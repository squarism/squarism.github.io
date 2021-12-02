---
layout: post
status: published
published: true
title: The Bet Against Web Tech
date: 2021-12-03
---

Sometimes I will run into a comment or an opinion that basically boils down to a bet against web technology.  I wanted to collect my thoughts on this.  First I want to talk about GUIs, layout and web views and then I will collect a surprising list of native APIs and their Web equivalents.


## Example Bets in the GUI Domain

> Someone somewhere: <br />
> "Electron is too slow and Qt is the future, $25 on Qt please."

I agree on the impulse.  I don't agree on the bet. There's a problem of feasibility, complete project context but also just historical trends.  There are plenty of debates already online so there's no need to rehash them here.  I wanted to instead just focus on one aspect of this which is layout.

Layout has been implemented many times.  Almost none of these technologies have gathered human effort like the web has but lets consider some past examples.  In the early Web, if you wanted lots of functionality (or all you knew is one tech stack) you had to reach for Java applets, Flash or some other browser plugin.

So if you picked Java to do a form, you would pick a layout class to use.  One is the [GridBagLayout](https://docs.oracle.com/javase/tutorial/uiswing/layout/gridbag.html).  An applet might have used this instead of form markup plus styling.

<img alt="Grid Bag" style="width: 40%; margin: auto;" src="/uploads/2021/GridBagLayout.png" />  

```java
button = new JButton("5");
c.ipady = 0;       //reset to default
// snip ...
c.insets = new Insets(10,0,0,0);  //top padding
c.gridx = 1;       //aligned with button 2
c.gridwidth = 2;   //2 columns wide
c.gridy = 2;       //third row
pane.add(button, c);
```

Of course there might have been tools to help you generate these layouts but this is essentially the CSS of Java GUIs.  If you squint hard enough, you can almost see a stylesheet in there.  They call it insets whereas CSS would call it padding.

[Qt does a similar thing](https://doc.qt.io/qt-5/layout.html).  This is not me hating on Qt.  I breathe a sigh of relief when I can use Qt.  It's quick, it's light.  It looks nice when the scope is small.  I don't want Qt apps to disappear.


### The Bet Over Time

So given a goal of distributing a GUI form with project and team constraints, maybe you would select Java and its GridBag.  But this technology is not compatible or related to the web version you didn't write.  Over time (with hindsight), this turned out to not be a good bet.  Flex, Flash, Shockwave, Applets, Silverlight, ActiveX have come and gone and the pattern is still repeating today.  The web tech version we have now has not been perfect and [I understand the critics](https://neutralino.js.org/).

I would instead bet that distribution, updates, marketing, docs, interop and many other aspects of this hypothetical Java Applet project would eventually need something that is adjacent to web tech.  Maybe the page itself that contains the "active form" or the rich email that you will later send.

Web tech doesn't auto-win.  I still like text.  TUIs are great (but perhaps a concession).  Native mobile is tricky and no one I talk to _really_ likes generators or [abstraction layers](https://cordova.apache.org/) they are using (but this is 2nd hand).

Regardless of current abstractions, I feel that complete web tech avoidance is a liability and the implementations can be fixed.  I have run into terrible web apis written late or poorly as a feature reluctantly bolted on.  Misformed XML, weird JSON, wrong verbs.  Whatever a bad API is, it's usually not coming from a web-native team or culture.  These are not specialized projects with an exempt domain.  Is that the bet coming due?

If I had to bet I would bet that someone is going to solve Electron's slowness before Qt displaces web tech or find a performance solution in general.  The best thing would be to have a performance workaround or solution while keeping the Web APIs to enable the most interop and reuse.  Then I'd rather adopt web tech related skills for the team.

The internal dichotomy I have is considering that I quite like Xcode from what I've used and I can't imagine how you would have both.  Trying to use web tech naturally leads to a web view which would have to have an entire engine in it.  Now we don't have web with applet/flash plugins; we have native code with a web plugin.  It's just swapping the framing.  If browsers on the desktop can do lightweight native web tech then mobile will too, that's my hope anyway.


## Many Domains, One Tech Stack

The list of things web tech is solving is increasing.  There's very little left untouched.  I'm almost speechless.  I firmware flashed a teensy board using [WebUSB](https://wicg.github.io/webusb/).  I changed a configuration on an audio interface using [WebMIDI](https://www.w3.org/TR/webmidi/).  Someone told me that their browser was opening native files and autosaving to their filesystem and I said _"that's impossible without a security vuln or something"_ and lo and behold, [I was extremely incorrect](https://developer.mozilla.org/en-US/docs/Web/API/FileSystem).

In this vein, here is a list of technologies which were server-side, native or sacredly impossible to have a web alternative and now are in use or soon to be.

| Technology | The Web Tech Version |
| --- | ----|
| Unix Sockets | [Websockets](https://developer.mozilla.org/en-US/docs/Web/API/WebSocket) |
| OpenGL | [WebGL](https://developer.mozilla.org/en-US/docs/Web/API/WebGL_API) |
| sqlite or small caches | [localStorage](https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API)|
| MIDI | [WebMIDI](https://developer.mozilla.org/en-US/docs/Web/API/Web_MIDI_API) |
| Assembly | [WebAssembly](https://developer.mozilla.org/en-US/docs/WebAssembly) |
| Bluetooth | [WebBluetooth](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API) |
| Filesystem | [Native Filesystem API](https://developer.mozilla.org/en-US/docs/Web/API/FileSystem) |

The list continues with similarities like what [Web Workers](https://developer.mozilla.org/en-US/docs/Web/API/Web_Workers_API) would equivocate to in an operating system context.  The list of things web tech is not solving is small regardless of what I think.

When I flashed a development board over WebUSB, there were two options: a binary or use the browser.  I used the browser.  Zero install and they can control distribution and the environment.

<img alt="flashing firmware over webusb" style="width: 80%; margin: auto;" src="/uploads/2021/webusb.png" />

Look at the instructions at the bottom.  Visit `chrome://.../usbDevices`?  Amazing.


## The Web is the Biggest Target

The web platform is the largest there is.  The [list of technologies](https://developer.mozilla.org/en-US/docs/Web/API) is large.  The exclusivity and importance of the operating system is ending and there is a focus and a force by all of us arriving and contributing to a single stack instead of reimplementing bespoke things over and over again.  If WebWorkers give you something like threads, why not just use it "for free" with an extremely easy distribution model versus trying to package and maintain Windows/Mac/Linux once again?

It's not all roses.  I have a lot to say about nits and niggles in the _web tech_ space but that will just have to be another post.  This topic can extend easily to backend web frameworks with a javascript avoidance bias but I want to keep this focused.  Consider these equivalent technologies and the problem with GUI technologies when betting against web tech.  Without a major black swan event, I don't see these technologies (and then naturally skills) going away soon.
