const firebase = require('firebase');
const Wreck = require('wreck');

const config = {
  apiKey: "AIzaSyD8UqsW47jswCMAinuRb6SbeXyFK7iROTQ",
  authDomain: "quiz-72f50.firebaseapp.com",
  databaseURL: "https://quiz-72f50.firebaseio.com",
  storageBucket: "quiz-72f50.appspot.com"
};

firebase.initializeApp(config);


const sendNewGame = (token) => {
  Wreck.post('http://localhost:3000/game/new', { headers: {authorization: 'Basic ' + token} }, (err, res, payload) => {
      console.log(payload.toString() )
  });
};

if (process.argv[0] === '1') {
  firebase.auth().signInWithEmailAndPassword('ioioasdlas@gmail.com', '12345678')
  .then(function () {
    firebase.auth().currentUser.getToken(true).then(function(idToken) {
      console.log('tok', idToken)
      sendNewGame(idToken);
    }).catch(function(error) {
      // Handle error
    });

  })
  .catch(function(error) {
    if (error){
      console.log('error')
      return 'done';
    }
    firebase.auth().currentUser.getToken(true).then(function(idToken) {
      console.log('tok', idToken)
      sendNewGame(idToken);
    }).catch(function(error) {
      // Handle error
    });
  });

} else {
  firebase.auth().signInWithEmailAndPassword('ioioasdlas2@gmail.com', '12345678')
  .then(function () {
    firebase.auth().currentUser.getToken(true).then(function(idToken) {
      console.log('tok', idToken)
      sendNewGame(idToken);
    }).catch(function(error) {
      // Handle error
    });

  }).catch(function(error) {
    if (error){
      console.log('error')
      return 'done';
    }

  });
}







