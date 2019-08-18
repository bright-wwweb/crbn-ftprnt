package main

import (
	"bytes"
	"github.com/tarm/serial"
	"log"
)

func newSerialConn(name string, baud int) *serial.Config {
	return &serial.Config{
		Name: name,
		Baud: baud,
	}
}

func serialListen(signal string, c *serial.Config, h *Hub) {
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
		message := bytes.TrimSpace(bytes.Replace([]byte(signal), newline, space, -1))
		h.broadcast <- message
	}
}
