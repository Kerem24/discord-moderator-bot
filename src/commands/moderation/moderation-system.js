const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
} = require("discord.js");
const { execute } = require("../../events/spamDetect");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("mod")
    .setDescription("A moderation system")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("ban")
        .setDescription("Ban a user")
        .addUserOption((option) =>
          option
            .setName("user-to-ban")
            .setDescription("The user to ban")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("reason")
            .setDescription("The reason for the ban")
            .setRequired(false)
        )
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName("kick")
        .setDescription("Kick a user")
        .addUserOption((option) =>
          option
            .setName("user-to-kick")
            .setDescription("The user to kick")
            .setRequired(true)
        )
    )

    .addSubcommand((subcommand) =>
      subcommand
        .setName("timeout")
        .setDescription("Timeout a user")
        .addUserOption((option) =>
          option
            .setName("user-to-timeout")
            .setDescription("The user to timeout")
            .setRequired(true)
        )
        .addIntegerOption((option) =>
          option
            .setName("duration")
            .setDescription("Specify a duration (10 = 10 mins)")
            .setRequired(true)
        )
    )
    .setDMPermission(false)
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),

  async execute(interaction) {
    const { options } = interaction;
    const targetBan = await options.getUser("user-to-ban");
    const targetKick = await options.getUser("user-to-kick");

    const sub = options.getSubcommand();

    if (sub == "ban") {
      const reason = await options.getString("reason");
      if (!reason) {
        reason = "No reason provided.";
      }

      const bannedEmbed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle(`Moderation System - BAN`)
        .setDescription(`⚠️ ${targetBan.username} has been banned!`)
        .addFields(
          {
            name: "User",
            value: `> \`${targetBan.username} (${targetBan.id})\``,
          },
          {
            name: "Reason",
            value: `> \`${reason}\``,
          },
          {
            name: "Moderator",
            value: `> \`${interaction.user.username} (${interaction.user.id})\``,
          }
        )
        .setTimestamp();

      await interaction.guild.bans.create(targetBan, {
        reason: reason,
        deleteMessageDays: 1,
      });
      await interaction.reply({ embeds: [bannedEmbed], ephemeral: true });
    } else if (sub == "kick") {
      const kickedEmbed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle(`Moderation System - KICK`)
        .setDescription(`✅ ${targetKick.username} has been kicked!`)
        .addFields(
          {
            name: "User",
            value: `> \`${targetKick.username} (${targetKick.id})\``,
          },
          {
            name: "Moderator",
            value: `> \`${interaction.user.username} (${interaction.user.id})\``,
          }
        )
        .setTimestamp();

      await interaction.guild.members.kick(targetKick);
      await interaction.reply({ embeds: [kickedEmbed], ephemeral: true });
    } else if (sub == "timeout") {
      const duration = options.getInteger("duration");
      const targetTimeout = await options.getUser("user-to-timeout");
      const memberTimeout = await interaction.guild.members
        .fetch(targetTimeout.id)
        .catch(console.error);


      const timeoutEmbed = new EmbedBuilder()
        .setColor("Blurple")
        .setTitle(`Moderation System - TIMEOUT`)
        .setDescription(`✅ ${targetTimeout.username} has been timed out!`)
        .addFields(
          {
            name: "User",
            value: `> \`${targetTimeout.username} (${targetTimeout.id})\``,
          },
          {
            name: "Moderator",
            value: `> \`${interaction.user.username} (${interaction.user.id})\``,
          },
          {
            name: "Duration",
            value: `> \`${duration} minute\``,
          }
        )
        .setTimestamp();

      await memberTimeout.timeout(duration * 60 * 1000);
      await interaction.reply({ embeds: [timeoutEmbed], ephemeral: true });
    }
  },
};
