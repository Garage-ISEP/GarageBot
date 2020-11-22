import { BotService } from './../../services/bot.service';
import { DBService } from '../../services/db.service';
import { DefaultComponent } from './../component.default';

export class VoiceChannelComponent implements DefaultComponent {

  constructor(
    private _dbService: DBService,
    private _botService: BotService
  ) { }
  
  public async init() {

  }
}