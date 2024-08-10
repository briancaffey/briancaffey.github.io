---
layout: post
title: Getting started with Python's Twisted Framework
date: 2017-12-22
comments: true
image: /static/twisted-snakes.png
tags:
  - python
  - twisted
---

![png](/static/twisted-snakes.png)

In this article I'm going to be exploring python's twisted framework. I'm working through the _Twisted Network Programming Essentials_ book from O'Reilly.

## Installation

```
 $ pip install twisted
```

The main idea behind Twisted is that it gives us the parallelism of multithreading programming with the ease of reasoning of single threaded programming.

![png](/static/event-driven.jpg)

## The Reactor

This is the core of Twisted. Here is a simple explanation of what the reactor does with psuedo-code:

```python
while True:
    timeout = timeout_until_next_timed_event()
    events = wait_for_events(timeout)
    events += timed_events_until(now())
    for event in events:
        event.process()
```

Here's a simple echo server/client example that illustrates how the reactor works. It is composed of `echoclient.py` and `echoserver.py`:

_echoclient.py_

```python
from twisted.internet import reactor, protocol

class EchoClient(protocol.Protocol):
    def connectionMade(self):
        self.transport.write(u"Hello, world!".encode('utf-8'))

    def dataReceived(self, data):
        print("Server said:", data)
        self.transport.loseConnection()

class EchoFactory(protocol.ClientFactory):
    def buildProtocol(self, addr):
        return EchoClient()

    def clientConnectionFailed(self, connector, reason):
        print("Connection failed.")
        reactor.stop()

    def clientConnectionLost(self, connector, reason):
        print("Connection lost.")
        reactor.stop()

reactor.connectTCP("localhost", 8000, EchoFactory())
reactor.run()
```

_echoserver.py_

```python
from twisted.internet import protocol, reactor

class Echo(protocol.Protocol):
    def dataReceived(self,data):
        self.transport.write(data)

class EchoFactory(protocol.Factory):
    def buildProtocol(self, addr):
        return Echo()

reactor.listenTCP(8000, EchoFactory())
reactor.run()
```
