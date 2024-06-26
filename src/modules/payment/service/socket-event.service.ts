import { Injectable } from '@nestjs/common';
import { SocketGateway } from '../socket/socket.gateway';

@Injectable()
export class SocketEventService {
  constructor(private readonly socketGateway: SocketGateway) {}

  emitEvent(eventName: string, eventData: any): void {
    if (this.socketGateway.server) {
      this.socketGateway.server.emit(eventName, eventData);
      console.log(`Emitted event ${eventName} with data:`, eventData);
    } else {
      console.log('Socket.IO server not initialized');
    }
  }
}
