'use strict';

// Load modules

const Boom = require('boom');
const Hoek = require('hoek');
const firebaseAdmin = require('firebase-admin');



// Declare internals

const internals = {};

firebaseAdmin.initializeApp({
  credential: firebaseAdmin.credential.cert("./serviceAccountKey.json"),
  databaseURL: "https://quiz-72f50.firebaseio.com"
});

exports.register = function (plugin, options, next) {

    plugin.auth.scheme('firebasic', internals.implementation);
    next();
};


exports.register.attributes = {
    name: 'firebasePlugin',
    version: '0.1.0'
};


internals.implementation = function (server, options) {
    Hoek.assert(options, 'Missing basic auth strategy options');

    const settings = Hoek.clone(options);

    const scheme = {
        authenticate: function (request, reply) {
            const req = request.raw.req;
            const authorization = req.headers.authorization;
            if (!authorization) {
                return reply(Boom.unauthorized(null, 'Basic', settings.unauthorizedAttributes));
            }

            const parts = authorization.split(/\s+/);

            if (parts[0].toLowerCase() !== 'basic') {
                return reply(Boom.unauthorized(null, 'Basic', settings.unauthorizedAttributes));
            }

            if (parts.length !== 2) {
                return reply(Boom.badRequest('Bad HTTP authentication header format', 'Basic'));
            }

            firebaseAdmin.auth().verifyIdToken(parts[1])
            .then((decodedToken) => {
              const uid = decodedToken.uid;
              firebaseAdmin
              .auth()
              .getUser(uid)
              .then((user) => {
                reply.continue({ credentials: user });
              })
              .catch((error) => {
                reply(Boom.unauthorized('Bad credentials'));
              })
              
            }).catch((error) => {
              reply(Boom.unauthorized('Bad credentials'));
            });            


        }
    };

    return scheme;
};