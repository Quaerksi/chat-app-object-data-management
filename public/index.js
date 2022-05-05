socket = io();
        
//message form in chat
var form = document.getElementById('form');
var input = document.getElementById('input');
// formLogin
var welcomePageFormELement = document.getElementById('formLogin');

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

// console.log(`Send container: ${form}`)

// ${req.body.newUser}{
//      socket.emit('start user management', user)
//     console.log(`A User: ${user}`);
// }

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
    console.log(`Hello World, room ${room}, user ${user}`)
    let newElement = document.createElement('div');
    newElement.innerText = room;
    let newLink = document.createElement('a');
    // href noch richtig machen !!!!!!???????????
    // http://localhost:3000/room/<%= room %>/user/<%= user %>
    newLink.href = `http://localhost:3000/room/${room}/user/${user}`;
    newLink.innerText = 'Join';
    roomContainer.append(newElement);
    roomContainer.append(newLink);
});

// ********************************* message handling  *********************************//
// receive message and print it to screen
socket.on('chat message', function(msg) {
    appendMessage(msg);
    window.scrollTo(0, document.body.scrollHeight);
});




