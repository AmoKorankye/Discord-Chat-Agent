import 'dotenv/config';
import { Client, Events, GatewayIntentBits } from 'discord.js';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

client.on(Events.ClientReady, readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}!`);
});

// SLASH COMMANDS - explore later implementation
// client.on(Events.InteractionCreate, async interaction => {
//   if (!interaction.isChatInputCommand()) return;
//
//   if (interaction.commandName === 'ping') {
//     await interaction.reply('Pong!');
//   }
// });

client.login(process.env.DISCORD_TOKEN);