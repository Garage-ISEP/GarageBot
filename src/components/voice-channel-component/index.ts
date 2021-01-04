import { VoiceComponent } from './guild.component';
import { Channel, Message, MessageReaction, PartialUser, TextChannel, User, VoiceChannel, VoiceState } from 'discord.js';
import { DefaultComponent } from './../component.default';
import discordConf from "../../conf/discord.conf";
export class VoiceHandlerComponent extends DefaultComponent {
  /**
   *  Liste de toutes les guildes
   */
  private _voicesData: VoiceComponent[] = [];

  public async init(): Promise<VoiceHandlerComponent> {
    this._botService.addEventListener('message', message => this._messageListener(message));
    this._botService.addEventListener("messageReactionAdd", (reaction, user) => this._reactionListener(reaction, user));
    // this._botService.addEventListener("messageReactionRemove", (reaction, user) => this._reactionListener(reaction, user, "remove"));
    this._botService.addEventListener("voiceStateUpdate", (prev, next) => this._voiceListener(prev));
    this._botService.addEventListener("channelDelete", (channel) => this._channelDeleteListener(channel as TextChannel))
    return this;
  }

  /**
   * Réagis aux messages avec un prefix défini
   * Commande : !g cvc start: @see _enableVoiceChannel
   * Commande : !g cvc stop : @see _disableVoiceChannel
   */  
  private _messageListener(message: Message) {
    if (!message.guild.member(message.author).hasPermission("ADMINISTRATOR"))
      return;
    if (message.content === `${discordConf.prefix} cvc start`)
      this._enableVoiceChannel(message.channel as TextChannel)
    else if (message.content === `${discordConf.prefix} cvc stop`)
      this._disableVoiceChannel(message.channel as TextChannel)
  }

  private _reactionListener(reaction: MessageReaction, user: PartialUser | User) {
    try {
      this._getGuildComponentFromCategory((reaction.message.channel as TextChannel).parentID)?.reactionListener(reaction, user);      
    } catch (e) {
      this._logger.error(e);
    }
  }

  /**
   * Réagis a tt les events des channels vocaux
   * Si l'utilisateur viens dans un channel vocal du bot ou si il en sort @see _onVoiceChannelUpdate
   * @param next object contenant les informations des changements (channel)
   */
  private async _voiceListener(prev: VoiceState) {
    try {
      await this._getGuildComponentFromCategory(prev?.channel?.parentID)?.onVoiceChannelUpdate(prev.channel);      
    } catch (e) {
      this._logger.error(e);
    }
  }

  /**
   * Event trigger lors de la suppression d'un channel
   * Supprime les données du channel IRL
   */
  private async _channelDeleteListener(channel: Channel) {
    if (channel instanceof VoiceChannel && channel.parentID) {
      try {
        await this._getGuildComponentFromCategory(channel.parentID)?.removeDataChannelAndReaction(channel);
        this._logger.log(`Channel : ${channel.name} deleted removing creator reaction and data`);
      } catch (e) {
        this._logger.error(e);
      }
    }
  }

  /**
   * Créer un message avec une réaction '+' pour pouvoir ajouter des messages si cette feature est pas déjà activée
   * @param channel Channel dans lequel la commande à été envoyée
   */
  private async _enableVoiceChannel(channel: TextChannel) {
    try {
      if (channel.isText() && !this._getGuildComponentFromCategory(channel.parentID)) {
        this._logger.log("Enabling voice feature in guild :", channel.guild.name);
        this._voicesData.push(await new VoiceComponent(this._botService).init(channel));
      }
    } catch (e) {
      this._logger.error(e);
    }
  }

  /**
   * Désactive la fonctionnalité des VoiceChannel
   * Supprime tt les channels vocaux
   * Supprime la catégorie
   * Supprime toutes les réactions au message
   * @param channel 
   */
  private async _disableVoiceChannel(channel: TextChannel) {
    try {
      if (!channel.parentID)
        return;
      const component = await this._getGuildComponentFromCategory(channel.parentID).destroy();
      this._voicesData.splice(this._voicesData.indexOf(component), 1);
    } catch (e) {
      this._logger.error(e);
    }
  }

  private _getGuildComponentFromId(id: string): VoiceComponent {
    return this._voicesData.find(el => el.guildId == id);
  }
  private _getGuildComponentFromCategory(id: string): VoiceComponent {
    return this._voicesData.find(el => el.guildCategoryId == id);
  }
}
