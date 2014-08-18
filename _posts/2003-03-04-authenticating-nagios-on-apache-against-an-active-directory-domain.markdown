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
<p>
In a world of multiple systems, a person wants to avoid unnecessary logins.  I ran into the problem of setting up a web application where I didn't want to create an new set of usernames and passwords for people.  A single sign on (SSO) environment was not available, so I investigated authenticating Apache against an Active Directory domain.
</p></p>
<h4>Introduction</h4>
First off, I am using redhat 7.3.  I'm sure that this will work on other Unices.  I just haven't tested it yet.  Here's what I did to get everyong logging into Nagios.  NOTE: Details (passwords etc) are fictional.</p>
<h4>Setup and Requirements</h4></p>
<ol>
<li>
First, I have my user group "Admins" in an organizational unit called "Org_Unit".  I want a member of "Admins" to be able to log into the web page with their AD password.
</li></p>
<li>
I created an account called "ldapperson" with the password of "password" in the Org Unit "Users".  This is required to authenticate.
</li></p>
<li>
The domain controller's machine name is domaincontroller.
</li></p>
<li>
My domain is called domain.com
</li></p>
<li>
Obviously, I had <a href="http://www.nagios.org/">Nagios</a> already running.
</li>
</ol></p>
<h3>The Install</h3></p>
<p>
I downloaded <a href="http://www.rudedog.org/auth_ldap/">Auth_LDAP</a>.  Followed the instructions on their site and realized that I needed apxs.  This is very typical I've found of default redhat installs.  Eventually, you need the apache sources to add modules etc.  So I did a rpm -e apache to remove apache (note: I had to remove other rpm packages too, just keep "rpm -e" on the package names). I download apache 1.3.27 and installed under /usr/local/apache just like the apache docs say.
</p></p>
<p>
I had Nagios already running under /usr/local/nagios, so I created a new file /usr/local/nagios/sbin/.htaccess with the following:
</p></p>
<pre>
AuthName "Nagios Access"
AuthType Basic</p>
<p>AuthLDAPBindDN "CN=ldapperson,OU=Users,DC=domain,DC=com"
AuthLDAPBindPassword "password"</p>
<p>#the following two lines need to be on one line, split for readability
#remove these comments
AuthLDAPURL ldap://domaincontroller.domain.com/dc=domain,dc=com?
sAMAccountName?sub?(&amp;(objectClass=*) (memberOf=CN=Admins,OU=Org_Unit,DC=domain,DC=com))</p>
<p>require valid-user
</pre></p>
