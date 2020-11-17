# FSCMC: A Fully-synchronous Computer-mediated Communication App Designed for Conversation Analysis
FSCMC is a program written with node.js, developed for my master's thesis. The key features of this program are:

  - Realtime message transmission (i.e. the interlocutors can read each other's message even when their opponent is still typing)
  - Support group size greater than two persons (maybe broken, need to fix how the code interacts with the database)
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
Then type <kbd>Y</kbd> to comfirm.

Environment variables:
  Before you start developing, you need to set up a `.env` file to config the environment variables.
  There is a sample file named `.sample-env` in the root directory. All you have to do is to rename it into `.env` and edit the values.
```sh
MONGODB = mongodb://localhost:27017/SCMC # Your mongodb connection string.
PORT = 80 # Port your app will be running on.
```

Visit `http://your.domain:port` to enter the chatroom, and `http://your.domain:port/spec.html` to enter the spectator view.

### How to transcribe the typelog for Conversation Analysis
Please refer to the transcription system I specifically designed for this program. This transcription system was adapted from oral Conversation Analysis ([Paul ten Have, p213](https://uk.sagepub.com/en-gb/eur/doing-conversation-analysis/book229124)). Table 1 shows the notations and the descriptions of the notations used.

**Table1**</br>
***Conversation Transcript Notation***
| Notation | Description |
|----------|-------------|
| < | The action of pressing “Enter” key. |
| = | To indicate no gap between the two lines. |
| (0.1) | Pause time in tenths of a second. |
| [ ] | The start and the end of an overlap. |
| <ins>delete</ins> | To indicate the utterances that will be deleted later |
| ~~delete~~ | To indicate when the deletion happened |
| {cut$ utterance} | To indicate the sender cut utterances using the clipboard |
| {paste$ utterance} | To indicate the sender pasted utterances from the clipboard  |
| {move# cursor} | To indicate that the sender moved the cursor somewhere in the ongoing utterance |

The action of a participant pressing the <kbd>Enter</kbd> key is indicated by the symbol “<” at the end of a line (Example 1a line 5, 7). The symbol “=” at the end of one line and at the beginning of the next line indicates that there is almost no gap between those two lines (Example 1a line 6, and 7). The length of a pause is indicated by time in tenths of a second inside parentheses (Example 1a line 6). The overlaps are indicated by brackets enclosing the utterances that are overlapped (Example 1a line 5, 6). The deletion consists of two notations, (1) an underline to indicate the utterances that will be deleted, and a deletion line over the deleted utterances to when the deletion happened. In line 6 of Example 1a, ZL typed “number 2 is a boy”, the underline below “a boy” indicates that she deleted “a boy” later. In line 9, there is a deletion line over “a boy”. This shows that ZL deleted “a boy” at this moment.

**Example 1a:**
<pre>
005 SQ: OK, number one <ins>si</ins> <del>si</del> is [a rising] sun. <
006 ZL:                         [number  ] (1.5) 2 (8.7) is <ins>a boy</ins> =
007 SQ: =r<ins>sin</ins> <del>sin</del> ising from the horizen <
008 (3.0)
009 ZL: <del>a boy</del> some[one who       ] is in bed <
010 SQ:           [mine is a girl] <
</pre>

The notation “{cut$ utterance}” and “{paste$ utterance}” shows when the sender cut a piece of utterance and pasted a piece of utterance using clipboard. In line 55 of Example 1b, ZL cut the utterance “and in the last picture, the girl is on the way to school, I guess”. In line 62 of Example 1b, ZL pasted the utterance she cut in line 55 and posted it. The notation “{move# cursor}” indicates that the sender moved the cursor somewhere in the ongoing utterance. In line 58, SQ typed “so i think my no. 7 is the pic before your no.6 since my no.7 is the girl”. In line 60, she deleted “is the girl” first, then moved the cursor between “since” and “my” and typed “the girl in” which made the utterance become “so i think my no.7 is the pic before your no.6 since the girl in my no.7”. She then moved the cursor behind “no.7” and continued typing.

**Example 1b:**
<pre>
055 ZL: {cut$ and in the last picture, the girl is on the way to school, I guess}
056     [you][ are right       ] <
057 SQ: [ok ] <
058 SQ:      [so i think my no.]7 [is the pic before your no.6 since my no.7 <ins>is the girl</ins>] =
059 ZL:                           [the picture 6 shows that 6:02                        ] <
060 SQ: =<del>is the girl</del> (6.3) {since # my} the girl in {no.7 #} pic is combing her hair and
061     brushing her teath. <
062 ZL: {paste$ and in the last picture, the girl is on the way to school, I guess} <
</pre>

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
