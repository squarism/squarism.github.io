---
layout: post
status: publish
published: true
title: RVM behind proxy and firewall
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 622
wordpress_url: http://squarism.com/?p=622
date: !binary |-
  MjAxMC0xMS0wNSAyMDowODowNSAtMDQwMA==
date_gmt: !binary |-
  MjAxMC0xMS0wNiAwMTowODowNSAtMDQwMA==
categories:
- Ruby
tags: []
comments: []
---
<p>Firefox worked, gem install worked, elinks worked and even curl worked.  So why isn't <a href="http://rvm.beginrescueend.com/">RVM</a> able to update?</p>
<p><code>Initialized empty Git repository in ~/.rvm/src/rvm/.git/
github.com[0: x.x.x.x]: errno=No route to host
fatal: unable to connect a socket (No route to host)
</code></p>
<p>And you've tried setting http_proxy and --proxy flags with rvm.  No need to fear, there's a git URL hardcoded in there.</p>
<p><code>cd ~/.rvm/scripts
vi utility</code></p>
<p>Change the line:
<code>builtin cd $rvm_src_path && git clone git://github.com/wayneeseguin/rvm.git && builtin cd rvm/ && ./scripts/install</code>
to
<code>builtin cd $rvm_src_path && git clone http://github.com/wayneeseguin/rvm.git && builtin cd rvm/ && ./scripts/install</code></p>
<p>This is how I got it to work but obviously this is a hack.  You should check out <a href="https://github.com/stevenhaddox/rvm_fw">rvm:fw</a> for a more permanent solution.</p>
<p>Alternatively, if you can get curl to work with ALL_PROXY and HTTP_PROXY environment variables (test with curl yahoo.com), then you can simply do the manual install method to install RVM or even upgrade RVM to the latest version.  I used this method when I was seeing "rvm get fails" where rvm get wouldn't work:
<code>curl -s https://rvm.beginrescueend.com/install/rvm -o rvm-installer ; chmod +x rvm-installer ; ./rvm-installer --version latest</code></p>
