const { MessageEmbed } = require('discord.js');

module.exports = {
    name: 'giveaway',
    description: 'Displays a guide for using giveaway commands.',
    category: 'giveaway',
    aliases: ['ghelp', 'sadqa'],
    usage: 'ghelp',

    run(client, message, args) {
        // Create an embed to display the help guide
        const embed = new MessageEmbed()
            .setTitle('🎉 Giveaway Help Guide 🎉')
            .setDescription('Here is a guide to help you manage giveaways on the server.')
            .setColor('BLUE')
            .addFields(
                { 
                    name: '**gstart <time> <winner_count> <prize>**', 
                    value: 'Starts a new giveaway.\n\n**FlaMe Giveaway:**\n- `time`: How long the giveaway will last (e.g., `10m`, `1h`, `1d`)\n- `winner_count`: How many winners should be selected.\n- `prize`: The prize for the giveaway (e.g., "Nitro", "Role", etc.)'
                },
                { 
                    name: '**gpause <message_id>**', 
                    value: 'Pauses an ongoing giveaway.\n\n**FlaMe Giveaway:**\n- `message_id`: The ID of the giveaway message to pause.\n\n**Note:** The giveaway will be paused and will need to be resumed manually.'
                },
                { 
                    name: '**gresume <message_id>**', 
                    value: 'Resumes a paused giveaway.\n\n**FlaMe Giveaway:**\n- `message_id`: The ID of the giveaway message to resume.\n\n**Note:** The giveaway will continue from where it left off.'
                },
                { 
                    name: '**gstop <message_id>**', 
                    value: 'Stops an ongoing giveaway.\n\n**FlaMe Giveaway:**\n- `message_id`: The ID of the giveaway message to stop.\n\n**Note:** This will immediately end the giveaway and select winners if any participants exist.'
                }
            )
            .setFooter('Use these commands to easily manage giveaways in your server.')
            .setTimestamp();

        // Send the help guide to the user
        message.reply({
            embeds: [embed]
        });
    },
};
