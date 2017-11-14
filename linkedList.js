/* 
    Author: Alex Sin Hang Wu
*/

class CustomLinkedList {
    constructor(participantInformation) {
        this.value = participantInformation;
        this.next = null;
    }
    get email() {
        return this.value[1];
    }
    get name() {
        return this.value[0];
    }
    push(value) {
        let newNode = new LinkedList(value);
        this.next = newNode;
    }
}

module.exports = CustomLinkedList;
