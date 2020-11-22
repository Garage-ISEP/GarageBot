import { BotService } from './../services/bot.service';
import { DBService } from './../services/db.service';
export abstract class DefaultComponent {
  constructor(
    protected _dbService: DBService,
    protected _botService: BotService
  ) { }

  public abstract init(): Promise<void>;
}