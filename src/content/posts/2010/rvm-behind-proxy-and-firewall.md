---
title: "RVM behind proxy and firewall"
description: "Firefox worked, gem install worked, elinks worked and even curl worked. So why isn't RVMhttp://rvm.beginrescueend.com/ able to update?"
date: 2010-11-05T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

Firefox worked, gem install worked, elinks worked and even curl worked.  So why isn't [RVM](http://rvm.beginrescueend.com/) able to update?

```text
Initialized empty Git repository in ~/.rvm/src/rvm/.git/
github.com[0: x.x.x.x]: errno=No route to host
fatal: unable to connect a socket (No route to host)
```

And you've tried setting http_proxy and --proxy flags with rvm.  No need to fear, there's a git URL hardcoded in there.

```bash
cd ~/.rvm/scripts
vi utility
```

Change the line:
`builtin cd $rvm_src_path && git clone git://github.com/wayneeseguin/rvm.git && builtin cd rvm/ && ./scripts/install`
to
`builtin cd $rvm_src_path && git clone http://github.com/wayneeseguin/rvm.git && builtin cd rvm/ && ./scripts/install`

This is how I got it to work but obviously this is a hack.  You should check out [rvm:fw](https://github.com/stevenhaddox/rvm_fw) for a more permanent solution.

Alternatively, if you can get curl to work with ALL_PROXY and HTTP_PROXY environment variables (test with curl yahoo.com), then you can simply do the manual install method to install RVM or even upgrade RVM to the latest version.  I used this method when I was seeing "rvm get fails" where rvm get wouldn't work:
`curl -s https://rvm.beginrescueend.com/install/rvm -o rvm-installer ; chmod +x rvm-installer ; ./rvm-installer --version latest`
