import { DefaultComponent } from './../component.default';
import { BotService } from './../../services/bot.service';
import { DBService } from './../../services/db.service';
/**
 * Faites votre life ici !
 */
export class RankComponent implements DefaultComponent {
  
  constructor(
    private _dbService: DBService,
    private _botService: BotService
  ) { }
  
  public async init() {
    //Init le systeme de component
  }

}