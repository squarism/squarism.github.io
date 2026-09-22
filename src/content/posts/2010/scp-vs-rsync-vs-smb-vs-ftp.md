---
title: "SCP vs RSync vs SMB vs FTP"
description: "Update: as many have commented, my testing with /dev/zero might be skewing the results. I'll be adding a random DVD iso test soon. I have a newbor"
date: 2010-02-11T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

**Update:** as many have commented, my testing with /dev/zero might be skewing the results.  I'll be adding a random DVD iso test soon.  I have a newborn so give me a sec.  I'll even add the NFS test.  :)

[@fearthepenguin](http://twitter.com/fearthepenguin) made an rsync comment that made me curious.  He said that rsync in cygwin is faster than native SMB in Windows.  Ok I haven't done this test in a while, let's get a reminder about how fat SMB is.

### Test Setup

SOHO gigabit switch.  Ubuntu 9.10 and octo-core 2008 Mac Pro running 10.6.  Both pretty fast boxes.  Regular SATA drives in each, not very fast I/O.  Whatever, network should be the bottleneck.

Get my test file generated.
```bash
$ dd if=/dev/zero of=1gb_file.zeros bs=1G count=1
1073741824 bytes (1.1 GB) copied, 133.577 s, 8.0 MB/s
```

Ignore that 8.0 MB/s.  You can do a blocksize trick to make it output a file faster, I just didn't feel like looking up the switches.  Now you can see Mr. 1GB Zero File in all it's empty and big glory.

```bash
$ ls -lh
total 1.2G
-rw-r--r--  1 dude herd 1.0G 2010-02-11 12:29 1gb_file.zeros
```

### The Tests

**RSync**
Copy from ubuntu box to Mac Pro:

```bash
$ time rsync -t /tmp/1gb_file.zeros dude@mac:~/tmp
real  0m17.694s
user  0m11.577s
sys 0m3.056s
```

**SMB**
Mount Mac share from Ubuntu box.  Copy same file from ubuntu box to Mac Pro over SMB mount.  I never do this.  It's stupid, slow, strips permissions and requires a mount.  In the name of science!

```text
# time cp /tmp/1gb_file.zeros /mnt/tmp
real  0m32.649s
user  0m0.008s
sys 0m0.568s
```

**FTP**
Ok let's goddamn turn on OSX FTP and test that too.  FTP is stupid.

```text
The remote file "1gb_file.zeros" already exists.
  Local:    1073741824 bytes, dated Thu 11 Feb 2010 12:29:06 PM EST.
  (Files are identical, skipped)
```

Hey at least FTP is showing some smarts about it.  Or maybe ncftp just rules.  I dunno.  Deleted it and got FTP time.

```bash
$ time ncftpput -u dude -p whoa mac /dest/tmp /tmp/1gb_file.zeros
/tmp/1gb_file.zeros:                          1.00 GB   39.09 MB/s
real  0m26.507s
user  0m0.036s
sys 0m0.828s
```

**SCP**
Is SCP any different than rsync?

```bash
$ time scp /tmp/1gb_file.zeros dude@mac:~/tmp
1gb_file.zeros                                100% 1024MB  42.7MB/s   00:24
real  0m24.303s
user  0m9.641s
sys 0m2.212s
```

Weird.  It is.  I wonder if rsync has compression flags whereas ssh does not without the -C magic switches.  You can get SCP to be pretty quick with blowfish or arcfour:

```bash
$ time scp -c arcfour /tmp/1gb_file.zeros dude@mac:~/tmp
1gb_file.zeros                                100% 1024MB  46.6MB/s   00:22
real  0m21.653s
user  0m5.452s
sys 0m2.032s
```

### Conclusion

|        | rsync  | SMB    | FTP    | SCP    | SCP arcfour |
| -----  | -----  | ---    | ---    | ---    | ----------- |
| time   | 17.694 | 32.649 | 26.507 | 24.303 | 21.653      |
| MB/sec | 57.87  | 31.36  | 38.63  | 42.13  | 47.29       |

So RSync is pretty quick and SMB is pretty slow.  @fearthepenguin was right.
