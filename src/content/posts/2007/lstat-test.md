---
title: "lstat test"
description: "Following an interview question that was extremely hard I went to man lstat' and tried to code up a test just based on system documentation. It was n"
date: 2007-04-10T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

Following an interview question that was extremely hard I went to `man lstat` and tried to code up a test just based on system documentation.  It was not entirely successful, however after a tip-off from an online resource I came up with this.

<!-- more -->

_File: lstat.c_

```c
#include <unistd.h>
#include <sys/types.h>
#include <sys/stat.h>
#include <stdio.h>
int main(int c, char** argv) {
        struct stat buf;
        lstat(argv[1],&buf);
        printf("%s is %d bytes\n", argv[1],buf.st_size);

        return 0;
}
```

When compile like this:
`g++ -o lstat lstat.c`

It looks like this where yep.txt is a dummy file.
```bash
user@box ~/c $ ls -l /tmp/yep.txt
ls -l /tmp/yep.txt
-rw-r--r-- 1 user users 17 Apr  9 23:16 /tmp/yep.txt

user@box ~/c $ ./lstat /tmp/yep.txt
/tmp/yep.txt is 17 bytes
```

So all this does is really use stat since yep.txt is a file and not a symbolic link.  This stupid test just prints out the file size which you can see by the real `ls` above.
