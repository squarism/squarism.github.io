---
layout: post
status: publish
published: true
title: ! 'Stream of thoughthose: Game Store'
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 660
wordpress_url: http://squarism.com/?p=660
date: !binary |-
  MjAxMC0wOC0yNyAyMjoyNDowOCAtMDQwMA==
date_gmt: !binary |-
  MjAxMC0wOC0yOCAwMzoyNDowOCAtMDQwMA==
categories:
- Brainstorm
tags: []
comments: []
---
<p><img src="/uploads/2010/08/game_store_2-264x300.png" alt="" title="game_store_2" width="264" height="300" class="aligncenter size-medium wp-image-663" />
I created a rails app that acts as a harmless baseline app that I can fork and play around with.  <a href="http://railscasts.com/">Railscasts</a> has an example app that I based my theme on.  I call this example app "Game Store".  It's really simple.  It's a video and board game store that has users and a cart.  There's nothing beyond that.  No admin interface, no checkout and nothing else fancy.</p>
<p>Again, another stream of raw consciousness while stuck in traffic, then transcribed from the iPhone.</p>
<blockquote><p>
Ok things to do for the game store app.  Right now I have everything checked into git, I'm pretty sure I branched it for rails3.  I think the master branch is current.  Login and the cart is working.  If I squashed any bugs and I'm in the wrong branch, that would be bad, so I need to check on that.  Maybe merge them back in to the master branch.  So there's some CM things I need to do, baseline it and that should basically be the baselined app.  This should be all I need to work with, I created this app so I'd have a test app with basic functionality that wasn't trying to do anything crazy.  It's just a basic shopping cart app that I can futz with.</p>
<p>So there's two big things I want to do with this app.  One, get LDAP authentication working with Authlogic (which could also spill into doing some kind of special authorization thing or gem).  Right now it's just using database authentication.  Get a fancier version of authentication working, goal #1, which could be it's own branch.</p>
<p>Two, port the whole thing to rails3 and/or ruby 1.9, whatever.  Rails3 would be the first thing.  So those are two big things, which screw with the baseline app (which is working right now).  I would want to branch those two efforts, screw with them, get them working and then merge them back in.  So that way I learn more about git, rails3 and the authlogic stuff.  But there's also kind of a "meta-goal", how am I going to know if these things are working while I'm developing it?   So the third goal (which is sort of a meta-thing), I should have tests.  I know how the game store works right now, I know what defines success.  Basically, a user logs in, using a seeded password for a test user that is part of the fixtures.  There's also fixtures for products of the game store (like Scrabble, Pacman, whatever).  So I know that when I add a certain quantity of products to my cart given a set of test products from the fixtures, I will know what the total should be.  The cart view will show this total too so I can test the web UI the same way.</p>
<p>So basically the high level test is adding a bunch of items, looking at the total and seeing if the total adds up to the expected number.  So I can write a cucumber test that hopefully tests the functionality of the cart model in the game store.  Of course before you can add anything to your cart, you have to log in.  So I'll have another test that basically says "log in as this user" and if you log in successfully, you're going to see a message, like "user logged in successfully" or a cart link at the top.  So there could be like 2 or 3 really high level tests that test a lot of functionality and then maybe I could write smaller unit tests that test like my helper methods or tests certain methods on the carts.  So to do this I need to figure out my testing stack.  The stack needs to be able to do unit testing (meaning ruby classes) and then something that can do web UI type testing (filling in a login form etc).  Maybe this could be webrat with cucumber.  But I'm not sure about the integration between all the testing frameworks.  Like I don't know if cucumber uses webrat or if cucumber can use rspec.  So on my week off, before I start on the #1 and #2 goals (which are about changing functionality and code), I want to figure out how to do TDD.  Meaning, I've got my app working and I should have written the tests before I got my app working.  But now I'm going to write a test suite that can verify that my app is working.  Then, once that's completed, I can branch, hack and break stuff all I want.  My tests will help the actual development part of goals #1 and #2 where I'm changing a bunch of different aspects of my app.</p>
<p>So I'll probably need to create a TDD test app to screw around with the testing stacks.  Like follow their example or get someone else's example.  Just to make sure that I have a working test stack.  Cucumber's syntax is a bit weird to me right now.  So there's some learning there.  But it's crucial for my two big changes.  The rails3 migration is going to screw everything up.  So my tests are really needed.  Even if this is a contrived project.  So at the end of it I'll know more about TDD, maybe testing in general, rails3, authlogic plugs and also CM and git branching and merging.  So that's a lot of work but I hope I tackle a lot of it on my week off.
</p></blockquote>
