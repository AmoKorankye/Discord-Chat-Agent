import 'dotenv/config';
import { Client, Events, GatewayIntentBits, ModalBuilder, TextInputBuilder, TextInputStyle, ActionRowBuilder } from 'discord.js';
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
  
  // Handle Modal Submissions
  if (interaction.isModalSubmit()) {
    if (interaction.customId === 'registerModal') {
      const name = interaction.fields.getTextInputValue('nameInput');
      const age = interaction.fields.getTextInputValue('ageInput');
      const dob = interaction.fields.getTextInputValue('dobInput');
      
      console.log('📝 Form submitted:', { name, age, dob });
      
      await interaction.reply({
        content: `✅ **Registration Successful!**\n\n**Name:** ${name}\n**Age:** ${age}\n**Date of Birth:** ${dob}\n\nThank you for registering!`,
        ephemeral: true // Only visible to the user
      });
      return;
    }
  }
  
  // Handle Slash Commands
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

  if (interaction.commandName === 'register') {
    console.log('📋 Opening registration form...');
    
    // Create the modal form
    const modal = new ModalBuilder()
      .setCustomId('registerModal')
      .setTitle('User Registration');

    // Create form fields
    const nameInput = new TextInputBuilder()
      .setCustomId('nameInput')
      .setLabel('What is your full name?')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('John Doe')
      .setRequired(true)
      .setMaxLength(100);

    const ageInput = new TextInputBuilder()
      .setCustomId('ageInput')
      .setLabel('How old are you?')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('25')
      .setRequired(true)
      .setMaxLength(3);

    const dobInput = new TextInputBuilder()
      .setCustomId('dobInput')
      .setLabel('What is your date of birth?')
      .setStyle(TextInputStyle.Short)
      .setPlaceholder('YYYY-MM-DD (e.g., 1998-05-15)')
      .setRequired(true)
      .setMaxLength(10);

    // Create action rows (each input needs its own row)
    const firstRow = new ActionRowBuilder().addComponents(nameInput);
    const secondRow = new ActionRowBuilder().addComponents(ageInput);
    const thirdRow = new ActionRowBuilder().addComponents(dobInput);

    // Add inputs to the modal
    modal.addComponents(firstRow, secondRow, thirdRow);

    // Show the modal to the user
    await interaction.showModal(modal);
    console.log('✅ Modal shown!');
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