---
layout: post
status: publish
published: true
title: SCP vs RSync vs SMB vs FTP
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 327
wordpress_url: http://squarism.com/?p=327
date: !binary |-
  MjAxMC0wMi0xMSAyMzo1NTowMCAtMDUwMA==
date_gmt: !binary |-
  MjAxMC0wMi0xMiAwNDo1NTowMCAtMDUwMA==
categories:
- Blog
tags: []
comments:
- id: 2348
  author: Endless Nameless
  author_email: cassio@cbpf.br
  author_url: ''
  date: !binary |-
    MjAxMC0xMC0xOSAwNDoxMToxOCAtMDQwMA==
  date_gmt: !binary |-
    MjAxMC0xMC0xOSAwOToxMToxOCAtMDQwMA==
  content: Very good article. I sometimes compare rsync and scp. The time varies to
    me, depending on file. If it is text files, rsync is faster. If it is images or
    movies that I want to copy, scp is the winner. But is first time that I see the
    arcfour flag. I will check it. Thanks.
- id: 3241
  author: Endless Nameless
  author_email: freemorethanone@hotmail.com
  author_url: ''
  date: !binary |-
    MjAxMC0xMi0yOCAwMTowOTo1NSAtMDUwMA==
  date_gmt: !binary |-
    MjAxMC0xMi0yOCAwNjowOTo1NSAtMDUwMA==
  content: I think rsync uses more time when on some files when it is trying to figure
    out if to use delta encoding or not. Which is the main pro over scp.
- id: 6784
  author: James
  author_email: ingo@invalid.tld
  author_url: ''
  date: !binary |-
    MjAxMS0xMi0wNiAxMjowODozMSAtMDUwMA==
  date_gmt: !binary |-
    MjAxMS0xMi0wNiAxNzowODozMSAtMDUwMA==
  content: ! "Your hint with the -c arcfour saved my day, i was struggling to copy
    a 75GB file (which was already a LUKS-encrypted container) within my network.
    estimated time was something around 80 Minutes. I could not believe that transfer
    time was reduced to 15 Minutes due to the -c arcfour switch!\r\n\r\nThanks for
    sharing this, you are my hero!"
- id: 6820
  author: anonymous_coward
  author_email: anon@gmail.com
  author_url: ''
  date: !binary |-
    MjAxMi0wMS0wNyAwMzowMzo0NCAtMDUwMA==
  date_gmt: !binary |-
    MjAxMi0wMS0wNyAwODowMzo0NCAtMDUwMA==
  content: ! "There is no way SCP beat FTP!!\r\n\r\nSomething has to be wrong with
    your testing methods.\r\n\r\n\r\n\r\n\r\nFTP can saturate the wire easily, and
    without the additional burden of compression or encryption that comes with SCP/SFTP.\r\n\r\n\r\n\r\nrsync
    has even more computational complexities and burdens than even SCP as it is hashing
    the whole files, and performing a rolling-hash of the file contents, deallign
    with the file on two sides, etc.\r\n\r\n\r\nAlso I noticed you did not compare
    NFS.\r\n\r\n\r\nI would suggest you create a file of random data instead of all
    zero. A good idea would be to use a DVD iso image you can download online, and
    other people can reproduce the results. You might also like to purge your filesystem
    buffer cache before or after each successive test run to ensure the file is not
    sitting in memory instead of on the disk."
- id: 6831
  author: M
  author_email: x@x.com
  author_url: ''
  date: !binary |-
    MjAxMi0wMS0zMCAxNDo1MjoyNiAtMDUwMA==
  date_gmt: !binary |-
    MjAxMi0wMS0zMCAxOTo1MjoyNiAtMDUwMA==
  content: ! "Test results using a test file created from /dev/zero will be
    completely bogus due to the almost perfect 100% compression ratio.  (This is why
    SCP beat FTP.)\r\n   Try it again with a file created from /dev/random
    and the results will be completely different, (and far more applicable to the
    real world)."
- id: 6913
  author: Tej
  author_email: tejvan@live.com
  author_url: ''
  date: !binary |-
    MjAxMi0wMy0yOCAwNTo0NDo0NSAtMDQwMA==
  date_gmt: !binary |-
    MjAxMi0wMy0yOCAxMDo0NDo0NSAtMDQwMA==
  content: ! "I did similar tests with an MS-office CD tarball. \r\n\r\nResults on
    my network (fastest first):\r\n\r\n1. FTP\r\n2. SMB\r\n3. rsync -avz\r\n4  scp
    -Cv"
- id: 6914
  author: Tej
  author_email: tejvan@live.com
  author_url: ''
  date: !binary |-
    MjAxMi0wMy0yOCAwNTo1Mzo0OCAtMDQwMA==
  date_gmt: !binary |-
    MjAxMi0wMy0yOCAxMDo1Mzo0OCAtMDQwMA==
  content: BTW, 'scp -Cv -c arcfour' edged out SMB but was still slower than simple
    FTP.
---
**Update:** as many have commented, my testing with /dev/zero might be skewing the results.  I'll be adding a random DVD iso test soon.  I have a newborn so give me a sec.  I'll even add the NFS test.  :)

[@fearthepenguin](http://twitter.com/fearthepenguin) made an rsync comment that made me curious.  He said that rsync in cygwin is faster than native SMB in Windows.  Ok I haven't done this test in a while, let's get a reminder about how fat SMB is.

### Test Setup

SOHO gigabit switch.  Ubuntu 9.10 and octo-core 2008 Mac Pro running 10.6.  Both pretty fast boxes.  Regular SATA drives in each, not very fast I/O.  Whatever, network should be the bottleneck.

Get my test file generated.
`$ dd if=/dev/zero of=1gb_file.zeros bs=1G count=1
1073741824 bytes (1.1 GB) copied, 133.577 s, 8.0 MB/s`

Ignore that 8.0 MB/s.  You can do a blocksize trick to make it output a file faster, I just didn't feel like looking up the switches.  Now you can see Mr. 1GB Zero File in all it's empty and big glory.
`
$ ls -lh
total 1.2G
-rw-r--r--  1 dude herd 1.0G 2010-02-11 12:29 1gb_file.zeros`

### The Tests

**RSync**
Copy from ubuntu box to Mac Pro:
`$ time rsync -t /tmp/1gb_file.zeros dude@mac:~/tmp
real  0m17.694s
user  0m11.577s
sys 0m3.056s
`

**SMB**
Mount Mac share from Ubuntu box.  Copy same file from ubuntu box to Mac Pro over SMB mount.  I never do this.  It's stupid, slow, strips permissions and requires a mount.  In the name of science!
`# time cp /tmp/1gb_file.zeros /mnt/tmp
real  0m32.649s
user  0m0.008s
sys 0m0.568s
`

**FTP**
Ok let's goddamn turn on OSX FTP and test that too.  FTP is stupid.
`The remote file "1gb_file.zeros" already exists.
  Local:    1073741824 bytes, dated Thu 11 Feb 2010 12:29:06 PM EST.
  (Files are identical, skipped)
`

Hey at least FTP is showing some smarts about it.  Or maybe ncftp just rules.  I dunno.  Deleted it and got FTP time.

`$ time ncftpput -u dude -p whoa mac /dest/tmp /tmp/1gb_file.zeros
/tmp/1gb_file.zeros:                          1.00 GB   39.09 MB/s
real  0m26.507s
user  0m0.036s
sys 0m0.828s
`

**SCP**
Is SCP any different than rsync?
`$ time scp /tmp/1gb_file.zeros dude@mac:~/tmp
1gb_file.zeros                                100% 1024MB  42.7MB/s   00:24
real  0m24.303s
user  0m9.641s
sys 0m2.212s
`

Weird.  It is.  I wonder if rsync has compression flags whereas ssh does not without the -C magic switches.  You can get SCP to be pretty quick with blowfish or arcfour:

`$ time scp -c arcfour /tmp/1gb_file.zeros dude@mac:~/tmp
1gb_file.zeros                                100% 1024MB  46.6MB/s   00:22
real  0m21.653s
user  0m5.452s
sys 0m2.032s`

### Conclusion
</p>
<table width=75%>
<th></th>
<th>rsync</th>
<th>SMB</th>
<th>FTP</th>
<th>SCP</th>
<th>SCP arcfour</th></p>
<tr>
<td>time</td>
<td>17.694</td>
<td>32.649</td>
<td>26.507</td>
<td>24.303</td>
<td>21.653</td>
</tr></p>
<tr>
<td>MB/sec</td>
<td>57.87</td>
<td>31.36</td>
<td>38.63</td>
<td>42.13</td>
<td>47.29</td>
</tr></p>

</table>

So RSync is pretty quick and SMB is pretty slow.  @fearthepenguin was right.