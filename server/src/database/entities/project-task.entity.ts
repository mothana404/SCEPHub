import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Projects } from './project.entity';
import { Users } from './user.entity';
import { Students } from './student.entity';

@Table
export class Tasks extends Model {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  task_id: bigint;

  @ForeignKey(() => Projects)
  @Column({ type: DataType.BIGINT })
  project_id: bigint;

  @ForeignKey(() => Students)
  @Column({ type: DataType.BIGINT })
  assigned_to: bigint;

  @Column(DataType.STRING)
  title: string;

  @Column(DataType.TEXT)
  description: string;

  @Column({
    type: DataType.ENUM('in_progress', 'completed', 'pending_approval'),
    defaultValue: 'in_progress',
  })
  status: 'in_progress' | 'completed' | 'pending_approval';

  @Column(DataType.DATE)
  due_date: Date;

  @Column(DataType.TEXT)
  task_img: string;

  @Column(DataType.TEXT)
  task_delivery: string;

  @BelongsTo(() => Projects)
  project: Projects;

  @BelongsTo(() => Students)
  assignedUser: Students;
}
