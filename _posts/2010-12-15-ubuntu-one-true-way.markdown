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
<p>For a Linux development box, I typically install the same packages over and over again.  For any new OS install, I call this the "One True Way" (OTW taken from a now defunct source online).  Almost every box needs development libraries at some point.  There's a lot of extra stuff thrown in here too.  These packages are circa ubuntu 10.04.  Keep this in mind.</p>
<p><code># aptitude install ruby ruby1.8-dev mysql-server mysql-client libmysql-ruby libmysqlclient-dev nmap htop nginx git-core postgresql nethack-console irssi tightvncserver xtightvncviewer distcc build-essential linux-kernel-headers linux-source couchdb solr-common solr-tomcat tomcat6 rar unrar p7zip k3b libk3b6-extracodecs gparted ubuntu-restricted-extras libdvdcss libxml2-dev libxslt-dev curl libcurl4-openssl-dev lua50 liblua50-dev libsqlite3-ruby libmagick9-dev</code></p>
<p>Download rubygems and install.</p>
<p>Add git hub to our gems list:<code># gem source -a http://gems.github.com</code>.</p>
<p>Install some gems I like. <code># gem install mysql RedCloth capistrano rmagick termios warbler sinatra feedzirra</code></p>
<p>Install Chrome.  Download .deb 64 package (google-chrome-beta_current_amd64.deb or newer) and double-click on the deb file.  Click install.</p>
<p>Grab <a href="http://www.proggyfonts.com/">proggy fonts</a>: clean, square, tiny, small.  Set terminal font to proggy font.  Set scrollback to 9000 lines, hidden scrollbar (shift+page up works instead), turn off menu, turn off terminal bell.</p>
<p>Install dropbox.</p>
<p>Go to town.</p>
