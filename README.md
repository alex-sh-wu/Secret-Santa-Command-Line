# Secret Santa Command Line Email Sender

This code was coded with Node.js v6.11.4. It is guaranteed to run on a Windows machine after installing the proper npm packages.

To get started, run `npm install` on the root directory.
	
To run the project:

```
node main.js
```

Just follow the instructions on the screen!

## Known flaws:
- If you check the 'Sent' folder of the account used to send all the emails, you can find out which person is giving to who. This is great for a host of the party, but otherwise ruins the anonymity for one person.
- Currently, only a gmail account can be used to send all the emails. You can change this by editing __L36__ of *utility.js*.
- Don't enter the password for the email account if there are other people staring at your screen.
