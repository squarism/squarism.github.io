---
layout: post
status: publish
published: true
title: Authenticating Nagios on Apache against an Active Directory domain
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 15
wordpress_url: http://squarism.com/2003/03/04/authenticating-nagios-on-apache-against-an-active-dire
date: !binary |-
  MjAwMy0wMy0wNCAxNjowNTozMSAtMDUwMA==
date_gmt: !binary |-
  MjAwMy0wMy0wNCAyMTowNTozMSAtMDUwMA==
categories:
- Unix
tags: []
comments: []
---
In a world of multiple systems, a person wants to avoid unnecessary logins.  I ran into the problem of setting up a web application where I didn't want to create an new set of usernames and passwords for people.  A single sign on (SSO) environment was not available, so I investigated authenticating Apache against an Active Directory domain.



#### Introduction

First off, I am using redhat 7.3.  I'm sure that this will work on other Unices.  I just haven't tested it yet.  Here's what I did to get everyong logging into Nagios.  NOTE: Details (passwords etc) are fictional.

#### Setup and Requirements


1.  First, I have my user group "Admins" in an organizational unit called "Org_Unit".  I want a member of "Admins" to be able to log into the web page with their AD password.

2.  I created an account called "ldapperson" with the password of "password" in the Org Unit "Users".  This is required to authenticate.

3.  The domain controller's machine name is domaincontroller.

4.  My domain is called domain.com

5.  Obviously, I had [Nagios](http://www.nagios.org/) already running.

### The Install


I downloaded [Auth_LDAP](http://www.rudedog.org/auth_ldap/).  Followed the instructions on their site and realized that I needed apxs.  This is very typical I've found of default redhat installs.  Eventually, you need the apache sources to add modules etc.  So I did a rpm -e apache to remove apache (note: I had to remove other rpm packages too, just keep "rpm -e" on the package names). I download apache 1.3.27 and installed under /usr/local/apache just like the apache docs say.



I had Nagios already running under /usr/local/nagios, so I created a new file /usr/local/nagios/sbin/.htaccess with the following:


<pre>
AuthName "Nagios Access"
AuthType Basic

AuthLDAPBindDN "CN=ldapperson,OU=Users,DC=domain,DC=com"
AuthLDAPBindPassword "password"

#the following two lines need to be on one line, split for readability
#remove these comments
AuthLDAPURL ldap://domaincontroller.domain.com/dc=domain,dc=com?
sAMAccountName?sub?(&amp;(objectClass=*) (memberOf=CN=Admins,OU=Org_Unit,DC=domain,DC=com))

require valid-user
</pre>