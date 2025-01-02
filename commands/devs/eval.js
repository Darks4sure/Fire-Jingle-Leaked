const {
    Message,
    Client,
    MessageEmbed,
    MessageActionRow,
    MessageButton
} = require('discord.js');
this.config = require(`${process.cwd()}/config.json`);

module.exports = {
    name: 'eval',
    aliases: ['ev', 'jaduexe'],
    category: 'owner',
    run: async (client, message, args) => {
        // Check if the author is in the owner list
        if (!this.config.owner.includes(message.author.id)) return;

        // Get the content to evaluate (after the command)
        const content = message.content.split(' ').slice(1).join(' ');

        try {
            const result = new Promise((resolve) => resolve(eval(content)));

            // Handle successful eval execution
            return result
                .then(async (output) => {
                    // If output is not a string, inspect it
                    if (typeof output !== 'string') {
                        output = require('util').inspect(output, { depth: 0 });
                    }

                    // Replace sensitive info like token or DB connection strings
                    output = output
                        .replaceAll(client.token, 'T0K3N')
                        .replaceAll(client.config.MONGO_DB, 'T0K3N');

                    // Create an embed with the output
                    const user = new MessageEmbed()
                        .setColor(client.color)
                        .setDescription(`\`\`\`js\n${output}\`\`\``);

                    // Send the result to the message channel
                    message.channel.send({ embeds: [user] });

                    // Log the eval execution to a log channel
                    const logEmbed = new MessageEmbed()
                        .setColor('BLUE')
                        .setTitle('Eval Command Executed')
                        .setDescription(`**Owner**: ${message.author.tag} (${message.author.id})\n**Command**: \`${content}\`\n**Result**: \`\`\`js\n${output}\`\`\``)
                        .setTimestamp();

                    const logChannelID = '1314820712766378076'; // Replace with your log channel ID
                    const logChannel = await client.channels.fetch(logChannelID);
                    logChannel.send({ embeds: [logEmbed] });
                })
                .catch(async (err) => {
                    // Handle errors in eval
                    err = err.toString();
                    err = err.replaceAll(client.token, 'T0K3N');
                    err = err.replaceAll(client.config.MONGO_DB, 'T0K3N');

                    // Send the error message in the channel
                    message.channel.send(err, { code: 'js' });

                    // Log the error to the log channel
                    const logEmbed = new MessageEmbed()
                        .setColor('RED')
                        .setTitle('Eval Command Error')
                        .setDescription(`**Owner**: ${message.author.tag} (${message.author.id})\n**Command**: \`${content}\`\n**Error**: \`\`\`js\n${err}\`\`\``)
                        .setTimestamp();

                    const logChannelID = '1314820712766378076'; // Replace with your log channel ID
                    const logChannel = await client.channels.fetch(logChannelID);
                    logChannel.send({ embeds: [logEmbed] });
                });
        } catch (err) {
            // Handle any unexpected errors
            err = err.toString();
            err = err.replaceAll(client.token, 'T0K3N');
            err = err.replaceAll(client.config.MONGO_DB, 'T0K3N');
            message.channel.send(err, { code: 'js' });

            // Log the error to the log channel
            const logEmbed = new MessageEmbed()
                .setColor('RED')
                .setTitle('Eval Command Error')
                .setDescription(`**Owner**: ${message.author.tag} (${message.author.id})\n**Command**: \`${content}\`\n**Error**: \`\`\`js\n${err}\`\`\``)
                .setTimestamp();

            const logChannelID = 'YOUR_LOG_CHANNEL_ID'; // Replace with your log channel ID
            const logChannel = await client.channels.fetch(logChannelID);
            logChannel.send({ embeds: [logEmbed] });
        }
    }
};