---
layout: post
status: publish
published: true
title: Rails behind Enterprise SSO
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 680
wordpress_url: http://squarism.com/?p=680
date: !binary |-
  MjAxMC0xMS0wNiAyMDoxMjoyNyAtMDQwMA==
date_gmt: !binary |-
  MjAxMC0xMS0wNyAwMToxMjoyNyAtMDUwMA==
categories:
- Systems
- Rails
tags: []
comments:
- id: 3582
  author: Gareth Hunt
  author_email: garethrhunt@hotmail.com
  author_url: http://www.garethhunt.com/
  date: !binary |-
    MjAxMS0wMS0wNCAxOTo1Njo0MyAtMDUwMA==
  date_gmt: !binary |-
    MjAxMS0wMS0wNSAwMDo1Njo0MyAtMDUwMA==
  content: ! "Modify Headers will run in the background.  Go to Options (Configuration
    in version 0.6.6 and below) and check the \"Always On\" option.\r\n\r\nModify
    Headers will now run in the background while the window is closed."
---
<p>This is a quick write-up without a lot of detail.  We hacked together a quick rails app to do provisioning in the style of OIM behind an OAM SSO webgate.  The complete guide and detail would be tens of pages so I'll just give a quick overview for the strategy.</p>
<h3>The Goal</h3></p>
<ul>
<li>Ldap authentication</li>
<li>No db</li>
<li>Sso protected</li>
<li>Weblogic deployment</li>
</ul></p>
<h3>Develop app steps and failures</h3><p>
We used activeldap for the LDAP pieces and defined our user model to narrowly search for a particular objectclass and attributes.  Tried to use Authlogic.  Fail.  Acts as authenticated fail.  Devise fail.  Ended up using filters and activeldap.  Integrating the gems and activeldap was actually kind of hard.  A lot of the security gems assume you've got activerecord users and depend a lot on the validation helpers etc.  So some of the authN gems didn't work for us.  We also had to hack a bit on the activeldap validations.  Password policy was non-trivial.  I just rolled my own like so:</p>
<p><code>
def validate_password(password)
  // initialize a password score
  // call password rule methods like:
  // check_special_characters
  // check_length
  // check_uppercase
end
</code></p>
<p>The score from each check method is added to a total score.  If the score is greater than zero then your password fails the checks.  Each check, a hash for flash[:error] is used so that a precise error message is possible.  It works ok except the flash error display is for some reason not ordered correctly.</p>
<p>All configuration constants are stored as YML as an app_config.yml file.  For example, the LDAP server, port, password policy rules etc.</p>
<p>For the SSO config, we just detect header as HTTP_REMOTE_USER even though OAM is creating REMOTE_USER.  Quick and easy.  You have to append the "HTTP_" for the name.  It's a naming convention thing that you can't do anything about.  If your OAM header variable is UNICORNS, then you have to use HTTP_UNICORNS.</p>
<p>We used formtastic for the forms.  This was a bit problematic with it trying to detect the activeldap model instead of activerecord.</p>
<h3>Testing while developing</h3><p>
Ok so how do you test integration?  Are you going to SSO enable your dev laptop?  That's way too hard.  You can hardcode the credentials for a while but then eventually you're going to want to test.  I got around this by using a firefox plugin called modify headers. It's pretty straight forward except for the small detail that you have to keep it open while hitting pages. I thought it would run in the background but it doesn't.  Just keep the modify headers firefox plugin open and it'll let you create an auth cookie.  Don't worry, this isn't a security hole.  OAM in production won't let you do this.  It's just used for development.</p>
<h3>Warble</h3><p>
install warbler with gem install warbler
Generate default config warble config
Install jruby-openssl because activeldap requires it
Edit config/warble.rb to include jruby-openssl note that you don't have to have jruby installed or anything.</p>
<p>The rest of the steps are not rails related.  Deploy war to Weblogic as usual.  Set up a Proxy webgate back to Weblogic for /app (you can't protecte Weblogic directly with OAM).  Protect /app with an OAM policy.  If your firefox header test worked then when you turn that off and hit it behind OAM it will work the same. I was able to identify and trust the REMOTE_USER header coming in.</p>
<p>Bam, you've got a rails app working in a big scary enterprise SSO environment.  The best part about all of this was how fast it went.  Compared to JSP/Java EE dev, it was a breeze.  The only big multi-day hangups we had was with activeldap.  Many gems and auth models really expect you do have your user in the DB.  Unfortunately, putting users in the DB creates a silo.  Fine for small shops, not so good if you're using Active Directory, OID, OpenLDAP or Fedora DS (389) for a centralized login.</p>
