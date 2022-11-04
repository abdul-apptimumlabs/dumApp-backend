import { ChatDto } from './dto/chat.dto';
import {
  WebSocketGateway,
  SubscribeMessage,
  MessageBody,
  WebSocketServer,
  ConnectedSocket,
} from '@nestjs/websockets';
import { ChatService } from './chat.service';
import { Socket, Server } from 'socket.io';
import { UnauthorizedException, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserService } from 'src/user/user.service';
import { JwtService } from '@nestjs/jwt';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class ChatGateways {
  @WebSocketServer()
  server: Server;

  constructor(
    private readonly chatService: ChatService,
    private userService: UserService,
    private jwtService: JwtService,
  ) {}

  @SubscribeMessage('message')
  connected(@ConnectedSocket() client: Socket) {
    console.log('client ---=--=--=--=-=->>>>', client);
  }

  @SubscribeMessage('joinChatThread')
  async joinThread(
    @MessageBody('threadId') threadId: string,
    @ConnectedSocket() client: Socket,
  ) {
    const authToken = client.handshake.auth.token;
    if (!authToken) {
      throw new UnauthorizedException();
    }
    const verified = this.jwtService.verify(authToken);

    const user = await this.userService.findById(verified.userId);

    this.chatService.joinThread(threadId, user.id, client);
  }

  @SubscribeMessage('leaveChatThread')
  @UseGuards(AuthGuard('jwt'))
  async leaveThread(
    @MessageBody('threadId') threadId: string,
    @MessageBody('userId') userId: string,
    @ConnectedSocket() client: Socket,
  ) {
    this.chatService.leaveThread(threadId, userId, client);
  }

  @SubscribeMessage('sendText')
  async create(
    @MessageBody() chatMessageDto: ChatDto,
    @ConnectedSocket() client: Socket,
  ) {
    const authToken = client.handshake.auth.token;
    if (!authToken) {
      throw new UnauthorizedException();
    }
    const verified = this.jwtService.verify(authToken);

    const user = await this.userService.findById(verified.userId);
    const message = this.chatService.sendMessage(
      chatMessageDto,
      user.id,
      client,
    );
    client.emit('message', message);
    return message;
  }

  @SubscribeMessage('findAllMessages')
  findAll() {
    const chats = this.chatService.findAll();
    return chats;
  }

  @SubscribeMessage('typing')
  async typing(
    @MessageBody('isTyping') isTyping: boolean,
    @ConnectedSocket() client: Socket,
  ) {
    // const name = await this.chatService.getClientName(client.id)

    client.broadcast.emit('typing', { name, isTyping });
  }
}
