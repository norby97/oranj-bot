require('dotenv').config();
const {
  Client,
  GatewayIntentBits,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  Events
} = require('discord.js');
const { generateChallenge, checkSolution } = require('./ciphers/challenges');

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.once('ready', () => {
  console.log(`Bot online as ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  if (message.content === '!orange') {
    const menu = new StringSelectMenuBuilder()
      .setCustomId('difficulty-select')
      .setPlaceholder('Choose your orange...')
      .addOptions([
        { label: '🟠 Basic Orange', value: 'easy' },
        { label: '🟣 Purple Orange', value: 'medium' },
        { label: '🥉 Bronze Orange', value: 'hard' },
        { label: '🥈 Silver Orange', value: 'veryhard' },
        { label: '🥇 Golden Orange', value: 'insane' }
      ]);

    const row = new ActionRowBuilder().addComponents(menu);

    await message.reply({
      content: 'Select your orange to begin the cipher trial:',
      components: [row]
    });
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isStringSelectMenu()) return;

  const difficulty = interaction.values[0];
  const challenge = generateChallenge(difficulty);

  await interaction.reply(
    `🧩 Your cipher:\n\`${challenge.encrypted}\`\n\nReply with your decrypted answer.`
  );

  const filter = (m) => m.author.id === interaction.user.id;
  const collector = interaction.channel.createMessageCollector({
    filter,
    time: 60000
  });

  collector.on('collect', (m) => {
    if (checkSolution(m.content, challenge)) {
      m.reply('✅ Correct! You have peeled the orange of mystery.');
      collector.stop();
    } else {
      m.reply('❌ Incorrect. Try again.');
    }
  });

  collector.on('end', (collected, reason) => {
    if (reason === 'time') {
      interaction.followUp('⏰ Time is up! The orange has spoiled.');
    }
  });
});

client.login(process.env.DISCORD_TOKEN);
