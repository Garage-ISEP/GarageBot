import { DefaultComponent } from './../component.default';
import { BotService } from './../../services/bot.service';
import { DBService } from './../../services/db.service';
/**
 * Faites votre life ici !
 */
export class RankComponent extends DefaultComponent {
  
  public async init(): Promise<RankComponent> {
    //Init le systeme de component
    return this;
  }

}