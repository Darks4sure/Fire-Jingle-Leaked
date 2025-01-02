const { MessageEmbed } = require('discord.js');
this.config = require(`${process.cwd()}/config.json`);

module.exports = {
    name: 'noprefix',
    aliases: ['np'],
    category: 'owner',
    run: async (client, message, args) => {
        // Check if the message author is the bot owner
        if (!this.config.np.includes(message.author.id)) return;

        const embed = new MessageEmbed().setColor(client.color);
        let prefix = message.guild.prefix;

        // Log Channel ID (change this to your actual log channel ID)
        const logChannelID = '1306096377381781657'; // Replace with your log channel ID
        const logChannel = await client.channels.fetch(logChannelID);

        // If no action is provided
        if (!args[0]) {
            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            `Please provide the required arguments.\n${prefix}noprefix \`<add/remove/list/reset>\` \`<user id>\``
                        )
                ]
            });
        }

        const action = args[0].toLowerCase();

        // List action
        if (action === `list`) {
            let listing = (await client.db.get(`noprefix_${client.user.id}`)) || [];
            let info = [];

            if (listing.length < 1) {
                info.push(`No Users ;-;`);
            } else {
                for (let i = 0; i < listing.length; i++) {
                    let user = await client.users.fetch(`${listing[i]}`);
                    info.push(`${i + 1}) ${user.tag} (${user.id})`);
                }
            }

            // Send pagination for the list
            await client.util.pagination(message, info, '**No Prefix Users List :-**');

            // Log this action in an embed
            const logEmbed = new MessageEmbed()
                .setColor(client.color)
                .setTitle('No Prefix List Accessed')
                .setDescription(`**${message.author.tag}** checked the No Prefix users list.`)
                .addField('Total Users in List', listing.length < 1 ? 'No Users' : listing.length, true)
                .addField('Action', 'Checked No Prefix List', true)
                .setTimestamp();

            logChannel.send({ embeds: [logEmbed] });
            return;
        }

        // Reset action
        if (action === `reset`) {
            await client.db.set(`noprefix_${client.user.id}`, []);
            client.util.noprefix();

            // Send a reset confirmation
            message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(`🔄 | The **No Prefix** user list has been reset.`)
                ]
            });

            // Log this action in an embed
            const logEmbed = new MessageEmbed()
                .setColor(client.color)
                .setTitle('No Prefix List Reset')
                .setDescription(`**${message.author.tag}** reset the No Prefix user list.`)
                .addField('Action', 'Reset No Prefix List', true)
                .setTimestamp();

            logChannel.send({ embeds: [logEmbed] });
            return;
        }

        // User ID is required for add/remove actions
        if (!args[1]) {
            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            `Please provide the required arguments.\n${prefix}noprefix \`<add/remove>\` \`<user id>\``
                        )
                ]
            });
        }

        let user;
        try {
            user = await client.users.fetch(`${args[1]}`);
        } catch (error) {
            return message.channel.send({
                embeds: [
                    embed
                        .setDescription(
                            `Invalid User ID. Please provide a valid user ID.\n${prefix}noprefix \`<add/remove>\` \`<user id>\``
                        )
                ]
            });
        }

        let added = (await client.db.get(`noprefix_${client.user.id}`)) || [];
        const opt = action;

        // Add user action
        if (opt === `add` || opt === `a` || opt === `+`) {
            if (added.includes(user.id)) {
                return message.channel.send({
                    embeds: [
                        embed.setDescription(
                            `${client.emoji.cross} | <@${user.id}> is already present in the **No Prefix** list.`
                        )
                    ]
                });
            }

            added.push(`${user.id}`);
            added = client.util.removeDuplicates(added);
            await client.db.set(`noprefix_${client.user.id}`, added);
            client.util.noprefix();

            // Send confirmation message
            message.channel.send({
                embeds: [
                    embed.setDescription(
                        `${client.emoji.tick} | **<@${user.id}> (${user.id})** has been added as a **No Prefix** user.`
                    )
                ]
            });

            // Log this action in an embed
            const logEmbed = new MessageEmbed()
                .setColor(client.color)
                .setTitle('User Added to No Prefix List')
                .setDescription(`**${message.author.tag}** added **${user.tag}** (${user.id}) to the No Prefix list.`)
                .addField('Action', 'Added User', true)
                .setTimestamp();

            logChannel.send({ embeds: [logEmbed] });
            return;
        }

        // Remove user action
        if (opt === `remove` || opt === `r` || opt === `-`) {
            added = added.filter((srv) => srv != `${user.id}`);
            added = client.util.removeDuplicates(added);
            await client.db.set(`noprefix_${client.user.id}`, added);
            client.util.noprefix();

            // Send confirmation message
            message.channel.send({
                embeds: [
                    embed.setDescription(
                        `<:IconTick:1245261305561223199> | **<@${user.id}> (${user.id})** has been removed from the **No Prefix** list.`
                    )
                ]
            });

            // Log this action in an embed
            const logEmbed = new MessageEmbed()
                .setColor(client.color)
                .setTitle('User Removed from No Prefix List')
                .setDescription(`**${message.author.tag}** removed **${user.tag}** (${user.id}) from the No Prefix list.`)
                .addField('Action', 'Removed User', true)
                .setTimestamp();

            logChannel.send({ embeds: [logEmbed] });
            return;
        }

        // If the action is unknown, provide help
        message.channel.send({
            embeds: [
                embed.setDescription(
                    `${prefix}noprefix \`<add/remove/list/reset>\` \`<user id>\``
                )
            ]
        });
    }
};