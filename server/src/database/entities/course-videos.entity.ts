import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Courses } from './course.entity';

@Table({
  tableName: 'contents',
  timestamps: true,
  underscored: true,
})
export class Contents extends Model<Contents> {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  video_id: bigint;

  @Column(DataType.STRING)
  video_title: string;

  @Column(DataType.TEXT)
  video_url: string;

  @Column(DataType.STRING)
  video_description: string;

  @ForeignKey(() => Courses)
  @Column({ type: DataType.BIGINT })
  course_id: bigint;

  @Column({ type: DataType.BOOLEAN, defaultValue: false })
  is_deleted: boolean;

  @BelongsTo(() => Courses)
  course: Courses;
}
