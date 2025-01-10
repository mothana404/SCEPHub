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
export class Payments extends Model {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  payment_id: bigint;

  @ForeignKey(() => Users)
  @Column({ type: DataType.BIGINT })
  user_id: bigint;

  @Column(DataType.STRING)
  stripe_sub_id: string;

  @Column(DataType.BIGINT)
  activate: bigint;

  @BelongsTo(() => Users)
  user: Users;
}
