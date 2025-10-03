import 'dotenv/config';
import { REST, Routes } from 'discord.js';

const commands = [
  {
    name: 'ping',
    description: 'Replies with Pong! 🏓',
  },
  {
    name: 'register',
    description: 'Register with your personal information',
  },
];

const rest = new REST().setToken(process.env.DISCORD_TOKEN);

console.log('🚀 Started refreshing application (/) commands...');

try {
  const data = await rest.put(
    Routes.applicationCommands(process.env.CLIENT_ID),
    { body: commands },
  );

  console.log(`✅ Successfully reloaded ${data.length} application (/) commands.`);
} catch (error) {
  console.error('❌ Error deploying commands:', error);
}