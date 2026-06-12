const http = require('http');
http.createServer((req, res) => res.end('Bot alive')).listen(process.env.PORT || 3000);require('dotenv').config();
const { Client, GatewayIntentBits, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, ModalBuilder, TextInputBuilder, TextInputStyle, Events } = require('discord.js');

const TOKEN = process.env.TOKEN;
const PAYMENT_URL = 'https://mr-dakroma-bot-organization.vercel.app';

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ]
});

client.once(Events.ClientReady, () => {
  console.log(`✅ Mr Dakroma Agent Bot is LIVE as ${client.user.tag}`);
  client.user.setActivity('🤖 Watching Mr Dakroma Server', { type: 3 });
});

client.on(Events.GuildMemberAdd, async (member) => {
  try {
    const channel = member.guild.systemChannel ||
      member.guild.channels.cache.find(c => c.name.includes('general') || c.name.includes('welcome'));
    if (!channel) return;
    const welcomeEmbed = new EmbedBuilder()
      .setColor('#7C3AED')
      .setTitle(`🤖 Welcome to Mr Dakroma Agent, ${member.user.username}!`)
      .setDescription(`Hey **${member.user.username}**, welcome to the official **Mr Dakroma Bot Organization** server! 🎉\n\nWe provide powerful **WhatsApp automation bots** that protect and manage your groups 24/7.\n\n👇 Click the button below to **register** and get started!`)
      .setThumbnail(member.user.displayAvatarURL({ dynamic: true }))
      .addFields(
        { name: '🛡️ What We Offer', value: 'Auto-delete suspicious links\nWarn & kick spammers\n24/7 group protection', inline: true },
        { name: '💰 Pricing', value: 'Basic: ₦1,500/mo\nStandard: ₦2,000/mo\nPremium: ₦3,500/mo', inline: true }
      )
      .setFooter({ text: 'Mr Dakroma Bot Organization 🔥' })
      .setTimestamp();
    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setCustomId('register').setLabel('📝 Register Now').setStyle(ButtonStyle.Primary),
      new ButtonBuilder().setLabel('🌐 Visit Website').setStyle(ButtonStyle.Link).setURL(PAYMENT_URL)
    );
    await channel.send({ embeds: [welcomeEmbed], components: [row] });
  } catch (err) {
    console.error('Welcome error:', err);
  }
});

client.on(Events.InteractionCreate, async (interaction) => {
  if (interaction.isButton() && interaction.customId === 'register') {
    const modal = new ModalBuilder().setCustomId('registration_form').setTitle('📝 Mr Dakroma Bot Registration');
    const nameInput = new TextInputBuilder().setCustomId('name').setLabel('Your Full Name').setStyle(TextInputStyle.Short).setPlaceholder('e.g. David Koroma').setRequired(true);
    const ageInput = new TextInputBuilder().setCustomId('age').setLabel('Your Age').setStyle(TextInputStyle.Short).setPlaceholder('e.g. 25').setRequired(true);
    const countryInput = new TextInputBuilder().setCustomId('country').setLabel('Your Country').setStyle(TextInputStyle.Short).setPlaceholder('e.g. Nigeria').setRequired(true);
    const whatsappInput = new TextInputBuilder().setCustomId('whatsapp').setLabel('Your WhatsApp Number').setStyle(TextInputStyle.Short).setPlaceholder('e.g. 2348012345678').setRequired(true);
    const planInput = new TextInputBuilder().setCustomId('plan').setLabel('Which Plan? (Basic / Standard / Premium)').setStyle(TextInputStyle.Short).setPlaceholder('Standard').setRequired(true);
    modal.addComponents(
      new ActionRowBuilder().addComponents(nameInput),
      new ActionRowBuilder().addComponents(ageInput),
      new ActionRowBuilder().addComponents(countryInput),
      new ActionRowBuilder().addComponents(whatsappInput),
      new ActionRowBuilder().addComponents(planInput)
    );
    await interaction.showModal(modal);
  }

  if (interaction.isModalSubmit() && interaction.customId === 'registration_form') {
    const name = interaction.fields.getTextInputValue('name');
    const age = interaction.fields.getTextInputValue('age');
    const country = interaction.fields.getTextInputValue('country');
    const whatsapp = interaction.fields.getTextInputValue('whatsapp');
    const plan = interaction.fields.getTextInputValue('plan');
    const prices = { basic: '₦1,500', standard: '₦2,000', premium: '₦3,500' };
    const price = prices[plan.toLowerCase()] || '₦2,000';
    const successEmbed = new EmbedBuilder()
      .setColor('#22C55E')
      .setTitle('✅ Registration Successful!')
      .setDescription(`Thank you **${name}**! Your registration has been received. 🎉\n\nClick the button below to proceed to payment and get your bot activated!`)
      .addFields(
        { name: '👤 Name', value: name, inline: true },
        { name: '🎂 Age', value: age, inline: true },
        { name: '🌍 Country', value: country, inline: true },
        { name: '📱 WhatsApp', value: whatsapp, inline: true },
        { name: '📦 Plan', value: plan, inline: true },
        { name: '💰 Amount', value: price, inline: true }
      )
      .setFooter({ text: 'Mr Dakroma Bot Organization 🔥 — Pay to activate your bot!' })
      .setTimestamp();
    const payRow = new ActionRowBuilder().addComponents(
      new ButtonBuilder().setLabel('💳 Pay Now & Get Your Bot').setStyle(ButtonStyle.Link).setURL(PAYMENT_URL)
    );
    await interaction.reply({ embeds: [successEmbed], components: [payRow], ephemeral: true });
    const logChannel = interaction.guild.channels.cache.find(c => c.name.includes('log') || c.name.includes('registration') || c.name.includes('admin'));
    if (logChannel) {
      const logEmbed = new EmbedBuilder()
        .setColor('#F59E0B')
        .setTitle('📋 New Registration!')
        .addFields(
          { name: '👤 Name', value: name, inline: true },
          { name: '🎂 Age', value: age, inline: true },
          { name: '🌍 Country', value: country, inline: true },
          { name: '📱 WhatsApp', value: whatsapp, inline: true },
          { name: '📦 Plan', value: plan, inline: true },
          { name: '💰 Amount', value: price, inline: true },
          { name: '🎮 Discord', value: `${interaction.user.tag}`, inline: true }
        )
        .setTimestamp();
      await logChannel.send({ embeds: [logEmbed] });
    }
  }
});

client.login(TOKEN);
