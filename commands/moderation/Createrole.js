const { MessageEmbed } = require('discord.js');

module.exports = {

    name: 'createrole',

    category: 'utility',

    run: async (client, message) => {

        // Ensure user has permissions

        if (!message.member.permissions.has('MANAGE_ROLES') && message.guild.ownerId !== message.member.id) {

            return message.channel.send({

                embeds: [

                    new MessageEmbed()

                        .setColor('BLACK')

                        .setDescription('🚫 | You need **Manage Roles** permission or be the Guild Owner to use this command.'),

                ],

            });

        }

        // Step 1: Ask for Role Name

        const nameEmbed = new MessageEmbed()

            .setColor('BLACK')

            .setDescription('✏️ | Please enter the name of the role.');

        const namePrompt = await message.channel.send({ embeds: [nameEmbed] });

        const nameCollector = message.channel.createMessageCollector({

            filter: (m) => m.author.id === message.author.id,

            max: 1,

            time: 30000,

        });

        nameCollector.on('collect', async (nameMessage) => {

            const roleName = nameMessage.content;

            // Step 2: Ask for Role Color

            const colorEmbed = new MessageEmbed()

                .setColor('BLACK')

                .setDescription('🎨 | Please enter the hex color code for the role (e.g., `#FF5733`).');

            await message.channel.send({ embeds: [colorEmbed] });

            const colorCollector = message.channel.createMessageCollector({

                filter: (m) => m.author.id === message.author.id,

                max: 1,

                time: 30000,

            });

            colorCollector.on('collect', async (colorMessage) => {

                const roleColor = colorMessage.content;

                // Validate color code

                const isValidColor = /^#([0-9A-F]{3}){1,2}$/i.test(roleColor);

                if (!isValidColor) {

                    return message.channel.send({

                        embeds: [

                            new MessageEmbed()

                                .setColor('RED')

                                .setDescription('🚫 | Invalid color code. Please ensure it is in the format `#RRGGBB`.'),

                        ],

                    });

                }

                // Step 3: Create Role

                try {

                    await message.guild.roles.create({

                        name: roleName,

                        color: roleColor,

                    });

                    message.channel.send({

                        embeds: [

                            new MessageEmbed()

                                .setColor('GREEN')

                                .setDescription(`✅ | Successfully created the role **${roleName}** with color **${roleColor}**.`),

                        ],

                    });

                } catch (err) {

                    console.error(err);

                    message.channel.send({

                        embeds: [

                            new MessageEmbed()

                                .setColor('RED')

                                .setDescription('🚫 | An error occurred while creating the role.'),

                        ],

                    });

                }

            });

            colorCollector.on('end', (_, reason) => {

                if (reason === 'time') {

                    message.channel.send({

                        embeds: [

                            new MessageEmbed()

                                .setColor('RED')

                                .setDescription('⏳ | You took too long to respond. Please try again.'),

                        ],

                    });

                }

            });

        });

        nameCollector.on('end', (_, reason) => {

            if (reason === 'time') {

                namePrompt.edit({

                    embeds: [

                        new MessageEmbed()

                            .setColor('RED')

                            .setDescription('⏳ | You took too long to respond. Please try again.'),

                    ],

                });

            }

        });

    },

};