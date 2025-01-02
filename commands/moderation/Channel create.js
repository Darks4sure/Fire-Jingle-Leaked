const { MessageEmbed, MessageActionRow, MessageButton } = require('discord.js');

module.exports = {

    name: 'createchannel',

    category: 'utility',

    run: async (client, message) => {

        // Ensure user has permissions

        if (!message.member.permissions.has('MANAGE_CHANNELS') && message.guild.ownerId !== message.member.id) {

            return message.channel.send({

                embeds: [

                    new MessageEmbed()

                        .setColor('BLACK')

                        .setDescription('🚫 | You need **Manage Channels** permission or be the Guild Owner to use this command.'),

                ],

            });

        }

        // Step 1: Send Embed with Buttons

        const embed = new MessageEmbed()

            .setColor('BLACK')

            .setTitle('Create Channel')

            .setDescription('What type of channel would you like to create?');

        const row = new MessageActionRow().addComponents(

            new MessageButton()

                .setCustomId('text_channel')

                .setLabel('Text Channel')

                .setStyle('PRIMARY'),

            new MessageButton()

                .setCustomId('voice_channel')

                .setLabel('Voice Channel')

                .setStyle('PRIMARY')

        );

        const messagePrompt = await message.channel.send({ embeds: [embed], components: [row] });

        // Step 2: Handle Button Interaction

        const filter = (interaction) => interaction.user.id === message.author.id;

        const collector = message.channel.createMessageComponentCollector({ filter, time: 60000 });

        collector.on('collect', async (interaction) => {

            if (interaction.customId === 'text_channel') {

                collector.stop(); // Stop collector

                // Step 3: Ask for Category

                const categoryEmbed = new MessageEmbed()

                    .setColor('BLACK')

                    .setDescription('📂 | Please provide the category name or ID to add the channel under.');

                await interaction.update({ embeds: [categoryEmbed], components: [] });

                const categoryCollector = message.channel.createMessageCollector({

                    filter: (m) => m.author.id === message.author.id,

                    max: 1,

                    time: 30000,

                });

                categoryCollector.on('collect', async (m) => {

                    const categoryInput = m.content;

                    const category = message.guild.channels.cache.find(

                        (c) => c.name === categoryInput || c.id === categoryInput

                    );

                    if (!category || category.type !== 'GUILD_CATEGORY') {

                        return message.channel.send({

                            embeds: [

                                new MessageEmbed()

                                    .setColor('RED')

                                    .setDescription('🚫 | Invalid category. Please try again.'),

                            ],

                        });

                    }

                    // Step 4: Ask for Channel Name

                    const nameEmbed = new MessageEmbed()

                        .setColor('BLACK')

                        .setDescription('✏️ | Please enter a name for the channel.');

                    await message.channel.send({ embeds: [nameEmbed] });

                    const nameCollector = message.channel.createMessageCollector({

                        filter: (m) => m.author.id === message.author.id,

                        max: 1,

                        time: 30000,

                    });

                    nameCollector.on('collect', async (nameMessage) => {

                        const channelName = nameMessage.content;

                        // Step 5: Create Channel

                        try {

                            await message.guild.channels.create(channelName, {

                                type: 'GUILD_TEXT',

                                parent: category.id,

                            });

                            message.channel.send({

                                embeds: [

                                    new MessageEmbed()

                                        .setColor('GREEN')

                                        .setDescription(`✅ | Successfully created the channel **${channelName}** in category **${category.name}**.`),

                                ],

                            });

                        } catch (err) {

                            console.error(err);

                            message.channel.send({

                                embeds: [

                                    new MessageEmbed()

                                        .setColor('RED')

                                        .setDescription('🚫 | An error occurred while creating the channel.'),

                                ],

                            });

                        }

                    });

                });

            }

            if (interaction.customId === 'voice_channel') {

                collector.stop();

                // You can add similar logic here for creating a voice channel

                await interaction.update({

                    embeds: [

                        new MessageEmbed()

                            .setColor('BLACK')

                            .setDescription('🎙️ | Voice channel creation is not implemented yet.'),

                    ],

                    components: [],

                });

            }

        });

        collector.on('end', (_, reason) => {

            if (reason === 'time') {

                messagePrompt.edit({

                    embeds: [embed.setDescription('⏳ | You took too long to respond. Try again.')],

                    components: [],

                });

            }

        });

    },

};