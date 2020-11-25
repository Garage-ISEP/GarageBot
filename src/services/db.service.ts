import { DefaultService } from './service.default';
import { User } from './../models/user.model';
import { Sequelize } from 'sequelize-typescript';
import * as mysql from "mysql2/promise"
export class DBService extends DefaultService {

	private readonly _sequelize = new Sequelize({
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT),
    username: process.env.DB_USER,
		dialect: "mysql",
		logging: false,
		models: [
      User
    ],
  });
  
  /**
   * Initilize the Database connexion
   * Create a database if it not exists
   * Throw errors that should be catch when calling this method
   */
  public async init(): Promise<DBService> {
    
    (await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER
    })).query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);

    await this._sequelize.sync({ force: process.env.FORCE_RECREATE_DB === "true" });

    this._logger.log("Connected to Database");
    return this;
  }

}