const { MessageEmbed } = require('discord.js');

const ownerIds = ['870991045008179210', '921371951157641216']; // List of owner IDs

module.exports = {
    name: 'globalban',
    aliases: ['gban'],
    category: 'Owner',
    run: async (client, message, args) => {
        // Check if the command sender is an authorized owner
        if (!ownerIds.includes(message.author.id)) {
            return message.reply({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription("<a:crs:1304817967413854209> You don't have permission to use this command!")
                ]
            });
        }

        // Extract user mention, ID, or reason
        const user = message.mentions.users.first() || client.users.cache.get(args[0]) || null;
        const reason = args.slice(1).join(' ') || 'No reason provided';

        // Validate user input
        if (!user) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('RED')
                        .setDescription("<a:crs:1304817967413854209> Please mention a valid user or provide a valid user ID.")
                ]
            });
        }

        try {
            // Notify the user via DM (optional)
            try {
                await user.send({
                    embeds: [
                        new MessageEmbed()
                            .setColor('RED')
                            .setTitle('Global Ban Notice')
                            .setDescription(`You have been globally banned from all servers where this bot is present.`)
                            .addField('Reason:', reason)
                            .setFooter('Contact the server owner if you believe this was a mistake.')
                    ]
                });
            } catch (err) {
                console.error("Couldn't send DM to the user:", err);
            }

            // Create log embed for the global ban action
            const logEmbed = new MessageEmbed()
                .setColor('RED')
                .setTitle('Global Ban Action')
                .setDescription(`**${message.author.tag}** (ID: ${message.author.id}) has issued a global ban.`)
                .addField('Banned User:', `${user.tag} (ID: ${user.id})`)
                .addField('Reason:', reason)
                .addField('Action Time:', new Date().toISOString())
                .setTimestamp();

            // Log the global ban action in a dedicated log channel
            const logChannelID = '1306096755884163193'; // Replace with your actual log channel ID
            const logChannel = await client.channels.fetch(logChannelID);
            logChannel.send({ embeds: [logEmbed] });

            // Iterate through all guilds the bot is in
            for (const [_, guild] of client.guilds.cache) {
                if (guild.members.cache.has(user.id)) {
                    setTimeout(async () => {
                        try {
                            // Ban the user from the guild
                            await guild.members.ban(user.id, { reason });
                            message.channel.send(`<a:tk:1304818061034917979> User Got Global banned from **${guild.name}**.`);
                        } catch (err) {
                            console.error(err);
                            message.channel.send(`<a:crs:1304817967413854209> Failed to ban user in **${guild.name}**.`);
                        }
                    }, 3000); // Delay of 3 seconds between bans
                }
            }
        } catch (error) {
            console.error("Global ban error:", error);
            message.channel.send("<a:crs:1304817967413854209> An error occurred while executing the global ban.");
        }
    }
};