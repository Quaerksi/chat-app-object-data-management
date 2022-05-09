declare type member = {
    memberID: String;
    memberName: String;
};
declare type Room = {
    readonly name: String;
    members: member[];
};
declare let rooms: Room[];
declare let indexOne: number;
declare let indexTwo: number;
