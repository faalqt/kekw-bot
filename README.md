# kekw-bot
 Replicates CarlBot's "starboard" but instead with KEKWs.

# To run it yourself

1) Create a folder named `data` and inside that folder create `messages.json`
2) Create another folder named `config` and inside that folder create `settings.json`
3) Inside `settings.json`, add a key and value for the following.
```
{
    "botToken": "",
    "serverID": "",
    "boardID": "",
    "emote": "kekw",
    "threshhold": 1
}
```
4) `npm install` to install the packages used
5) You can then run it by doing `node kekw.js` or `npm start`