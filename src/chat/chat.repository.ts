import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ChatDto } from './dto/chat.dto';
import { Chat } from './entities/chat.entity';

@Injectable()
export class ChatRepositery {
  constructor() {}

  //   async getOrCreatePriveteChatThread(chatThread: ChatThreadDto): Promise<ChatThread> {
  //     const chatThreadToSave = new this.chatThreadModel(chatThread)
  //     return await chatThreadToSave.save()
  //   }

  async myChatThread() {
    //TODO
  }

  async getMessagesForSingleThread() {
    //TODO
  }

  async saveMessage(message: ChatDto) {
    // const messageToSave = new this.chatMessageModel(message)
    return 1;
  }
  async getAllMessages() {
    // return await this.chatMessageModel.find({})
  }
  async getMessagesForSingleUser(userId: string) {
    // return await this.chatMessageModel.findOne({ sender: userId })
  }
}
