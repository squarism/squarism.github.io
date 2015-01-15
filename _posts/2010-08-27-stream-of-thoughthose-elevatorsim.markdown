---
layout: post
status: publish
published: true
title: ! 'Stream of thoughthose: ElevatorSim'
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 658
wordpress_url: http://squarism.com/?p=658
date: !binary |-
  MjAxMC0wOC0yNyAyMTozMDowNCAtMDQwMA==
date_gmt: !binary |-
  MjAxMC0wOC0yOCAwMjozMDowNCAtMDQwMA==
categories:
- Brainstorm
tags: []
comments: []
---
Another herecation.  I have a lot I want to get done.  On the way back from a training class, I got stuck in traffic and decided to brainstorm and transcribe my stream of consciousness to the iPhones voice recorder.  I was hoping to find a speech to text package for cheap (sub $50?) but looks like [Scribe](http://www.macspeech.com/pages.php?pID=181) is the only one and it's $150.  I really don't need it beyond the 12 minutes of "drink from the thought hose" recordings, so I can't buy it right now.  Maybe if I keep [talking to myself](http://www.joynk.com/cdg/), I'll buy it.  It's exactly what I need in this situation actually, just don't know how often this situation will occur.

Hey I don't want to be the guy with the personal recorder with the crap ideas: "Note to self.  Chocolate saucepan.  Makes a great gift for chocoholics.  No mess to clean up.  Research chocolate that can withstand 400&Acirc;&ordm;."  Whatever.

So there's two projects rattling around.  One, not really important right now, an elevator simulator (which has been blogged about [previously](http://squarism.com/2009/04/26/elevator-sim-wip/)).  Really stale project, don't know why I started thinking about it, I realized I got stuck on it and wanted to jot down a TODO in case I had some time.  So here's what I shouted to myself.  It's really raw.  Just posting it here for myself rather than putting it in Evernote.  If Scribe + iPhone works out, I'll stop posting them publicly.  This is just a follow-up to the now very old ElevatorSim post on here.

> What's left to do is to load people onto elevator car.  This could be done by creating four slots which would be dots on the floor of the elevator car representing the offsets where those people would stand.  This could be defined as a series of constants in the car as offsets to the center of the car, which could be reusable for each of the cars.  So I need to add a series of x and y, maybe z values representing all the spots on the floor where the people stand basically.  Each of the slots also should be pointers that can hold people.  So I also need a loadCar method, that when a person gets on the elevator, they go into the next free slot.  And also maybe a convenience method to say whether the car is full not or maybe the loadCar method returns false if it's full (IDK), uh, that's the easy part.
>
> When the car is loaded, the draw list should still iterate through the people in the car.  So when the building manager or the drawing manager draws, it can draw the car but it also draws all the people in the car because the people haven't fallen off the drawable list.  If this is too messy or confusing possibly the elevator car, when it draws, it could draw the people in the car.  But I'm pretty sure that the project, as it's set up right now, that it draws the people independently.  So the drawing shouldn't change.  But what will happen is that when the elevator moves, that move method will need to update that same list of four slots (the pointers to the people riding in the car).  So when the elevator car's tween method fires, that updates the X, that also needs to iterate through the list, updating all the people in the car.  Basically, the people will tween with the car.
>
> When the car arrives, and there's a callback or a sysout that prints "we've arrived!".  The people will need to be unloaded onto the bind point on the floor.  So basically all the people's positions will need to be updated to the bind point.  At that point, the people need to decide which exit to exit to.  Which should just be like a random value to make the simulation more interesting.  So basically, there needs to be a method for unloadPeople() that either could be put in the car or that could be put in the building.  The building could have an unload, which basically the car would call the building unload method to a person object and then that unload method on the building could take over the setting of the bind point and then randomize the exit that the person is going to go to.
>
> And then, once the person decides which exit they are going to go to on the ground floor, when they reach that exit, there will be like another "we've arrived" callback hopefully and that should destroy the person off the user population list (if there is one right now -- I don't think there is).
>
> Ok.  So that's basically the user movement stuff of the building that's left to do.  The other big problem with the project is watching the simulation when debugging.  Because the rotation of the camera is all screwed up right now.  So what I need to do is to implement WASD style flythrough.  So I can move around, fly through with the camera/keyboard/mouse WASD movement.  And then I can actually peer inside the car to watch all the bind points because while I'm developing the loading and unloading of people, it's going to be really hard to debug with sysouts or whatever.  I'm going to wanna draw the bind points in the car, have like filled in circles when they're populated and empty circles when they're not populated.  Just so I can get all the logic coded up, etc.  I'm going to wanna fly through, watch the people go down with the car, make sure there's no clipping, any bugs or whatever.  Watch the people load, go to the bind point, decide which exit they're going to go to, exit the building and get destroyed.  All that stuff is going to be hard to watch unless I freakin fix all the camera movement (which is all jacked up right now).
>
> So those are the two big high level features that need to be done.  There's a ton of little tiny features that need to go in to make the elevator car load people getting on the elevator and coming off the elevator.  But basically, this is where I got stuck last time.  So, I need to write this into some psuedocode, write a little TODO list, put it in a pomodoro list and start working on it on my week off, if I have time.  That's it.

So basically, I'm saying the [people moving on the floors](http://squarism.com/2009/06/21/elevator-sim-update/) aren't getting on the elevator car.  I got stuck on this not knowing which design was best or really how to think about it.  I didn't really start design either.  It just kinda died at that point.  Then I'm saying I need to fix the camera controls.  Not only for the user experience but also for my own debugging.  It's hard to use System.println() calls all over the place (sysouts) to try to debug a game or simulator.  It's a state engine and so you get lots of text that you have to later sort through and think about how the state changed.  Instead, it's better to build the tools inside the simulation/game itself.  Like the Quake console or whatever.

Anyway, this brainstorm wasn't really important.  And it took a long time to transcribe by hand.  Meh.  Onto the next little recording...