package main

import (
	"github.com/tarm/serial"
	"log"
	"net/http"
)

func main() {
	c := &serial.Config{Name: "/dev/cu.usbmodem14301", Baud: 9600}

	s, err := serial.OpenPort(c)
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
		conn, err := upgrader.Upgrade(w, r, nil)
		if err != nil {
			log.Println(err)
			return
		}

		client := &Client{conn: conn, send: make(chan []byte, 256)}

	})
}
