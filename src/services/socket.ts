import { io, Socket } from 'socket.io-client';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:3000';

// Callback type for step updates received from remote peers
type StepUpdateCallback = (index: number) => void;

class SocketService {
  private socket: Socket | null = null;
  private onStepUpdate: StepUpdateCallback | null = null;

  /**
   * Register a callback for remote step updates.
   * This breaks the circular dependency by letting the store
   * register itself after initialization instead of being imported here.
   */
  setStepUpdateCallback(callback: StepUpdateCallback) {
    this.onStepUpdate = callback;
  }

  connect() {
    this.socket = io(SOCKET_URL);

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('step_update', (index: number) => {
      if (this.onStepUpdate) {
        this.onStepUpdate(index);
      }
    });

    this.socket.on('algorithm_start', (data: { algoId: string; initialData: number[] }) => {
      // Handle remote start
    });
  }

  emitStep(index: number) {
    if (this.socket) {
      this.socket.emit('step_update', index);
    }
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }
}

export const socketService = new SocketService();
