---
title: "Verifying an ssh key fingerprint"
description: "I'm sure you have seen something like this when you have connected to a ssh host."
date: 2005-08-25T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

I'm sure you have seen something like this when you have connected to a ssh host.

```text
The authenticity of host 'host (1.2.3.4)' can't be established.
RSA key fingerprint is 44:99:ff:33:66:88:cc:66:aa:22:00:00:ee:11:99:33.
Are you sure you want to continue connecting (yes/no)?
```

Great.  Now what?  What to do with that cryptic garbage up top?  Log into the box or call the admin over the phone and verify the key.

```bash
$ ssh-keygen -l -f /etc/ssh/ssh_host_key.pub
```
