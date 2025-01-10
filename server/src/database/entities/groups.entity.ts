import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  ForeignKey,
  BelongsToMany,
} from 'sequelize-typescript';
import { Users } from './user.entity';
import { Projects } from './project.entity';
import { UserGroups } from './user-groups.entity';

@Table
export class Groups extends Model {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  group_id: bigint;

  @Column(DataType.STRING)
  group_name: string;

  @ForeignKey(() => Projects)
  @Column(DataType.BIGINT)
  group_project: bigint;

  //   @HasMany(() => Users, 'group_id')
  //   members: Users[];

  @BelongsToMany(() => Users, () => UserGroups)
  members: Users[];
}
