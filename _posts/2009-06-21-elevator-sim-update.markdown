---
layout: post
status: publish
published: true
title: Elevator Sim update
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 221
wordpress_url: http://squarism.com/?p=221
date: !binary |-
  MjAwOS0wNi0yMSAxMToxNjo0NyAtMDQwMA==
date_gmt: !binary |-
  MjAwOS0wNi0yMSAxNjoxNjo0NyAtMDQwMA==
categories:
- GameDev
- Processing
tags: []
comments: []
---
![elevator_sim_2](/uploads/2009/06/elevator_sim_2.png "elevator_sim_2")
Quick update about [the elevator sim post](http://squarism.com/2009/04/26/elevator-sim-wip/).  Currently the cars are animating fine.  IE: you press 3 and car #1 goes to floor three, stops, opens the door and waits.  If you press 1, the car closes the door, moves to floor 1 and opens the door.  The building controller is aware of the care state as evidenced by the little labels you see.

The person sprite (on that line there) is currently a placeholder.  He paths over to wait for the elevator but I don't have the "AI" done for him to wait.

This has lost a bit of traction since I've been cranking on the iPhone class.