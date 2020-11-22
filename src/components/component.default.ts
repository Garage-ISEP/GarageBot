import { Logger } from './../utils/logger';
import { BotService } from './../services/bot.service';
import { DBService } from './../services/db.service';
export class DefaultComponent {

  protected _logger = new Logger(this);
  
  constructor(
    protected _dbService: DBService,
    protected _botService: BotService
  ) { }

  public async init(): Promise<void> { };
}