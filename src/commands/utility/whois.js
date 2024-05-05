const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("whois")
    .setDescription("Get information about any user")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to get information about")
        .setRequired(false)
    ),
  async execute(interaction) {
    const user = interaction.options.getUser("user") || interaction.user;
    const member = await interaction.guild.members.fetch(user.id);
    const icon = user.displayAvatarURL({ extension: "png", size: 1_024 });
    const tag = user.tag;

    const embed = new EmbedBuilder()
      .setColor("Blue")
      .setAuthor({ name: tag, iconURL: icon })
      .setThumbnail(icon)
      .addFields(
        {
          name: "Member",
          value: `${user}`,
          inline: false,
        },
        {
          name: "Roles",
          value: `${member.roles.cache.map((r) => r).join(" ")}`,
          inline: false,
        },
        {
          name: "Joined Server",
          value: `<t:${parseInt(member.joinedAt / 1000)}:R>`,
          inline: true,
        },
        {
          name: "Joined Discord",
          value: `<t:${parseInt(user.createdAt / 1000)}:R>`,
          inline: true,
        }
      )
      .setFooter({ text: `User ID: ${user.id}` })
      .setTimestamp();

    await interaction.reply({
      embeds: [embed],
      ephemeral: true,
    });
  },
};
