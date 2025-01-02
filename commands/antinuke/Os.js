const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {

    name: 'transferos',

    description: 'Transfer server ownership to another user.',

    category: 'security',

    run: async (client, message, args) => {

        // Check if the user is the server owner

        if (message.author.id !== message.guild.ownerId) {

            return message.channel.send({

                embeds: [

                    new MessageEmbed()

                        .setColor('RED')

                        .setDescription('🚫 | Only the server owner can use this command.')

                ]

            });

        }

        // Check if a user is mentioned

        const targetUser = message.mentions.members.first();

        if (!targetUser) {

            return message.channel.send({

                embeds: [

                    new MessageEmbed()

                        .setColor('RED')

                        .setDescription('🚫 | Please mention the user you want to transfer ownership to.')

                ]

            });

        }

        if (targetUser.id === message.author.id) {

            return message.channel.send({

                embeds: [

                    new MessageEmbed()

                        .setColor('RED')

                        .setDescription('🚫 | You cannot transfer ownership to yourself.')

                ]

            });

        }

        // Confirmation Embed with Buttons

        const confirmEmbed = new MessageEmbed()

            .setColor('YELLOW')

            .setTitle('⚠️ Confirm Ownership Transfer')

            .setDescription(

                `Are you sure you want to transfer server ownership to **${targetUser.user.tag}**? This action cannot be undone.`

            );

        const row = new MessageActionRow().addComponents(

            new MessageButton()

                .setCustomId('confirm_transfer')

                .setLabel('Yes')

                .setStyle('SUCCESS'),

            new MessageButton()

                .setCustomId('cancel_transfer')

                .setLabel('No')

                .setStyle('DANGER')

        );

        const confirmationMessage = await message.channel.send({

            embeds: [confirmEmbed],

            components: [row]

        });

        // Create Button Interaction Collector

        const filter = (interaction) =>

            ['confirm_transfer', 'cancel_transfer'].includes(interaction.customId) &&

            interaction.user.id === message.author.id;

        const collector = confirmationMessage.createMessageComponentCollector({

            filter,

            time: 30000

        });

        collector.on('collect', async (interaction) => {

            if (interaction.customId === 'confirm_transfer') {

                try {

                    // Transfer Ownership

                    await message.guild.setOwner(targetUser);

                    await interaction.update({

                        embeds: [

                            new MessageEmbed()

                                .setColor('GREEN')

                                .setDescription(

                                    `✅ | Ownership has been successfully transferred to **${targetUser.user.tag}**.`

                                )

                        ],

                        components: []

                    });

                } catch (error) {

                    console.error(error);

                    await interaction.update({

                        embeds: [

                            new MessageEmbed()

                                .setColor('RED')

                                .setDescription('🚫 | An error occurred while transferring ownership.')

                        ],

                        components: []

                    });

                }

            } else if (interaction.customId === 'cancel_transfer') {

                await interaction.update({

                    embeds: [

                        new MessageEmbed()

                            .setColor('RED')

                            .setDescription('❌ | Ownership transfer has been canceled.')

                    ],

                    components: []

                });

            }

        });

        collector.on('end', (_, reason) => {

            if (reason === 'time') {

                confirmationMessage.edit({

                    components: [],

                    embeds: [

                        new MessageEmbed()

                            .setColor('RED')

                            .setDescription('⏳ | You took too long to respond. Ownership transfer canceled.')

                    ]

                });

            }

        });

    }

};