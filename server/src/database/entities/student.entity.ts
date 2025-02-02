import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
  HasMany,
  PrimaryKey,
} from 'sequelize-typescript';
import { Users } from './user.entity';
import { Skills } from './skills.entity';
import { Links } from './link.entity';

@Table
export class Students extends Model {
  @PrimaryKey
  @ForeignKey(() => Users)
  @Column({ type: DataType.BIGINT })
  user_id: bigint;

  @Column(DataType.STRING)
  university_name: string;

  @Column({ type: DataType.BIGINT, defaultValue: null })
  enrolled_courses: bigint;

  @Column({ type: DataType.JSON, defaultValue: null })
  joined_projects: bigint[];

  @Column(DataType.STRING)
  major: string;

  @Column({ type: DataType.TEXT, defaultValue: null })
  about_me: string;

  @Column({ type: DataType.TEXT, defaultValue: null })
  user_cv: string;

  @BelongsTo(() => Users)
  user: Users;

  @HasMany(() => Skills)
  skills: Skills[];

  @HasMany(() => Links)
  user_link: Links[];
}
