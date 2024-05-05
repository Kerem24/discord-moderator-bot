// I get spam detect system from MrJAwesome!
const {
  SlashCommandBuilder,
  EmbedBuilder,
  ChannelType,
  PermissionsBitField,
} = require("discord.js");
const main = require("../../Schemas/spamDetectSetupSchema");

module.exports = {
  mod: true,
  data: new SlashCommandBuilder()
    .setName("spam-detect")
    .setDescription("Spam Detect System")
    .addSubcommand((command) =>
      command
        .setName("enable")
        .setDescription("Enable the spam detect system for your server")
        .addChannelOption((option) =>
          option
            .setName("channel")
            .setDescription("The log channel to get informed about spams")
            .addChannelTypes(ChannelType.GuildText)
        )
    )
    .addSubcommand((command) =>
      command
        .setName("disable")
        .setDescription("Remove the spam detect system from your server")
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageGuild),
  async execute(interaction) {
    const { options } = interaction;
    const sub = options.getSubcommand();
    var data = await main.findOne({ Guild: interaction.guild.id });

    async function sendMessage(message) {
      const embed = new EmbedBuilder()
        .setColor("Blurple")
        .setDescription(message);

      await interaction.reply({ embeds: [embed], ephemeral: true });
    }

    switch (sub) {
      case "enable":
        if (data) {
          await sendMessage(`❌ You have already setup this system before.`);
        } else {
          const channel = options.getChannel("channel") || false;
          if (!channel) {
            await main.create({ Guild: interaction.guild.id });
          } else {
            await main.create({
              Guild: interaction.guild.id,
              Channel: channel.id,
            });
          }

          await sendMessage(
            `✅ I have successfully enabled the spam detect system.`
          );
        }
        break;
      case "disable":
        if (!data) {
          await sendMessage(
            `❌ You can't disable the thing that doesn't exist.`
          );
        } else {
          await main.deleteOne({ Guild: interaction.guild.id });
          await sendMessage(
            `✅ I have successfully disabled the spam detect system.`
          );
        }
    }
  },
};
