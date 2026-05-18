import { io, Socket } from 'socket.io-client';
import { supabase } from './supabase';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:3000';

type StepUpdateCallback = (index: number) => void;

class SocketService {
  private socket: Socket | null = null;
  private onStepUpdate: StepUpdateCallback | null = null;
  private currentRoom: string | null = null;

  
  setStepUpdateCallback(callback: StepUpdateCallback) {
    this.onStepUpdate = callback;
  }

  
  async connect() {
    let token: string | undefined;
    let userId: string | undefined;

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        token = session.access_token;
        userId = session.user.id;
      }
    } catch (e) {
      console.warn('Socket: Could not get auth session, connecting anonymously');
    }

    this.socket = io(SOCKET_URL, {
      auth: { token, userId },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      timeout: 10000,
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
      if (this.currentRoom) {
        this.socket?.emit('join_room', this.currentRoom);
      }
    });

    this.socket.on('step_update', (index: number) => {
      if (this.onStepUpdate) {
        this.onStepUpdate(index);
      }
    });

    this.socket.on('algorithm_start', (data: { algoId: string; initialData: number[]; startedBy: string }) => {
      console.log(`Remote user ${data.startedBy} started ${data.algoId}`);
    });

    this.socket.on('user_joined', (data: { userId: string; roomSize: number }) => {
      console.log(`User joined room (${data.roomSize} total)`);
    });

    this.socket.on('user_left', (data: { userId: string; roomSize: number }) => {
      console.log(`User left room (${data.roomSize} remaining)`);
    });

    this.socket.on('room_joined', (data: { roomId: string; roomSize: number }) => {
      console.log(`Joined room '${data.roomId}' (${data.roomSize} users)`);
    });

    this.socket.on('error', (data: { message: string }) => {
      console.warn('Socket error:', data.message);
    });

    this.socket.on('connect_error', (err) => {
      console.warn('Socket connection error:', err.message);
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected from WebSocket:', reason);
    });
  }

  
  joinRoom(roomId: string) {
    this.currentRoom = roomId;
    if (this.socket?.connected) {
      this.socket.emit('join_room', roomId);
    }
  }

  
  leaveRoom() {
    if (this.currentRoom && this.socket?.connected) {
      this.socket.emit('leave_room', this.currentRoom);
    }
    this.currentRoom = null;
  }

  
  emitStep(index: number) {
    if (this.socket?.connected) {
      if (this.currentRoom) {
        this.socket.emit('step_update', { roomId: this.currentRoom, index });
      } else {
        this.socket.emit('step_update', index);
      }
    }
  }

  
  emitAlgorithmStart(algoId: string, initialData: number[]) {
    if (this.socket?.connected) {
      this.socket.emit('algorithm_start', {
        algoId,
        initialData,
        roomId: this.currentRoom,
      });
    }
  }

  
  disconnect() {
    this.leaveRoom();
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  
  get isConnected(): boolean {
    return this.socket?.connected ?? false;
  }
}

export const socketService = new SocketService();
