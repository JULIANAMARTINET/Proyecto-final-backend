import normalizr from 'normalizr'
import { schema, normalize} from "normalizr"

// Schemas
const authorSchema = new schema.Entity('authors', {}, {idAttribute: 'email'})
const messageSchema = new schema.Entity('messages', {
    author: authorSchema
}, {idAttribute: 'date'})
const messageArraySchema = new schema.Entity('messageArrays', {
    messages: [messageSchema]
})

const normalizeMessages = (messagesToNormalize) => {
    const normalizedData = normalize({id: 1, messages: messagesToNormalize}, messageArraySchema)
    const a = JSON.stringify(messagesToNormalize).length;
    const b = JSON.stringify(normalizedData).length;

    return { normalizedData, compression: b/a }
}

const denormalizeMessages = (messagesToDenormalize) => {
    try {
        const denormalizedData = normalizr.denormalize(messagesToDenormalize.result, messageArraySchema, messagesToDenormalize.entities)
        return denormalizedData
    } catch (err) {
        return new Error(err)
    }
}

export { normalizeMessages, denormalizeMessages }

