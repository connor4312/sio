# sio, a socket.io debugger

Sio was created because I was frustrated with making temporary index files and mashing F5 when I wanted to test or debug socket.io applications.

![](http://i.imgur.com/9Hz5OYD.gif)

Installation:

```bash
npm install -g sio
```

It's a terminal app. Features:

 * Connect to any socket.io 1.0+ server
 * Filtering of incoming events
 * Pausing and unpausing output
 * Emitting your own events
 * More to come?

## Usage

```bash
# Connect to a server
c <host> <port>
# Emit an event. The "data" will be evaluated, so any valid Js goes.
e <name> # <data>
# Filter event names. They're matched with minimatch.
f <pattern>
# Removes all filters
uf
# Pauses output
p
# Unpauses output
up
# Clears all output
cls
```
