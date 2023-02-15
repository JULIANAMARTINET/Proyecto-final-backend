
const socket = io()

// FORMULARIO DE CHAT
const chatForm = document.getElementById('chat-form')

chatForm.addEventListener('submit', (e) => {
    e.preventDefault()
    const formData = new FormData(chatForm)
    const formValues = Object.fromEntries(formData)
    chatForm.reset()
    socket.emit('new message', formValues)
    console.log('chat desde el formValues', formValues);
})

socket.on('all messages', allMessages => {
    renderChatBoxHB(allMessages)
})


// LISTADO DE MENSAJES EN EL CHAT
const chatBox = document.getElementById('chat-messages')

const renderChatBoxHB = async (messages) => {
    const response = await fetch('./views/chat.hbs')
    const formTemplate = await response.text()
    // compile the template
    const template = Handlebars.compile(formTemplate);
    const html = template({ messages })
    chatBox.innerHTML = html
}