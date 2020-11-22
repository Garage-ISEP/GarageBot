import { table } from "console";
import { Model, Table } from "sequelize-typescript";
import { tableConf } from "../conf/table.conf";

@Table(tableConf)
export class Guild extends Model {
  
}