const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'embed',
    aliases: ['createembed'],
    category: 'mod',
    premium: false,
    usage: '[title] [description] [color] [footer]',
    run: async (client, message, args) => {
        // Ensure that the user provides at least a title and description
        if (args.length < 2) {
            return message.channel.send({
                embeds: [
                    new MessageEmbed()
                        .setColor(client.color)
                        .setDescription('You must provide a **title** and **description** for the embed!')
                ]
            });
        }

        // Extract the title and description from the arguments
        const title = args[0];
        const description = args.slice(1).join(' ');

        // Default values for optional parameters
        let color = '#3498db'; // Default color is blue
        let footerText = null;

        // Check if the user provided a color or footer
        const colorMatch = description.match(/#[0-9A-F]{6}/i); // Regex to check if the description includes a color code
        if (colorMatch) {
            color = colorMatch[0];
            description.replace(colorMatch[0], '').trim(); // Remove the color code from the description
        }

        const footerMatch = description.match(/\[footer:(.*?)\]/);
        if (footerMatch) {
            footerText = footerMatch[1];
            description = description.replace(footerMatch[0], '').trim(); // Remove the footer part from the description
        }

        // Create the embed
        const embed = new MessageEmbed()
            .setTitle(title)
            .setDescription(description)
            .setColor(color)
            .setFooter(footerText || `Requested by ${message.author.tag}`, message.author.displayAvatarURL({ dynamic: true }))
            .setTimestamp();

        // Send the embed to the channel
        return message.channel.send({ embeds: [embed] });
    }
};
