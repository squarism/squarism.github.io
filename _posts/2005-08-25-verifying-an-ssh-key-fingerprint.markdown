---
layout: post
status: publish
published: true
title: Verifying an ssh key fingerprint
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 62
wordpress_url: http://squarism.com/2005/08/25/verifying-an-ssh-key-fingerprint/
date: !binary |-
  MjAwNS0wOC0yNSAwOTozNTozMyAtMDQwMA==
date_gmt: !binary |-
  MjAwNS0wOC0yNSAxNDozNTozMyAtMDQwMA==
categories:
- Unix
tags: []
comments: []
---
<p>I'm sure you have seen something like this when you have connected to a ssh host.</p>
<p><code>
The authenticity of host 'host (1.2.3.4)' can't be established.
RSA key fingerprint is 44:99:ff:33:66:88:cc:66:aa:22:00:00:ee:11:99:33.
Are you sure you want to continue connecting (yes/no)?
</code></p>
<p>Great.  Now what?  What to do with that cryptic garbage up top?  Log into the box or call the admin over the phone and verify the key.</p>
<p><code>
$ ssh-keygen -l -f /etc/ssh/ssh_host_key.pub
</code></p>
