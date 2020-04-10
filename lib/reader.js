const events = require('events');

class Reader extends events {
  constructor(socket, packetDelimiter = "\n") {
    super();
    this.buffer = [];
    this.packetDelimiter = packetDelimiter;

    this.onReceiveData = this.onReceiveData.bind(this);

    socket.on('data', this.onReceiveData);
  }

  onReceiveData(data) {
    data = this.buffer + data;
    let lines = data.split(this.packetDelimiter);
    let length = lines.length - 1;

    this.buffer = lines[length] || '';

    for (let i = 0; i < length; i++)
      this.emit('read', lines[i]);
  }
}

module.exports = Reader;
