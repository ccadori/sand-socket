const net = require('net');
const tls = require('tls');
const events = require('events');
const colors = require('colors/safe');
const Client = require('./client');

class Socket extends events {
  constructor(packetDelimiter = "\n", eventDelimiter = "#e#", options) {
    super();
    
    this.clients = [];
    this.server = null;
    this.packetDelimiter = packetDelimiter;
    this.eventDelimiter = eventDelimiter;
    this.verboseLog = false;

    this.onClientEnter = this.onClientEnter.bind(this);
    this.onServerListen = this.onServerListen.bind(this);
    this.listen = this.listen.bind(this);
    this.addClient = this.addClient.bind(this);
    this.removeClient = this.removeClient.bind(this);
    this.writeToAll = this.writeToAll.bind(this);

    const createServer = options.encrypted? tls.createServer : net.createServer;

    this.server = createServer(options.serverOptions, this.onClientEnter);
  }

  onClientEnter(socket) {
    if (this.verboseLog)
      console.log(colors.yellow("[Client] Connection attempt"));
      
    const client = new Client(
      socket,
      this,
      this.packetDelimiter,
      this.eventDelimiter
    );
  }

  onServerListen() {
    if (this.verboseLog)
      console.log(colors.yellow('[Server] Listening'));

    this.emit('listen');
  }

  listen(port = 3000, host = '127.0.0.1') {
    this.server.listen(port, host, this.onServerListen);
  }

  addClient(client) {
    if (this.verboseLog)
      console.log(colors.green('[Client] Client connected'))

    this.clients.push(client);
    this.emit('connected', client);
  }

  removeClient(clientId) {
    if (this.verboseLog)
      console.log(colors.red('[Client] Disconnected'));

    this.clients = this.clients.filter(c => c.id !== clientId);
  }

  writeToAll(event, message, exceptionId) {
    for (let client of this.clients)
      if (client.id !== exceptionId)
        client.write(event, message);
  }
}

module.exports = Socket;
