---
layout: post
status: publish
published: true
title: Ubuntu One True Way
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 385
wordpress_url: http://squarism.com/?p=385
date: !binary |-
  MjAxMC0xMi0xNSAxMTozODowNCAtMDUwMA==
date_gmt: !binary |-
  MjAxMC0xMi0xNSAxNjozODowNCAtMDUwMA==
categories:
- Ruby
- Unix
tags: []
comments: []
---
__Outdated post.  I have a One True Way Guide here__
[One True Way](https://squarism.hackpad.com/The-One-True-Way-1w4ocgrhUkM)

For a Linux development box, I typically install the same packages over and over again.  For any new OS install, I call this the "One True Way" (OTW taken from a now defunct source online).  Almost every box needs development libraries at some point.  There's a lot of extra stuff thrown in here too.  These packages are circa ubuntu 10.04.  Keep this in mind.

`# aptitude install ruby ruby1.8-dev mysql-server mysql-client libmysql-ruby libmysqlclient-dev nmap htop nginx git-core postgresql nethack-console irssi tightvncserver xtightvncviewer distcc build-essential linux-kernel-headers linux-source couchdb solr-common solr-tomcat tomcat6 rar unrar p7zip k3b libk3b6-extracodecs gparted ubuntu-restricted-extras libdvdcss libxml2-dev libxslt-dev curl libcurl4-openssl-dev lua50 liblua50-dev libsqlite3-ruby libmagick9-dev`

Download rubygems and install.

Add git hub to our gems list:`# gem source -a http://gems.github.com`.

Install some gems I like. `# gem install mysql RedCloth capistrano rmagick termios warbler sinatra feedzirra`

Install Chrome.  Download .deb 64 package (google-chrome-beta_current_amd64.deb or newer) and double-click on the deb file.  Click install.

Grab [proggy fonts](http://www.proggyfonts.com/): clean, square, tiny, small.  Set terminal font to proggy font.  Set scrollback to 9000 lines, hidden scrollbar (shift+page up works instead), turn off menu, turn off terminal bell.

Install dropbox.

Go to town.