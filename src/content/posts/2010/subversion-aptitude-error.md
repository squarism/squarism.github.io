---
title: "Subversion Aptitude Error"
description: "I used to have an SVN repository up and running. Then my server crashed. Nothing was really important so I never rebuilt it. However my server backup"
date: 2010-02-08T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

I used to have an SVN repository up and running.  Then my server crashed.  Nothing was really important so I never rebuilt it.  However my server backup files referenced the SVN modules in apache.  I suppose during the crazy rebuild time, I restored an old conf file that referenced dav_svn and I disabled the module by deleting the file.

So now I want to get SVN back because Git (while great) lacks a nice GUI.  I'm not converting to SVN.  I'm just going to put stuff in both places for a while and then merge them after playing with Versions.

Anyway, why you are here.  You're getting a `ERROR: Module dav_svn does not exist!` when trying to install subversion with `aptitude install libapache2-svn`?  That's what I was getting.  I strace'd and googled it for a bit and nothing was working.  Eventually I found the original files and put them in their place and that seemed to resolve the package installation however aptitude still thinks the conf files are there even after removing.  So this method will get you past the aptitude install and let you install/uninstall as you like (I tested install/uninstall about fives times).  And then it will remove your existing svn configs.  **So please don't have anything regarding mod_svn that you want to keep.**

I found the originals from [sysinf0.klabs.be](http://sysinf0.klabs.be/etc/apache2/mods-available/dav_svn.load?dist=;arch=).

Create or edit /etc/apache2/mods-available/dav_svn.conf
```text
# dav_svn.conf - Example Subversion/Apache configuration
#
# For details and further options see the Apache user manual and
# the Subversion book.
#
# NOTE: for a setup with multiple vhosts, you will want to do this
# configuration in /etc/apache2/sites-available/*, not here.

# <Location URL> ... </Location>
# URL controls how the repository appears to the outside world.
# In this example clients access the repository as http://hostname/svn/
# Note, a literal /svn should NOT exist in your document root.
#<Location /svn>

  # Uncomment this to enable the repository
  #DAV svn

  # Set this to the path to your repository
  #SVNPath /var/lib/svn
  # Alternatively, use SVNParentPath if you have multiple repositories under
  # under a single directory (/var/lib/svn/repo1, /var/lib/svn/repo2, ...).
  # You need either SVNPath and SVNParentPath, but not both.
  #SVNParentPath /var/lib/svn

  # Access control is done at 3 levels: (1) Apache authentication, via
  # any of several methods.  A "Basic Auth" section is commented out
  # below.  (2) Apache <Limit> and <LimitExcept>, also commented out
  # below.  (3) mod_authz_svn is a svn-specific authorization module
  # which offers fine-grained read/write access control for paths
  # within a repository.  (The first two layers are coarse-grained; you
  # can only enable/disable access to an entire repository.)  Note that
  # mod_authz_svn is noticeably slower than the other two layers, so if
  # you don't need the fine-grained control, don't configure it.

  # Basic Authentication is repository-wide.  It is not secure unless
  # you are using https.  See the 'htpasswd' command to create and
  # manage the password file - and the documentation for the
  # 'auth_basic' and 'authn_file' modules, which you will need for this
  # (enable them with 'a2enmod').
  #AuthType Basic
  #AuthName "Subversion Repository"
  #AuthUserFile /etc/apache2/dav_svn.passwd

  # To enable authorization via mod_authz_svn
  #AuthzSVNAccessFile /etc/apache2/dav_svn.authz

  # The following three lines allow anonymous read, but make
  # committers authenticate themselves.  It requires the 'authz_user'
  # module (enable it with 'a2enmod').
  #<LimitExcept GET PROPFIND OPTIONS REPORT>
    #Require valid-user
  #</LimitExcept>

#</Location>
```

Create or edit /etc/apache2/mods-available/dav_svn.load
```text
# Depends: dav
LoadModule dav_svn_module /usr/lib/apache2/modules/mod_dav_svn.so
LoadModule authz_svn_module /usr/lib/apache2/modules/mod_authz_svn.so
```

After putting those in:
```bash
sudo aptitude remove libapache2-svn
sudo aptitude install libapache2-svn
/etc/init.d/apache2 restart
```

Now when you do:
```bash
sudo aptitude search libapache2-svn
c   libapache2-svn                   - Subversion server modules for Apache
```
You'll see that annoying little 'c' from aptitude.  That means that it's not installed but the config files are still hanging around.  Purge the config files with:
`sudo aptitude purge libapache2-svn`

And you'll see:
```text
aptitude search libapache2-svn
p   libapache2-svn                   - Subversion server modules for Apache
```
