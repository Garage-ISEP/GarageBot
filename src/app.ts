import { AuthService } from './services/auth.service';
import { DefaultService } from './services/service.default';
import { Logger } from './utils/logger';
import { DBService } from './services/db.service';
import { BotService } from './services/bot.service';
import { VoiceHandlerComponent } from './components/voice-channel-component';
import { RankComponent } from './components/rank-component';
import * as dotenv from "dotenv";
import { DefaultComponent } from './components/component.default';
class App {

  private _logger = new Logger(this);

  private readonly _components = new Map<typeof DefaultComponent, DefaultComponent>([
    [VoiceHandlerComponent, undefined],
    [RankComponent, undefined]
  ]); 

  private readonly _services = new Map<typeof DefaultService, DefaultService>([
    [AuthService, undefined],
    [BotService, undefined],
    // [DBService, undefined]
  ]); 

  public async init() {
    await this._initServices();
    this._logger.log("Services initialized");
    await this._initComponent();
  }

  private async _initServices() {
    try {
      for (const service of this._services.keys())
        this._services.set(service, await new service().init());
    } catch (e) {
      this._logger.error("Services Initialization Error :", e);
    }
  }

  private async _initComponent() {
    try {
      for (const component of this._components.keys())
        this._components.set(component, await new component(this._services.get(DBService) as DBService, this._services.get(BotService) as BotService).init());
    } catch (e) {
      this._logger.error("Components Initialization Error :", e);
    }
  }
}

dotenv.config();
new App().init();