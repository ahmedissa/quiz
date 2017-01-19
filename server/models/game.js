const ObjectID = require('mongodb').ObjectID;


class Game {

  constructor(db, {_id, playerA, playerB, questions, time}, doc){
    this._id = _id;
    this.playerA = playerA;
    this.playerB = playerB;
    this.questions = questions;
    this.time = time;
    this.db = db;
    this.row = doc;
  }



  setAnswers(playerUid, answers){
    const playerId = playerUid === this.playerA.uid ? 'playerA' : 'playerB';
    
    db
    .collections('games')
    .updateOne({_id: new ObjectID(this._id)}, 
               {$set: 
                {[`${playerId}.answers`]: '',
                [`${playerId}.count`]: answers.length,
                [`${playerId}.status`]: 'finished',
                [`${playerId}.time`]: new Date()}});

    return 
  }

  static getGame(db, id){
    return db.collections('games').findOne({_id: new ObjectID(id)}).then((doc) => {
      return new Game(db, doc, doc);
    });
  }

}

modules.export = Game;