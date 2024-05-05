const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("Just use this command"),

  async execute(interaction) {
    const client = interaction.client;
    const embed = new EmbedBuilder()
      .setTitle("Moderator Bot")
      .setColor("Blurple")
      .setThumbnail(client.user.displayAvatarURL({ format: "png", size: 1024 }))
      .addFields(
        {
          name: "Moderation Commands",
          value:
            "\`> /mod\` = A basic moderation system with subcommands.\n\n\`> /deleted-message-log\` = An interactive deleted message logging system that provides deleted message in the channel you mentioned while setting up the system.\n\n\`> /spam-detect\` = An interactive spam detection system to catch spammers and provide them in the log channel you mentioned while setting up the system.\n\n\`> /ticket\` = Create a ticket system for your server, determine an open menu select message and let bot send a inform message to the channel you mentioned.\n\n\`> /purge\` = You already know what does it mean. (purge the messages, first specify a number)",
          inline: false,
        },
        {
          name: "Utility Commands",
          value: "\`> /help\` = You know it, right?\n\n\`> /whois\` = Get information about anyone you want.\n\n\`> /thecommandthatdoesntexist\` = What was developer thinking while typing that",
        }
      );

    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};
