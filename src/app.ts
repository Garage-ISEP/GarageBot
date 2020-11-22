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

  public async init() {
    await this._initServices();
    await this._initComponent();
  }

  private async _initServices() {
    try {
      await this._botService.init();
      await this._dbService.init(process.env.FORCE_RECREATE_DB === "true");
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