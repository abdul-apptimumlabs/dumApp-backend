import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Date, Document, Types } from 'mongoose';

export type ChatThreadDocument = ChatThread & Document;

@Schema({ timestamps: true })
export class ChatThread {
  @Prop({ required: true, ref: 'User' })
  createdBy: Types.ObjectId;

  @Prop({ required: true, ref: 'User' })
  members: [Types.ObjectId];

  @Prop({ required: true, default: true })
  isPrivate: boolean;

  @Prop({ required: true, default: false })
  isDeleted: boolean;

  @Prop({ required: true, default: Date.now() })
  createdAt: string;
}

export const ChatThreadSchema = SchemaFactory.createForClass(ChatThread);
