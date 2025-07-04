import { AllowNull, Column, DataType, Model, PrimaryKey, Table } from 'sequelize-typescript'

type CategoryModelProps = {
  category_id: string,
  name: string,
  description: string | null,
  isActive: boolean,
  createdAt: Date
}

@Table({ tableName: 'categories', timestamps: false })
export class CategoryModel extends Model<CategoryModelProps> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare category_id: string;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  declare description: string | null;

  @Column({ allowNull: false, type: DataType.BOOLEAN })
  declare isActive: boolean;

  @Column({ allowNull: false, type: DataType.DATE(3) })
  declare createdAt: Date;
}