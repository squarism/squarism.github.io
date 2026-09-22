---
title: "Homebrew behind a proxy"
description: "Git doesn't work behind a proxy with homebrew the macports new hotness. Because git:// is blocked at my office. There's a patch herehttps://githu"
date: 2010-12-14T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

Git doesn't work behind a proxy with homebrew (the macports new hotness).  Because git:// is blocked at my office.  There's a patch [here](https://github.com/wright/homebrew/commit/c6ecd3bd1c4e04d8d49cf863e9b62a33a4205d44).  Unfortunately, the drop-in replacement didn't work for me (it's an old commit).

<del>Instead I made the modifications myself.  Be warned, that this file will probably only work for the version I'm using (0.7.1), in which case you'll have to look at the SVN commit yourself.  :(</del>

<del>
```bash
cd /usr/local/Library/Homebrew
cp download_strategy.rb download_strategy.rb.orig
wget http://squarism.com/files/download_strategy_proxy_fix.rb -O download_strategy.rb
export HOMEBREW_GIT_VIA_HTTP=1
brew install [something]
```
</del>

<del>Any brew installs that use git should work now.  </del>

But then there's curl.  Curl doesn't quite use the same env that others do.  So solve it like this:

```javascript
export http_proxy=http://proxy:80
export ALL_PROXY=$http_proxy
```

Curl likes that ALL_PROXY env for some reason.

After that, I was able to get my favorite homebrew apps installing:
`brew install couchdb irssi git mysql watch lua p7zip htop openssl node npm nmap netcat`

**Update**: If the above still doesn't work for you (I had problems with Git URLs), try this:
```bash
cd /usr/local/Library/Homebrew
vi download_strategy.rb
```

Find the line `when %r[^git://] then GitDownloadStrategy` and replace (or comment it out) it with this:
```text
when %r[^git://]
        url.gsub!(/^git\:\/\//, 'http://')
        GitDownloadStrategy
```

Git should use the http:// method of downloading code and brew install should work.  Just to be clear, the relevant part of download_strategy.rb looks like this:

```ruby
when %r[^bzr://] then BazaarDownloadStrategy
  #when %r[^git://] then GitDownloadStrategy
  when %r[^git://]
        url.gsub!(/^git\:\/\//, 'http://')
        GitDownloadStrategy
  when %r[^hg://] then MercurialDownloadStrategy
```

Another thing to try is to edit ~/.curlrc to enable a SOCKS5 proxy if you have one.
`socks5 = "yourserver:port"`
