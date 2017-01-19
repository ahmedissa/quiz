
const EventEmitter = require('events');
const ObjectID = require('mongodb').ObjectID;

class GameMaker {
    constructor() {
      this.waitingRoom = [];
    }

    static get QUESTIONS() {
        return [
             {question: '', answers: ['', ''], correct: 0},
             {question: '', answers: ['', ''], correct: 0},
             {question: '', answers: ['', ''], correct: 0},
             {question: '', answers: ['', ''], correct: 0},
             ];
    }    

    static makeQuestions() {
      return GameMaker.QUESTIONS;
    }

    static makeGame(playerA, playerB, callback) {
      const qs = GameMaker.makeQuestions();
      callback(null, {
        state: 'started',
        time: new Date(),
        questions: qs,
        playerA: {uid: playerA.uid, status: 'started', count: 0, answers: [], time: null},
        playerB: {uid: playerA.uid, status: 'started', count: 0, answers: [], time: null},
      })
      return;
    }
    

}

class MatchMaking {
    constructor(db) {
      this.db = db;
      this.gamesCollections = db.collection('games');
      this.waitingRoom = [];
    }

    lookingForGame(playerA, callback) {
      if (this.waitingRoom.length > 0) {
        let rq = this.waitingRoom.pop();
        clearTimeout(rq.to);
        let foundPlayer = !rq.playerB.disconnected;
        while(foundPlayer) {
          if(this.waitingRoom.length > 0) {
            rq = this.waitingRoom.pop();
            foundPlayer = !rq.playerB.disconnected;
          }
        }
        if (foundPlayer &&
            rq.playerB.uid !== playerA.uid &&
            rq.playerB.disconnected === false) {
          this.createNewGame(playerA, rq, callback);
          return;
        }
      }

      const to = setTimeout(()=> {
        //const playerB =  
        //createNewGame(playerA, playerB, callback);
        callback(new Error('no player'), null);
      }, 30000);
      this.waitingRoom.push({playerB: playerA, callback, to});
      
    }

    createNewGame(playerA, req, callback) {      
      GameMaker.makeGame(playerA, req.playerB, (err, game) => {
        console.log(game);
        this.gamesCollections.insertOne(game, (err, r)=> {
          if(err) {
            req.callback(err, null);
            callback(err, null);
            return;
          }
          req.callback(null, game);
          callback(null, game);
        });
      });
    }
}

module.exports = MatchMaking