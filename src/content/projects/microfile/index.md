---
title: "Microfile"
description: "A file event and content relay for microservices. Watches directories and passes what changed to HTTP services, configured with a small HCL file and shipped as a single Go binary."
date: 2017-09-15T00:00:00.000Z
repo: "https://github.com/squarism/microfile"
order: 2
---

Microfile watches directories and relays file events, or the file contents, to
microservices over HTTP. It is configured with a short HCL file and ships as a
single binary, so it deploys anywhere a file lands.

The idea is message passing without doing the work itself. A file server
gets a photo dropped on it but then you don't know this has happened.  This is what Microfile solves.

Microfile hands the event to an image service, and
the real work happens in a real language. There is no shell-out action on
purpose. Actions run in order, reactions are evented rather than polled, and
logging is structured.

Written in Go. See the repo for config examples and binary releases.
