import {
  normalizeMessages,
  denormalizeMessages,
} from "../../utils/normalize.js";
import { Loggers } from "../../loggers/loggers.js";

const addMessage = async (message) => {
  // Check if it is the first message to be added
  const response = await this.container.getByKey(messagesModel, {
    messagesDataId: 1,
  });
  if (response !== null) {
    console.log("Response is not null");
    // Denormalize the data
    const relevantData = {
      entities: response.entities,
      result: response.result[0],
    };
    const { messages } = denormalizeMessages(relevantData);
    // Make the array equal to the data
    this.messages = messages;
    // Add the item to the array
    this.messages.push(message);
    // Normalize the array
    const { normalizedData } = normalizeMessages(this.messages);
    // Turn the array into an objecto MongoDb can understand
    const objectToStore = {
      messagesDataId: 1,
      ...normalizedData,
    };
    // Update the DB with the new object
    const updateResponse = await this.container.updateFieldById(
      messagesModel,
      response._id,
      objectToStore
    );
    // If there are no errors,
    // Send a true response
    return true;
  } else {
    console.log("Reponse is null");
    // First document to be added
    // Normalize the only message so far
    const { normalizedData } = normalizeMessages([message]);
    // Create a new object with the destructuring and add an id
    const objectToStore = {
      messagesDataId: 1,
      ...normalizedData,
    };
    // Store the object
    const saveResponse = await this.container.add(messagesModel, objectToStore);
    Loggers.logDebug("--- message save Response ---");
    Loggers.logDebug(saveResponse);
    // Return true
    return true;
  }
};

const getMessages = async () => {
  // Must return an object with keys: normalizedData, compression
  const response = await this.container.getByKey(messagesModel, {
    messagesDataId: 1,
  });
  // The container will return null if there is no data in the db
  if (response === null) {
    return;
  }
  // Reponse is a normalized piece of data, so we denormalize it to calculate the compression rate
  // Denormalize the data
  const relevantData = {
    entities: response.entities,
    result: response.result[0],
  };
  const { messages } = denormalizeMessages(relevantData);
  const a = JSON.stringify(response).length;
  const b = JSON.stringify(messages).length;
  // Return it
  return { normalizedData: response, compression: a / b };
};

export const MessageController = {
  addMessage,
  getMessages,
};
