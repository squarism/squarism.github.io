---
layout: post
status: publish
published: true
title: samba, winbind and solaris
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
excerpt: ! "<font color=\"orange\"><i>This is a repost for formatting</i></font>\r\n\r\nWinbind-Solaris
  Documentation\r\nNaag Mummaneni getnag at rediffmail.com \r\nThu May 2 11:10:54
  GMT 2002 \r\n\r\nNext message: Winbind-Solaris Documentation \r\nMessages sorted
  by: [ date ] [ thread ] [ subject ] [ author ] \r\n\r\n--------------------------------------------------------------------------------\r\n\r\nHi,\r\n\r\nI
  just configured my Solaris box to logon to my Windows 2k Domain after working on
  it for three days.I am sorry to say that I have found no documentation for setting
  up Samba-winbind on solaris.And I feel that a Prestigious opensource project like
  Samba shouldnt be blamed for this.So I modified the documentation that come with
  samba &amp; prepared this one for \"solaris\" so that no other administrator will
  face problems that I did. I hope the Samba group will put this documentation part
  in the distribution.Please find the attached doc file for the documentation.\r\n\r\nThanks\r\nNaag
  Mummaneni(getnag at rediffmail.com)\r\n--------------------------------------------------------\r\n"
wordpress_id: 46
wordpress_url: http://squarism.com/2004/10/01/samba-winbind-and-solaris/
date: !binary |-
  MjAwNC0xMC0wMSAxNToxNzowMSAtMDQwMA==
date_gmt: !binary |-
  MjAwNC0xMC0wMSAyMDoxNzowMSAtMDQwMA==
categories:
- Unix
tags: []
comments: []
---
<p><font color="orange"><i>This is a repost for formatting</i></font></p>
<p>Winbind-Solaris Documentation
Naag Mummaneni getnag at rediffmail.com
Thu May 2 11:10:54 GMT 2002 </p>
<p>Next message: Winbind-Solaris Documentation
Messages sorted by: [ date ] [ thread ] [ subject ] [ author ] </p>
<p>--------------------------------------------------------------------------------</p>
<p>Hi,</p>
<p>I just configured my Solaris box to logon to my Windows 2k Domain after working on it for three days.I am sorry to say that I have found no documentation for setting up Samba-winbind on solaris.And I feel that a Prestigious opensource project like Samba shouldnt be blamed for this.So I modified the documentation that come with samba &amp; prepared this one for "solaris" so that no other administrator will face problems that I did. I hope the Samba group will put this documentation part in the distribution.Please find the attached doc file for the documentation.</p>
<p>Thanks
Naag Mummaneni(getnag at rediffmail.com)
--------------------------------------------------------
<a id="more"></a><a id="more-46"></a>
Installation and Configuration of Winbind on Solaris.</p>
<p>This HOWTO describes how to get winbind services up and running to control access and authenticate users on your Solaris box using the winbind services which come with SAMBA 2.2.x latest CVS Checkout.Make sure you are using the latest Samba 2.2.x cvs checkout as other versions come with a lots of bugs regarding winbind .And even the Latest Samba Stable Release is also not an exception to this.</p>
<p>Introduction
This HOWTO describes the procedures used to get winbind up and running on a Solaris system.
Winbind is capable of providing access and authentication control for Windows Domain users through an NT
or Win2K PDC for 'regular' services, such as telnet and ftp, as well for SAMBA services.
Why should I to this? ?h?n
This allows the SAMBA administrator to rely on the authentication mechanisms on the NT/Win2K
PDC for the authentication of domain members. NT/Win2K users no longer need to have separate
accounts on the SAMBA server.
Who should be reading this document? ?h?n
This HOWTO is designed for system administrators. If you are implementing SAMBA on a file
server and wish to (fairly easily) integrate existing NT/Win2K users from your PDC onto the
SAMBA server, this HOWTO is for you. </p>
<p>Requirements
If you have a samba configuration file that you are currently using... BACK IT UP! If your system already uses PAM, back up the /etc/pam.conf file ! If you haven't already made a boot disk, MAKEONE NOW!
Messing with the pam configuration file can make it nearly impossible to log in to yourmachine. That's why you want to be able to boot back into your machine in single user mode and restore your /etc/pam.conf back
to the original state they were in if you get frustrated with the way things are going. ;-)
Please refer to the main SAMBA web page or, better yet, your closest SAMBA mirror site for
instructions on downloading the source code of Samba 2.2.x from the SAMBA CVS repository.
To allow Domain users the ability to access SAMBA shares and files, as well as potentially other services provided by your SAMBA machine, PAM (pluggable authentication modules) must be setup properly on your machine. In order to compile the winbind modules, you should have at least the pam libraries resident on your system. Solaris 7/8 has its pam modules coming with the distribution itself.</p>
<p>Testing Things Out
Before starting, it is probably best to kill off all the SAMBA related daemons running on your server. Kill off
all smbd, nmbd, and winbindd processes that may be running. </p>
<p>Configure and compile SAMBA
The configuration and compilation of SAMBA is pretty straightforward. The first three steps may not be
necessary depending upon whether or not you have previously built the Samba binaries.
root# autoconf
root# make clean
root# rm config.cache
root# ./configure --with-winbind --with-pam
root# make
root# make install</p>
<p>This will, by default, install SAMBA in /usr/local/samba. See the main SAMBA documentation if you
want to install SAMBA somewhere else. It will also build the winbindd executable and libraries.</p>
<p>Configure nsswitch.conf and the winbind libraries
The libraries needed to run the winbindd daemon through nsswitch need to be copied to their proper
locations, so
root# cp ../samba/source/nsswitch/libnss_winbind.so /usr/lib
I also found it necessary to make the following symbolic links:
root# ln -s /usr/lib/libnss_winbind.so /usr/lib/libnss_winbind.so.1
root# ln -s /usr/lib/libnss_winbind.so /usr/lib/libnss_winbind.so.2
root# ln -s /usr/lib/libnss_winbind.so /usr/lib/nss_winbind.so.1
root# ln -s /usr/lib/libnss_winbind.so /usr/lib/nss_winbind.so.2</p>
<p>Now, as root you need to edit /etc/nsswitch.conf to allow user and group entries to be visible from the winbindd daemon. My /etc/nsswitch.conf file look like this after editing:
passwd: files winbind
group: files winbind</p>
<p>Configure smb.conf
Several parameters are needed in the smb.conf file to control the behavior of winbindd. Configure smb.conf These are described in more detail in the winbindd(8) man page. My smb.conf file was modified to include the following entries in the [global] section:
[global]</p>
<p># The previous documentation says to as the "winbind seperator " #directive also but it is no longer supported.
# use uids from 10000 to 20000 for domain users
winbind uid = 10000-20000
# use gids from 10000 to 20000 for domain groups
winbind gid = 10000-20000
# allow enumeration of winbind users and groups
winbind enum users = yes
winbind enum groups = yes
# give winbind users a real shell (only needed if they have telnet access)
template homedir = /home/winnt/%D/%U
template shell = /bin/bash</p>
<p>Join the SAMBA server to the PDC domain
Enter the following command to make the SAMBA server join the PDC domain, where DOMAIN is the name
of your Windows domain and Administrator is a domain user who has administrative privileges in the
domain.
root# /usr/local/samba/bin/smbpasswd -j DOMAIN -r PDC -U Administrator
The proper response to the command should be: "Joined the domain DOMAIN" where DOMAIN is your
DOMAIN name.</p>
<p>Start up the winbindd daemon and test it!
Eventually, you will want to modify your smb startup script to automatically invoke the winbindd daemon
when the other parts of SAMBA start, but it is possible to test out just the winbind portion first. To start up
winbind services, enter the following command as root:
root# /usr/local/samba/bin/winbindd
I'm always paranoid and like to make sure the daemon is really running...
root# ps -ae | grep winbindd
This command should produce output like this, if the daemon is running
3025 ? 00:00:00 winbindd
Now... for the real test, try to get some information about the users on your PDC
root# /usr/local/samba/bin/wbinfo -u
This should echo back a list of users on your Windows users on your PDC. For example, I get the following
response:
CEO\Administrator
CEO\burdell
CEO\Guest
CEO\jt-ad
CEO\krbtgt
CEO\TsInternetUser</p>
<p>root# /usr/local/samba/bin/wbinfo -g
CEO\Domain Admins
CEO\Domain Users
CEO\Domain Guests
CEO\Domain Computers
CEO\Domain Controllers
CEO\Cert Publishers
CEO\Schema Admins
CEO\Enterprise Admins
CEO\Group Policy Creator Owners
The function 'getent' can now be used to get unified lists of both local and PDC users and groups. Try the
following command:
root# getent passwd
You should get a list that looks like your /etc/passwd list followed by the domain users with their new
uids, gids, home directories and default shells.
The same thing can be done for groups with the command
root# getent group</p>
<p>Fix the /etc/rc.d/init.d/samba.server startup files
The winbindd daemon needs to start up after the smbd and nmbd daemons are running. To accomplish this
task, you need to modify the /etc/init.d/samba.server script to add commands to invoke this daemon in the
proper sequence. My /etc/init.d/samba.server file starts up smbd, nmbd, and winbindd from the
/usr/local/samba/bin directory directly.
samba.server
if [ ! -d /usr/bin ]
then                    # /usr not mounted
        exit
fi</p>
<p>killproc() {            # kill the named process(es)
        pid=`/usr/bin/ps -e |
             /usr/bin/grep -w $1 |
             /usr/bin/sed -e 's/^  *//' -e 's/ .*//'`
        [ "$pid" != "" ] &amp;&amp; kill $pid
}</p>
<p># Start/stop processes required for samba server</p>
<p>case "$1" in</p>
<p>'start')
#
# Edit these lines to suit your installation (paths, workgroup, host)
#
echo Starting SMBD
   /usr/local/samba/bin/smbd -D
#-s /usr/local/samba/smb.conf
echo Starting NMBD
   /usr/local/samba/bin/nmbd -D
#-l /usr/local/samba/var/log -s /usr/local/samba/smb.conf
echo Starting Winbind Daemon
/usr/local/samba/bin/winbindd
   ;;
'stop')
   killproc nmbd
   killproc smbd
   killproc winbindd
   ;;
*)
   echo "Usage: /etc/init.d/samba.server { start | stop }"
   ;;
esac</p>
<p>If you restart the smbd, nmbd, and winbindd daemons at this point, you should be able to connect to the
samba server as a domain member just as if you were a local user.</p>
<p>Configure Winbind and PAM
If you have made it this far, you know that winbindd and samba are working together. If you want to use
winbind to provide authentication for other services, keep reading. The pam configuration file need to be altered in this step. (Did you remember to make backups of your original /etc/pam.conf file? If not, do it now.)
You will need a pam module to use winbindd with these other services. This module will be compiled in the ../source/nsswitch directory by default when we used
 ./configure --with-pam option.
root# make nsswitch/pam_winbind.so
from the ../source directory. The pam_winbind.so file should be copied to the location of your other
pam security modules. On my Solaris 8, this was the /usr/lib/security directory.
root# cp ../samba/source/nsswitch/pam_winbind.so /usr/lib/security</p>
<p>The /etc/pam.conf need to be changed. I changed this file so that my Domain users can logon both locally as well as telnet.The following are the changes that I made.You can customize the pam.conf file as per your requirements,but be sure of those changes because in the worst case it will leave your system nearly impossible to boot.</p>
<p>#
#ident	"@(#)pam.conf	1.14	99/09/16 SMI"
#
# Copyright (c) 1996-1999, Sun Microsystems, Inc.
# All Rights Reserved.
#
# PAM configuration
#
# Authentication management
#
login   auth required   /usr/lib/security/pam_winbind.so
login	auth required 	/usr/lib/security/$ISA/pam_unix.so.1 try_first_pass
login	auth required 	/usr/lib/security/$ISA/pam_dial_auth.so.1 try_first_pass
#
rlogin  auth sufficient /usr/lib/security/pam_winbind.so
rlogin  auth sufficient /usr/lib/security/$ISA/pam_rhosts_auth.so.1
rlogin	auth required 	/usr/lib/security/$ISA/pam_unix.so.1 try_first_pass
#
dtlogin auth sufficient /usr/lib/security/pam_winbind.so
dtlogin	auth required 	/usr/lib/security/$ISA/pam_unix.so.1 try_first_pass
#
rsh	auth required	/usr/lib/security/$ISA/pam_rhosts_auth.so.1
other   auth sufficient /usr/lib/security/pam_winbind.so
other	auth required	/usr/lib/security/$ISA/pam_unix.so.1 try_first_pass
#
# Account management
#
login   account sufficient      /usr/lib/security/pam_winbind.so
login	account requisite	/usr/lib/security/$ISA/pam_roles.so.1
login	account required	/usr/lib/security/$ISA/pam_unix.so.1
#
dtlogin account sufficient      /usr/lib/security/pam_winbind.so
dtlogin	account requisite	/usr/lib/security/$ISA/pam_roles.so.1
dtlogin	account required	/usr/lib/security/$ISA/pam_unix.so.1
#
other   account sufficient      /usr/lib/security/pam_winbind.so
other	account requisite	/usr/lib/security/$ISA/pam_roles.so.1
other	account required	/usr/lib/security/$ISA/pam_unix.so.1
#
# Session management
#
other	session required	/usr/lib/security/$ISA/pam_unix.so.1
#
# Password management
#
#other   password sufficient     /usr/lib/security/pam_winbind.so
other	password required	/usr/lib/security/$ISA/pam_unix.so.1
dtsession auth required	/usr/lib/security/$ISA/pam_unix.so.1
#
# Support for Kerberos V5 authentication (uncomment to use Kerberos)
#
#rlogin	auth optional	/usr/lib/security/$ISA/pam_krb5.so.1 try_first_pass
#login	auth optional	/usr/lib/security/$ISA/pam_krb5.so.1 try_first_pass
#dtlogin	auth optional	/usr/lib/security/$ISA/pam_krb5.so.1 try_first_pass
#other	auth optional	/usr/lib/security/$ISA/pam_krb5.so.1 try_first_pass
#dtlogin	account optional /usr/lib/security/$ISA/pam_krb5.so.1
#other	account optional /usr/lib/security/$ISA/pam_krb5.so.1
#other	session optional /usr/lib/security/$ISA/pam_krb5.so.1
#other	password optional /usr/lib/security/$ISA/pam_krb5.so.1 try_first_pass</p>
<p>I also added a try_first_pass line after the winbind.so line to get rid of annoying double
prompts for passwords.</p>
<p>Now restart your Samba &amp; try connecting through your  application that you configured in the pam.conf.</p>
<p>_________________________________________________________
Click below to visit monsterindia.com and review jobs in India or Abroad
http://monsterindia.rediff.com/jobs</p>
<p>--------------------------------------------------------------------------------</p>
<p>Next message: Winbind-Solaris Documentation
Messages sorted by: [ date ] [ thread ] [ subject ] [ author ] </p>
<p>--------------------------------------------------------------------------------
More information about the samba-docs mailing list</p>
