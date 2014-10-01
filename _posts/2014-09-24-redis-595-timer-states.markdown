---
layout: post
status: publish
published: true
title: Redis and 595 Timer States
---
![Pixel Ribbon](/ribbons/pixel-ribbon_air_mail.png){:.ribbon}

I wanted to learn about how a 595 timer chip works.  I'm a code dude.  So when I see this integrated chip and all its pins, it's scary.  I'm sure an EE major is giggling right now but that's just [Impostor Syndrome](http://en.wikipedia.org/wiki/Impostor_syndrome).  For no reason beyond this, I wanted to visualize and grok a 595 timer's state at any given point by having it's pins mapped to Redis key/value pairs.

Here's a quick video explanation of the project.

<iframe width="560" height="315" src="//www.youtube.com/embed/k2rJjbI6A5A" frameborder="0" allowfullscreen></iframe>


### Sketch

Here's my initial drawing on how I thought it was going to work.

![595 Sketch](/uploads/2014/09/595_sketch.png)

### Electronics

The 595 timer chip isn't really scary.  You can read about them on [Adafruit](https://learn.adafruit.com/adafruit-arduino-lesson-4-eight-leds/the-74hc595-shift-register) but the real breakthrough for me was this [interactive 595 timer toy](http://conductiveresistance.com/2011/02/28/interactive-595-shift-register-simulator/) online.

![595 Simulator](/uploads/2014/09/595_simulator.png)

### Reading Values

The biggest problem with reading values off the timer is that eventually it's going to be sent to redis.  And that means Ethernet and the rest of the stack.  This is not very easy to do with Arduino even with a shield.  I'm not really a huge fan of making the Arduino do "computer" things.  I could have made the same Arduino read the values off the 595 but to me it seemed like it would look like there's some cheating going on.  So instead, I decided to have a Raspberry Pi read the values off the 595 timer.  It has networking built in and it would give me a chance to learn about its GPIO.

GPIO is not what I expected.  There's some annoying security gotchas.  You'll get `cannot access /dev/mem`.  You will get `cannot read /sys/class/gpio/export`.  If I'm going to use a Raspberry Pi beyond this little toy, I need to figure these things out.  I've tried adding users to the groups that ship with Raspbian but it doesn't change the `/dev/mem` access.  I think you don't want to mess with permissions on that node, it's too messy/risky even for a toy.

All that annoying stuff aside, reading values with the Ruby gem pi_piper is easy (although not perfect).  It's evented and that made me happy when considering what I would have had to have done in Arduino-land.  It would probably be some kind of hardware interrupt and a whole lot more code than what I want.

### Putting it all together

Here's the wiring.

![595 Simulator](/uploads/2014/09/595_together.png)

Here's the ruby program output.  It monitors Redis state and prints a table.

![595 Simulator](/uploads/2014/09/595_table.png)

### Problems

Nothing but this when trying to get things to work.

	gems/pi_piper-1.3.2/lib/pi_piper/pin.rb:23:in `close': Device or resource busy
	@ fptr_finalize - /sys/class/gpio/export (Errno::EBUSY)
	from gems/pi_piper-1.3.2/lib/pi_piper/pin.rb:23:in `open'
	from gems/pi_piper-1.3.2/lib/pi_piper/pin.rb:23:in `initialize'
	from gems/pi_piper-1.3.2/lib/pi_piper.rb:18:in `new'
	from gems/pi_piper-1.3.2/lib/pi_piper.rb:18:in `block in watch'

What?  Even after bouncing my RPi I get this.  What kind of clean up isn't this thing doing?  So now I fix it by doing this between program runs:

	echo 17 >/sys/class/gpio/unexport
	# I was using pin 17

I also wish that you could break out PiPiper's watch events to have two blocks for the same pin.  Like `when goes:high` = bake brownies and then `when goes:low` = frost cupcakes.  When you try to run two watches you get `Device or resource busy`.  In fact, you get that error all the time no matter what you do.  Meh.

### What Did I Learn

- RPi GPIO isn't perfect.
	- Sudo stuff is unfortunate.
	- The best way to reset GPIO if it complains about `Device or resource
  busy` is to unplug all the GPIO pins and reboot.  Rebooting I think is
  excessive because reboots in Linux rarely solve anything.  What I
  think it does do is give the pins time to quiet down.  This is strange
  to me from a `/dev` or `/proc` standpoint.  I've never seen pins cause
  file locks before __(in unix, everything is a file, sure but it's still
  weird)__.
	- Electrical problems might cause `Device or resource busy`?  Check grounds?
- Clocks.  I'm reading the state kind of "by chance".  What if the state changes in the middle of a read?  Ah!  Clocks!  It's like a contract!  I get it now.  I'm not interested enough in making this "lolscale" to implement this.  I bet there's something better than what I'm doing.
- The 595.  Through playing with the 595's various aspects, I feel I grok the 595 now.
- This won't scale forever.  Reading the pins is slow and the 595 can really flip states fast.  If I really wanted to read this at some kind of insane throughput, I'd have to really think about it.  In other words, this toy is kind of performance-stupid.
- Grounding is very important.  I had some shorts along the way and I don't understand why.
- This was my first project with RPi GPIO, so that was fun.

The code for this project is available [on Github](https://github.com/squarism/595_state).
