# FSCMC: A Fully-synchronous Computer-mediated Communication App

FSCMC is a program written with node.js, developed for my master's thesis. The key features of this program are:

  - Realtime message transmission (i.e. the interlocutors can read each other's message even when their opponent is still typing)
  - Support group size greater than two person
  - Have a detailed typelog system utilizing mongodb to record the precise time of each keystroke
  - Have a spectator mode for observers to spectate the conversations
  - Designed for conversation analysis

You can visit the demo [here](http://demo.fscmc.efl-call.xyz/) ([Spectator View](http://demo.fscmc.efl-call.xyz/spec.html)).

### Usage
Install `git`, `node.js`, `mongodb`

Clone this repository using git.
```sh
$ git clone https://github.com/Nats-ji/SCMC.git
```

Install the dependencies and start the server.

```sh
$ cd SCMC
$ npm install
$ node ./index.js
```

Alternatively, you can use `nodemon` to the development.
```sh
$ npm install -g nodemon
$ nodemon ./index.js
```

If you are on Windows and get this error `nodemon.ps1 cannot be loaded because running scripts is disabled on this system. For more information, see about_Execution_Policies at https:/go.microsoft.com/fwlink/?LinkID=135170.
` when using nodemon, open Powershell as Admin and type:
```sh
Set-ExecutionPolicy Unrestricted
```
Then type `Y` to comfirm.

Environment variables:
  Before you start developing, you need to set up a `.env` file to config the environment variables.
  There is a sample file named `.sample-env` in the root directory. All you have to do is to rename it into `.env` and edit the values.
```toml
MONGODB = mongodb://localhost:27017/SCMC # Your mongodb connection string.
PORT = 80 # Port your app will be running on.
```

Visit `http://your.domain:port` to enter the chatroom, and `http://your.domain:port/spec.html` to enter the spectator view.

### How to transcribe the typelog for Conversation Analysis
Please refer to the transcription system I specifically designed for this program. This transcription system was adapted from oral Conversation Analysis ([Paul ten Have, p213](https://uk.sagepub.com/en-gb/eur/doing-conversation-analysis/book229124)). Table 1 shows the notations and the descriptions of the notations used.

Table1
*Conversation Transcript Notation*
| Notation | Description |
|----------|-------------|
| < | The action of pressing “Enter” key. |
| = | To indicate no gap between the two lines. |
| (0.1) | Pause time in tenths of a second. |
| [ ] | The start and the end of an overlap. |
| <ins>delete</ins> | To indicate the utterances that will be deleted later |
| ~~delete~~ | To indicate when the deletion happened |
| { cut$ utterance } | To indicate the sender cut utterances using the clipboard |
| { paste$ utterance } | To indicate the sender pasted utterances from the clipboard  |
| { move # cursor } | To indicate that the sender moved the cursor somewhere in the ongoing utterance |


### Todos

 - Add Control Panel
 - Add typelog view page
 - Add config file for easy configuration
 - Add the function of loading the tasks from file
 - Add the function to create more chatrooms
 - Add the ability to switch between fully-synchronous and quasi-synchronous mode

License
----

GPLv3
