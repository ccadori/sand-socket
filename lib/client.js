const events = require('events');
const uuid = require('uuid');
const colors = require('colors/safe');
const Reader = require('./reader')

class Client extends events {
  constructor(socket, server, packetDelimiter = "\n", eventDelimiter = "#e#") {
    super();
    this.server = server;
    this.socket = socket;
    this.packetDelimiter = packetDelimiter;
    this.eventDelimiter = eventDelimiter;
    this.id = uuid.v4();

    this.write = this.write.bind(this);
    this.onDisconnect = this.onDisconnect.bind(this);
    this.onReceiveData = this.onReceiveData.bind(this);
    this.onHandShake = this.onHandShake.bind(this);
    this.onError = this.onError.bind(this);

    new Reader(socket, packetDelimiter).on('read', this.onReceiveData);

    socket.on('close', this.onDisconnect);
    socket.on('error', this.onError);
    this.on('handshake', this.onHandShake);

    this.write('handshake', this.id);
  }

  onHandShake() {
    this.server.addClient(this);
  }

  write(event, payload) {
    this.socket.write(event + this.eventDelimiter + payload + this.packetDelimiter);
  }

  onDisconnect() {
    this.server.removeClient(this.id);
    this.emit('disconnected');
  }

  onReceiveData(data) {
    const [event, content] = (data + "").split(this.eventDelimiter);
    this.emit([event], content);
  }

  onError(error) {
    this.emit('fail', error);
  }
}

module.exports = Client;
