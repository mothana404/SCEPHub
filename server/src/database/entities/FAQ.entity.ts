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
export class Feedback extends Model {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  feedbackId: bigint;

  @Column(DataType.STRING)
  feedbackParagraph: string;

  @ForeignKey(() => Users)
  @Column(DataType.BIGINT)
  feedbackFrom: bigint;

  @BelongsTo(() => Users)
  user: Users;
}
