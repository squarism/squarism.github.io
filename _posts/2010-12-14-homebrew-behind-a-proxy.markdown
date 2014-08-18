---
layout: post
status: publish
published: true
title: Homebrew behind a proxy
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 782
wordpress_url: http://squarism.com/?p=782
date: !binary |-
  MjAxMC0xMi0xNCAxMDoxMjo1NyAtMDUwMA==
date_gmt: !binary |-
  MjAxMC0xMi0xNCAxNToxMjo1NyAtMDUwMA==
categories:
- Blog
tags: []
comments:
- id: 7414
  author: How to Install HomeBrew on MacOS over HTTP Proxy | JavaLees
  author_email: ''
  author_url: http://javalees.wordpress.com/2012/11/01/how-to-install-homebrew-on-macos-over-http-proxy/
  date: !binary |-
    MjAxMy0wMS0yMyAxNjozMToyMyAtMDUwMA==
  date_gmt: !binary |-
    MjAxMy0wMS0yMyAyMTozMToyMyAtMDUwMA==
  content: ! '[...] http://squarism.com/2010/12/14/homebrew-behind-a-proxy/
    [...]'
- id: 9039
  author: Anon
  author_email: aaa@aaa.com
  author_url: ''
  date: !binary |-
    MjAxNC0wMS0xNSAxMjo1NjoyMyAtMDUwMA==
  date_gmt: !binary |-
    MjAxNC0wMS0xNSAxNzo1NjoyMyAtMDUwMA==
  content: THANK YOU!
- id: 11089
  author: Minna
  author_email: mperala@fastmail.fm
  author_url: ''
  date: !binary |-
    MjAxNC0wNS0yMyAwNjowOTozMiAtMDQwMA==
  date_gmt: !binary |-
    MjAxNC0wNS0yMyAxMTowOTozMiAtMDQwMA==
  content: Thank you a lot, I was able to install Homebrew at work.
---
<p>Git doesn't work behind a proxy with homebrew (the macports new hotness).  Because git:// is blocked at my office.  There's a patch <a href="https://github.com/wright/homebrew/commit/c6ecd3bd1c4e04d8d49cf863e9b62a33a4205d44">here</a>.  Unfortunately, the drop-in replacement didn't work for me (it's an old commit).  </p>
<p><del>Instead I made the modifications myself.  Be warned, that this file will probably only work for the version I'm using (0.7.1), in which case you'll have to look at the SVN commit yourself.  :(</del></p>
<p><del>
<code>cd /usr/local/Library/Homebrew
cp download_strategy.rb download_strategy.rb.orig
wget http://squarism.com/files/download_strategy_proxy_fix.rb -O download_strategy.rb
export HOMEBREW_GIT_VIA_HTTP=1
brew install [something]
</code>
</del></p>
<p><del>Any brew installs that use git should work now.  </del></p>
<p>But then there's curl.  Curl doesn't quite use the same env that others do.  So solve it like this:</p>
<p><code>export http_proxy=http://proxy:80
export ALL_PROXY=$http_proxy</code></p>
<p>Curl likes that ALL_PROXY env for some reason.</p>
<p>After that, I was able to get my favorite homebrew apps installing:
<code>brew install couchdb irssi git mysql watch lua p7zip htop openssl node npm nmap netcat</code></p>
<p><strong>Update</strong>: If the above still doesn't work for you (I had problems with Git URLs), try this:
<code>cd /usr/local/Library/Homebrew
vi download_strategy.rb
</code></p>
<p>Find the line <code>when %r[^git://] then GitDownloadStrategy</code> and replace (or comment it out) it with this:
when %r[^git://]
        url.gsub!(/^git\:\/\//, 'http://')
        GitDownloadStrategy
</code></p>
<p>Git should use the http:// method of downloading code and brew install should work.  Just to be clear, the relevant part of download_strategy.rb looks like this:</p>

{% highlight ruby %}  when %r[^bzr://] then BazaarDownloadStrategy
  #when %r[^git://] then GitDownloadStrategy
  when %r[^git://]
        url.gsub!(/^git\:\/\//, 'http://')
        GitDownloadStrategy
  when %r[^hg://] then MercurialDownloadStrategy
{% endhighlight %}

</p>
<p>Another thing to try is to edit ~/.curlrc to enable a SOCKS5 proxy if you have one.
<code>socks5 = "yourserver:port"</code></p>
