import { DefaultService } from './service.default';
import * as Discord from "discord.js";
import { generate as uuid } from "short-uuid";

export class BotService extends DefaultService {

  private _bot: Discord.Client = new Discord.Client();

  private _listeners: ListenerData<keyof Discord.ClientEvents> = {};
  
  /**
   * Initilize the bot connection
   * Throw errors that should be catch when calling this method
   */
  public async init() {
    await this._bot.login(process.env.BOT_TOKEN);
    this._logger.log("Bot logged in !");
  }

  /**
   * Add en event listener to discord
   * @returns an ID that you can use to remove the listener 
   */
  public addEventListener<K extends keyof Discord.ClientEvents>(event: K, listener: (...args: Discord.ClientEvents[K]) => void): string {
    this._bot.on(event, listener);
    const id = uuid();
    this._listeners[id] = {
      listener,
      name: event
    }
    return id;
  }

  /**
   * Remove an event listener added precedently
   * throw an error if the id doesn't exists
   * @param id the id of the event
   */
  public removeEventListener(id: string): void {
    const event = this._listeners[id];
    if (!event)
      throw "Bad ID for event listener";
    this._bot.off(event.name, event.listener);
  }

  /**
   * Get a guild from its id
   */
  public getGuild(guildId: string): Discord.Guild {
    return this._bot.guilds.resolve(guildId);
  }

  /**
   * Get all the guilds that the server has
   */
  public getAllGuilds(): Discord.Guild[] {
    return this._bot.guilds.cache.array();
  }
}



interface ListenerData<K extends keyof Discord.ClientEvents> {
  [key: string]: {
    name: K,
    listener: (...args: Discord.ClientEvents[K]) => void
  }
}