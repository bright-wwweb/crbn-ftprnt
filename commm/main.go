package main

import (
	"github.com/gorilla/websocket"
	"github.com/tarm/serial"
	"log"
	"net/http"
	"time"
)

var upgrader = websocket.Upgrader{} // use defaults

func newSerialConn(name string, baud int) *serial.Config {
	return &serial.Config{
		Name: name,
		Baud: baud,
	}
}

func main() {
	c0 := newSerialConn("/dev/cu.usbmodem14301", 9600)
	//c1 := newSerialConn("/dev/cu.usbmodem14301", 9601)
	//c2 := newSerialConn("/dev/cu.usbmodem14301", 9602)
	hub := newHub()

	go serialListen(c0)
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
	ticker := time.NewTicker(time.Second * 30)
	conn, err := upgrader.Upgrade(w, r, nil)
	if err != nil {
		log.Println(err)
		return
	}

	client := &Client{hub: hub, conn: conn, send: make(chan []byte, 256)}
	client.hub.register <- client

	defer func() {
		ticker.Stop()
		client.conn.Close()
	}()

	for {

		select {

		case message, ok := <- client.send:
			client.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if !ok {
				client.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := client.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			w.Write(message)

			if err := w.Close(); err != nil {
				return
			}

		case <-ticker.C:
			client.conn.SetWriteDeadline(time.Now().Add(10 * time.Second))
			if err := client.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
