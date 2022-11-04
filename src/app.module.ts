import { Module } from '@nestjs/common';
import { ServeStaticModule } from '@nestjs/serve-static';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { EmailModule } from './email/email.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { SearchModule } from './search/search.module';
import { ChatModule } from './chat/chat.module';
import { join } from 'path';

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'client'),
    }),
    ConfigModule.forRoot({ isGlobal: true }),
    MongooseModule.forRoot(
      'mongodb+srv://awajidm:maybe12@very-first.b1hx6o8.mongodb.net/dumapp?retryWrites=true&w=majority',
    ),
    UserModule,
    AuthModule,
    CloudinaryModule,
    EmailModule,
    PostModule,
    CommentModule,
    SearchModule,
    ChatModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
