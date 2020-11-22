import { User } from './../models/user.model';
import { Sequelize } from 'sequelize-typescript';
import { Logger } from './../utils/logger';
export class DBService {

  private readonly _logger = new Logger(this);

	private readonly _sequelize = new Sequelize({
		database: process.env.DB_NAME,
		host: process.env.DB_HOST,
		port: parseInt(process.env.DB_PORT),
		username: process.env.DB_USER,
		password: process.env.DB_PASS,
		dialect: "mysql",
		logging: false,
		models: [
      User
    ],
  });
  
  /**
   * Initilize the Database connexion
   * Throw errors that should be catch when calling this method
   */
  public async init(removeOld = false) {
			await this._sequelize.sync({ force: removeOld });
  }

}