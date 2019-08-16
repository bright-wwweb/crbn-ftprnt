package main

import (
	"github.com/tarm/serial"
	"log"
)

func main() {
	c := &serial.Config{Name: "/dev/cu.usbmodem14301", Baud: 9600}

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
