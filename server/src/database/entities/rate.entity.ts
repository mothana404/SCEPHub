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
export class Ratings extends Model {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  rate_id: bigint;

  @Column({ type: DataType.DECIMAL(10, 1), defaultValue: 0 })
  rating: number;

  @ForeignKey(() => Users)
  @Column({ type: DataType.BIGINT })
  rating_user: bigint;

  @Column(DataType.DATE)
  rating_on: Date;

  @BelongsTo(() => Users, 'rating_user')
  user: Users;
}
