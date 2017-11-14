/* 
    Author: Alex Sin Hang Wu
*/

const nodemailer = require('nodemailer');

const defaultState = {
    userGmailAddress: "",
    userPassword: "",
    confirmInput: false,
    finishedWithParticipants: false,
    userConfirmation: "",
    participants: [],
    finalized: false,
}

const yes = "yes"; //string to compare to for yes
const no = "no"; //string to compare to for no

function isValidEmail(email) {
    //algorithm borrowed from here:
    //https://stackoverflow.com/questions/46155/how-to-validate-email-address-in-javascript
    
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(email);
}

function showParticipantInfo(participants) {
    for (let i = 0; i < participants.length; i++) {
        console.log('Participant #' + (i+1) + ' - Name: ' + participants[i][0] + ', Email: ' + participants[i][1]);
    }
}

function sendEmail(userEmail, emailPassword, participantsLinkedList, numberOfParticipants) {
    let transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: userEmail,
        pass: emailPassword
      }
    });
    
    for (let i = 0; i < numberOfParticipants; i++) {
        let mailOptions = {
          from: userEmail,
          subject: 'Secret Santa Information',
          text: 'Hello ' + participantsLinkedList.name + '!\n\nYou are giving a gift to ' + participantsLinkedList.next.name + '.',
        };
        mailOptions.to = participantsLinkedList.email;
        
        console.log("Sending email to " + participantsLinkedList.email + "...");

        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log(error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
        participantsLinkedList = participantsLinkedList.next;
    }
    
    //TODO: exit when all emails are sent
    //process.exit(0);
}

function setSenderNameMessage(rl, participantIndex, minimumNumberOfParticipants) {
    if (participantIndex > minimumNumberOfParticipants) {
        rl.setPrompt('Please enter participant #' + participantIndex + '\'s name (Leave input blank to finish): ');
    } else {
        rl.setPrompt('Please enter participant #' + participantIndex + '\'s name: ');
    }
}

function setSenderEmailMessage(rl, participantIndex, participantName) {
    rl.setPrompt('Please enter participant #' + participantIndex + ' - ' + participantName + '\'s email: ');
}

function setConfirmationMessage(rl) {
    rl.setPrompt('Is this information correct? (\'' + yes + '\' or \'' + no + '\') ');
}

function userEmailPrompt(rl) {
    rl.setPrompt('Email: ');
}

function userPasswordPrompt(rl) {
    rl.setPrompt('Password: ');
}

function invalidEmailWarning() {
    console.log('Please enter a valid email address.');
}

module.exports = {
    defaultState: defaultState,
    isValidEmail: isValidEmail,
    showParticipantInfo: showParticipantInfo,
    sendEmail: sendEmail,
    setSenderNameMessage: setSenderNameMessage,
    setSenderEmailMessage: setSenderEmailMessage,
    setConfirmationMessage: setConfirmationMessage,
    userEmailPrompt: userEmailPrompt,
    userPasswordPrompt: userPasswordPrompt,
    invalidEmailWarning: invalidEmailWarning,
    yes: yes,
    no: no,
}
