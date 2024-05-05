const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  ChannelType,
} = require("discord.js");
const ticket = require("../../Schemas/ticketSchema");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Manage the ticket system")
    .addSubcommand((command) =>
      command
        .setName("send")
        .setDescription("Send the ticket message")
        .addStringOption((option) =>
          option
            .setName("name")
            .setDescription("The name for the ticket menu")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("message")
            .setDescription("A custom message to add to the embed")
            .setRequired(false)
        )
    )
    .addSubcommand((command) =>
      command
        .setName("setup")
        .setDescription("Setup the ticket system by providing a category")
        .addChannelOption((option) =>
          option
            .setName("category")
            .setDescription("The category to send tickets in")
            .addChannelTypes(ChannelType.GuildCategory)
            .setRequired(true)
        )
    )
    .addSubcommand((command) =>
      command.setName("remove").setDescription("Disable the ticket system")
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.Administrator),
  async execute(interaction) {
    const { options } = interaction;
    const sub = options.getSubcommand();
    const data = await ticket.findOne({ Guild: interaction.guild.id });

    switch (sub) {
      case "send":
        if (!data)
          return await interaction.reply({
            content: `❌ You don't have a ticket system yet. By using /ticket setup, you can setup a ticket system for your server.`,
            ephemeral: true,
          });

        const name = options.getString("name");
        var message =
          options.getString("message") ||
          "Please describe why are you opening a ticket? What's your goal on it?";

        const select = new ActionRowBuilder().addComponents(
          new StringSelectMenuBuilder()
            .setCustomId("ticketCreateSelect")
            .setPlaceholder(`🌍 ${name}`)
            .setMinValues(1)
            .addOptions({
              label: "Create your ticket",
              description: "Click to begin the ticket creation process",
              value: "createTicket",
            })
        );

        const embed = new EmbedBuilder()
          .setColor("Blurple")
          .setTitle(`✨ Create a ticket!`)
          .setDescription(message + " 🎫")
          .setFooter({
            text: `${interaction.guild.name}`,
            iconURL: `${interaction.guild.iconURL()}`,
          });

        await interaction.reply({
          content: `✅ I have sent your ticket message below.`,
          ephemeral: true,
        });
        await interaction.channel.send({
          embeds: [embed],
          components: [select],
        });

        break;
      case "remove":
        if (!data)
          return await interaction.reply({
            content: `❌ You can't remove something that doesn't exist.`,
            ephemeral: true,
          });
        else {
          await ticket.deleteOne({ Guild: interaction.guild.id });
          await interaction.reply({
            content: `✅ I have successfully removed ticket system from the server.`,
            ephemeral: true,
          });
        }

        break;
      case "setup":
        if (data)
          return await interaction.reply({
            content: `❌ You already setup a ticket system before.\nCategory you set: <#${data.Category}>`,
            ephemeral: true,
          });
        else {
          const category = options.getChannel("category");
          await ticket.create({
            Guild: interaction.guild.id,
            Category: category.id,
          });

          await interaction.reply({
            content: `✅ I have successfully set the ticket system to **${category}** category! Use /ticket send format to send a ticket create message`,
            ephemeral: true,
          });
        }
    }
  },
};
