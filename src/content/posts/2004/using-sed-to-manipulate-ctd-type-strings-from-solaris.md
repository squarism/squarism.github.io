---
title: "Using sed to manipulate ctd type strings from Solaris"
description: "This is a very specific example. I found this tricky because regular expressions in sed http://www.student.northpark.edu/pemente/sed/sed1line.txti"
date: 2004-10-22T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

This is a very specific example.  I found this tricky because regular expressions in [sed ](http://www.student.northpark.edu/pemente/sed/sed1line.txt)isn't the same as in [Perl](http://perl.com/).

I wanted to take output from the _format _command in Solaris and just get a list of disks on the system.

I ran _format _and redirected the output to a file called disks.txt

-- file: disks.txt --
```text
       0. c0t0d0
          /pci@1f,4000/scsi@3/sd@0,0
       1. c0t1d0
          /pci@1f,4000/scsi@3/sd@1,0
       2. c1t32d0
          /pci@1f,4000/SUNW,qlc@2/fp@0,0/ssd@w21000004cf8ab02c,0
       3. c1t33d0
          /pci@1f,4000/SUNW,qlc@2/fp@0,0/ssd@w21000004cfb448ed,0
       4. c1t34d0
          /pci@1f,4000/SUNW,qlc@2/fp@0,0/ssd@w21000004cf70fd3f,0
       5. c1t35d0
          /pci@1f,4000/SUNW,qlc@2/fp@0,0/ssd@w21000004cfa6efc4,0
```

Then I wanted just the 'ctd' names of these disks (ie: c1t35d0 being the last one).

-- magical sed trick --
```bash
cat disks.txt | sed -n 's/\(.*\)\(c[0-9]*t[0-9]*d[0-9]*\)\(.*\)/\2/p'
```

This should output:
```text
c0t0d0
c0t1d0
c1t32d0
c1t33d0
c1t34d0
c1t35d0
```

The one thing I can't figure out is how to run _format_  in a non-interactive way for scripting.  It seems you have to resort to using the path_to_inst file.  I did something like this in my humble project [easylun](http://squarism.com/projects/easylun.html).
