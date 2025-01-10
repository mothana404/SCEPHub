import {
  Table,
  Column,
  Model,
  ForeignKey,
  PrimaryKey,
} from 'sequelize-typescript';
import { Users } from './user.entity';
import { Groups } from './groups.entity';

@Table({
  tableName: 'user_groups',
  timestamps: false,
})
export class UserGroups extends Model {
  @ForeignKey(() => Users)
  @PrimaryKey
  @Column
  user_id: number;

  @ForeignKey(() => Groups)
  @PrimaryKey
  @Column
  group_id: number;
}
