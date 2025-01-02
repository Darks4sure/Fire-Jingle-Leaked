module.exports = async (client) => {
    client.on('ready', async () => {
        client.user.setPresence({
            activities: [
                {
                    name: `Faster Than All`,
                    type: `PLAYING`
                }
            ],
            status: `dnd`
        })
        client.logger.log(`Logged in to ${client.user.tag}`, 'ready')
    })

}
