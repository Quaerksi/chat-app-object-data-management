socket = io();
        
//message form in chat
var form = document.getElementById('form');
var input = document.getElementById('input');
// formLogin
var welcomePageFormELement = document.getElementById('formLogin');
//welcome page
var listUserNames = document.getElementById('listUserNames');
var infoMessage = document.getElementById('infoMessage');

//rooms seen on index page
const roomContainer = document.getElementById('roomContainer');

// ********************************* function area *********************************//
//append a message to the message area
const appendMessage = msg => {
    var item = document.createElement('li');
    item.textContent = `${msg}`;
    messages.appendChild(item);
}

// ********************************* user management *********************************//

//at the welcome page
if(listUserNames != null){
    socket.emit('send user names');
}

socket.on('user names', users => {

    while (listUserNames.lastElementChild) {
        listUserNames.removeChild(listUserNames.lastElementChild);
    }

    users.forEach(username => {
        let element = document.createElement('li');
        element.innerText = username;
        listUserNames.append(element);
    })
    
}); 

//in a chat room
if(form != null){
    console.log(`Room: ${room} User: ${user}`);

    //send the name of the new member
    socket.emit('new chat member', room, user);
    appendMessage('You joined')

    // ********************************* DOM  *********************************//
    //event listener for input button
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        if (input.value) {
            //send message to server
            socket.emit('chat message', room, user, input.value);
            appendMessage(`You: ${input.value}`);
            input.value = '';
        }
    });
}

//a member left the room
socket.on('member gone', function(member){
     appendMessage(`${member} has left`);
})

// ***************************************landing page************************************//

socket.on('new room created', (room) => {
    let newElement = document.createElement('div');
    newElement.innerText = room;
    let newLink = document.createElement('a');
    newLink.href = `http://localhost:3000/room/${room}/user/${user}`;
    newLink.innerText = 'Join';
    roomContainer.append(newElement);
    roomContainer.append(newLink);
});

// ********************************* message handling  *********************************//
// receive message and print it to screen in chatroom
socket.on('chat message', function(msg) {
    appendMessage(msg);
    window.scrollTo(0, document.body.scrollHeight);
});




