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

client.on(Events.MessageCreate, message => {
  console.log(message.content);
  if (message.author.bot) return;
  if (!message.mentions.has(client.user)) return;
  message.content = message.content.replace(/<@!?1421182513358835854>/, '').trim();

  message.reply('Hello! How can I assist you today?');
});

client.login(process.env.DISCORD_TOKEN);