import 'dotenv/config';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import OpenAI from 'openai';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

client.on(Events.ClientReady, readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}!`);
});

// SLASH COMMANDS - explore later implementation
client.on(Events.InteractionCreate, async interaction => {
  if (!interaction.isChatInputCommand()) return;

  if (interaction.commandName === 'ping') {
    await interaction.reply('Pong!');
  }
});

client.on(Events.MessageCreate, async message => {
  console.log(message.content);
  if (message.author.bot) return;
  if (!message.mentions.has(client.user)) return;
  
  // Remove the bot mention from the message
  const cleanContent = message.content.replace(/<@!?\d+>/, '').trim();

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages: [
      {
        role: 'system',
        content: 'You are a helpful and friendly assistant who enjoys casual conversation with friends in Discord'
      },
      {
        role: 'user',
        content: cleanContent
      }
      ],
      temperature: 0.7
    });

    message.reply(response.choices[0].message.content);
  } catch (error) {
    console.error('OpenAI API Error:', error);
    message.reply('Slight issue encountered. Please try again later.');
  }
});

client.login(process.env.DISCORD_TOKEN);