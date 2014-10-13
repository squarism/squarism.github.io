---
layout: post
status: draft
published: false
title: Where Do You Put Your Go Code?
---
One of the most confusing parts of starting Go was learning the project
layout.  It's changed a little bit in past releases (eschewing $GOROOT
etc) but the confusion I think remains if you come from other languages.

Internalize these things:

1. Your code will go in a folder next to all the libraries you
download.
1. You probably cannot put your code in Dropbox.
1. You probably cannot put your Go code next to your Java/Python/Ruby/... unless you luck out on naming conventions.
1. If you are starting out, just create ~/gocode and set $GOPATH to that.

You also do not need to create a github.com account to put your projects
in `~/gocode/src/github.com/{username}/hello_world`.  You can just go
ahead and start your project.  It's just a namespace.  If something else
needs `github.com/{username}/hello_world` then it will import it.  If it
can find it in the GOPATH then it will work.  That's all this is.

When I started Go, I was worried that I was polluting system paths by
starting projects in `src/github.com/{username}`.  You're not.  Don't
think about it.  It's impostor syndrome.  Just start your project.  Just go.
