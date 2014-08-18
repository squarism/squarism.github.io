---
layout: post
status: publish
published: true
title: More on samba, winbind on Solaris
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
excerpt: ! '<p>

  Here''s how you can get the samba home directories to be created on the fly:

  </p>

'
wordpress_id: 47
wordpress_url: http://squarism.com/2004/10/06/more-on-samba-winbind-on-solaris/
date: !binary |-
  MjAwNC0xMC0wNiAxNDowMToxMCAtMDQwMA==
date_gmt: !binary |-
  MjAwNC0xMC0wNiAxOTowMToxMCAtMDQwMA==
categories:
- Unix
tags: []
comments: []
---
<p>
Here's how you can get the samba home directories to be created on the fly:
</p>
<a id="more"></a><a id="more-47"></a></p>
<p>
http://keutel.de/pam_mkhomedir/
Download from the <a href="http://keutel.de/pam_mkhomedir/pam_mkhomedir.solaris.tar.gz">first link</a> and copy the binary to /usr/lib/security. You might want to check to see if the binary is going to work with ldd pam_mkhomedir.so.1
</p></p>
<pre>
#sshd auth required  pam_unix_account.so.1 try_first_pass
#sshd account sufficient /usr/lib/security/pam_winbind.so debug
#sshd session sufficient /usr/lib/security/pam_winbind.so debug
</pre></p>
<p>
Then edit /etc/pam.conf (make a backup) and edit the section
</p></p>
<pre>
#
# Default definition for Session management
# Used when service name is not explicitly mentioned for session management
#
other session required pam_mkhomedir.so.1 skel=/etc/skel umask=0022
other session required pam_unix_session.so.1
other session sufficient /usr/lib/security/pam_winbind.so try_first_pass debug
</pre></p>
<p>
I got a hint on this (I take no credit) from <a href="http://groups.google.com/groups?hl=en&#38;lr=&#38;selm=1lyeh-KT-1%40gated-at.bofh.it&#38;rnum=4">this newsgroup posting</a>. I'm glad, 'cause I know <strong>jack</strong> about messing with PAM.
</p>
<p>
Here's a working pam.conf file for Solaris that works with winbind. Very hard information to find on the Internet. Order seriously matters in this file.
</p></p>
<pre>
#
#ident  "@(#)pam.conf   1.20    02/01/23 SMI"
#
# Copyright 1996-2002 Sun Microsystems, Inc.  All rights reserved.
# Use is subject to license terms.
#
# PAM configuration
#
# Unless explicitly defined, all services use the modules
# defined in the "other" section.
#
# Modules are defined with relative pathnames, i.e., they are
# relative to /usr/lib/security/$ISA. Absolute path names, as
# present in this file in previous releases are still acceptable.
#
# Authentication management
#
# login service (explicit because of pam_dial_auth)
#
login   auth sufficient         /usr/lib/security/pam_winbind.so debug
login   auth requisite          pam_authtok_get.so.1
login   auth required           pam_dhkeys.so.1
login   auth required           pam_unix_auth.so.1
login   auth required           pam_dial_auth.so.1
#
# rlogin service (explicit because of pam_rhost_auth)
#
rlogin  auth sufficient         /usr/lib/security/pam_winbind.so debug
rlogin  auth sufficient         pam_rhosts_auth.so.1
rlogin  auth requisite          pam_authtok_get.so.1
rlogin  auth required           pam_dhkeys.so.1
rlogin  auth required           pam_unix_auth.so.1
#
# rsh service (explicit because of pam_rhost_auth,
# and pam_unix_auth for meaningful pam_setcred)
#
rsh     auth sufficient         pam_rhosts_auth.so.1
rsh     auth required           pam_unix_auth.so.1
#
# PPP service (explicit because of pam_dial_auth)
#
ppp     auth requisite          pam_authtok_get.so.1
ppp     auth required           pam_dhkeys.so.1
ppp     auth required           pam_unix_auth.so.1
ppp     auth required           pam_dial_auth.so.1
#
# Default definitions for Authentication management
# Used when service name is not explicitly mentioned for authenctication
#
other   auth sufficient         /usr/lib/security/pam_winbind.so debug
other   auth requisite          pam_authtok_get.so.1
other   auth required           pam_dhkeys.so.1
other   auth required           pam_unix_auth.so.1
#
# passwd command (explicit because of a different authentication module)
#
passwd  auth required           pam_passwd_auth.so.1
#
# cron service (explicit because of non-usage of pam_roles.so.1)
#
cron    account required        pam_projects.so.1
cron    account required        pam_unix_account.so.1
#
# Default definition for Account management
# Used when service name is not explicitly mentioned for account management
#
other   account sufficient      /usr/lib/security/pam_winbind.so debug
other   account requisite       pam_roles.so.1
other   account required        pam_projects.so.1
other   account required        pam_unix_account.so.1
#
# Default definition for Session management
# Used when service name is not explicitly mentioned for session management
#
other   session required        pam_mkhomedir.so.1 skel=/etc/skel umask=0077
other   session sufficient      /usr/lib/security/pam_winbind.so debug
other   session required        pam_unix_session.so.1
#
# Default definition for  Password management
# Used when service name is not explicitly mentioned for password management
#
other   password sufficient     /usr/lib/security/pam_winbind.so debug
other   password required       pam_dhkeys.so.1
other   password requisite      pam_authtok_get.so.1
other   password requisite      pam_authtok_check.so.1
other   password required       pam_authtok_store.so.1
#
# Support for Kerberos V5 authentication (uncomment to use Kerberos)
#
#rlogin         auth optional           pam_krb5.so.1 try_first_pass
#login          auth optional           pam_krb5.so.1 try_first_pass
#other          auth optional           pam_krb5.so.1 try_first_pass
#cron           account optional        pam_krb5.so.1
#other          account optional        pam_krb5.so.1
#other          session optional        pam_krb5.so.1
#other          password optional       pam_krb5.so.1 try_first_pass
</pre></p>
