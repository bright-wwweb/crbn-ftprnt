package main

import "github.com/gorilla/websocket"

type Client struct {
	// WS conn
	conn *websocket.Conn
	// Buffered channel of outbound messages
	send chan []byte
}
