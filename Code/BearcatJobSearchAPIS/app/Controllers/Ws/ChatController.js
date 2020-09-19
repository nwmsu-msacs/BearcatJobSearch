"use strict";

class ChatController {
  constructor({ socket, request }) {
    this.socket = socket;
    this.request = request;

    console.log("------");
  }

  onMessage(message) {
    this.socket.broadcastToAll("message", message);
  }
}

module.exports = ChatController;
