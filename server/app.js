const Hapi = require('hapi');
const Nes = require('nes');
const MatchMaking = require('./models/matchmaking');
const Player = require('./models/player');
const Game = require('./models/game');

const MongoClient = require('mongodb').MongoClient;
const Boom = require('boom');
const firebasePlugin = require('./firebasePlugin');

const server = new Hapi.Server();
const serverPort = 3000;
const mongoDBUrl = 'mongodb://localhost:27017/game33s';
server.connection({ port: 3000 });

MongoClient.connect(mongoDBUrl, (err, db) => {

  server.register(firebasePlugin, (err) => {
    server.auth.strategy('firesimple', 'firebasic', {});

    const matchMaking = new MatchMaking(db);

    server.route({
        method: 'POST',
        path: '/game/new',
        config: {
          auth: 'firesimple',
          handler: function (request, reply) {
            const credentials = request.auth.credentials;
            const player = new Player(request,credentials.uid);
            matchMaking.lookingForGame(player, (err, game)=> {
              if (err != null) {
                console.error(err);
                return reply(Boom.unauthorized('no user'));
              }
              
              return reply(game);
            });
                    
          }
        }
    });

    server.route({
        method: 'POST',
        path: '/game/{gameId}/finish',
        config: {
          auth: 'firesimple',
          handler: function (request, reply) {
              const credentials = request.auth.credentials;
              //const player = new Player(request, credentials.uid);
              Game
              .findOne(db, request.params.gameId)
              .then((game) => {
                return game.setAnswers(credentials.uid, request.payload.answers)
                .then(() => {
                  reply({
                      statusCode: 200,
                      message: 'The answers have been submited'
                  });
                });
              }).catch(() => {
                  reply(Boom.badImplementation());
              })
          }
        }
    });

    server.route({
        method: 'GET',
        path: '/game/{id}',
        config: {
          auth: 'firesimple',
          handler: function (request, reply) {
              Game
              .findOne(db, request.params.gameId)
              .then((game) => {
                reply({
                    statusCode: 200,
                    message: 'The answers have been submited',
                    data: game.row
                });
              }).catch(() => {
                  reply(Boom.badImplementation());
              })
              
          }
        }

    });

  });


  server.start(function (err) { console.log('start the server', err) });
});
