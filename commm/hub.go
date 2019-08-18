package main

type Hub struct {
	// register clients
	clients map[*Client]bool
	// inbound msgs from serial clients
	broadcast chan []byte
	// register requests from serial clients
	register chan *Client
	// unregister requests from serial clients
	unregister chan *Client
}
