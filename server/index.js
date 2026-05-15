const http = require('http');
const { Server } = require('socket.io');

// ══════════════════════════════════════════════════════════════════════
// ██  DSA PLATFORM — REAL-TIME SERVER  ██
// ══════════════════════════════════════════════════════════════════════

const PORT = process.env.PORT || 3000;

// ── Rate Limiting ──────────────────────────────────────────────────────
const RATE_LIMIT = {
  windowMs: 1000,     // 1 second window
  maxEvents: 30,      // Max events per window per user
};

const rateLimitMap = new Map(); // socketId -> { count, resetTime }

function isRateLimited(socketId) {
  const now = Date.now();
  const entry = rateLimitMap.get(socketId);

  if (!entry || now > entry.resetTime) {
    rateLimitMap.set(socketId, { count: 1, resetTime: now + RATE_LIMIT.windowMs });
    return false;
  }

  entry.count++;
  if (entry.count > RATE_LIMIT.maxEvents) {
    console.warn(`[RATE LIMIT] Socket ${socketId} exceeded ${RATE_LIMIT.maxEvents} events/sec`);
    return true;
  }
  return false;
}

// ── Input Validation ───────────────────────────────────────────────────
function isValidStepIndex(index) {
  return typeof index === 'number' && Number.isFinite(index) && index >= 0 && index < 10000;
}

function isValidRoomId(roomId) {
  return typeof roomId === 'string' && roomId.length > 0 && roomId.length <= 100 && /^[a-zA-Z0-9_-]+$/.test(roomId);
}

function isValidAlgoStart(data) {
  return (
    data &&
    typeof data === 'object' &&
    typeof data.algoId === 'string' &&
    data.algoId.length <= 100 &&
    Array.isArray(data.initialData) &&
    data.initialData.length <= 100 &&
    data.initialData.every(n => typeof n === 'number' && Number.isFinite(n))
  );
}

// ── Room Tracking ──────────────────────────────────────────────────────
const rooms = new Map(); // roomId -> { users: Set<socketId>, createdAt, algorithmId }

function getRoomStats() {
  const stats = {};
  rooms.forEach((room, id) => {
    stats[id] = { users: room.users.size, algorithm: room.algorithmId || 'none' };
  });
  return stats;
}

// ── HTTP Health Check ──────────────────────────────────────────────────
const server = http.createServer((req, res) => {
  if (req.url === '/health') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      status: 'ok',
      uptime: process.uptime(),
      connections: io.engine?.clientsCount || 0,
      rooms: getRoomStats(),
      timestamp: new Date().toISOString(),
    }));
  } else {
    res.writeHead(404);
    res.end('Not found');
  }
});

// ── Socket.IO Server ───────────────────────────────────────────────────
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST'],
  },
  // Connection limits
  maxHttpBufferSize: 1e6,      // 1MB max message size
  pingTimeout: 20000,          // 20s before considering disconnected
  pingInterval: 10000,         // Ping every 10s
  connectTimeout: 10000,       // 10s to complete handshake
});

// ── Auth Middleware ─────────────────────────────────────────────────────
io.use((socket, next) => {
  // Extract token from handshake (optional — allows unauthenticated for dev)
  const token = socket.handshake.auth?.token;
  const userId = socket.handshake.auth?.userId;

  if (token) {
    // In production, verify the Supabase JWT here:
    // const { data, error } = await supabase.auth.getUser(token);
    // if (error) return next(new Error('Authentication failed'));
    socket.data.userId = userId || 'authenticated-user';
    socket.data.authenticated = true;
  } else {
    // Allow connection without auth for dev/demo mode
    socket.data.userId = `anon-${socket.id.slice(0, 8)}`;
    socket.data.authenticated = false;
  }

  next();
});

// ── Connection Handler ─────────────────────────────────────────────────
io.on('connection', (socket) => {
  const userId = socket.data.userId;
  console.log(`[CONNECT] ${userId} (${socket.id}) — auth: ${socket.data.authenticated}`);

  // ── Join Room ──
  socket.on('join_room', (roomId) => {
    if (!isValidRoomId(roomId)) {
      socket.emit('error', { message: 'Invalid room ID' });
      return;
    }

    // Leave any previous rooms (except the socket's own room)
    for (const r of socket.rooms) {
      if (r !== socket.id) {
        socket.leave(r);
        const room = rooms.get(r);
        if (room) {
          room.users.delete(socket.id);
          if (room.users.size === 0) rooms.delete(r);
        }
      }
    }

    // Join the new room
    socket.join(roomId);
    if (!rooms.has(roomId)) {
      rooms.set(roomId, { users: new Set(), createdAt: Date.now(), algorithmId: null });
    }
    rooms.get(roomId).users.add(socket.id);

    const roomSize = rooms.get(roomId).users.size;
    console.log(`[ROOM] ${userId} joined '${roomId}' (${roomSize} users)`);

    // Notify room members
    socket.to(roomId).emit('user_joined', { userId, roomSize });
    socket.emit('room_joined', { roomId, roomSize });
  });

  // ── Leave Room ──
  socket.on('leave_room', (roomId) => {
    if (!isValidRoomId(roomId)) return;
    socket.leave(roomId);
    const room = rooms.get(roomId);
    if (room) {
      room.users.delete(socket.id);
      const roomSize = room.users.size;
      if (roomSize === 0) {
        rooms.delete(roomId);
      } else {
        socket.to(roomId).emit('user_left', { userId, roomSize });
      }
    }
    console.log(`[ROOM] ${userId} left '${roomId}'`);
  });

  // ── Step Update (scoped to room) ──
  socket.on('step_update', (data) => {
    if (isRateLimited(socket.id)) {
      socket.emit('error', { message: 'Rate limited. Slow down.' });
      return;
    }

    // Support both formats: just an index, or { roomId, index }
    let index, roomId;
    if (typeof data === 'number') {
      index = data;
      roomId = null;
    } else if (data && typeof data === 'object') {
      index = data.index;
      roomId = data.roomId;
    } else {
      return;
    }

    if (!isValidStepIndex(index)) {
      socket.emit('error', { message: 'Invalid step index' });
      return;
    }

    if (roomId && isValidRoomId(roomId)) {
      // Room-scoped broadcast
      socket.to(roomId).emit('step_update', index);
    } else {
      // Fallback: broadcast to all (backward compatible)
      socket.broadcast.emit('step_update', index);
    }
  });

  // ── Algorithm Start (scoped to room) ──
  socket.on('algorithm_start', (data) => {
    if (isRateLimited(socket.id)) return;
    if (!isValidAlgoStart(data)) {
      socket.emit('error', { message: 'Invalid algorithm start data' });
      return;
    }

    const roomId = data.roomId;
    if (roomId && isValidRoomId(roomId)) {
      const room = rooms.get(roomId);
      if (room) room.algorithmId = data.algoId;
      socket.to(roomId).emit('algorithm_start', {
        algoId: data.algoId,
        initialData: data.initialData,
        startedBy: userId,
      });
    } else {
      socket.broadcast.emit('algorithm_start', {
        algoId: data.algoId,
        initialData: data.initialData,
        startedBy: userId,
      });
    }

    console.log(`[ALGO] ${userId} started ${data.algoId} in room '${roomId || 'global'}'`);
  });

  // ── Disconnect ──
  socket.on('disconnect', (reason) => {
    // Clean up from all rooms
    for (const [roomId, room] of rooms.entries()) {
      if (room.users.has(socket.id)) {
        room.users.delete(socket.id);
        if (room.users.size === 0) {
          rooms.delete(roomId);
        } else {
          socket.to(roomId).emit('user_left', { userId, roomSize: room.users.size });
        }
      }
    }

    // Clean up rate limit entry
    rateLimitMap.delete(socket.id);

    console.log(`[DISCONNECT] ${userId} (${reason})`);
  });

  // ── Error Handler ──
  socket.on('error', (err) => {
    console.error(`[ERROR] ${userId}:`, err.message);
  });
});

// ── Clean up stale rate limit entries every 60s ────────────────────────
setInterval(() => {
  const now = Date.now();
  for (const [id, entry] of rateLimitMap.entries()) {
    if (now > entry.resetTime + 5000) {
      rateLimitMap.delete(id);
    }
  }
}, 60000);

// ── Graceful Shutdown ──────────────────────────────────────────────────
process.on('SIGTERM', () => {
  console.log('[SERVER] SIGTERM received. Shutting down gracefully...');
  io.close(() => {
    server.close(() => {
      console.log('[SERVER] Closed.');
      process.exit(0);
    });
  });
});

process.on('uncaughtException', (err) => {
  console.error('[FATAL] Uncaught exception:', err);
  // Keep running — don't crash on unexpected errors
});

process.on('unhandledRejection', (reason) => {
  console.error('[FATAL] Unhandled rejection:', reason);
});

// ── Start ──────────────────────────────────────────────────────────────
server.listen(PORT, () => {
  console.log(`\n🚀 DSA Platform Server running on http://localhost:${PORT}`);
  console.log(`   Health check: http://localhost:${PORT}/health`);
  console.log(`   Features: rooms, rate-limiting, validation, auth-ready\n`);
});
