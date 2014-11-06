---
layout: post
status: published
published: true
date: 2014-11-14
title: Where Do You Put Your Go Code?
---
One of the most confusing parts of starting Go was learning the project
layout or what Go calls _the workspace_.  It's changed a little bit in past
releases (eschewing `$GOROOT` etc) but the confusion I think remains
if you come from other languages and tools.

Internalize these things:

1. Your code will go in a folder next to all the libraries you download.
1. You probably cannot put your Go code next to your Java/Python/Ruby/Javascript/... unless you luck out on naming conventions that you've already started.
1. If you are starting out and you don't put stuff in `~/bin` then just set `$GOPATH` to your home.
1. If you don't like that last rule, just create `~/gocode` and set `$GOPATH` to that.
1. You probably should not put your Go code in Dropbox.

You also do not need to create a github.com account to put your projects
in `~/gocode/src/github.com/{username}/hello_world`.  You can just go
ahead and start your project.  It's just a namespace.  If something else
needs `github.com/{username}/hello_world` then it will import it.  If it
can find it in the GOPATH then it will work.  That's all this is.

When I started Go, I was worried that I was polluting system paths by
starting projects in `$GOPATH/src/github.com/{my_username}`.  You're not.  Don't
think about it.

> I can't put my crap code next to the likes of Docker!

It's impostor syndrome.  Just start your project.  Just do it.
