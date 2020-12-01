export interface VoiceModel {
  msgId: string;
  msgChannelId: string;
  guildId: string;
  categoryId: string;
  channels: {
    creatorId: string;
    channelId: string;
  }[];
}