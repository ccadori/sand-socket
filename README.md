[![Dependency Status](https://david-dm.org/ccadori/sand-socket.svg)](https://david-dm.org/ccadori/sand-socket)
[![devDependency Status](https://david-dm.org/ccadori/sand-socket/dev-status.svg)](https://david-dm.org/ccadori/sand-socket?type=dev)
[![NPM version](https://badge.fury.io/js/sand-socket.svg)](https://www.npmjs.com/package/sand-socket)

## Sand

Sand is a very simple and lightweight implementation of the core node TCP socket, adding some usefull features like client 
management, packet separation, handshake and event oriented clients like socket.io.

## Install

```
$ npm i -s sand-socket
```

## Usage
The usage is very simple and inspired on socket.io, but you are going to use write instead of emit.

```javascript
const SandSocket = require('sand-socket');

const server = new SandSocket();

// Listening for a new client connection
server.on('connected', async (client) => {
  
  // Writing a chat message to the client
  client.write('chat', JSON.stringify({
    text: "Feel free to write anything you want.",
    user: 'System'
  }));
  
  // Listening to a chat message from client
  client.on('chat', message => {
     
    // Sendin the message to all the other clients connected
    socket.writeToAll("chat", message);
  });

  // Listening for this client disconnection
  client.on('disconnected', message => {
    console.log("Client " + client.id + " disconnected.");
  });
});

// Starting server on the port 3000
server.listen(3000);
```

## Delimiters
Sand socket packets are text oriented, by default it just send a string to the client using "\n" as the delimiter
between packets, and "#e#" as the delimiter between event name and message. 
If you prefer, you can set any other delimiter by passing it to the socket constructor.

```javascript
const SandSocket = require('sand-socket');

const packetDelimiter = "packetEndsHere";
const eventDelimiter = "eventNameEndsHere";

const server = new SandSocket(packetDelimiter, eventDelimiter);
```

## Concerns
Sand socket performance was not enough tested yet, and as long as it is a TCP socket and is text-based, it may not be 
the best option for an application that requires a lot of packets per second, like an action game.

## Roadmap
- Make logs optional.
- Find a more performatic way to separate event and message.
- Create the concept of rooms, in order to not store all the clients together.
