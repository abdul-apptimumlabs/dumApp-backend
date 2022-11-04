import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Types } from 'mongoose';

export type ChatMessageDocument = ChatMessage & Document;

@Schema({ timestamps: true })
export class ChatMessage {
  @Prop({ ref: 'User' })
  sender: Types.ObjectId;

  @Prop({ ref: 'User' })
  receiver: Types.ObjectId;

  @Prop({ required: true })
  text: string;

  @Prop({ ref: 'Thread', index: true })
  thread: Types.ObjectId;

  @Prop({ required: true, default: false })
  delivered: boolean;

  @Prop({ required: true, default: false })
  seen: boolean;

  @Prop({ required: true, default: false })
  isDeleted: boolean;
}

export const ChatMessageSchema = SchemaFactory.createForClass(ChatMessage);
