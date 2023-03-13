import { JwtPayload } from './../auth/interfaces/jwt-payload.interface';
import {
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
  SubscribeMessage,
} from '@nestjs/websockets';
import { MessagesWsService } from './messages-ws.service';
import { Socket, Server } from 'socket.io';
import { NewMessageDto } from './dto/new-message.dto';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({ cors: true, namespace: '/' })
export class MessagesWsGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() wss: Server;
  constructor(
    private readonly messagesWsService: MessagesWsService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket, ...args: any[]) {
    const token = client.handshake.headers.authentication as string;
    let payload: JwtPayload;
    try {
      payload = this.jwtService.verify(token);
      await this.messagesWsService.registerClient(client, payload.id);
    } catch (error) {
      client.disconnect();
      return;
    }

    this.wss.emit(
      'clients-updated',
      this.messagesWsService.getConnectedClients(),
    );
  }
  handleDisconnect(client: Socket) {
    this.messagesWsService.removeClient(client.id);
  }

  @SubscribeMessage('message-from-client')
  onMessageFromClient(client: Socket, payload: NewMessageDto) {
    //! Emite unicamente al cliente, no a todos
    // client.emit('message-from-server',{
    //   fillName: 'Test',
    //   message: payload.message || 'no message!!!'
    // })

    //! Emite a todos menos al cliente inicial
    // client.broadcast.emit('messages-from-server', {
    //   fillName: 'Test',
    //   message: payload.message || 'no message!!!'
    // })

    //! Emitir a todos incluyendo al cliente inicial
    this.wss.emit('messages-from-server', {
      fullName: this.messagesWsService.getUserFullName(client.id),
      message: payload.message || 'no message!!!',
    });
  }
}
