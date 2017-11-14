/* 
    Author: Alex Sin Hang Wu
*/

const readline = require('readline');
const CustomLinkedList = require('./linkedList.js');
var utility = require('./utility.js');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const yes = utility.yes; //string to compare to for yes
const no = utility.no; //string to compare to for no

const minimumNumberOfParticipants = 3; //it doesn't make sense to use secret santa for less than 3 people

let userState;

function resetState() {
    //Despite the weird syntax, this is the recommended way to make a deep copy of an object
    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/assign#Deep_Clone
    
    userState = JSON.parse(JSON.stringify(utility.defaultState));
}

resetState();
utility.setSenderNameMessage(rl, userState.participants.length + 1, minimumNumberOfParticipants);
rl.prompt();
rl.on('line', function(line) {
    let numberOfParticipants = userState.participants.length;
    let currentParticipant = userState.participants[numberOfParticipants - 1];
    
    if (userState.finalized) { //the user was okay with all the information entered in
        if (userState.userGmailAddress !== "") {
            userState.userPassword = line;
            rl.close();
        } 
        else {
            if (utility.isValidEmail(line)) {
                userState.userGmailAddress = line;
                utility.userPasswordPrompt(rl);
            }
            else {
                utility.invalidEmailWarning();
            }
        }
    }
    else if (userState.confirmInput) { //the user just entered a blank
        if (line.toLowerCase() === yes || line.toLowerCase() === no) {
            if (line.toLowerCase() === yes) {
                userState.finalized = true;
                console.log('Please login with your email credentials (Gmail only) to send out emails to all the participants.');
                utility.userEmailPrompt(rl);
            }
            else { //the user was not happy with the displayed information
                resetState();
                utility.setSenderNameMessage(rl, userState.participants.length + 1, minimumNumberOfParticipants);
            }
        }
    }
    else if (currentParticipant && currentParticipant.length === 1) { //the user just entered a participant's email
        if (utility.isValidEmail(line)) {
            currentParticipant.push(line);
            utility.setSenderNameMessage(rl, numberOfParticipants + 1, minimumNumberOfParticipants);
            
        } else {
            utility.invalidEmailWarning();      
        }
    }
    else { //the user just entered a participant's name
        if (line !== "") {
            let newParticipant = [];
            newParticipant.push(line);
            userState.participants.push(newParticipant);
            utility.setSenderEmailMessage(rl, numberOfParticipants + 1, line);
        } else {
            //only allow the user to move to the next state after 3 participants are entered in
            if (numberOfParticipants >= minimumNumberOfParticipants) {
                utility.showParticipantInfo(userState.participants);
                userState.confirmInput = true;
                utility.setConfirmationMessage(rl);
            }
        }
    }
    if (userState.userPassword === "") { //this if statement is to prevent console output after password is entered
        rl.prompt();
    }

}).on('close',function(){
    let numberOfParticipants = userState.participants.length;
    
    function generateLinkedList(participantList) {
        let indexToRemove = Math.floor((Math.random() * participantList.length));
        let result = new CustomLinkedList(participantList.splice(indexToRemove, 1)[0]);
        let pointer = result; //this variable will point to the last node in the link list
        while(participantList.length > 0) {
            indexToRemove = Math.floor((Math.random() * participantList.length));
            let nextNode = new CustomLinkedList(participantList.splice(indexToRemove, 1)[0]);
            pointer.next = nextNode;
            pointer = pointer.next;
        }
        pointer.next = result; //make the linked list circular for convenience
        return result;
    }
    
    if (utility.isValidEmail(userState.userGmailAddress) && userState.userPassword !== "") { //in case the user press CTRL + C
        participantLinkedList = generateLinkedList(userState.participants);
        utility.sendEmail(userState.userGmailAddress, userState.userPassword, participantLinkedList, numberOfParticipants);
    }
});
