import { Table, Column, Model, DataType, HasMany } from 'sequelize-typescript';
import { Users } from './user.entity';

@Table
export class Roles extends Model {
  @Column({ type: DataType.BIGINT, primaryKey: true, autoIncrement: true })
  role_id: bigint;

  @Column(DataType.STRING)
  role_name: string;

  @HasMany(() => Users, { foreignKey: 'role' })
  users: Users[];
}
