---
layout: post
status: published
published: true
title: How to install a specific version of something in Homebrew
date: 2016-01-06
---

{% highlight bash %}
cd /usr/local

# find some sha you want, I want mysql 5.6.26
git log -S'5.6.26' Library/Formula/mysql.rb
git checkout -b mysql-5.6.26 93a54a

brew install mysql
# oh no!  the CDN doesn't have 5.6.26 anymore!
# Homebrew pukes with a 404 error.  :(  :(  :(

# make homebrew's cache folder
mkdir ~/Library/Caches/Homebrew

# google for the tarball (the url doesn't matter as long as you trust it)
wget http://pkgs.fedoraproject.org/repo/pkgs/community-mysql/mysql-5.6.26.tar.gz/733e1817c88c16fb193176e76f5b818f/mysql-5.6.26.tar.gz -o ~/Library/Caches/Homebrew/mysql-5.6.26.tar.gz

brew install mysql
# This installs older versions of dependencies.
# You probably don't want to install old versions just for fun.
# Like, this will install some version of cmake for mysql 5.6.26 but
# idk what happens when you flip back to master and install
# something else that requires cmake.


# You can delete the branch when it's done.
cd /usr/local
git br -d mysql-5.6.26
git checkout master

# I assume you can use a newer version of cmake (or other deps)
# after the binary is built but I don't know.
{% endhighlight %}
