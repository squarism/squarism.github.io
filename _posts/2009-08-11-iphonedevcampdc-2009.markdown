---
layout: post
status: publish
published: true
title: iPhoneDevCampDC 2009
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 254
wordpress_url: http://squarism.com/?p=254
date: !binary |-
  MjAwOS0wOC0xMSAyMjozMjo1MyAtMDQwMA==
date_gmt: !binary |-
  MjAwOS0wOC0xMiAwMzozMjo1MyAtMDQwMA==
categories:
- Blog
tags: []
comments: []
---
![iphonedevdc](/uploads/2009/08/iphonedevdc.jpg "iphonedevdc")
Went to the first annual iPhone Dev Camp here in DC.  It was a barcamp style event over two days.  It was very enjoyable although there were quite a few heavy hitters there (I wasn't one of them).  There were a few different types of people there and I was one of the ones who doesn't have anything on the app store and isn't making any money off iPhone dev.  A few people there had apps I knew from the press as well as an author (Dave Mark -- who was great) that I've read quite a bit from.

What follows is some of the notes that I took at the conference.  It's by no means a transcription.

## Peter Corbett - Apps for Democracy

@corbet3000
He met with Vivek Kundra (CTO/fed CIO DC) and started a dontest for DC, open data.  Citizens created "fix my city" type apps.  43 webapps created, $2.3 EST value, $50k cost, 5000% roi.  Huge success.

A few examples:

*   areyousafedc iphone app - a tachometer as you walk, green = safe, red = danger.  Pulls data from open city sources, crime reports etc.  Very simple interface, pretty cool
*   wethepeoplewiki.com - structured wiki, real-time crime data.  I didn't get this.
*   park it dc - very cool parking meter app.  People report broken meters, displays broken meters on a google map mashup.  City found their contractors were fixing their meters in avg of 7 days but their SLA was 24 hours.  Broken meters not cities fault, app helped DC discover the real problem.
*   iPhone demo at DC311 - http://victorshillo.com/dc311/2/</p>

Really good presentation.  Peter is a cool guy.  Nice, technical and well connected.  Peter did another awesome presentation called [No one cares about your crappy webapp](http://www.youtube.com/watch?v=wZI2_fHFJ2s) at an Ignite Baltimore conference.  I tried to tell him how awesome that was but it's hard to put into words.

## Jonathan Blocksom - OpenGL

@jblocksom
http://www.gollygee.com/weblogs/jblocksom

Jonathan works at google.  He had an android shirt on.  It was pretty funny.  I seriously think he was there to convert some people.  :P  He was really nice and I enjoyed talking to him about gamedev (even if most of my stuff has been in Java).  He did a really nice overview of OpenGL, computer graphics and his game Bubbles.  His game has been on the app store since the beginning of the app store opening.

*   Z buffering is checking if a pixel is behind another, won't render.
*   Use the iPhone boilerplate template to learn
*   Overview of the various buffers that the template creates.
*   You can use the bullet SDK, collada to import 3d models etc
*   You can use the Texture2D class to easily import textures from the apple Lunar lander sample code
*   You can use the touch fighter sample code.  It shows how to  overlay a high score list over opengl view
*   Don't mix OpenGL and cocoa views together for performance reasons
*   He gave an overview of his sales history which was interesting.</p>

A lot of people showed their sales tapering off after an initial burst of sales.  Sometimes press coverage or even competing apps would create another bust of sales.

## Leon Palm - Computer Vision

Leon also works at Google (not that anyone is judging people based on their day job.  Hey, google is a cool company (currently).  He was a really smart and nice guy.  Easy to talk to.  Had a cool Sudoku solver app to demo.  I thought I had seen his app covered in the press but that turned out to be a competing one (oops!).  His presentation walked through how the app works.  Some parts are super confusing and hard but he did a good job in breaking it down.

How his app works:

*   Evolution algorithm
*   RANSAC to find the line
*   Walk the intersection of the lines
*   Find 8x8 inliers in checkers, 7x8 in connect four
*   Have lines, apply transform matrix to rectify image
*   Get pieces is easy
*   Sample region at expected center, create int array for piece config
*   Use open source solver etc</p>

Drawing the results back.
We have: piece colors, positions, sizes and warp matrix.  Derectify image and draw over solution.

Conclusion: easy to do if task is broken down.  Use existing knowledge (whitepapers).  Filtering/tweaking is the most important part.  You have to tweak it to work with cameras lighting and make it accurate.  He said tweaking and adjusting took the most time.  I believe it.

I have done some test type stuff with OpenCV but Leon had really taken this all the way to the finish line.  It was a really in-depth talk that was academically the most complicated of all the talks.

## Kiril - Working w Designers from Imagini Studios

Kiril is the artist that worked on Harbor Master.  It's a "line drawing" game similar to Flight Control.  Apparently it's doing very well on the app store.  These guys were super pro.  They had a great presentation, super personalities and they had found success being an indie game dev shop.  I was really green but then I hadn't put in the hours etc.

Kiril talked about his mock ups, how he worked with the developers (2 of them) and showed his different iterative art pieces.  He mentioned [ffffound](http://ffffound.com/) for art inspiration.  And his most important advice to developers: _don't think that mockups are the final product._  He said many people can't make the jump from concept to final product.

## Christopher Brown - App Store Data!

Christopher runs an analytics company called Tap Metrics.  They had a super slick web app that scrapes data from the app store (I imagine only a few people can do this).  He had run many reports and shared some interesting trends:

*   Most people that buy an app stay in that category and buy again
*   94% of apps are in English, meaning German/English counts.  Germany only counts wouldn't count.  All -> EN -> DE, FR, JP</p>

If I was on the store, I'd talk to Chris about metrics.  I can't imagine anyone else having something similar in polish.  I hope he gets some traction (if he hasn't already) on his work.  It was impressive.

## Dave Smith - Audio on the iPhone

Dave had a presentation that I really enjoyed having worked with various audio APIs.  I asked the most questions on this one.  He walked through his audiobook app (which was really neat).  He was friendly to talk to (for further notice ... everyone was nice).  He gave a good overview of real code and a real working audiobook app he works on.  The app displays the text version of the audiobook while it plays and stays in sync.  It's very polished.

Some random notes (I wrote as fast as I could):

*   AVAudioPlayer level above openAL
*   mp3 format is hw decompression, good for batt/performance
*   To get started, add AVFoundation, AudioToolbox frameworks to project
*   Make a pointer: AVAudioPlayer* player
*   - (IBAction)play:(id)sender;  // methods for button actions etc
*   In interface builder, mapping actions using touchUpInside is the best option to capture user button push
*   Useful command line utility in OSX: /usr/bin/afconvert -iaf4 (convert aiff to compressed formats, pre-compress best for iphone optimization)
*   UInt32 category = kAudioSessionCategory_MediaPlayback  // kAudioSessionCategory_* has many diff options</p>

He always released his memory correctly.  :)
`[player pause]
[player release]
player = nil // nice GC technique`

His start method created the player and played at the same time.  Pause destroyed it.  This might seem odd but he said, "don't keep player instances around for a long time, non deterministic things can start happening."

## Sze Wong - $1M app

Sze asked the question "what would a $1M iphone app look like?".  He also talked about enterprise development and asked if the iPhone could be a serious contender.  He has a metric ton of experience doing enterprise and mobile development.  He seems to like the iPhone (hey a lot of us are sick of doing J2EE) as a refreshing platform.

Sze had a really nice presentation that didn't materialize for me until he showed his demo.  I can only describe it as Oracle Forms for the iPhone.  He has a slick web ui that can generate custom forms for many different uses.  His forms could even include a signature box that the iPhone can use to create a UPS type delivery board.  It was pretty compelling and he had a lot of nice backend stuff (like JSON, RSS, XLS exporters) created in the web ui.

## Other topics

Things wound down and at the end they had a panel of the experts there give answers to various questions by Dave Mark.  It was really neat to see an improvised conference.

*   A lot of people mentioned the importance of Touch Arcade.
*   Someone mentioned nsfetchrequest for nstableviews?
*   Ad hoc distribution for beta testers?  I need to research that.
*   Imangi Studios mentioned getsatisfaction, a customer support portal to outsource support</p>

Fun conference.  I hope to see them next year or sooner.  I think ruby dcamp is next for me.