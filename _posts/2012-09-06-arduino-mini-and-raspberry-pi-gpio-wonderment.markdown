---
layout: post
status: publish
published: true
title: Arduino Mini and Raspberry Pi GPIO wonderment
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 1617
wordpress_url: http://squarism.com/?p=1617
date: !binary |-
  MjAxMi0wOS0wNiAyMzo0MjoxMiAtMDQwMA==
date_gmt: !binary |-
  MjAxMi0wOS0wNyAwNDo0MjoxMiAtMDQwMA==
categories:
- Arduino
tags: []
comments: []
---
![](/uploads/2012/09/arduino_raspberry_pi-300x168.png "arduino_raspberry_pi")
A group of us were wondering about this new Arduino Mini I got.  How is it powered?  This turned into a question about the Raspberry Pi and how it compares.  The Pi runs Linux but you have the GPIO pins.  Are they /dev devices?  Is it something else?  How do you write serial to /dev/pin/1?  We left the questions on the table.

## The Arduino Mini Powered on a Breadboard

I was curious so last night I got the Arduino Mini up and running.  It was pretty tricky.  I tried powering it over 9v.  I was careful to read up on sparkfun forums and the like to see what it could handle.  I found that it would boot (or at least the power light would come on) on as little as 3.3v off the 9v battery.  Then I measured what was coming out of the 9v and it was only 7v (old battery).  I read that it could handle up to 9v on the 9v input pin.  So I had that working but how do you load code on it?

So I had ordered this FTDI cable from sparkfun.  It's a 5v version as my Mini is a 5v too.  An alternative is a breakout board with a regular USB host cable.  So I messed around with the 9v powering my breadboard with a barrel jack and a little rocker switch and left the 5v off USB disconnected.  So I was just trying to use USB for TX/RX information to program the Arduino (as in load code, not burn the bootloader).

First, I had to load FTDI drivers for mac.  On Windows, this would create a COM port.  On mac, it just magically works and there's no control panel or sys prefs applet.  That's a bit weird that there's no interface to change settings but luckily it all worked.  I had read about Windows users having to set "rts on close" option to true on older versions of the Arduino IDE but in the end, that was not my problem.

I tried to upload the Examples->Blink sketch.  I was getting a few errors.  Like:
`"programmer not responding"` and
`"avrdude: stk500_getsync(): not in sync: resp=0x00"`

I had seen this before when I choose the wrong board type but after flipping through all possible combinations, this wasn't it.  I eventually ran into a post buried deep in the web that mentioned hitting the reset button on the Arduino right before you load the sketch.  So I did that (with some tricky timing involved) and the not in sync error no longer happened.  So this was great because this was the first success.

Success is so much more useful for progress than failure just because you can start messing with stuff.  And up to this point I was wondering all kinds of things like: is my board bad?  is my cable bad?  are my drivers stupid?  So I was happy that things were working but I didn't like having to hit reset manually.  I never had to do this on the regular Arduino.

So I looked at someone's wiring and realized that the USB FTDI cable I was using has an RTS on it that can go to a reset pin.  So I plugged that in.  But then it would complain that it couldn't find the programmer on the board.  Then I realized that they didn't just hook it up straight, they had a 100uf capacitor on it.  So it acts like a little trigger.  If it's on constantly the Arduino is constantly resetting so the code upload sort of times out.  When the cap hooked up, I don't have to reset it manually just to update code on it.

So then I uploaded the blink sketch again and it "just works".  There's no built-in LED on pin 13 so I just hooked one up (with a resistor, don't forget an led doesn't resist) and it blinked on pin 13.  Pretty cool.  Also it seems to boot really quick.  Like almost instantly.  When you power it up, it just starts blinking.

Also I was powering it off a 9v which worked fine.  Apparently the mini has a regulator.  I double regulated it to 3.3v and it still booted although the light is dim.  I think it is pretty tolerant but I also read that it's not as "tough" as the regular one.  The regular Arduino is pretty forgiving to electrical errors (within reason... don't plug it into the wall).

## How Do the GPIO Pins on a Raspberry PI work?

I found a Python and a Ruby project for the Raspberry PI GPIO pins.

Here's the python version.  If you had an LED on pin 12, this code (I assume) would turn it on (high).

{% highlight python %}
import RPi.GPIO as GPIO
# to use Raspberry Pi board pin numbers
GPIO.setmode(GPIO.BOARD)
# set up GPIO output channel
GPIO.setup(12, GPIO.OUT)
# set RPi board pin 12 high
GPIO.output(12, GPIO.HIGH)
{% endhighlight %}

The [ruby version](https://github.com/klappy/gpio) called gpio by klappy on github is pretty similar. I looked at the ruby code and it looks like [an abstraction](https://github.com/klappy/gpio/blob/master/lib/gpio/devices/raspberry_pi.rb) around the raw devices.

{% highlight ruby %}
BASE_PATH = '/sys/class/gpio/'
{% endhighlight %}

So that's pretty neat.  You get something really similar to the Arduino but could a higher level language and have networking and video built in.  That for me was what I was wondering.  I don't exactly understand how serial over raw devices and pins work but I do understand system and virtual device nodes in /sys.