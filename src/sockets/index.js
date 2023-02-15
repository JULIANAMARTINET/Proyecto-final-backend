import { MessageController } from '../controllers/index.js'
// import { products } from '../data/archiveData/index.js'
import { Loggers } from '../loggers/loggers.js'

const startSockets = (io) => {
    Loggers.logDebug('Trying to connect to socket')
    io.on('connection', async (client) => {
        console.log('Client connected');
        const messages = await MessageController.getMessages()
        Loggers.logDebug('--- Messages ---')
        Loggers.logDebug(messages)
        client.emit('messages', messages)
    
        // Operation when a message is added
        client.on('new-message', async (msg) => {
            console.log('Receiving');
            const response = await MessageController.addMessage(msg)
            if (response) {
                console.log('Server - Saved');  
                io.sockets.emit('messages', await MessageController.getMessages())
            }
        })
    
        // Operation when a product is added
        client.on('add-product', (product) => {
            products.push(product)
            io.sockets.emit('products', product)
        })
    })
}

export { startSockets }
