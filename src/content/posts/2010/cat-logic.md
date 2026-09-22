---
title: "Buying a cat with logic switches"
description: "Charles Petzold's book Codehttp://www.amazon.com/Code-Language-Computer-Hardware-Software/dp/0735611319 is an awesome read. I'm reading it again a"
date: 2010-01-23T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

Charles Petzold's book [Code](http://www.amazon.com/Code-Language-Computer-Hardware-Software/dp/0735611319) is an awesome read. I'm reading it again actually. It's so elegant and simple. Walks you through history and experiments in a style I find _extremely_ invoking. I wanted to build a logic switch but I don't want to blow anything up so I tried [this java applet](http://www.falstad.com/circuit/) at falstad.com and it works pretty well. I tried qucs but it's way too complicate for me and doesn't include an LED.

An example from Code (this is not the exact example) is where he's trying to buy a pet from a pet store and he creates a logic circuit that will light up a light bulb when the pet is correct. Let's say I'm looking for a normal gray cat as a house pet (not a tiger! rawr!). When I flip all the switches correctly, the LED lights up but if I get a gray tiger (that's technically a cat) then the LED (the red dot) says nope.

The salesman brings me a gray tiger. Nope.
![logic_gray_tiger](/uploads/2010/01/logic_gray_tiger.png "logic_gray_tiger")

The salesman brings me a gray cat that's not a tiger. Yep.
![logic_gray_cat](/uploads/2010/01/logic_gray_cat.png "logic_gray_cat")
