import { AuthService } from './services/auth.service';
import { DefaultService } from './services/service.default';
import { Logger } from './utils/logger';
import { DBService } from './services/db.service';
import { BotService } from './services/bot.service';
import { VoiceChannelComponent } from './components/voice-channel-component';
import { RankComponent } from './components/rank-component';
import * as dotenv from "dotenv";
import { DefaultComponent } from './components/component.default';
class App {

  private _botService = new BotService();
  private _dbService = new DBService();
  private _logger = new Logger(this);

  private readonly _components: (typeof DefaultComponent)[] = [
    VoiceChannelComponent,
    RankComponent
  ] 

  private readonly _services: (typeof DefaultService)[] = [
    AuthService,
    BotService,
    DBService
  ]

  public async init() {
    await this._initServices();
    await this._initComponent();
  }

  private async _initServices() {
    try {
      for (const Service of this._services)
        await new Service().init();
    } catch (e) {
      this._logger.error("Services Initialization Error :", e);
    }
  }

  private async _initComponent() {
    try {
      for (const Component of this._components)
        await new Component(this._dbService, this._botService).init();
    } catch (e) {
      this._logger.error("Components Initialization Error :", e);
    }
  }
}

dotenv.config();
new App().init();