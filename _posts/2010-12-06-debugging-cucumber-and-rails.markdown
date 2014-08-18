---
layout: post
status: publish
published: true
title: Debugging Cucumber and Rails
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 796
wordpress_url: http://squarism.com/?p=796
date: !binary |-
  MjAxMC0xMi0wNiAxMzowMzozOCAtMDUwMA==
date_gmt: !binary |-
  MjAxMC0xMi0wNiAxODowMzozOCAtMDUwMA==
categories:
- Blog
tags: []
comments: []
---
<p><img src="/uploads/2010/12/cucumber_green.png" alt="" title="cucumber_green" width="635" height="61" class="aligncenter size-full wp-image-800" />
I was working on my <a href="http://squarism.com/2010/08/27/stream-of-thoughthose-game-store/">game store</a> app and I had some TDD things I wanted to finish up before creating a rails3 branch.  I discuss it kind of randomly in that post linked there.  I had left it to languish because I got stuck and frustrated with cucumber.  My app was working but the tests were failing (false negative).  The biggest problem was trying to understand how to debug a cucumber step.</p>
<p>The first problem is logging.  When cucumber runs webrat as a mock browser, I really expected to see the traffic in the server log (script/server).  But it didn't.  Nothing.  No traffic at all.  The second problem was seeing what the browser sees.  It was reporting back that my login was failing.   The third problem is the problem itself.  It was saying "invalid login".  I am using factorygirl to create mock users on the fly and authlogic for the authentication and so there was a possibility that something was wrong there.</p>
<h2>Logging</h2><p>
<img src="/uploads/2010/12/cucumber_console-249x300.png" alt="" title="cucumber_console" width="249" height="300" class="alignright size-medium wp-image-804" />So let's go through this in order.  First the log problem.  The traffic I was not seeing in the script/server console was kind of confusing.  Cucumber's traffic is actually redirected to log/cucumber.log.  So you can either tail -f that log or use the OSX console app (screenshot) to watch cucumber.log.  Either way, the traffic and any puts or STDOUT text will be there.  It's pretty odd actually.  I don't know how they pull this off.  The dev server (script/server) doesn't even need to be running for the cucumber steps to work.  See below, I stopped the server and ran the tests successfully:</p>
<p><code>box:game_store chris$ script/server
=> Booting WEBrick
=> Rails 2.3.8 application starting on http://0.0.0.0:3000
=> Call with -d to detach
=> Ctrl-C to shutdown server
[2010-12-05 00:21:34] INFO  WEBrick 1.3.1
[2010-12-05 00:21:34] INFO  ruby 1.8.7 (2010-08-16) [i686-darwin10.4.0]
[2010-12-05 00:21:34] INFO  WEBrick::HTTPServer#start: pid=23554 port=3000
^C[2010-12-05 14:38:43] INFO  going to shutdown ...
[2010-12-05 14:38:43] INFO  WEBrick::HTTPServer#start done.
Exiting</p>
<p>box:game_store chris$ cucumber features/user_sessions.feature
Using the default profile...
WARNING: Nokogiri was built against LibXML version 2.7.7, but has dynamically loaded 2.7.3
..........</p>
<p>2 scenarios (2 passed)
10 steps (10 passed)
0m0.508s
</code></p>
<h2>Debugging Webrat</h2><p>
<img src="/uploads/2010/12/cucumber_save_and_open-300x281.png" alt="" title="cucumber_save_and_open" width="300" height="281" class="alignright size-medium wp-image-797" />Next, the "seeing what webrat sees" problem.  The invalid login error was based on detecting text.  In my test app, when you're signed in you see the Logout link.  When you're signed out, you see the Login link.  Webrat was telling me that it couldn't sign in because Logout never appeared.  I had to figure out if it was lying because the app in my dev environment was working fine.  So I needed to see what webrat was seeing when launched from cucumber.</p>
<p>I had hunted down a function called save_and_open_page but it never worked for me.  It's supposed to take a snapshot of the webrat client and open the web page in your browser so you can see what it sees.  It's like debugging with puts.  So if you're stuck on a step, just save_and_open_page and investigate.  Well unfortunately, I had left that option for dead a while ago because it wasn't working.  I had missed a key step:</p>
<p>Install the launchy gem.
<code>gem install launchy</code></p>
<p>Now your default browser should launch with a simple snapshop of the page.  It's just a local file so you won't be able to click on links back to your app (unless you have some awesome hardcoded urls everywhere that would take you back from anywhere).  The idea here is to just look at what the client is seeing on a basic level.  I was getting an invalid login error message so I was looking any evidence related to logins.  You can see in the screenshot to the right that I have a Login link available.  In my app, that means I'm not logged in.  I put the save_and_open_page in the logout feature step of cucumber so this is a good thing.</p>
<p>Ok, so at this point my save_and_open_page was launching two pages.  What?  One was correct but the other one was incorrect.  That is to say, one page was giving me an invalid login and the other one was signing in fine.  So what is going on?</p>
<h2>Factorygirl</h2><p>
A key to my problem was how I was using factorygirl to create mock users and misunderstanding a convention.  First, here is the non-working features/step_definitions/user_session_steps.rb file:</p>
<pre lang="ruby" line="0">require "authlogic/test_case"
require "factory_girl"</p>
<p>Factory.find_definitions</p>
<p>include Authlogic::TestCase</p>
<p>def user
  @user ||= Factory :user
end</p>
<p>def login
  user
  visit path_to("the homepage")
  click_link "Log in"
  fill_in "user_session_login", :with => "john"
  fill_in "user_session_password", :with => "funkypass"
  click_button "Login"
end</p>
<p>def logout
  click_link "Logout"
  #save_and_open_page
  visit path_to("the homepage")
end</p>
<p>Given /^I am a registered user$/ do
  user
end</p>
<p>When /^I login$/ do
  login
end</p>
<p>Given /^I am logged in$/ do
  login
  visit path_to("the homepage")
end</p>
<p>When /^I logout$/ do
  logout
end</pre></p>
<p>The login method is all about clicking the Log in link and filling in the username and password boxes.  Now before you say, "what is john and funkypass?".  I tried many different variations of passwords.  I tried my passwords out of my dev db, obviously this won't work.  I tried foo1/foobar which actually led to my one working and one not case.</p>
<p>So here's what went wrong.  My feature file defines two scenarios for one feature, logging in and logging out:</p>
<pre lang="ruby" line="0">Feature: User Sessions</p>
<p>  So that I can blah, blah, blah
  As a registered user
  I want to log in and log out</p>
<p>  Scenario: log in
    Given I am a registered user
    And I am on the homepage
    When I login
    Then I should see "Login successful!"
    And I should see "Cart"</p>
<p>  Scenario: log out
    Given I am logged in
    And I am on the homepage
    When I logout
    Then I should see "Register"
    And I should see "Log In"
</pre></p>
<p>The "When I login" step fires the login method.  But so does the "Given I am logged in" step.  So there are my two save_and_open_page hits, the reason I see two pages open when debugging.  But why would one work and the other one wouldn't?  I'm not changing anything.</p>
<p>The problem is factorygirl was creating a second user called foo2 for the <em>log out</em> scenario but rolling back the foo1 user that was created for the <em>log in</em> sceneario.  I didn't realize this when I hardcoded <code>fill_in "user_session_login", :with => "foo1"</code> during integration.  So in the log out scenario, foo1 would log in but only foo2 would exist in the DB.</p>
<p>So I changed the login method to look like this:</p>
<pre lang="ruby" line="0">def login
  @user ||= Factory :user
  visit path_to("the homepage")</p>
<p>  click_link "Log in"</p>
<p>  fill_in "user_session_login", :with => @user.login
  fill_in "user_session_password", :with => @user.password</p>
<p>  click_button "Login"
  #save_and_open_page
end
</pre></p>
<p>I really wanted to create a user once (what the ||= is trying to do) but I couldn't figure out how to properly use instance variables in a test step.  So I'll just do it this way for now.  Notice that I'm using the fields on @user so it'll always work.</p>
<h2>LibXML warning with Nokogiri</h2><p>
You may have noticed that I was receiving an warning here:
<code>WARNING: Nokogiri was built against LibXML version 2.7.7, but has dynamically loaded 2.7.3</code>
I'm on OSX and I'm not sure what OSX is using but xml2-config --version shows 2.7.3.  So I'm pretty sure that it's using the shipped OS version.  Ok, no problem.  I'm running homebrew (a macports/fink replacement).  I'll just install 2.7.7:
<code>
$ brew search xml
  blahtexml	  libwbxml	    xml-tooling-c     xmlrpc-c		xmltoman
  gccxml		  libxml2	    xml2rfc	      xmlstarlet
  html-xml-utils	  xml-security-c    xmlformat	      xmlto
$ brew install libxml2
==> Downloading ftp://xmlsoft.org/libxml2/libxml2-2.7.7.tar.gz
######################################################################## 100.0%
==> ./configure --disable-dependency-tracking --prefix=/usr/local/Cellar/libxml2/2.7.7
==> make
==> make install
==> Caveats
...
$ brew info libxml2
libxml2 2.7.7
http://xmlsoft.org
/usr/local/Cellar/libxml2/2.7.7 (293 files, 12M)
http://github.com/mxcl/homebrew/commits/master/Library/Formula/libxml2.rb
</code></p>
<p>Ok so it installed correctly.  Now we need to reinstall nokogiri using the 2.7.7 libs.
<code>
gem install nokogiri -- --with-xml2-lib=/usr/local/Cellar/libxml2/2.7.7/lib --with-xml2-include=/usr/local/Cellar/libxml2/2.7.7/include
</code></p>
<p>Now when we run cucumber, we won't get the error.  But here's the problem.  Brew provides a way to link to the brew version of libxml2 by default with the `brew link libxml2` command but issues a warning about doing this.  The problem with using a path like /usr/local/Cellar/libxml2/2.7.7/lib is eventually brew will update it to 2.7.8 or something and it's hard to say what the consequences will be.  Most likely, some binary will fail with lib errors.</p>
<h2>Wrapping up</h2><p>
Another note is that I was futzing with all of this in a git branch called "tdd", a branch I used to integrate cucumber/rspec and anything else related to testing.  I read some advice somewhere that a good practice is to branch a new feature and then roll it back into master when it's done.</p>
<p>So I was already in the "tdd" branch had already committed everything.  It was time to merge the branches and get rid of the tdd branch:
<code># switch back to master
git checkout master
# merge tdd into master
git merge tdd
# run the tests again for sanity
cucumber features/user_sessions.feature
# ok, passed, we don't need the tdd branch anymore
git branch -d tdd
# view branches
git branch
* master
</code></p>
<p>After the merge, my code is up to date in the master branch and I can create a new branch called "rails3", for example, if I want to play with upgrading the app to rails 3.  Or I could create a branch called refactor if I was going to majorly overhaul code.</p>
