import { Logger } from './../../utils/logger';
import { CategoryChannel, MessageReaction, PartialUser, TextChannel, User, VoiceChannel, Guild } from 'discord.js';
import { BotService } from './../../services/bot.service';
import { GuildVoiceModel } from './models/voice-channel.model';
import discordConf from "../../conf/discord.conf";

export class VoiceComponent {
  private _guildData: GuildVoiceModel
  private readonly _logger: Logger = new Logger(this);
  constructor(
    private readonly _botService: BotService,
  ) { }

  public async init(channel: TextChannel): Promise<VoiceComponent> {
    const msg = await channel.send("@everyone cliquez sur **"+discordConf.emoji+"** pour créer un nouveau channel vocal dans la catégorie **exercices** !");
    const category = channel.parent || await channel.guild.channels.create("Exercices", { type: "category" });
    await msg.react(discordConf.emoji);
    this._guildData = {
      guildId: msg.guild.id,
      msg: msg,
      createdCategory: !channel.parent,
      categoryChannel: category,
      msgChannel: channel,
      channels: []
    };
    return this;
  }

  /**
   * Désactive la fonctionnalité des VoiceChannel
   * Supprime tt les channels vocaux
   * Supprime la catégorie si elle a été créée par le bot
   * Supprime toutes les réactions au message
   */
  public async destroy(): Promise<VoiceComponent> {
    for (const el of this._guildData.channels) {
      await el.channel.delete();
      // await this.removeDataChannelAndReaction(el.channel);
    }
    if (this._guildData.createdCategory)
      await this._guildData.categoryChannel.delete();
    return this;
  }

  
  /**
   * Si l'utilisateur a réagis un '+' sur le message d'annonce alors on créer un channel vocal @see _createVoiceChannel()
   * @param reaction reaction de l'utilisateur (message, emoji, ajout|suppression)
   * @param user utilisateur qui a réagis
   */
  public async reactionListener(reaction: MessageReaction, user: User | PartialUser, action: "add"|"remove") {
    if (user instanceof User && reaction.emoji.toString() === discordConf.emoji) {
      if (action == "add")
        await this._createVoiceChannel(user);
      else {
        const index = this._guildData.channels.findIndex(el => el.creatorId == user.id);
        if (!index)
          return;
        await this._guildData.channels[index].channel.delete();
        this._guildData.channels.splice(index, 1);
      }
    }
  }

  /**
   * Méthode appellée lorsque un des channels vocaux de la feature est modifié
   * Dans le cas ou il n'y a plus personne dans le chanel celui ci est supprimé 
   * Le créateur à alors sa réaction '+' du message au dessus supprimée
   * @param channel 
   */
  public async onVoiceChannelUpdate(channel: VoiceChannel) {
    if (!channel || !this._guildData.channels.find(el => el.channel.id === channel.id))
      return;
    this._logger.log("Voice channel update on guild :", channel.guild.name);
    if (channel.members.size === 0) {
      try {
        await channel.delete();
      } catch (e) {
        this._logger.error(e);
      }
    }
  }

  
  public async removeDataChannelAndReaction(channel: VoiceChannel) {
    const channelInfoIndex = this._guildData.channels.findIndex(el => el.channel.id === channel.id);
    const msgReactions = this._guildData.msg.reactions.resolve(discordConf.emoji);
    await msgReactions.users.remove(this._guildData.channels[channelInfoIndex].creatorId);

    this._guildData.channels.splice(channelInfoIndex, 1);
  }


  /**
   * Créer un channel vocal dans une category spécifique et bouge l'utilisateur dedans si celui ci était déjà dans un vocal
   * Si personne join le channel au bout de 30 sec alors il est supprimé
   * @param category category ou créer le channel
   * @param user utilisteur à vouger
   */
  private async _createVoiceChannel(user?: User) {
    try {
      const channel = await this._guildData.categoryChannel.guild.channels.create(`Channel de ${user.username}`, { type: 'voice', parent: this._guildData.categoryChannel });
      const member = this._botService.getGuild(this._guildData.guildId).member(user);
      if (member.voice.channelID)
        await member.voice.setChannel(channel);
      else
        setTimeout(() => channel?.members?.size == 0 && channel?.delete(),1000 * 60);
      this._guildData.channels.push({ channel, creatorId: user.id });
    } catch (e) {
      this._logger.error(e);
    }
  }

  get guildId(): string {
    return this._guildData.guildId;
  }
  

}