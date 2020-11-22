import { BotService } from './../services/bot.service';
import { DBService } from './../services/db.service';
export class DefaultComponent {
  constructor(
    protected _dbService: DBService,
    protected _botService: BotService
  ) { }

  public async init(): Promise<void> { };
}