import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  PrimaryKey,
} from 'sequelize-typescript';
import { Users } from './user.entity';

@Table({
  timestamps: true,
})
export class Admins extends Model {
  @PrimaryKey
  @ForeignKey(() => Users)
  @Column({ type: DataType.BIGINT })
  user_id: bigint;

  @Column({ type: DataType.STRING })
  department: string;

  @BelongsTo(() => Users)
  user: Users;
}
