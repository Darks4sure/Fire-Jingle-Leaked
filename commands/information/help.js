const { MessageEmbed, MessageActionRow, MessageButton, MessageSelectMenu } = require('discord.js');

module.exports = {
    name: 'help',
    aliases: ['h'],
    category: 'info',
    premium: false,
    run: async (client, message, args) => {
        const prefix = message.guild?.prefix || '&'; // Default prefix if not set

        // Create a MessageSelectMenu
        const selectMenu = new MessageSelectMenu()
            .setCustomId('categorySelect')
            .setPlaceholder('Jingle & Fire Get Fucked!')
            .addOptions([
                {
                    label: 'Home',
                    value: 'home',
                    description: 'Return to the help menu',
                },
                {
                    label: 'All',
                    value: 'all',
                    description: 'Show all commands',
                },
                {
                    label: 'AntiNuke',
                    value: 'antinuke',
                    description: 'Commands related to AntiNuke',
                },
                {
                    label: 'Moderation',
                    value: 'mod',
                    description: 'Commands related to Moderation',
                },
                {
                    label: 'Utility',
                    value: 'info',
                    description: 'Utility commands',
                },
                {
                    label: 'Welcomer',
                    value: 'welcomer',
                    description: 'Commands for Welcomer',
                },
                {
                    label: 'Voice',
                    value: 'voice',
                    description: 'Commands related to Voice',
                },
                {
                    label: 'Automod',
                    value: 'automod',
                    description: 'Commands for Automod',
                },
                {
                    label: 'Custom Role',
                    value: 'customrole',
                    description: 'Commands for Custom Roles',
                },
                {
                    label: 'Ticket',
                    value: 'ticket',
                    description: 'Commands for Ticket',
                },
                {
                    label: 'Logging',
                    value: 'logging',
                    description: 'Commands for Logging',
                },
                {
                    label: 'Autoresponder',
                    value: 'autoresponder',
                    description: 'Commands for Autoresponder',
                },
                {
                    label: 'Giveaway',
                    value: 'give',
                    description: 'Commands for Giveaway',
                },
                {
                    label: 'Fun',
                    value: 'fun',
                    description: 'Fun commands',
                }
            ]);

        // Create action row with buttons
        const actionRow = new MessageActionRow()
            .addComponents(
                new MessageButton()
                    .setLabel('Invite Me')
                    .setStyle('LINK')
                    .setURL('https://discord.com/oauth2/authorize?client_id=1323687398210670683&permissions=8&integration_type=0&scope=bot'),
                new MessageButton()
                    .setLabel('Support')
                    .setStyle('LINK')
                    .setURL('https://discord.gg/drontop'),
                new MessageButton()
                    .setLabel('Home')
                    .setCustomId('homeButton')
                    .setStyle('SECONDARY'),
                new MessageButton()
                    .setLabel('Delete')
                    .setCustomId('deleteButton')
                    .setStyle('DANGER')
            );

        // Embed message
        const embed = new MessageEmbed()
            .setColor(client.color) // Red color for the embed
            .setAuthor({
                name: message.author.tag,
                iconURL: message.author.displayAvatarURL({ dynamic: true })
            })
            .setThumbnail(client.user.displayAvatarURL({ dynamic: true }))
            .setDescription(
                `Hello! I'm Fire, Your server Nuking Bot I am fucked by darks and i also copy harm using chatgpt but there is soo different logic :clown:\n\nPrefix for this server \`${prefix}\`\nTotal Commands: \`${client.commands.size}\``
            )
            .addField(
                '__Main Modules__',
                `
                <:AntiNuke:1304657090484240385> **AntiNuke**\n<:Moderation:1304655483180810320> **Moderation**\n<:Utility:1304663064976556163> **Utility**\n<:Welcomer:1304663120442036235> **Welcomer**\n<:ReactionRole:1304663769225498654> **Reaction Role**\n<:Ticket:1304657132506845224> **Ticket**
                `,
                true
            )
            .addField('\u200b', '\u200b', true)
            .addField(
                '__Extra Modules__',
                `
                <:Voice:1304664870347739188> **Voice**\n<:CustomRole:1304655571311657054> **Custom Role**\n<:Logging:1304695374715555861> **Logging**\n<:Automod:1304696136518336512> **Automod**\n<:Autoresponder:1304697522937397308> **Autoresponder**\n<:Giveaway:1304695533595529217> **Giveaway**\n<:Ticket:1304657132506845224> **Fun**\n**Links**\n[Support](https://discord.gg/MKCxUgFNnA) **|** [Invite Me](https://discord.com/oauth2/authorize?client_id=1323687398210670683&permissions=8&integration_type=0&scope=bot)
                `,
                true
            )
            .setFooter({
                text: 'Jingle & Fire Fucked By /drontop Darks Papa',
                iconURL: client.user.displayAvatarURL()
            });

        // Send the initial help message
        const helpMessage = await message.channel.send({
            embeds: [embed],
            components: [actionRow, new MessageActionRow().addComponents(selectMenu)]
        });

        // Component collector for interactions
        const collector = helpMessage.createMessageComponentCollector({
            filter: (i) => i.user.id === message.author.id,
            time: 60000
        });

        collector.on('collect', async (i) => {
            if (i.customId === 'deleteButton') {
                await helpMessage.delete();
                return;
            }

            if (i.customId === 'homeButton' || i.values?.[0] === 'home') {
                await i.deferUpdate();
                return helpMessage.edit({
                    embeds: [embed],
                    components: [actionRow, new MessageActionRow().addComponents(selectMenu)]
                });
            }

            await i.deferUpdate();

            const category = i.values[0];
            let commands = [];

            if (category === 'all') {
                commands = client.commands.map((x) => `\`${x.name}\``);
            } else {
                const categoryMap = {
                    antinuke: 'security',
                    mod: 'mod',
                    info: 'info',
                    welcomer: 'welcomer',
                    voice: 'voice',
                    automod: 'automod',
                    customrole: 'customrole',
                    logging: 'logging',
                    autoresponder: 'autoresponder',
                    giveaway: 'giveaway',
                    fun: 'fun',
                    ticket: 'ticket'
                };
                const filteredCategory = categoryMap[category];
                commands = client.commands
                    .filter((x) => x.category === filteredCategory)
                    .map((x) => `\`${x.name}\``);
            }

            const categoryEmbed = new MessageEmbed()
                .setColor(client.color)
                .setAuthor({
                    name: client.user.username,
                    iconURL: client.user.displayAvatarURL()
                })
                .setDescription(
                    `**${category.charAt(0).toUpperCase() + category.slice(1)} Commands**\n${commands.join(', ')}`
                );

            helpMessage.edit({
                embeds: [categoryEmbed],
                components: [actionRow, new MessageActionRow().addComponents(selectMenu)]
            });
        });

        collector.on('end', collected => {
            if (collected.size === 0) {
                helpMessage.edit({ components: [] });
            }
        });
    }
};