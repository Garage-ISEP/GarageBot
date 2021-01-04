import { CategoryChannel, Message, TextChannel, VoiceChannel } from "discord.js";

export interface GuildVoiceModel {
  msg: Message;
  msgChannel: TextChannel;
  guildId: string;
  createdCategory: boolean;
  categoryChannel: CategoryChannel;
  channels: {
    creatorId: string;
    channel: VoiceChannel;
  }[];
}