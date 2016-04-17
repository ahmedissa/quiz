const net = require('net');

const util = require('util');
const Transform = require('stream').Transform;
util.inherits(SimpleProtocol, Transform);

function SimpleProtocol(options) {
  if (!(this instanceof SimpleProtocol))
    return new SimpleProtocol(options);

  Transform.call(this, options);
}

SimpleProtocol.prototype._transform = function(chunk, encoding, done) {
  done(null, "server:  "+chunk);
};

const parser = new SimpleProtocol();

const server = net.createServer((c) => {
  // 'connection' listener
  console.log('client connected 1');

  c.on('connect', () => {
    console.log('client connect 2');
  });

  c.on('end', () => {
    console.log('client disconnected');
  });
  c.pipe(parser).pipe(c);
});


server.on('error', (err) => {
  throw err;
});



server.listen(8124, () => {
  console.log('server bound');
});


