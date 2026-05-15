import { io, Socket } from 'socket.io-client';
import { useAlgorithmStore } from '../store/useAlgorithmStore';

const SOCKET_URL = process.env.EXPO_PUBLIC_SOCKET_URL || 'http://localhost:3000';

class SocketService {
  private socket: Socket | null = null;

  connect() {
    this.socket = io(SOCKET_URL);

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('step_update', (index: number) => {
      useAlgorithmStore.getState().jumpToStep(index);
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
