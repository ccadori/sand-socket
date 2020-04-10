const events = require('events');
const Server = require('../lib/server');
const Client = require('../lib/client');

class SocketMock extends events {
  constructor() {
    super();
    this.writtenData = "";
    this.write = this.write.bind(this);
  }
  
  write (data) {
    this.writtenData = data;
  }
};

describe("Client", () => {
  it("Should correctly write to stream", () => {
    const socket = new SocketMock();
    const server = new Server();
    const client = new Client(socket, server, "\n", "#e#");
    
    client.write("event", "payload");
    
    expect(socket.writtenData).toEqual("event#e#payload\n");
  });

  it("Should emit an event with event and payload", () => {
    const socket = new SocketMock();
    const server = new Server();
    const client = new Client(socket, server, "\n", "#e#");
    let receivedPayload = "";

    client.on("test", payload => receivedPayload = payload);
    client.onReceiveData("test#e#payload");
    
    expect(receivedPayload).toBeTruthy();
    expect(receivedPayload).toEqual("payload");
  });
});
