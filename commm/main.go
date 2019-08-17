package main

import (
	"github.com/gorilla/websocket"
	"github.com/tarm/serial"
	"log"
	"net/http"
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

	s, err := serial.OpenPort(c0)
	if err != nil {
		log.Fatal(err)
	}

	buf := make([]byte, 128)
	go func() {
		for {
			n, err := s.Read(buf)
			if err != nil {
				log.Fatal(err)
			}

			log.Printf("%s\n", string(buf[:n]))
		}
	}()

	http.HandleFunc("/ws", func(writer http.ResponseWriter, request *http.Request) {
		_, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}

		//client := &Client{conn: conn, send: make(chan []byte, 256)}
	})

	if err := http.ListenAndServe(":4000", nil); err != nil {
		log.Fatal(err)
	}
}
