const { Client, MessageActionRow, MessageButton, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'buttonrole',
    description: 'Create a button to assign roles to users.',
    category: 'mod', // Only allow admins or a specific role to use this
    run: async (client, message, args) => {

        // Make sure the user has the correct permissions (Admin permission)
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription(`You do not have permission to run this command.`)
                ]
            });
        }

        // Define the role names and the buttons' labels
        const roleNames = ['Member', 'Muted', 'VIP']; // Change these to your desired roles
        const roleButtons = roleNames.map(roleName => {
            return new MessageButton()
                .setCustomId(roleName)
                .setLabel(roleName)
                .setStyle('PRIMARY');
        });

        // Create the action row with buttons
        const row = new MessageActionRow().addComponents(roleButtons);

        // Send a message with the buttons
        const embed = new MessageEmbed()
            .setColor('BLUE')
            .setTitle('Click a button to assign a role!')
            .setDescription('Choose one of the roles below to self-assign by clicking the corresponding button.');

        // Send the embed message with the buttons attached
        await message.channel.send({
            embeds: [embed],
            components: [row],
        });

        // Create a message collector for the button interactions
        const filter = (interaction) => interaction.isButton() && interaction.user.id === message.author.id;
        const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 }); // 60 seconds

        collector.on('collect', async (interaction) => {
            const roleName = interaction.customId;
            const role = message.guild.roles.cache.find(r => r.name === roleName);

            if (!role) {
                return interaction.reply({
                    content: `Role \`${roleName}\` not found!`,
                    ephemeral: true,
                });
            }

            const member = message.guild.members.cache.get(interaction.user.id);

            // Toggle the role: if the member already has the role, remove it; otherwise, add it
            if (member.roles.cache.has(role.id)) {
                await member.roles.remove(role);
                return interaction.reply({
                    content: `You have removed the \`${roleName}\` role.`,
                    ephemeral: true,
                });
            } else {
                await member.roles.add(role);
                return interaction.reply({
                    content: `You have been given the \`${roleName}\` role.`,
                    ephemeral: true,
                });
            }
        });

        collector.on('end', () => {
            // Disable buttons after the collector ends
            const disabledRow = new MessageActionRow().addComponents(
                roleButtons.map(button => button.setDisabled(true))
            );

            message.edit({
                components: [disabledRow],
            });
        });
    }
};
