---
layout: post
status: publish
published: true
title: RedHat 8.0 to 9.0 upgrade
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
excerpt: ! 'I started this install log because I thought upgrading to 9.0 would be
  a serious pain in the neck.  It turns out it went <b>very smoothly</b> and there''s
  not much to say here.

  <p>

  Here''s a quick list of steps that took me through the update.  The update to Gnome
  2.2 is worth it.  Better theme functionality and everything just *seems* to run
  a bit faster with the 2.4.20 kernel running.  No proof, just text consoles react
  *super fast*.

'
wordpress_id: 25
wordpress_url: http://squarism.com/2003/05/03/redhat-80-to-90-upgrade/
date: !binary |-
  MjAwMy0wNS0wMyAyMDo1OToyMSAtMDQwMA==
date_gmt: !binary |-
  MjAwMy0wNS0wNCAwMTo1OToyMSAtMDQwMA==
categories:
- Unix
tags: []
comments: []
---
<p>I started this install log because I thought upgrading to 9.0 would be a serious pain in the neck.  It turns out it went <b>very smoothly</b> and there's not much to say here.</p>
<p>
Here's a quick list of steps that took me through the update.  The update to Gnome 2.2 is worth it.  Better theme functionality and everything just *seems* to run a bit faster with the 2.4.20 kernel running.  No proof, just text consoles react *super fast*.
<a id="more"></a><a id="more-25"></a></p>
<ol>
<li>Updated 8.0 -> 9.0
<li>Selected custom package upgrade
<li>Choose to upgrade boot loader - recommended 1st option
<li>Three CDs of install
<li>Grub was updated, NT boot loader remained intact.
<li>GDM wouldn't start, downloaded nvidia drivers
<li>New nvidia driver tool was fantastic, followed instructions
<li>Did a `killall gdm-binary', GDM restarted
<li>Logged in, everything works fine
</ol></p>
