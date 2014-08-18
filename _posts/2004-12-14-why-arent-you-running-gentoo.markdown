---
layout: post
status: publish
published: true
title: Why aren't you running gentoo?
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
excerpt: ! 'emerge world updates every package you have to the latest version that''s
  available via source.  Read on for a screendump of tastiness.

'
wordpress_id: 57
wordpress_url: http://squarism.com/2004/12/14/why-arent-you-running-gentoo/
date: !binary |-
  MjAwNC0xMi0xNCAxOTozMDoyMiAtMDUwMA==
date_gmt: !binary |-
  MjAwNC0xMi0xNSAwMDozMDoyMiAtMDUwMA==
categories:
- Unix
tags: []
comments: []
---
<p>emerge world updates every package you have to the latest version that's available via source.  Read on for a screendump of tastiness.
<a id="more"></a><a id="more-57"></a>
<code>
root@gentoobox opt # emerge -pv world</p>
<p>These are the packages that I would merge, in order:</p>
<p>Calculating world dependencies ...done!
[ebuild  N    ] sys-apps/man-pages-1.70  1,589 kB
[ebuild     U ] sys-libs/zlib-1.2.1-r3 [1.1.4-r2] -build -debug 277 kB
[ebuild     U ] sys-apps/grep-2.5.1-r6 [2.5.1-r1] -build -debug +nls -pcre -static (-uclibc) 0 kB
[ebuild     U ] x11-misc/xscreensaver-4.16 [4.14-r2] +gnome +gtk +gtk2 -icc +jpeg +kde -kerberos -krb4 +nls -offensive +opengl +pam -xinerama 4,112 kB
[ebuild     U ] dev-util/strace-4.5.7 [4.5.1] -debug -static 405 kB
[ebuild  N    ] app-shells/sash-3.7  -debug +readline 49 kB
[ebuild     U ] sys-apps/texinfo-4.7-r1 [4.5] -build -debug +nls -static 1,385 kB
[ebuild     U ] dev-db/mysql-4.0.22 [4.0.18-r1] +berkdb -debug -innodb +perl +readline (-selinux) +ssl -static +tcpd 14,058 kB
[ebuild     U ] media-gfx/bootsplash-0.6.1-r4 [0.6-r14] 686 kB
[ebuild  N    ] media-libs/gd-2.0.32  +X +jpeg +png +truetype 573 kB
[ebuild     U ] net-analyzer/ntop-3.0 [2.2c] +readline +ssl +tcpd 2,920 kB
[ebuild     U ] net-ftp/proftpd-1.2.10-r1 [1.2.9-r2] -debug -hardened +ipv6* -ldap +mysql +pam -postgres (-selinux) -shaper -softquota +ssl +tcpd 906 kB
[ebuild     U ] sys-libs/db-4.1.25_p1-r4 [4.1.25_p1-r3] -doc +java* +tcltk* (-uclibc) 0 kB
[ebuild     U ] sys-apps/man-1.5m-r2 [1.5l-r6] -debug +nls 222 kB
[ebuild     U ] sys-devel/autoconf-2.59-r5 [2.58-r1] 903 kB
[ebuild     U ] net-www/apache-2.0.52-r1 [2.0.49-r1] +berkdb -debug -doc +gdbm +ipv6* -ldap +ssl -static -threads 6,779 kB
[ebuild     U ] sys-apps/procps-3.2.3-r1 [3.1.15] -debug 264 kB
[ebuild     U ] app-editors/vim-core-6.3-r3 [6.2-r7] -acl -debug -livecd +ncurses +nls (-selinux) 6,862 kB
[ebuild     U ] app-editors/vim-6.3-r2 [6.2-r8] -acl -cscope -debug +gpm -minimal +ncurses +nls +perl +python -ruby (-selinux) -vim-with-x 0 kB
[ebuild     U ] mail-client/mutt-1.5.6-r4 [1.5.6] -cjk +crypt -debug -imap* -mbox +nls -nntp +slang +ssl -vanilla 38 kB
[ebuild     U ] sys-devel/make-3.80-r1 [3.80] -build -debug +nls -static (-uclibc) 899 kB
[ebuild     U ] app-arch/gzip-1.3.5-r3 [1.3.3-r2] -build -debug +nls -pic -static 332 kB
[ebuild     U ] net-misc/tightvnc-1.3_alpha5 [1.2.9-r1] +java +tcpd 1,721 kB
[ebuild     U ] sys-fs/raidtools-1.00.3-r2 [1.00.3-r1] -build -debug 0 kB
[ebuild  N    ] net-misc/openssh-3.8.1_p1-r1  -X509 -chroot -debug +ipv6 -kerberos -ldap +pam (-selinux) -skey -smartcard -static +tcpd (-uclibc) 798 kB
[ebuild     U ] sys-devel/gcc-config-1.3.6-r4 [1.3.4] 0 kB
[ebuild     U ] sys-devel/gcc-3.3.4-r1 [3.3.2-r5] +X -bootstrap -build -debug +fortran* -gcj* -hardened -multilib +nls -objc -pic -static (-uclibc) 23,269 kB
[ebuild  N    ] sys-devel/bin86-0.16.13  143 kB
[ebuild     U ] net-mail/courier-imap-3.0.8 [3.0.2-r1] +berkdb -debug +fam* +gdbm +ipv6* -ldap +mysql +nls +pam -postgres (-selinux) 1,673 kB
[ebuild  NS   ] sys-devel/libtool-1.5.2-r7  (-uclibc) 2,590 kB
[ebuild     U ] x11-base/xfree-4.3.0-r8 [4.3.0-r5] -3dfx -3dnow -bindist -cjk -debug -doc +ipv6* -mmx +nls +pam -sdk -sse -static +truetype +xml2 520 kB
[ebuild     U ] sys-libs/cracklib-2.7-r10 [2.7-r8] -debug +pam (-uclibc) 0 kB
[ebuild  N    ] app-arch/ncompress-4.2.4-r1  -build 7 kB
[ebuild  N    ] app-arch/tar-1.14  -build -debug +nls -static 1,052 kB
[ebuild     U ] sys-apps/sed-4.0.9 [4.0.7] -bootstrap -build -debug +nls -static 751 kB
[ebuild     U ] sys-apps/xinetd-2.3.13 [2.3.12] +tcpd 290 kB
[ebuild  N    ] sys-apps/psmisc-21.4  +nls (-selinux) 375 kB
[ebuild     U ] dev-util/cvs-1.11.17 [1.11.15] -doc -emacs 2,288 kB
[ebuild     U ] net-analyzer/nmap-3.55 [3.50-r1] +gnome +gtk 1,298 kB
[ebuild     U ] net-fs/nfs-utils-1.0.6-r6 [1.0.6] +tcpd 0 kB
[ebuild     U ] net-misc/whois-4.6.13-r1 [4.6.6-r2] +nls 49 kB
[ebuild  NS   ] dev-php/mod_php-4.3.9  +X +apache2 +berkdb +crypt -curl -debug -doc -fdftk -firebird -flash -freetds -gd -gd-external +gdbm -gmp -hardenedphp -imap -informix +ipv6 +java +jpeg -kerberos -ldap -mcal -memlimit -mssql +mysql +nls -oci8 -odbc +pam +pdflib +png -postgres +qt -snmp +spell +ssl +tiff +truetype +xml2 -yaz 3,908 kB
[ebuild     U ] dev-php/php-4.3.9 [4.3.6] +X +berkdb +crypt -curl -debug -doc -fdftk -firebird -flash -freetds -gd -gd-external +gdbm -gmp -hardenedphp -imap -informix +ipv6* +java* +jpeg -kerberos -ldap -mcal -memlimit -mssql +mysql +ncurses +nls -oci8 -odbc +pam +pdflib +png -postgres +qt +readline -snmp +spell +ssl +tiff* +truetype +xml2 -yaz 0 kB
[ebuild  N    ] sys-apps/less-382-r2  258 kB
[ebuild     U ] games-misc/wtf-20040124 [20021005] 7 kB
[ebuild     U ] sys-apps/baselayout-1.9.4-r6 [1.8.12] -bootstrap -build -debug -livecd (-selinux) -static (-uclibc) 108 kB
[ebuild     U ] net-misc/icecast-2.0.1-r1 [2.0.1] -curl 0 kB
[ebuild  N    ] sys-apps/kbd-1.12-r2  +nls 864 kB
[ebuild  N    ] sys-apps/findutils-4.1.20-r1  -afs -build -debug +nls (-selinux) -static 0 kB
[ebuild  N    ] net-www/webapp-config-1.10-r11  52 kB
[ebuild  NS   ] www-apps/horde-imp-3.2.5  -vhosts 1,535 kB
[ebuild     U ] sys-devel/binutils-2.15.90.0.1.1-r3 [2.14.90.0.7-r4] -bootstrap -build -debug -multitarget +nls 10,874 kB
[ebuild     U ] sys-libs/glibc-2.3.4.20040808-r1 [2.3.2-r9] -build -debug -erandom -hardened -multilib +nls -nptl -pic -userlocales 15,372 kB
[ebuild  N    ] sys-libs/pwdb-0.62  -debug (-selinux) 0 kB
[ebuild     U ] net-www/elinks-0.9.2 [0.9.1] +X +gpm -guile +ipv6 -lua +ssl +zlib 1,849 kB
[ebuild     U ] sys-libs/readline-4.3-r5 [4.3-r4] 6 kB
[ebuild     U ] sys-apps/module-init-tools-3.0-r2 [3.0] -debug -no-old-linux 229 kB
[ebuild     U ] sys-apps/file-4.12 [4.09] -build -debug +python 404 kB
[ebuild     U ] mail-mta/postfix-2.1.5-r1 [2.0.19] +ipv6* -ldap -mailwrapper -mbox +mysql +pam -postgres -sasl +ssl -vda 2,452 kB
[ebuild     U ] net-fs/samba-3.0.8 [3.0.2a-r2] -acl +cups -debug -doc -kerberos -ldap -libclamav +mysql -oav +pam -postgres +python -quotas +readline (-selinux) -winbind +xml* +xml2 14,747 kB
[ebuild     U ] sys-devel/automake-1.8.5-r1 [1.8.3] (-uclibc) 647 kB
[ebuild     U ] sys-kernel/genkernel-3.1.0c [3.1.0a] -bootsplash 2,506 kB
[ebuild  N    ] net-misc/iputils-021109-r3  -debug +ipv6 -static (-uclibc) 418 kB
[ebuild     U ] sys-apps/shadow-4.0.5-r2 [4.0.3-r9] -debug +nls +pam (-selinux) -skey 988 kB
[ebuild     U ] sys-apps/groff-1.19.1-r2 [1.18.1-r4] +X -debug 2,567 kB
[ebuild  N    ] sys-apps/diffutils-2.8.4-r4  -debug +nls -static 0 kB
[ebuild     U ] sys-devel/gettext-0.12.1-r2 [0.12.1] -bootstrap -emacs +nls 0 kB
[ebuild     U ] sys-apps/ed-0.2-r4 [0.2-r3] 0 kB
[ebuild     U ] dev-lang/python-2.3.4 [2.3.3] +X +berkdb -bootstrap -build -debug -doc +gdbm +ipv6* +ncurses +readline +ssl +tcltk* -ucs2 7,020 kB
[ebuild     U ] app-arch/rar-3.3.0 [3.2.0] 659 kB
[ebuild  N    ] sys-apps/net-tools-1.60-r9  -build -debug +nls -static (-uclibc) 0 kB
[ebuild     U ] app-admin/sudo-1.6.7_p5-r2 [1.6.7_p5] +pam -skey 0 kB
[ebuild     UD] net-misc/rdate-0.990821-r2 [990821-r1] -debug +ipv6 0 kB
[ebuild  N    ] media-sound/xmms-1.2.10-r5  -3dnow +alsa -cjk -debug -directfb +esd +ipv6 +mikmod -mmx +nls +oggvorbis +opengl +oss +xml 191 kB
[ebuild     U ] net-irc/bitchx-1.1-r1 [1.1] -cdrom -cjk -debug +esd* +gnome* +gtk* +ipv6* +ncurses +ssl +xmms* 0 kB
[ebuild     U ] media-gfx/imagemagick-6.1.3.4 [5.5.7.15] +X +cups -debug -fpx -graphviz -jbig +jpeg -lcms +mpeg +perl +png +tiff* +truetype -wmf +xml2 4,457 kB
[ebuild     U ] net-misc/dhcp-3.0.1 [3.0_p2-r6] -debug (-selinux) -static 828 kB
[ebuild     U ] app-arch/unrar-3.4.2 [3.3.6] 117 kB
[ebuild     U ] sys-libs/ncurses-5.4-r5 [5.4-r1] -bootstrap -build -debug -doc -nocxx (-uclibc) -unicode 0 kB
[ebuild  N    ] net-misc/rsync-2.6.0-r3  -acl -build -debug -static 0 kB
[ebuild     U ] games-roguelike/nethack-3.4.3-r1 [3.4.3] +X* -debug +gnome* +qt 0 kB
[ebuild     U ] sys-apps/coreutils-5.2.1 [5.0.91-r4] -acl -build -debug +nls (-selinux) -static (-uclibc) 4,255 kB
[ebuild     U ] sys-fs/e2fsprogs-1.35-r1 [1.34] -debug -diet +nls -static 3,078 kB
[ebuild  N    ] sys-apps/hdparm-5.7-r1  37 kB
[ebuild  N    ] sys-fs/devfsd-1.3.25-r8  -debug (-uclibc) 0 kB
[ebuild     U ] sys-devel/m4-1.4.1 [1.4-r1] +nls 335 kB
[ebuild     U ] sys-devel/libperl-5.8.5 [5.8.2] +berkdb -debug +gdbm -ithreads (-uclibc) 11,651 kB
[ebuild     U ] sys-libs/gdbm-1.8.3-r1 [1.8.0-r5] +berkdb -debug 223 kB
[ebuild     U ] dev-lang/perl-5.8.5-r2 [5.8.2-r1] +berkdb -debug -doc +gdbm -ithreads -perlsuid (-uclibc) 0 kB
[ebuild     U ] app-portage/gentoolkit-0.2.0 [0.2.0_pre8] 60 kB
[ebuild     U ] app-misc/screen-4.0.2 [4.0.1-r2] -debug -nethack +pam (-uclibc) 820 kB </p>
<p>Total size of downloads: 173,636 kB
</code></p>
