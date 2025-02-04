import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WsException,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat.service';
import { JwtService } from '@nestjs/jwt';
import { UserGroups } from '../database/entities/user-groups.entity';

@WebSocketGateway({ cors: true, port: 8000 })
export class ChatGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server;

  private connections: Map<number, string> = new Map();

  constructor(
    private readonly chatService: ChatService,
    private readonly jwtService: JwtService,
  ) {}

  async handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
    const userId = await this.getUserIdFromClient(client);
    if (userId) {
      this.connections.set(userId, client.id);
      console.log(`User ${userId} connected with client id ${client.id}`);
    }
  }

  async handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
    const userId = await this.getUserIdFromClient(client);
    if (userId) {
      this.connections.delete(userId);
      console.log(`User ${userId} disconnected`);
    }
  }

  @SubscribeMessage('sendMessage')
  async handleSendMessage(
    client: Socket,
    payload: { receiver_id: number; message: string },
  ) {
    const senderId = Array.from(this.connections.entries()).find(
      ([userId, clientId]) => clientId === client.id,
    )?.[0];
    const receiverClientId = this.connections.get(payload.receiver_id);
    let message: any;
    if (receiverClientId) {
      message = await this.chatService.createMessage(senderId, payload);
      this.server.to(receiverClientId).emit('receiveMessage', message);
      console.log(`Message sent to user ${payload.receiver_id}`);
    } else {
      message = await this.chatService.createMessage(senderId, payload);
      console.log(`Receiver ${payload.receiver_id} is not connected`);
    }
  }

  @SubscribeMessage('fetchMessages')
  async handleFetchMessages(client: Socket, payload: { userId2: number }) {
    try {
      const senderId = Array.from(this.connections.entries()).find(
        ([userId, clientId]) => clientId === client.id,
      )?.[0];
      const messages = await this.chatService.getMessagesBetweenUsers(
        senderId,
        payload.userId2,
      );
      client.emit('messageHistory', messages);
    } catch (error) {
      console.log(error);
    }
  }

  @SubscribeMessage('sendGroupMessage')
  async handleSendGroupMessage(
    client: Socket,
    payload: { group_id: number; message: string },
  ) {
    console.log(payload);
    let senderId = Array.from(this.connections.entries()).find(
      ([userId, clientId]) => clientId === client.id,
    )?.[0];
    if (typeof senderId === 'bigint') {
      senderId = Number(senderId);
    }
    const groupMembers = await this.chatService.getGroupById(
      payload.group_id,
      senderId,
    );
    if (groupMembers) {
      const message = await this.chatService.createGroupMessage(
        senderId,
        payload,
      );
      //   console.log('group members =======>> ', groupMembers);
      console.log(senderId);
      groupMembers.forEach((member: UserGroups) => {
        const userId = member.dataValues.user_id;
        const receiverClientId = this.connections.get(userId);

        if (receiverClientId) {
          this.server.to(receiverClientId).emit('receiveGroupMessage', message);
        }
      });
      console.log(`Group message sent to group ${payload.group_id}`);
    } else {
      console.log(
        `Group ${payload.group_id} not found or user not in the group`,
      );
    }
  }

  @SubscribeMessage('fetchGroupMessages')
  async handleFetchGroupMessages(
    client: Socket,
    payload: { group_id: number },
  ) {
    try {
      const messages = await this.chatService.getGroupMessages(
        payload.group_id,
      );
      client.emit('groupMessageHistory', messages);
    } catch (error) {
      console.log(error);
    }
  }

  private async getUserIdFromClient(client: Socket) {
    const tokenHeader = client.handshake.headers.token;
    if (!tokenHeader) {
      console.log('No token found');
      throw new WsException('Unauthorized: No token provided');
    }
    console.log(tokenHeader);
    let token: string;
    if (Array.isArray(tokenHeader)) {
      token = tokenHeader[0];
    } else {
      token = tokenHeader;
    }
    try {
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.SECRET_KEY,
      });
      const user_id = payload.user_id;
      return user_id;
    } catch (err) {
      console.error('JWT verification failed:', err.message);
      //   throw new WsException('Unauthorized: Invalid token');
    }
  }
}
