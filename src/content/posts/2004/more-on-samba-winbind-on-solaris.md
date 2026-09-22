---
title: "More on samba, winbind on Solaris"
description: "Here's how you can get the samba home directories to be created on the fly:"
date: 2004-10-06T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

Here's how you can get the samba home directories to be created on the fly:

<!-- more -->

http://keutel.de/pam_mkhomedir/
Download from the [first link](http://keutel.de/pam_mkhomedir/pam_mkhomedir.solaris.tar.gz) and copy the binary to /usr/lib/security. You might want to check to see if the binary is going to work with ldd pam_mkhomedir.so.1

```text
#sshd auth required  pam_unix_account.so.1 try_first_pass
#sshd account sufficient /usr/lib/security/pam_winbind.so debug
#sshd session sufficient /usr/lib/security/pam_winbind.so debug
```

Then edit /etc/pam.conf (make a backup) and edit the section

```text
#
# Default definition for Session management
# Used when service name is not explicitly mentioned for session management
#
other session required pam_mkhomedir.so.1 skel=/etc/skel umask=0022
other session required pam_unix_session.so.1
other session sufficient /usr/lib/security/pam_winbind.so try_first_pass debug
```

I got a hint on this (I take no credit) from [this newsgroup posting](http://groups.google.com/groups?hl=en&lr=&selm=1lyeh-KT-1%40gated-at.bofh.it&rnum=4). I'm glad, 'cause I know **jack** about messing with PAM.

Here's a working pam.conf file for Solaris that works with winbind. Very hard information to find on the Internet. Order seriously matters in this file.

```text
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
```
