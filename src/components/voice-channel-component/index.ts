import { CategoryChannel, Guild, Message, MessageReaction, PartialUser, TextChannel, User, VoiceChannel, VoiceState } from 'discord.js';
import { DefaultComponent } from './../component.default';
import { VoiceModel } from './models/voice-channel.model';

export class VoiceChannelComponent extends DefaultComponent {
  private readonly prefix = '!g';
  private readonly emoji = "➕";
  /**
   * Donnée stockées pour chaque guilds lorsqu'on lance le système de VoiceChannel
   */
  private _voicesData: VoiceModel[] = [];

  public async init(): Promise<VoiceChannelComponent> {
    this._botService.addEventListener('message', message => this._messageListener(message));
    this._botService.addEventListener("messageReactionAdd", (reaction, user) => this._reactionListener(reaction, user));
    this._botService.addEventListener("voiceStateUpdate", (prev, next) => this._voiceListener(prev));

    return this;
  }

  /**
   * Réagis aux messages avec un prefix défini
   * Commande : !g cvc : @see _sendMessageCreateChannel
   */  
  private _messageListener(message: Message) {
    if (!message.guild.member(message.author).hasPermission("ADMINISTRATOR"))
      return;
    if (message.content === `${this.prefix} cvc start`)
      this._enableVoiceChannel(message.channel as TextChannel)
    else if (message.content === `${this.prefix} cvc stop`)
      this._disableVoiceChannel(message.channel as TextChannel)
  }

  /**
   * Si l'utilisateur a réagis un '+' sur le message d'annonce alors on créer un channel vocal @see _createVoiceChannel()
   * @param reaction reaction de l'utilisateur (message, emoji, ajout|suppression)
   * @param user utilisateur qui a réagis
   */
  private _reactionListener(reaction: MessageReaction, user: User | PartialUser) {
    const guildFeature = this._voicesData.find(el => el.msgId === reaction.message.id);
    if (user instanceof User && guildFeature && reaction.emoji.toString() === this.emoji)
      this._createVoiceChannel(reaction.message.guild.channels.cache.get(guildFeature.categoryId) as CategoryChannel, user);
  }

  /**
   * Réagis a tt les events des channels vocaux
   * Si l'utilisateur viens dans un channel vocal du bot ou si il en sort @see _onVoiceChannelUpdate
   * @param next object contenant les informations des changements (channel)
   */
  private async _voiceListener(prev: VoiceState) {
    const guildFeature = this._voicesData.find(el => el.guildId === prev.guild.id);
    if (guildFeature?.channels.map(el => el.channelId)?.includes(prev.channelID))
      this._onVoiceChannelUpdate(prev.channel, guildFeature);
  }

  /**
   * Créer un message avec une réaction '+' pour pouvoir ajouter des messages si cette feature est pas déjà activée
   * @param channel Channel dans lequel la commande à été envoyée
   */
  private async _enableVoiceChannel(channel: TextChannel) {
    try {
      if (!this._voicesData.find(el => el.guildId === channel.guild.id)) {
        this._logger.log("Enabling voice feature in guild :", channel.guild.name);
        const msg = await channel.send("@everyone cliquez sur **+** pour créer un nouveau channel vocal dans la catégorie **exercices** !");
        const category = await channel.guild.channels.create("Exercices", { type: "category" });
        await msg.react(this.emoji)
        this._voicesData.push({ guildId: msg.guild.id, msgId: msg.id, categoryId: category.id, msgChannelId: channel.id,channels: [] });
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
      const voiceData = this._voicesData.find(el => el.guildId === channel.guild.id);
      this._logger.log(voiceData);
      if (voiceData) {
        this._logger.log("Disabling voice feature in guild :", channel.guild.name);
        for (const channelData of voiceData.channels) {
          await channel.guild.channels.cache.get(channelData.channelId).delete();
          await channel.messages.cache.get(voiceData.msgId).reactions.removeAll();
        }
        await channel.guild.channels.cache.get(voiceData.categoryId).delete();
        this._voicesData.splice(this._voicesData.indexOf(voiceData), 1);
      }
    } catch (e) {
      this._logger.error(e);
    }
  }

  /**
   * Créer un channel vocal dans une category spécifique et bouge l'utilisateur dedans si celui ci était déjà dans un vocal
   * Si personne join le channel au bout de 30 sec alors il est supprimé
   * @param category category ou créer le channel
   * @param user utilisteur à vouger
   */
  private async _createVoiceChannel(category: CategoryChannel, user?: User) {
    try {
      const channel = await category.guild.channels.create(`Channel de ${user.username}`, { type: 'voice', parent: category });
      const member = this._botService.getGuild(category.guild.id).member(user);
      if (member.voice.channelID)
        await member.voice.setChannel(channel);
      else
        setTimeout(() => channel?.members?.size == 0 && channel?.delete(),1000 * 60);
      this._voicesData.find(el => el.categoryId == category.id).channels.push({ channelId: channel.id, creatorId: user.id });
    } catch (e) {
      this._logger.error(e);
    }
  }

  /**
   * Méthode appellée lorsque un des channels vocaux de la feature est modifié
   * Dans le cas ou il n'y a plus personne dans le chanel celui ci est supprimé 
   * Le créateur à alors sa réaction '+' du message au dessus supprimée
   * @param channel 
   */
  private async _onVoiceChannelUpdate(channel: VoiceChannel, voiceData: VoiceModel) {
    this._logger.log("Voice channel update on guild :", channel.guild.name);
    if (channel.members.size === 0) {
      try {
        const msgChannel = channel.guild.channels.cache.get(voiceData.msgChannelId) as TextChannel;
        const msgReactions = msgChannel.messages.resolve(voiceData.msgId).reactions.resolve(this.emoji);

        const creatorId = voiceData.channels.find(el => el.channelId == channel.id).creatorId;
        await msgReactions.users.remove(creatorId);
        await channel.delete();
      } catch (e) {
        this._logger.error(e);
      }
    }
  }
}
