import { VoiceChannel } from 'discord.js';
import { DefaultComponent } from './../component.default';

export class VoiceChannelComponent extends DefaultComponent {
  private readonly prefix = '!g';

  public async init(): Promise<VoiceChannelComponent> {
    return this;
  }
  
  private createOnJoin() {
    /**Sert à définir un salon vocal qui créra un salon quand on le rejoins */
    this._botService.addEventListener('message', async message => {
      if (message.content.startsWith(`${this.prefix}add`)) { //pour définir un channel qui va rester à l'écoute
        return message.content.slice(5);
      }
    });
  }
  
  private async detect(channel: VoiceChannel) {
    /**Detecte s'il y a quelqu'un dans le salon et créer un slaon */
    if (channel.members.size != 0) {
      (await this.createVoiceChannel(true));
        //TODO: move les personnes qui sont dans le salon dans le salon créé
    }
  }

  private async createVoiceChannel(bool = false) {
    /**Creer un voice channel si true et par défaut il faut faire !gcvc */
    if (!bool) {
      this._botService.addEventListener('message', async message => {
        if (message.content.startsWith(`${this.prefix}cvc`)) { //cvc pour create voice channel
          const args = message.content.slice(5);
          await message.guild.channels.create('New Voice Channel', { type: 'voice' });
        }
      });
    } else {
      return this._botService.addEventListener("voiceStateUpdate", async voiceStateUpdate => {
        await voiceStateUpdate.guild.channels.create('New Voice Channel', { type: 'voice' });
      });
    }
  }
  
}
