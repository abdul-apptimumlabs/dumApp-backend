import { ChatRepositery } from './chat.repository';
import { ChatController } from './chat.controller';
import { Module } from '@nestjs/common';
import { ChatService } from './chat.service';
import { ChatGateways } from './chat.gateway';
import { MongooseModule } from '@nestjs/mongoose';
import { ChatMessage, ChatMessageSchema } from '../schemas/chatMessage.schema';
import { ChatThread, ChatThreadSchema } from '../schemas/chatThread.schema';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from 'src/user/user.module';
import { User, UserSchema } from 'src/schemas/user.schema';
import { jwtConstants } from 'src/auth/constants';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ChatMessage.name, schema: ChatMessageSchema },
      { name: ChatThread.name, schema: ChatThreadSchema },
      { name: User.name, schema: UserSchema },
    ]),
    UserModule,
    JwtModule.register({
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '24h' },
    }),
  ],
  controllers: [ChatController],
  providers: [ChatService, ChatRepositery, ChatGateways],
})
export class ChatModule {}
