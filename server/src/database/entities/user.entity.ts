import {
  Table,
  Column,
  Model,
  DataType,
  HasMany,
  HasOne,
  ForeignKey,
  BelongsTo,
  BelongsToMany,
} from 'sequelize-typescript';
import { Admins } from './admin.entity';
import { Students } from './student.entity';
import { Instructors } from './instructor.entity';
import { Messages } from './message.entity';
import { Ratings } from './rate.entity';
import { Payments } from './payment.entity';
import { Groups } from './groups.entity';
import { DataTypes } from 'sequelize';
import { UserGroups } from './user-groups.entity';

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true,
})
export class Users extends Model {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  user_id: bigint;

  @Column(DataType.STRING)
  user_name: string;

  @Column({ type: DataType.STRING })
  user_email: string;

  @Column(DataType.STRING)
  password: string;

  @Column({ type: DataType.STRING })
  phone_number: string;

  @Column(DataType.BIGINT)
  role: bigint;

  @Column({ type: DataType.TEXT, defaultValue: null })
  user_img: string;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_deleted: boolean;

  @ForeignKey(() => Groups)
  @Column({ type: DataType.BIGINT })
  group_id: bigint;

  //   @Column({ type: DataType.JSON, defaultValue: [] })
  //   chat_groups: number[];

  @BelongsToMany(() => Groups, () => UserGroups)
  groups: Groups[];

  @BelongsTo(() => Groups, 'group_id')
  group: Groups;

  @HasOne(() => Admins)
  admin: Admins;

  @HasOne(() => Students)
  student: Students;

  @HasOne(() => Instructors)
  instructor: Instructors;

  @HasMany(() => Messages, { foreignKey: 'sender_id' })
  sentMessages: Messages[];

  @HasMany(() => Messages, { foreignKey: 'receiver_id' })
  receivedMessages: Messages[];

  @HasMany(() => Ratings, { foreignKey: 'rating_user' })
  ratings: Ratings[];

  @HasMany(() => Payments)
  payments: Payments[];
}
