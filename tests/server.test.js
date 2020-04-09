const Server = require('../lib/server');

class ClientMock {
  constructor(id) {
    this.write = this.write.bind(this);
    this.id = id;
    this.written = false;
  }

  write() {
    this.written = true;
  }
}

describe("Server", () => {
  it("Should add client", () => {
    const server = new Server();
    const client = { id: 1 };

    server.addClient(client);

    expect(server.clients.length).toEqual(1);
    expect(server.clients[0]).toEqual(client);
  });

  it("Should remove client", () => {
    const server = new Server();
    const client = { id: 1 };

    server.clients = [client];
    server.removeClient(client.id);

    expect(server.clients.length).toEqual(0);
  });

  it("Should write to all clients except one", () => {
    const server = new Server();
    const exceptionClient = new ClientMock(1);
    const otherClients = [
      new ClientMock(2),
      new ClientMock(3),
      new ClientMock(4),
    ];

    for (let otherClient of [...otherClients, exceptionClient]) {
      server.addClient(otherClient);
    }

    server.writeToAll("event", "message", 1);

    expect(otherClients.filter(c => !c.written).length).toEqual(0);
    expect(exceptionClient.written).toBeFalsy();
  });
});
