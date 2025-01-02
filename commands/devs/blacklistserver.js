const {
    MessageEmbed,
    Client,
    MessageActionRow,
    MessageButton
} = require('discord.js');
this.config = require(`${process.cwd()}/config.json`);

module.exports = {
    name: 'blacklistserver',
    aliases: ['bs'],
    category: 'owner',
    run: async (client, message, args) => {
        // Check if the message author is an admin
        if (!this.config.admin.includes(message.author.id)) return;

        const embed = new MessageEmbed().setColor(client.color);
        let prefix = message.guild.prefix;

        // If no action is provided
        if (!args[0]) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `Please provide the required arguments.\n${prefix}blacklistserver \`<add/remove/list/reset>\` \`<server id>\``
                        )
                ]
            });
        }

        // List all blacklisted servers
        if (args[0].toLowerCase() === 'list') {
            let listing = (await client.data.get(`blacklistserver_${client.user.id}`))
                ? await client.data.get(`blacklistserver_${client.user.id}`)
                : [];
            let info = [];
            let ss;
            if (listing.length < 1) info.push('No servers blacklisted ;-;');
            else {
                for (let i = 0; i < listing.length; i++) {
                    ss = await client.guilds.fetch(listing[i]).catch(() => null); // Fetch guild
                    if (ss) {
                        info.push(`${i + 1}) ${ss.name} (${ss.id})`);
                    } else {
                        // If guild is not available, remove it from the blacklist
                        await client.data.set(
                            `blacklistserver_${client.user.id}`,
                            listing.filter(id => id !== listing[i])
                        );
                    }
                }
            }

            return await client.util.pagination(
                message,
                info,
                '**Blacklist Server List** :-'
            );
        }

        // Handle server ID validation
        let check = 0;
        if (!args[1]) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `Please provide the required arguments.\n${prefix}blacklistserver \`<add/remove/list/reset>\` \`<server id>\``
                        )
                ]
            });
        }

        let server = await client.guilds.fetch(`${args[1]}`).catch((er) => {
            check += 1;
        });
        if (check == 1 || !server) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `Please provide a valid server ID.\n${prefix}blacklistserver \`<add/remove/list>\` \`<server id>\``
                        )
                ]
            });
        }

        // Fetch current blacklist and initialize options
        let added = (await client.data.get(`blacklistserver_${client.user.id}`))
            ? await client.data.get(`blacklistserver_${client.user.id}`)
            : [];

        let opt = args[0].toLowerCase();

        // Add server to blacklist
        if (opt === 'add' || opt === 'a' || opt === '+') {
            added.push(`${server.id}`);
            added = client.util.removeDuplicates2(added);
            await client.data.set(`blacklistserver_${client.user.id}`, added);
            client.util.blacklistserver();

            // Log the action
            const logEmbed = new MessageEmbed()
                .setColor('RED')
                .setTitle('Blacklist Server Action')
                .setDescription(
                    `**${message.author.tag}** has added **${server.name}** (${server.id}) to the blacklist.`
                )
                .setTimestamp();

            // Log the action to a specific log channel
            const logChannelID = '1306096580629233738'; // Replace with your actual log channel ID
            const logChannel = await client.channels.fetch(logChannelID);
            logChannel.send({ embeds: [logEmbed] });

            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<a:tk:1304818061034917979> | **${server.name} (${server.id})** has been added to the **Blacklist Server**.`
                        )
                ]
            });
        }

        // Remove server from blacklist
        if (opt === 'remove' || opt === 'r' || opt === '-') {
            added = added.filter((srv) => srv !== `${server.id}`);
            added = client.util.removeDuplicates2(added);
            await client.data.set(`blacklistserver_${client.user.id}`, added);
            client.util.blacklistserver();

            // Log the action
            const logEmbed = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('Blacklist Server Action')
                .setDescription(
                    `**${message.author.tag}** has removed **${server.name}** (${server.id}) from the blacklist.`
                )
                .setTimestamp();

            // Log the action to a specific log channel
            const logChannelID = '1306096646668423198'; // Replace with your actual log channel ID
            const logChannel = await client.channels.fetch(logChannelID);
            logChannel.send({ embeds: [logEmbed] });

            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `<a:tk:1304818061034917979> | **${server.name} (${server.id})** has been removed from the **Blacklist Server**.`
                        )
                ]
            });
        }

        // Reset the blacklist (remove from all servers)
        if (opt === 'reset' || opt === 'clear') {
            // Get all servers in the blacklist
            let blacklistedServers = await client.data.get(`blacklistserver_${client.user.id}`) || [];
            
            // If there are blacklisted servers
            if (blacklistedServers.length > 0) {
                // Reset the blacklist (clear all blacklisted servers)
                await client.data.set(`blacklistserver_${client.user.id}`, []); // Reset blacklist

                // Log the action
                const logEmbed = new MessageEmbed()
                    .setColor('YELLOW')
                    .setTitle('Blacklist Server Action')
                    .setDescription(`**${message.author.tag}** has reset the blacklist (removed all blacklisted servers).`)
                    .setTimestamp();

                // Log the action to a specific log channel
                const logChannelID = '1306096646668423198'; // Replace with your actual log channel ID
                const logChannel = await client.channels.fetch(logChannelID);
                logChannel.send({ embeds: [logEmbed] });

                return message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color)
                            .setDescription(
                                `<a:tk:1304818061034917979> | **The blacklist has been reset (all blacklisted servers have been removed).**`
                            )
                    ]
                });
            } else {
                return message.channel.send({
                    embeds: [
                        embed
                            .setColor(client.color)
                            .setDescription(`<a:tk:1304818061034917979> | **No servers to reset.** The blacklist is already empty.`)
                    ]
                });
            }
        }

        // If the command is invalid, show usage instructions
        message.channel.send({
            embeds: [
                embed
                    .setColor(client.color)
                    .setDescription(`${prefix}blacklistserver \`<add/remove/list/reset>\` \`<server id>\``)
            ]
        });
    }
};