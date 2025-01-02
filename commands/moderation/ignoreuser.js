const { Message, Client, MessageEmbed } = require('discord.js');

module.exports = {
    name: 'ignoreuser',
    aliases: ['ignoreuser'],
    category: 'mod',
    premium: false,

    /**
     * 
     * @param {Client} client 
     * @param {Message} message 
     * @param {String[]} args 
     */

    run: async (client, message, args) => {
        if (!message.member.permissions.has('ADMINISTRATOR')) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('FF0000') // Red for error
                        .setDescription('You must have `Administrator` permissions to ignore users.')
                ]
            });
        }

        // Ensure the user is specified
        const userToIgnore = message.mentions.users.first();
        if (!userToIgnore) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('FF0000')
                        .setDescription('Please mention the user you want to ignore.')
                ]
            });
        }

        // Ignore the user (store in the database or a file)
        try {
            // Set the user as ignored in the database (replace with actual DB operation)
            await client.db.set(`ignored_${message.guild.id}_${userToIgnore.id}`, true);

            // Inform the user about the ignore action
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('00FF00') // Green for success
                        .setDescription(`${userToIgnore.tag} has been successfully ignored and cannot use the bot now.`)
                ]
            });

        } catch (error) {
            console.error('Error ignoring user:', error);
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor('FF0000')
                        .setDescription('An error occurred while ignoring the user.')
                ]
            });
        }
    }
};
