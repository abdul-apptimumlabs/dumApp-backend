import { Socket } from 'socket.io';
import { ChatDto } from './dto/chat.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import {
  ChatMessage,
  ChatMessageDocument,
} from '../schemas/chatMessage.schema';
import { ChatThread, ChatThreadDocument } from '../schemas/chatThread.schema';
import { User, UserDocument } from 'src/schemas/user.schema';

@Injectable()
export class ChatService {
  constructor(
    @InjectModel(ChatMessage.name)
    private readonly ChatMessageModel: Model<ChatMessageDocument>,
    @InjectModel(ChatThread.name)
    private readonly ChatThreadModel: Model<ChatThreadDocument>,
    @InjectModel(User.name)
    private readonly UserModel: Model<UserDocument>,
  ) {}

  ioActiveClients = {};

  async getOrCreatePrivateThread(logedInUserId: string, otherUserId: string) {
    let thread = await this.ChatThreadModel.findOne({
      members: {
        $all: [logedInUserId, otherUserId],
      },
    });

    if (!thread) {
      thread = new this.ChatThreadModel({
        members: [logedInUserId, otherUserId],
        createdBy: logedInUserId,
      });

      await thread.save();
    }
    return thread;
  }

  async getMyThreads(loggedInUserId: string) {
    const myThreads = await this.ChatThreadModel.find({
      members: { $all: [loggedInUserId] },
    }).populate('members', 'profilePic username email coverImage');

    return myThreads;
  }

  async getChatofThread(threadId: string) {
    const chat = await this.ChatMessageModel.find({ thread: threadId });
    return chat;
  }

  joinThread(threadId: string, userId: string, ioClient: Socket) {
    ioClient.join(threadId);

    if (!this.ioActiveClients[threadId]) {
      this.ioActiveClients[threadId] = [];
    }
    if (!this.ioActiveClients[threadId].includes(userId)) {
      this.ioActiveClients[threadId].push(userId);
    }

    ioClient.emit('chatThreadjoined', threadId);
  }

  leaveThread(threadId: string, userId: string, ioClient: Socket) {
    if (!this.ioActiveClients[threadId]) {
      this.ioActiveClients[threadId] = [];
    }

    const index = this.ioActiveClients[threadId].indexOf(userId);
    if (index !== -1) {
      this.ioActiveClients[threadId].splice(index, 1);
    }
    ioClient.emit('chatThreadLeft', threadId);
    ioClient.leave(threadId);
  }

  async sendMessage(chat: ChatDto, userId: string, ioClient: Socket) {
    const { thread, text } = chat;
    const chatMessage = new this.ChatMessageModel({
      sender: userId,
      text: text,
      thread: thread,
    });

    await chatMessage.save();
    const chatThread = await this.ChatThreadModel.findOne({ _id: thread });

    const { members } = chatThread;

    const sender = await this.UserModel.findOne({ _id: userId }).select(
      'username profilePic',
    );

    const dataForSendingTextToMembers = {
      sender,
      chatMessage,
      chatThread,
    };

    //send message to members
    this.sendMessageToMembers(dataForSendingTextToMembers, ioClient);
  }

  async sendMessageToMembers(data: any, ioClient: Socket) {
    const { sender, chatMessage, chatThread } = data;
    const senderData = {
      name: sender.username,
      profilePic: sender.profilePic,
      _id: sender._id,
    };

    chatThread.members.forEach((mem) => {
      console.log('emiting to this member', mem);
      console.log('ioactiveClients', this.ioActiveClients);

      ioClient.emit('chatMessageReceived', {
        chatMessage,
        senderData,
        chatThread,
      });
    });
  }
  findAll() {
    //best try
  }
}
