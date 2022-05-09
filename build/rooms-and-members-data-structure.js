let rooms = [];
//add a room with members
rooms.push({
    name: 'Garten',
    members: [{ memberID: 'firstId', memberName: 'firstName' }, { memberID: 'secondId', memberName: 'secondName' }]
});
//add another room with members
rooms.push({
    name: 'Haus',
    members: [{ memberID: 'thirdId', memberName: 'thirdName' }, { memberID: 'fourthId', memberName: 'fourthName' }]
});
// Delete a member
let indexOne = rooms.findIndex(room => room.name === 'Haus');
let indexTwo = rooms[indexOne].members.findIndex(member => member.memberID === 'thirdId');
rooms[indexOne].members.splice(indexTwo, 1);
//log the result
console.log(`My Object: ${JSON.stringify(rooms)}`);
//****************************************************************************************************************************/
