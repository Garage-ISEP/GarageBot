import { table } from "console";
import { Column, DataType, Model, Table } from "sequelize-typescript";
import { tableConf } from "../conf/table.conf";

@Table(tableConf)
export class User extends Model {
  
  @Column({
    type: DataType.STRING(18),
    allowNull: false,
    primaryKey: true
  })
  public id: string;

  //TODO: Complemte User Model
}