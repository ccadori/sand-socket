const net = require('net');
const events = require('events');
const colors = require('colors/safe');
const Client = require('./client');

class Socket extends events {
  constructor() {
    super();
    this.clients = [];
    this.server = null;

    this.onClientEnter = this.onClientEnter.bind(this);
    this.onServerListen = this.onServerListen.bind(this);
    this.listen = this.listen.bind(this);
    this.addClient = this.addClient.bind(this);
    this.removeClient = this.removeClient.bind(this);
    this.writeToAll = this.writeToAll.bind(this);

    this.server = net.createServer(this.onClientEnter);
  }
  
  onClientEnter(socket) {
    console.log(colors.yellow("[Client] Connection attempt"));
    const client = new Client(socket, this);
  }
  
  onServerListen() {
    console.log(colors.yellow('[Server] Listening'));
    this.emit('listen');
  }
  
  listen(port = 3000, host = '127.0.0.1') {
    this.server.listen(port, host, this.onServerListen);
  }

  addClient(client) {
    console.log(colors.green('[Client] Client connected'))
    this.clients.push(client);
    this.emit('connected', client);
  }

  removeClient(clientId) {
    this.clients = this.clients.filter(c => c.id !== clientId);
  }

  writeToAll(event, message, exception) {
    for (let client of this.clients)
      if (client.id !== exception)
        if (exception instanceof String)
          client.write(event, message)
        else
          client.writeJSON(event, message)
  }

  writeToAll(event, message, exception) {
    for (let client of this.clients)
      if (client.id !== exception)
        client.write(event, message)
  }
}

module.exports = Socket;