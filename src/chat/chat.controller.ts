import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  Request,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDocument } from '../schemas/user.schema';
import { ChatService } from './chat.service';

@Controller('api/chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Post('getORCreatePrivteThread')
  @UseGuards(AuthGuard('jwt'))
  async getORCreatePrivteThread(
    @Request() req,
    @Body('userId') userId: string,
  ) {
    const thread = await this.chatService.getOrCreatePrivateThread(
      req.user.id,
      userId,
    );
    return {
      success: true,
      message: 'private thread fetched/created successfully',
      thread: thread,
    };
  }

  @Get('myThreads')
  @UseGuards(AuthGuard('jwt'))
  async myThreads(@Request() req) {
    const myThreads = await this.chatService.getMyThreads(req.user.id);
    return {
      success: true,
      message: 'logged in user threads fetched successfully',
      threads: myThreads,
    };
  }

  @Get('/:threadId')
  @UseGuards(AuthGuard('jwt'))
  async threadChat(@Body('threadId') threadId: string) {
    const chat = this.chatService.getChatofThread(threadId);
    return {
      success: true,
      message: `chat for thread ${threadId} fetched successfully`,
      chat: chat,
    };
  }
}
