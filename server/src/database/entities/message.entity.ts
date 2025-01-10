import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Users } from './user.entity';

@Table
export class Messages extends Model {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  message_id: bigint;

  @ForeignKey(() => Users)
  @Column({ type: DataType.BIGINT })
  sender_id: bigint;

  @ForeignKey(() => Users)
  @Column({ type: DataType.BIGINT })
  receiver_id: bigint;

  @Column(DataType.STRING)
  message: string;

  @Column(DataType.DATE)
  sent_at: Date;

  @BelongsTo(() => Users, 'sender_id')
  sender: Users;

  @BelongsTo(() => Users, 'receiver_id')
  receiver: Users;
}
