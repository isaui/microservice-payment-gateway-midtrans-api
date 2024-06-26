// src/socket/socket.gateway.ts
import { WebSocketGateway, WebSocketServer, OnGatewayConnection, OnGatewayDisconnect, OnGatewayInit, ConnectedSocket, MessageBody, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  path: '/api/payment-socket',
  cors: {
    origin: "*", // Adjust this based on your security requirements
  },
})
export class SocketGateway implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  afterInit(server: Server) {
    console.log('Socket server initialized');
  }

  handleConnection(client: Socket, ...args: any[]) {
    console.log('New client connected:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('Client disconnected:', client.id);
  }

  @SubscribeMessage('message')
  handleMessage(@MessageBody() payload: any, @ConnectedSocket() client: Socket): void {
    console.log('Received message:', payload);
    client.emit('message', 'Message received!');
  }

  emitEvent(eventName: string, eventData: any): void {
    if (this.server) {
      this.server.emit(eventName, eventData);
      console.log(`Emitted event ${eventName} with data:`, eventData);
    } else {
      console.log('Socket.IO server not initialized');
    }
  }
}
