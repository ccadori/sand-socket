const Reader = require("../lib/reader");
const events = require('events');

describe("Reader", () => {
  it("Should emit two events when receive a text with two messages", async () => {
    const mockedStream = new events();
    const reader = new Reader(mockedStream);
    const messages = [];

    reader.on("read", (data) => messages.push(data));
    mockedStream.emit("data", "message1\nmessage2\n");

    expect(messages[0]).toEqual("message1");
    expect(messages.length).toEqual(2);
  });

  it("Should only emit the event when the message is fully received", async () => {
    const mockedStream = new events();
    const reader = new Reader(mockedStream);
    const messages = [];

    reader.on("read", (data) => messages.push(data));
    mockedStream.emit("data", "messa");

    expect(messages.length).toEqual(0);
    
    mockedStream.emit("data", "ge\n");

    expect(messages.length).toEqual(1);
    expect(messages[0]).toEqual("message");
  });

  it ("Should kept an incomplete message in the buffer", async () => {
    const mockedStream = new events();
    const reader = new Reader(mockedStream);
    const messages = [];

    reader.on("read", (data) => messages.push(data));
    mockedStream.emit("data", "message1\nmessa");

    expect(messages.length).toEqual(1);
    expect(messages[0]).toEqual("message1");
    expect(reader.buffer).toEqual("messa");
    
    mockedStream.emit("data", "ge2\n");

    expect(messages.length).toEqual(2);
    expect(messages[1]).toEqual("message2");
  });
});
