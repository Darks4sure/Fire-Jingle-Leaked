const {
    MessageEmbed,
    Client
} = require('discord.js');
this.config = require(`${process.cwd()}/config.json`);

module.exports = {
    name: 'blacklist',
    aliases: ['bl'],
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
                            `Please provide the required arguments.\n${prefix}blacklist \`<add/remove/list/reset>\` \`<user id>\``
                        )
                ]
            });
        }

        // List all blacklisted users
        if (args[0].toLowerCase() === 'list') {
            let listing = await client.db.get(`blacklist_${client.user.id}`) || [];
            let info = [];
            let ss;
            if (listing.length < 1) info.push('No Users ;-;');
            else {
                for (let i = 0; i < listing.length; i++) {
                    ss = await client.users.fetch(listing[i]);
                    info.push(`${i + 1}) ${ss.tag} (${ss.id})`);
                }
            }

            return await client.util.pagination(
                message,
                info,
                '**Blacklist Users List** :-'
            );
        }

        // Handle user fetching and validation
        let check = 0;
        if (!args[1] && args[0].toLowerCase() !== 'reset') {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `Please provide the required arguments.\n${prefix}blacklist \`<add/remove/list/reset>\` \`<user id>\``
                        )
                ]
            });
        }

        let user;
        if (args[1] && args[0].toLowerCase() !== 'reset') {
            user = await client.users.fetch(args[1]).catch((er) => {
                check += 1;
            });
        }

        if (check === 1) {
            return message.channel.send({
                embeds: [
                    embed
                        .setColor(client.color)
                        .setDescription(
                            `Please provide the required arguments.\n${prefix}blacklist \`<add/remove/list/reset>\` \`<user id>\``
                        )
                ]
            });
        }

        // Fetch current blacklist and initialize options
        let added = await client.db.get(`blacklist_${client.user.id}`) || [];
        let opt = args[0].toLowerCase();

        // Add user to blacklist
        if (opt === 'add' || opt === 'a' || opt === '+') {
            added.push(user.id);
            added = client.util.removeDuplicates2(added);
            await client.db.set(`blacklist_${client.user.id}`, added);
            client.util.blacklist();

            // Log the action
            const logEmbed = new MessageEmbed()
                .setColor('RED')
                .setTitle('Blacklist Action')
                .setDescription(`**${message.author.tag}** has added **${user.tag}** (${user.id}) to the blacklist.`)
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
                            `<a:tk:1304818061034917979> | **<@${user.id}> (${user.id})** has been added to the **Blacklist**.`
                        )
                ]
            });
        }

        // Remove user from blacklist
        if (opt === 'remove' || opt === 'r' || opt === '-') {
            added = added.filter((id) => id !== user.id);
            added = client.util.removeDuplicates2(added);
            await client.db.set(`blacklist_${client.user.id}`, added);
            client.util.blacklist();

            // Log the action
            const logEmbed = new MessageEmbed()
                .setColor('GREEN')
                .setTitle('Blacklist Action')
                .setDescription(`**${message.author.tag}** has removed **${user.tag}** (${user.id}) from the blacklist.`)
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
                            `<a:tk:1304818061034917979> | **<@${user.id}> (${user.id})** has been removed from the **Blacklist**.`
                        )
                ]
            });
        }

        // Reset blacklist (clear all blacklisted users)
        if (opt === 'reset' || opt === 'clear') {
            await client.db.set(`blacklist_${client.user.id}`, []);  // Reset the blacklist in the database
            client.util.blacklist();

            // Log the action
            const logEmbed = new MessageEmbed()
                .setColor('YELLOW')
                .setTitle('Blacklist Action')
                .setDescription(`**${message.author.tag}** has reset the blacklist (removed all users).`)
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
                            `<a:tk:1304818061034917979> | **The blacklist has been reset.**`
                        )
                ]
            });
        }

        // If the command is invalid, show usage instructions
        message.channel.send({
            embeds: [
                embed
                    .setColor(client.color)
                    .setDescription(`${prefix}blacklist \`<add/remove/list/reset>\` \`<user id>\``)
            ]
        });
    }
};