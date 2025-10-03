import 'dotenv/config';
import { Client, Events, GatewayIntentBits } from 'discord.js';
import OpenAI from 'openai';

const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

client.on(Events.ClientReady, readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}!`);
  console.log(`Bot is in ${readyClient.guilds.cache.size} servers`);
});

// SLASH COMMANDS - Now active with debugging!
client.on(Events.InteractionCreate, async interaction => {
  console.log('📥 Interaction received!');
  
  if (!interaction.isChatInputCommand()) {
    console.log('❌ Not a chat input command');
    return;
  }

  console.log(`✅ Slash command received: "${interaction.commandName}"`);

  if (interaction.commandName === 'ping') {
    console.log('🏓 Responding to ping command...');
    await interaction.reply('Pong! 🏓');
    console.log('✅ Reply sent!');
    return;
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
    message.reply('🤖 My AI brain is temporarily offline due to quota limits. Try using slash commands like `/ping` instead!');
  }
});

client.login(process.env.DISCORD_TOKEN);