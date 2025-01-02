const { MessageEmbed } = require('discord.js');

const joinChannelId = '1306096143402532926'; // Channel where the bot sends messages on join
const leaveChannelId = '1306096330589995039'; // Channel where the bot sends messages on leave

module.exports = async (client) => {
    client.on('guildCreate', async (guild) => {
        try {
            // Fetch server owner information
            const owner = await guild.fetchOwner();
            
            // Create a personalized welcome message
            const embed = new MessageEmbed()
                .setTitle(`Hello ${owner.user.username}!`)
                .setDescription(`
                    **Thank you for choosing Fire!**
                    Fire has been successfully added to ${guild.name}

                    You can report any issues at my Support Server following the needed steps. You can also reach out to my Developers if you want to know more about me.
                    
                    <:jingle:1292483753632858122> Fire is love
                `)
                .setColor('BLACK')
                .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }));

            // Send the message to the server owner
            await owner.send({ embeds: [embed] });

            console.log(`Sent a welcome DM to ${owner.user.tag} for adding the bot to ${guild.name}`);
        } catch (error) {
            console.error('Error sending welcome message:', error);
        }

        // Send a message in the "join" channel
        const joinChannel = await client.channels.fetch(joinChannelId);
        const joinEmbed = new MessageEmbed()
            .setTitle(`Bot Added to New Server: ${guild.name}`)
            .setDescription(`
                **Server Info:**
                - **ID**: ${guild.id}
                - **Members**: ${guild.memberCount}
                - **Created At**: <t:${Math.round(guild.createdTimestamp / 1000)}:R>

                **Owner**: ${owner.user.tag} (${owner.id})
            `)
            .setColor('GREEN')
            .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }));

        await joinChannel.send({ embeds: [joinEmbed] });

    });

    client.on('guildDelete', async (guild) => {
        try {
            // Fetch server owner information when the bot leaves
            const owner = await guild.fetchOwner();

            // Create a personalized goodbye message
            const leaveEmbed = new MessageEmbed()
                .setTitle(`Fire Removed From Your ${guild.name}!`)
                .setDescription(`
                    It seems my time in your server, **${guild.name}**, has come to an end.

                    If this was a mistake, you can easily reinvite me by clicking the Invite button below. I would also appreciate any feedback you could provide to my developer. Your input will help me improve and serve you better in the future.

                    <:jingle:1292483753632858122> Fire Is Love
                `)
                .setColor('BLACK')
                .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }));

            // Send the goodbye message to the server owner
            await owner.send({ embeds: [leaveEmbed] });

            console.log(`Sent a goodbye DM to ${owner.user.tag} for removing the bot from ${guild.name}`);
        } catch (error) {
            console.error('Error sending goodbye message:', error);
        }

        // Send a message in the "leave" channel
        const leaveChannel = await client.channels.fetch(leaveChannelId);
        const leaveEmbed = new MessageEmbed()
            .setTitle(`Bot Left Server: ${guild.name}`)
            .setDescription(`
                **Server Info:**
                - **ID**: ${guild.id}
                - **Members**: ${guild.memberCount}
                - **Created At**: <t:${Math.round(guild.createdTimestamp / 1000)}:R>
            `)
            .setColor('RED')
            .setThumbnail(guild.iconURL({ dynamic: true, size: 1024 }));

        await leaveChannel.send({ embeds: [leaveEmbed] });
    });
};
