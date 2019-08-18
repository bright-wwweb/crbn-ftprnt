package main

import (
	"github.com/gorilla/websocket"
	"github.com/tarm/serial"
	"log"
	"net/http"
	"time"
)

var upgrader = websocket.Upgrader{} // use defaults

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

func newHub() *Hub {
	return &Hub{
		broadcast:  make(chan []byte),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
	}
}

func (h *Hub) run() {
	for {
		select {
		case client := <-h.register:
			h.clients[client] = true
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				close(client.send)
			}
		case message := <-h.broadcast:
			for client := range h.clients {
				select {
				case client.send <- message:
				default:
					close(client.send)
					delete(h.clients, client)
				}
			}
		}
	}
}

type Client struct {
	// hub
	hub *Hub
	// WS conn
	conn *websocket.Conn
	// Buffered channel of outbound messages
	send chan []byte
}

func (c *Client) writePump() {
	ticker := time.NewTicker(time.Second * 30)
	defer func() {
		ticker.Stop()
		c.conn.Close()
	}()

	for {
		select {
		case message, ok := <-c.send:
			c.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if !ok {
				c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			if err := w.Close(); err != nil {
				return
			}

		case <-ticker.C:
			c.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}


func newSerialConn(name string, baud int) *serial.Config {
	return &serial.Config{
		Name: name,
		Baud: baud,
	}
}

func serialListen(c *serial.Config) {
	s, err := serial.OpenPort(c)
	if err != nil {
		log.Fatal(err)
	}

	buf := make([]byte, 128)
	for {
		n, err := s.Read(buf)
		if err != nil {
			log.Fatal(err)
		}

		log.Printf("%s\n", string(buf[:n]))
	}
}

func serveWs(hub *Hub, w http.ResponseWriter, r *http.Request)  {
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	w.Write([]byte("pong"))
	client := &Client{hub: hub, conn: conn, send: make(chan []byte, 256)}
	client.hub.register <- client

	go client.writePump()
}

func main() {
	c0 := newSerialConn("/dev/cu.usbmodem14301", 9600)
	//c1 := newSerialConn("/dev/cu.usbmodem14301", 9601)
	//c2 := newSerialConn("/dev/cu.usbmodem14301", 9602)

	go serialListen(c0)

	hub := newHub()
	go hub.run()

	http.HandleFunc("/ping", func(w http.ResponseWriter, r *http.Request) {
		w.Write([]byte("pong"))
	})

	http.HandleFunc("/ws", func(w http.ResponseWriter, r *http.Request) {
		serveWs(hub, w, r)
	})

	if err := http.ListenAndServe(":4000", nil); err != nil {
		log.Fatal(err)
	}
}
