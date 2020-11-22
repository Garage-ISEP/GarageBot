import { User } from './../models/user.model';
import { Sequelize } from 'sequelize-typescript';
import { Logger } from './../utils/logger';
import * as mysql from "mysql2/promise"
export class DBService {

  private readonly _logger = new Logger(this);

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
   * Create a databse if it not exists
   * Throw errors that should be catch when calling this method
   */
  public async init(removeOld = false) {
    
    (await mysql.createConnection({
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      user: process.env.DB_USER
    })).query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);

    await this._sequelize.sync({ force: removeOld });

    this._logger.log("Connected to Database");
  }

}