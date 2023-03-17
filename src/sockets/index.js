import { MessageController } from "../controllers/index.js";
import { Loggers } from "../loggers/loggers.js";

const startSockets = (io) => {
  Loggers.logDebug("Trying to connect to socket");
  io.on("connection", async (client) => {
    const messages = await MessageController.getMessages();
    Loggers.logDebug("--- Messages ---");
    Loggers.logDebug(messages);
    client.emit("messages", messages);

    // Operation when a message is added
    client.on("new-message", async (msg) => {
      const response = await MessageController.addMessage(msg);
      if (response) {
        io.sockets.emit("messages", await MessageController.getMessages());
      }
    });
  });
};

export { startSockets };
