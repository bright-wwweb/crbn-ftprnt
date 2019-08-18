.PHONY: deps server test build client

deps:
	go get -u ./...

build: deps
	go build ./commm/main.go

server:
	go run ./commm/main.go

test:
	go test -v ./...

client:
	yarn start
