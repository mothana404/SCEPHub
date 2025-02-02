import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Users } from './user.entity';
import { Groups } from './groups.entity';

@Table
export class GroupMessages extends Model {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  message_id: bigint;

  @ForeignKey(() => Users)
  @Column({ type: DataType.BIGINT })
  sender_id: bigint;

  @ForeignKey(() => Groups)
  @Column({ type: DataType.BIGINT })
  group_id: bigint;

  @Column(DataType.STRING)
  message: string;

  @Column(DataType.DATE)
  sent_at: Date;

  @BelongsTo(() => Users, 'sender_id')
  sender: Users;

  @BelongsTo(() => Groups, 'group_id')
  group: Groups;
}
