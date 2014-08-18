---
layout: post
status: publish
published: true
title: Arduino Cat Faucet with Mongodb and Rails
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
excerpt: ! "I built a robot arm for my cat during a month-long geekcation.  :) Here
  are some shots of the web interface.  The graph shows the percentage of the day
  that she drinks.\r\n<img src=\"/uploads/2011/03/cat_faucet_final-580x412.png\"
  alt=\"\" title=\"cat_faucet_final\" width=\"580\" height=\"412\" class=\"aligncenter
  size-large wp-image-999\" />\r\n\r\n[caption id=\"attachment_997\" align=\"aligncenter\"
  width=\"580\" caption=\"Final hardware rig\"]<img src=\"/uploads/2011/03/cat_faucet_final_hw-580x433.png\"
  alt=\"\" title=\"cat_faucet_final_hw\" width=\"580\" height=\"433\" class=\"size-large
  wp-image-997\" />[/caption]\r\n\r\n<h2>Background</h2>\r\nMy cat likes
  to drink fresh and cold water directly from the faucet.  We get up and turn on the
  faucet only to leave it running after she's jumped down.  It's not really a big
  problem for us but I saw a fun problem that I could work on.  As much as this seems
  like a weird and freakish oddity, it's a potential start of a smarthome sensor network
  that may provide some utility.  I also saw an opportunity to learn various things
  such as <a href=\"http://www.mongodb.org/\">MongoDB</a>, mechanical
  construction with <a href=\"http://www.microrax.com/\">Microrax</a>,
  Rails3 and more development on <a href=\"http://www.arduino.cc/\">Arduino</a>
  with an Xbee module.\r\n\r\n"
wordpress_id: 874
wordpress_url: http://squarism.com/?p=874
date: !binary |-
  MjAxMS0wMy0wOSAyMzowMTo1NiAtMDUwMA==
date_gmt: !binary |-
  MjAxMS0wMy0xMCAwNDowMTo1NiAtMDUwMA==
categories:
- Ruby
- Noteworthy
- Arduino
- Rails
tags: []
comments:
- id: 5632
  author: ehcache.net
  author_email: ''
  author_url: http://ehcache.net/nosql/arduino-cat-faucet-with-mongodb-and-rails
  date: !binary |-
    MjAxMS0wMy0xOCAyMToxMDowOSAtMDQwMA==
  date_gmt: !binary |-
    MjAxMS0wMy0xOSAwMjoxMDowOSAtMDQwMA==
  content: ! '<strong>Arduino Cat Faucet with Mongodb and Rails...</strong>


    I built a robot arm for my cat during a month-long geekcation. :) Here are some
    shots of the web interface. The graph shows the percentage of the day that she
    drinks....'
- id: 6088
  author: Rob in Belfast UK
  author_email: r.jamison-ni@yahoo.co.uk
  author_url: ''
  date: !binary |-
    MjAxMS0wNS0yNCAxNjoyMDo1NiAtMDQwMA==
  date_gmt: !binary |-
    MjAxMS0wNS0yNCAyMToyMDo1NiAtMDQwMA==
  content: ! "Aww, what a cool Kitty.\r\n\r\nThat takes me back to when my cat used
    to jump up and drink from the faucet.\r\n\r\nWhile cats appreciate automation
    when it suits them, they still prefer staff to pander to their every furry little
    need.\r\n\r\nKudos."
- id: 6089
  author: Automated faucet keeps your cat watered | You&#039;ve been blogged!
  author_email: ''
  author_url: http://analyser.fevroplast.gr/?p=2092
  date: !binary |-
    MjAxMS0wNS0yNCAxNjozMToyOSAtMDQwMA==
  date_gmt: !binary |-
    MjAxMS0wNS0yNCAyMTozMToyOSAtMDQwMA==
  content: ! '[...] a simple solenoid [Chris] had to make the rig completely reversible.
    The result is an automated&Acirc;&nbsp; faucet control which involves an infrared
    sensor, Arduino,&Acirc;&nbsp; and tight fitting rail system with a servo to operate
    [...]'
- id: 6091
  author: Tristan
  author_email: tristan.willy@gmail.com
  author_url: ''
  date: !binary |-
    MjAxMS0wNS0yNCAxNzo0NzozMiAtMDQwMA==
  date_gmt: !binary |-
    MjAxMS0wNS0yNCAyMjo0NzozMiAtMDQwMA==
  content: ! "Great project! I love the non-destructive nature of the rig too.\r\n\r\n>
    1. The Arduino has very little memory and is annoying to code on. ... My best
    advice is to try to get your problems off the Arduino as soon as possible.\r\n\r\nEmbedded,
    especially 8-bit embedded, really is a different world to work in. Keep-it-simple-stupid
    is very good advice.\r\n\r\nMD5 is overkill and very memory hungry (minimum 16
    bytes of state). avr-libc, which I believe is available as part of the Arduino
    toolchain, offers simple, small, and fast CRC16 routines. They're sufficient in
    protecting against serial communication errors. If the message/bit-error-rate
    is small enough and your receiver is smart enough, then you can correct small
    bit errors! Simpler checksums, like a 8-bit sum of all bytes in the message, work
    well enough for message rejection and are KISS.\r\n\r\n\r\n> 4. Servo torque changes
    depending on the voltage given.\r\n\r\nThis is a good observation, but a DC motor's
    (servo) torque is not a function of voltage. Rather it is a function of current.
    Ohm's law states these two are related with resistance (V = I * R), so increasing
    the voltage will increase current and hence increase torque."
- id: 6093
  author: Automated faucet keeps your cat watered &laquo; Black Hat Security
  author_email: ''
  author_url: http://blackhatsec.com/?p=2997
  date: !binary |-
    MjAxMS0wNS0yNSAwMjoxMjo1MCAtMDQwMA==
  date_gmt: !binary |-
    MjAxMS0wNS0yNSAwNzoxMjo1MCAtMDQwMA==
  content: ! '[...] a simple solenoid [Chris] had to make the rig completely reversible.
    The result is an automated&Acirc;&nbsp; faucet control which involves an infrared
    sensor, Arduino,&Acirc;&nbsp; and tight fitting rail system with a servo to operate
    [...]'
- id: 6139
  author: links for 2011-06-08 &laquo; Bloggitation
  author_email: ''
  author_url: http://zhesto.wordpress.com/2011/06/09/links-for-2011-06-08/
  date: !binary |-
    MjAxMS0wNi0wOSAwMToxMDoyNyAtMDQwMA==
  date_gmt: !binary |-
    MjAxMS0wNi0wOSAwNjoxMDoyNyAtMDQwMA==
  content: ! '[...] Arduino Cat Faucet with Mongodb and Rails (tags: arduino ruby
    rails mongodb fun via:zite) [...]'
- id: 6578
  author: George
  author_email: guitar.jarj@gmail.com
  author_url: ''
  date: !binary |-
    MjAxMS0wNi0yOCAxNToxNTozOCAtMDQwMA==
  date_gmt: !binary |-
    MjAxMS0wNi0yOCAyMDoxNTozOCAtMDQwMA==
  content: ! "\"The Biggest Lesson\r\nThe biggest thing I learned from all this is
    how a project like this resonates with people more than software. When a friend
    would come over, it was a more interesting presentation because of the physical
    component versus just a pure software demo.\"\r\n\r\nso true!"
- id: 6579
  author: 10 WAYS TO MAKE YOUR HOME GEEKY COOL &Acirc;&raquo; CHECK, WITH, HOUSEHOLD,
    ONCE, KINECT, TWEET-A-POT &Acirc;&raquo; GADGETTECHNEWS.CO.CC
  author_email: ''
  author_url: http://gadgettechnews.co.cc/laptops/10-ways-to-make-your-home-geeky-cool-223620.html
  date: !binary |-
    MjAxMS0wNi0yOSAxNTo0OTo0OSAtMDQwMA==
  date_gmt: !binary |-
    MjAxMS0wNi0yOSAyMDo0OTo0OSAtMDQwMA==
  content: ! '[...] cat w&amp;#1072nt&amp;#1109 &amp;#1110t (water supply, m&amp;#959&amp;#1109t
    &amp;#959f th&amp;#1077 time, anyhow). Follow  th&amp;#1077 instructions t&amp;#959
    work &amp;#1110t out f&amp;#959r yourself, b&amp;#965t b&amp;#1077 patient&#8211;&amp;#1110t
    m&amp;#1072&amp;#1091 [...]'
- id: 6674
  author: bob
  author_email: rsanchez1990@gmail.com
  author_url: ''
  date: !binary |-
    MjAxMS0wOS0xOSAwNzo1NDozOCAtMDQwMA==
  date_gmt: !binary |-
    MjAxMS0wOS0xOSAxMjo1NDozOCAtMDQwMA==
  content: My cat likes to drink from the faucet too, although I don't think my cat
    would be happy with an automated faucet, only a hand cupping the water will do
    the job.
- id: 6730
  author: Arduino Cat Faucet with Mongodb and Rails &laquo; adafruit industries blog
  author_email: ''
  author_url: http://www.adafruit.com/blog/2011/11/02/arduino-cat-faucet-with-mongodb-and-rails/
  date: !binary |-
    MjAxMS0xMS0wMSAyMzowMTo1NyAtMDQwMA==
  date_gmt: !binary |-
    MjAxMS0xMS0wMiAwNDowMTo1NyAtMDQwMA==
  content: ! '[...] Arduino Cat Faucet with Mongodb and Rails. Dillon writes -  I
    built a robot arm for my cat during a month-long geekcation.  Here are some shots
    of the web interface. The graph shows the percentage of the day that she drinks.   Filed
    under: arduino &#8212; by adafruit, posted November 2, 2011 at 12:00 am    Comments
    (0) [...]'
- id: 7176
  author: The Automated Cat-activated Water Tap &laquo; freetronicsblog
  author_email: ''
  author_url: http://freetronicsblog.wordpress.com/2012/07/27/the-automated-cat-activated-water-tap/
  date: !binary |-
    MjAxMi0wNy0yNiAyMjoyNzozMCAtMDQwMA==
  date_gmt: !binary |-
    MjAxMi0wNy0yNyAwMzoyNzozMCAtMDQwMA==
  content: ! '[...] from a bowl. Then again, &#8220;dogs have masters, but cats have
    staff&#8221;. So head over to&nbsp;Chris&#8217; page&nbsp;to follow his designs,
    and we&#8217;re on&nbsp;twitter&nbsp;and&nbsp;Google+, so&nbsp;follow [...]'
---
<p>I built a robot arm for my cat during a month-long geekcation.  :) Here are some shots of the web interface.  The graph shows the percentage of the day that she drinks.
<img src="/uploads/2011/03/cat_faucet_final-580x412.png" alt="" title="cat_faucet_final" width="580" height="412" class="aligncenter size-large wp-image-999" /></p>
<p>[caption id="attachment_997" align="aligncenter" width="580" caption="Final hardware rig"]<img src="/uploads/2011/03/cat_faucet_final_hw-580x433.png" alt="" title="cat_faucet_final_hw" width="580" height="433" class="size-large wp-image-997" />[/caption]</p>
<h2>Background</h2><p>
My cat likes to drink fresh and cold water directly from the faucet.  We get up and turn on the faucet only to leave it running after she's jumped down.  It's not really a big problem for us but I saw a fun problem that I could work on.  As much as this seems like a weird and freakish oddity, it's a potential start of a smarthome sensor network that may provide some utility.  I also saw an opportunity to learn various things such as <a href="http://www.mongodb.org/">MongoDB</a>, mechanical construction with <a href="http://www.microrax.com/">Microrax</a>, Rails3 and more development on <a href="http://www.arduino.cc/">Arduino</a> with an Xbee module.</p>
<p><a id="more"></a><a id="more-874"></a></p>
<p>Some informal goals I had in mind when starting the project:</p>
<ul>
<li>Extensible - Something where I can add new sensors of any time of function.  Say I want an ambient temperature history.  Sure a SQL schema can be designed to be extensible and flexible but I wanted something super generic like a big hashtable</li>
<li>Analysis - I wanted to know what hour of the day my cat drinks the most.</li>
<li>Control - I wanted a protocol coming from the Arduino that would be flexible enough to not only collect metrics but also accept commands.</li>
<li>Temporary - Any installation had to be easily undone.  No holes in the wall, no new pipes and nothing I can't undo.</li>
</ul></p>
<p>Video and detail past the break.
<!--more--></p>
<p>Here's a video of it in action for the first time.
<iframe title="YouTube video player" width="560" height="349" src="http://www.youtube.com/embed/T0-EQqTW3Og" frameborder="0" allowfullscreen></iframe></p>
<h2>Design</h2><p>
I spent some time drawing sketches first of the physical problem.  I drew a sink and sketched out some frames around it.  I sketched out the angles and vectors in play.  I played with the sink handle and tried to break down the physical forces and simplify it to it's most basic components.  I built a small wooden sink faucet with the same dimensions as my real one so I wouldn't have to work in the bathroom.  I took some reference pictures and looked through my sparkfun parts box to see what components I had lying around.</p>
<p>I eventually came up with a small box built around a base platform that would hold both an IR sensor and a servo.  From my wooden sink mock up, I knew that the servo's fulcrum would have to be directly over the handle's fulcrum.  Anything else would cause sliding or rubbing which would lead to more difficult mechanical problems.  That meant that I needed something pretty fancy and precise in terms of a support structure.  I couldn't just cut up some wood and nail it together.  I would later solve this problem with the microrax structure, but I didn't know that yet.</p>
<h2>Early prototype and testing</h2><p>
I built some pretty rough prototypes using the wood faucet and handle.  I first started out by playing with the IR sensor.  I figured out a way to smooth the input values coming from the sensor and create a range window which could equate to "cat detected".  I saved that bit of code off to the side and moved on to playing with the servo.  This was pretty simple to begin with, using the built-in Arduino library, you just create a Servo instance and write an angle to it.  The angle greatly depends on where and how you attach the servo gear so the exact values have to be calibrated for your physical install.  In any event, the code to move a servo looks like this:</p>
<pre lang="java">
Servo servo;  // create servo object to control a servo
// attaches the servo on pin 9 to the servo object
servo.attach(9);
servo.write(180); // turns servo to angle 180 but this has to be calibrated
// sink is on at this point
</pre>
It's a little more complicated than this (I have the code posted in full) but the idea is pretty simple.  The servo library writes a value as a resistance to the data pin running to the servo and the servo moves.  The servo requires a bit of time to actually move the arm so you have to put a delay() in.  Also, there's some jitter and debouncing issues you have to consider, like if the servo can't get to it's destination then it's going to buzz (this was a major problem for me).  As I'll talk about later, the code in practice doesn't just work, you have to play with it and calibrate it until it works the way you want in the physical world.</p>
<p>So at this point, I had a servo that would move 90 degrees on and off when I put my hand (representing the cat) in front of the IR sensor.  I was moving a pencil attached to the servo gear that was representing a handle.  Later I'd realize that I didn't need to move a full 90 degrees because all I needed was a small stream of water (with about 10 degrees of movement).  There were many other things to do but this was a good first prototype.  I combined all my IR and servo code together and saved it off to the side.</p>
<h2>Microrax Frame</h2></p>
<p>[caption id="attachment_972" align="alignright" width="150" caption="Cat Faucet 3d sketch"]<img src="/uploads/2011/03/cat_faucet_sketch-150x150.png" alt="Cat Faucet 3d sketch" title="cat_faucet_sketch" width="150" height="150" class="size-thumbnail wp-image-972" />[/caption]</p>
<p>I needed some way to hover the servo directly over my sink handle.  I needed a mount for the IR sensor.  I needed something to either put on the sink, or on the wall or something.  I considered many options but I eventually found an erector set type product called Microrax.  I ordered a basic starter set with 6 pieces of the piping.  I figured I'd screw up quite a bit of it so I ordered extra lengths.  Suprisingly, after it arrived, I didn't screw up any lengths of it and the whole experience with Microrax was fun as hell.</p>
<p>Microrax lets you create almost any object you can think of, as long as it's 45 or 90 degree angles.  Maybe there are other configurations that are possible but the easiest ones are the structures like they have pictured on their website and the structures I have pictured here.  I also ordered a servo bracket which fit perfectly on a Microrax pipe piece.  I drew up some rough 3D sketches on graph paper.  You can see the final one to the right.</p>
<p>From this 3d sketch, I could count how many lengths and pieces I needed to make the frame.  So I made a parts list for myself.  It was pretty funny making a parts list like a <a href="http://en.wikipedia.org/wiki/Bill_of_materials">BOM</a> but it's was very necessary.  I had <em>planning-me</em> and then there was <em>hacksaw-me</em>.  Hacksaw me didn't care about the plan, he was there to cut.  So it was good to review the segment lengths on paper a few times to make sure I wasn't ruining my Microrax parts.</p>
<p>[caption id="attachment_974" align="alignright" width="150" caption="Showing the pivot point on the handle"]<img src="/uploads/2011/03/cat_faucet_pivot-150x150.png" alt="" title="cat_faucet_pivot" width="150" height="150" class="size-thumbnail wp-image-974" />[/caption]</p>
<p>After I had a rough design, I cut out the pieces for the base of the frame and put together the base.  I then double checked my lengths by putting it on the sink, also to visualize the rest of the pieces.  There were some definite anchoring problems that I was trying to solve because I knew that when the servo pushed on the sink handle, it would push back on the frame and I didn't want the frame to move.</p>
<p>I cut the rest of the pieces and eventually got a frame that placed the servo directly over the sink handle fulcrum which is exactly what I wanted.  You can see here (to the right) I'm illustrating that the servo gear is directly over the handle pivot point.  My screwdriver isn't exactly pointing on the pivot point, it's just there for depth reference.</p>
<p>My frame was built and I attached a servo bracket to it.  At this point I actually ran out of parts.  So I ordered some more and scavenged microrax pipes from other parts of the frame.</p>
<p>[caption id="attachment_992" align="aligncenter" width="300" caption="Microrax frame and base"]<img src="/uploads/2011/03/cat_faucet_frame-300x224.png" alt="" title="cat_faucet_frame" width="300" height="224" class="size-medium wp-image-992" />[/caption]</p>
<h2>Arm and grip</h2><p>
[caption id="attachment_970" align="alignright" width="150" caption="Faucet arm and servo gear mount"]<img src="/uploads/2011/03/cat_faucet_arm-150x150.png" alt="" title="cat_faucet_arm" width="150" height="150" class="size-thumbnail wp-image-970" />[/caption]</p>
<p>But now I needed to attach an arm to the handle.  The servo attachment is just a little plastic star-shaped gear and I had to somehow attach that to a microrax piece.  I sandwiched two plates together  and eventually got this little piece you see here.  The hole on the black star is where the servo gear threads go.  A screw goes through this and holds this servo sandwich piece in and keeps it from falling in the sink.  This star piece attaches to a Microrax piece that acts as the arm.  I simply made a 90 degree downward post that acts as fingers off the arm.  A lot of this I modeled just by using my real hand on the faucet and trying to reduce the mechanics as much as possible.</p>
<p>I tried a few variables on a grip (you can see the rubber band attempt).  I even tried velcro and some other weird ideas.  But the servo wasn't transferring enough force to the handle, or at least seemed like it could be doing better.  Also a lot of calibration came when I went to actually attach the grip.  If you do anything that is physically or deployed, make sure you have some wiggle room to adjust to your target.  Coming from a software world, I was horrified at how imprecise this is.  Automatic deployment like capistrano, chef and other tools obviously have no relevancy here in the physical/hardware world.</p>
<p>[caption id="attachment_966" align="alignright" width="150" caption="Grip attempt with too little leverage"]<img src="/uploads/2011/03/cat_faucet_grip_attempt-150x150.jpg" alt="" title="cat_faucet_grip_attempt" width="150" height="150" class="size-thumbnail wp-image-966" />[/caption]</p>
<p>Anyway, pontifications aside, the rubber band connection around the handle instead of a hand-life device was transferring too much power to the inner portion of the lever.  That wasn't good.</p>
<p>I eventually realized that the most torque I could get was to push at the outer point on the handle (ie: a lever).  So I positioned the grip so that it would squeeze all the way at the tip of the sink handle.  This allowed the servo to easily and smoothly turn the handle.  I put some rubber bands the pieces to give the arm some grippiness and it has worked very consistently for months.  This is the grip I settled on.  Some of the pieces need to be trimmed up but you get the idea.</p>
<p>[caption id="attachment_971" align="aligncenter" width="300" caption="Final grip with downward "fingers""]<img src="/uploads/2011/03/cat_faucet_grip-300x224.jpg" alt="" title="cat_faucet_grip" width="300" height="224" class="size-medium wp-image-971" />[/caption]</p>
<h2>Rig Polish</h2><p>
So at this point, my arm was gripping the handle and my code was turning on the faucet.  That pretty much finished up the hardware portion of the prototype.  After that, it was just polish and finish.  I got a box from sparkfun to mount the Arduino in and I wired it all up under the sink.  I made wire connectors that go to servo extension cables that make the box easy to unplug from the servo and IR hookups.  The wires go down the back of the sink to this box which is holding the Arduino and the Xbee shield.</p>
<p>[caption id="attachment_1005" align="aligncenter" width="580" caption="Inside the Arduino project box"]<img src="/uploads/2011/03/cat_faucet_arduino-580x433.png" alt="" title="cat_faucet_arduino" width="580" height="433" class="size-large wp-image-1005" />[/caption]</p>
<h2>Software Components</h2><p>
Before talking about the software components, here's an overview of how everything works together.
<img src="/uploads/2011/03/cat_faucet_components-580x317.png" alt="" title="cat_faucet_components" width="580" height="317" class="aligncenter size-large wp-image-1269" /></p>
<p>So let's start off by talking about the Xbee component that's attached to the Arduino.</p>
<h2>Xbee Integration</h2><p>
I played around with the usb-serial driver using an Xbee explorer and integrated some code that would print to serial instead of printing to console from the Arduino.  This would allow me to send a message from the sink to a full-on computer with a proper software stack to do something interesting.  In my case, I wanted to send a message when the sink is tripped.  I made up a little protocol based on JSON for the message.  The Arduino can't really do JSON per se but it can send plain-text that looks like it.  This is what my Arduino sends over Xbee when the cat jumps up into the sink:</p>
<pre lang="javascript">
// example JSON message
{
  "sensor": "sinks",
  "name": "basement",
  "proximity": "true",
  "running": "true",
  "hash": "82C61D54A77D6A90219E4E40CE6C8440",
  "type": "metric"
}
</pre></p>
<p>Proximity is a bit redundant but I put it in there because the Arduino actually knows proximity before it knows running (debouncing) so in the future, I could have it send a message on every proximity event.</p>
<p>The hash is actually computed on the Arduino using an MD5 library.  This was a b*tch to get working.  I'd actually drop this functionality right away if I did this over.  All it does is hash the sensor value and the name value together as a checksum.  I didn't know how good the Xbee would be.  Definitely overengineered this but I was following serial advice I read on the Arduino forums.  Almost every serial protocol has a checksum or sanity mechanism.</p>
<h2>Ruby Serial Bridge AKA: The Cat Bridge</h2><p>
So on the other side of the Xbee link is a Linux box that is running a do-forever ruby script.  It has an <a href="http://www.sparkfun.com/products/8687">Xbee Explorer USB</a> dongle and it watches for valid JSON coming in.  I'm cheating quite a bit on reading the serial and this part could be toughened up against garbage data.  I just look for opening and closing braces (meh).</p>
<p>Regardless of fragility, when a message comes in, it does a bit of sanity checking to make sure the message is valid.  If it is valid, it does an HTTP POST and passes the JSON message along, stripping the hash key.  The MD5 hash is just used for serial, TCP should handle error correction in a real software stack.</p>
<p>Here's the function that posts to rails.</p>
{% highlight ruby %}
# do JSON HTTP post to rails
def post_json(url, input_json)</p>
<p>  # we don't need the serial hash anymore so we
  # can reuse the serial json payload from the sensor
  input_json.delete "hash"</p>
<p>  # parse our input url
  uri = URI.parse(url)</p>
<p>  # make a new request
  req = Net::HTTP::Post.new(uri.path, initheader = {'Content-Type' =>'application/json'})</p>
<p>  # have to format it as json again with .to_json to avoid a
  #   undefined method 'bytesize' for #<Hash: ...
  # error message.
  req.body = input_json.to_json</p>
<p>  response = Net::HTTP.new(uri.host, uri.port).start {|http| http.request(req)}
  puts "Response #{response.code} #{response.message}: #{response.body}"
end
{% endhighlight %}</p>
<p>When it goes through, you see this on the console.</p>
<pre>
VALID: <metric>, proximity:0 running:false
Posting to http://localhost:3000/sinks/ -->
{"sensor"=>"sinks",
"name"=>"basement",
"proximity"=>"0", "running"=>"false", "type"=>"metric"}
Response 200 OK : mapped json_request.
</pre></p>
<p>The response message "mapped json_request" is coming from a Rails action which I'll talk about next.</p>
<h2>Rails and MongoDB</h2><p>
The rails app was pretty straight-forward.  I played around with MongoDB
and the <a href="http://mongoid.org/">Mongoid </a>gem (for ORM) for a few days, making some sample projects and reading up about document design (vs schema design).  I'm not an expert on MongoDB but I got enough working to starting loading data in.</p>
<p>I created a sensor registration page and model where I identify sensors by name, ie: "sink".  And then the json post updates the values for that sensor name and type.  I should really use IDs as keys but this is pretty easy and flexible to just use names.</p>
<p>[caption id="attachment_881" align="aligncenter" width="558" caption="Sensor registration"]<img src="/uploads/2010/12/sinks_sensor_list.png" alt="" title="sinks_sensor_list" width="558" height="187" class="size-full wp-image-881" />[/caption]</p>
<p>The interesting part was flipping on <a href="http://mongoid.org/docs/extras/">versioning in the Mongoid gem</a>.  This gave me automatic versioning on historical states of the sink.  With this enabled, I could make a graph summarizing what hours the cat drinks the most (or whatever report).  Versioning is dead simple to enable but later it would turn tricky to work with because the queries are very different in MongoDB vs a SQL database.</p>
<p>My model with versioning looks like this:</p>
{% highlight ruby %}
class Sink
  include Mongoid::Document
  include Mongoid::Timestamps
  include Mongoid::Versioning</p>
<p>  validates_uniqueness_of :name</p>
<p>  field :running, :type => Boolean
  field :proximity, :type => Boolean
  field :collected_at, :type => Time</p>
<p>  def plot_by_hours
    hours_hash = Hash.new(0)</p>
<p>    # count up our hours
    self.versions.each do |v|
      # we only care about when the sink is running to count cat drinking
      if v.running == true
        hours_hash[v.collected_at.hour] += 1
      end
    end</p>
<p>    hours_hash[self.collected_at.hour] += 1</p>
<p>    total = 0
    hours_hash.each_key do |h|
      total += hours_hash[h]
    end</p>
<p>    hours_percentage = Hash.new
    hours_hash.each_key do |h|
      percent = hours_hash[h].to_f / total.to_f
      hours_percentage[h] = (percent.round 2) * 100
    end</p>
<p>    # flot needs an array of arrays for data values
    hours_percentage.to_a
  end</p>
<p>end
{% endhighlight %}</p>

<p>The plot_by_hours method returns an array of of values that represents how many times the sink was tripped per hour.</p>
<pre>
 > Sink.first.plot_by_hours
 => [[23, 20.0], [22, 40.0], [18, 40.0]]
</pre></p>
<p>All this was enough to get a basic interface up and make a graph with <a href="http://code.google.com/p/flot/">flot</a>.</p>
<p>Certainly there's a ton of refactoring that could be done (if you look at the code especially).  First, naming the model "Sink" is sort of stupid.  It should be called "Sensor" or something like that.  Second, I should <strong>not</strong> use <em>font color</em> tags because those <a href="http://www.w3schools.com/HTML/html_fonts.asp">are going away</a>.  Lastly, I should move the do-forever cat bridge serial monitor thing into a God process or something else that starts and ends with rails.  But that would couple it to the webserver.</p>
<h2>Development Problems</h2><p>
While building this whole thing, I ran into some places where I got stuck.</p>
<p><strong>Servo buzzing</strong><br>
The biggest problem I had was getting the servo under control.  The servo would buzz when moving to a position because the resistance of the handle would not let it get completely to the target position.  For example:  90 is off and 180 is on.  It would try to turn off but get to 91.  At 91, it buzzes but it's not moving enough to get to 90.  I solved this by jerking to 20 and then moving to 70,80 and then 90.  Seemed to work but then the microrax rig would eventually de-calibrate my fine tuning.  I was not happy about this and it wasn't very elegant.  I tried many times simply to turn off the servo when it was done moving but many attempts would cause the servo to completely reset itself which would jerk the handle violently as it went back to position 0 and then to 90 (or 180 whatever).  For a long time I didn't think turning off the servo was actually possible.  I thought the Arduino servo library was either buggy or incapable of doing what I wanted.  I kept playing with it and I really don't know exactly how but I managed to get a bit of working code that did turn off the servo after moving.  This way, I don't need to jerk to 91,70,80 or anything else weird.  I just move, turn off.  The snippet of relevant code for turning off an Arduino servo is below:</p>
<pre lang="java">
// full code available, this is just an excerpt
void setup() {
// attaches the servo on pin 9 to the servo object
  servo.attach(9);
}</p>
<p>// do forever loop
void draw() {</p>
<p>// if cat detected, move faucet to on
servo.attach(9);  // reattach
servo.write(105);  // or whatever angle
servo.detach();  // this would jerk/spaz the servo out
....</p>
<p>// cat is gone, move faucet to off
servo.attach(9);  // reattach
servo.write(85);  // or whatever angle for off
servo.detach();  // this would jerk/spaz the servo out
}
</pre></p>
<p>The important thing to get out of the code here is that the servo detaches after moving and only reattaches when it needs to move.  This is way better than just moving and staying attached because it won't buzz if it doesn't reach its destination.</p>
<p><strong>Frame torque</strong><br>
Torque on the faucet handle was a problem.  When the faucet would turn on, the opposite force would torque the frame.  I had to "anchor" it with some hobby putty.  A better solution would be to clamp it down but I didn't have a lot of lip around my sink to do that.</p>
<p><strong>Flot</strong><br>
Flot is what I used to draw the graph.  It's a client-side javascript graphing library.  Flot is nice but it gave me a lot of trouble trying to figure out exactly what format it needed the data coming from the rails webservice to return.  I had to play with this a lot and sometimes it would silently die (like javascript likes to do).  I was using Chrome to test but I switched to Firefox with Firebug to help catch the javascript errors.  Getting the javascript data from the rails app (really from the DB) to the jQuery graph was a pain.  I got stuck on this for at least a week.  But flot is really cool.  No imagemagick problems.</p>
<p><strong>Deployment Problems</strong><br>
After getting ready for "deployment" (where I wanted to take my code from my laptop and put it on my home Linux box), I found that Ubuntu was really out of date on my server.  So I ran a bunch of `do dist-upgrade' commands on it to update it and that's when my server's HDD died.  I mean, I guess it's a logical time for it to die.  The dist-upgrade thing lights up the disks pretty good.</p>
<p>Luckily, I had the root disks mirrored so I could get all the data off (not much).  The problem was, it's software raid and it was using mdadm instead of the newer LVM.  Compounded by that, it was still running some older version of Ubuntu so I couldn't just switch to LVM and re-mirror the disks.  A bit of an environmental issue but lesson learned, just spring for <a href="http://www.newegg.com/Product/Product.aspx?Item=N82E16816116042">the 3ware card</a>.</p>
<p>So I ordered a new one and ran into problems there.  The box I am using is a Shuttle SFF thing.  It was supposed to have graphics on it.  Well guess what.  You have to buy a CPU with graphics on it (wut).  The i5-750 doesn't have a GPU on it and the Shuttle VGA port is actually just a pass through for the GPU on the CPU.  So I had to buy a i5-650 which fixed this problem.</p>
<p>Then I had a virtual console resolution problem.  Console mode would boot up at 1680x1050 (way too high a resolution and VGA cable noise).  <a href="http://ubuntuforums.org/showthread.php?t=1673551">Setting nomodeset fixed it</a>.  </p>
<p>Then I had a networking problem.  Large secure copies over SSH (or presumably anything) would cause kernel panic with r8169 network driver.  I tried moving to <a href="http://kernel.ubuntu.com/~kernel-ppa/mainline/v2.6.37-rc2-maverick/">2.6.37-20637rc2</a> off ubuntu's ppa site but it would still happen.  I wasn't even past the OS build at this point.  I was just trying to copy some files over (not even code) and the box would panic.  Awesome.  Well, I'm glad I found it early.  So eventually I found that the r8169 driver sucks.  Everyone said to use the r8168 driver even if that doesn't match the chip exactly.  Apparently the devices are really similar but the drivers are very different in terms of stability.  Ok!  Yak shaving ho!</p>
<p>This solution worked.  It's pretty lengthy and I'll save it for another post.  There's <a href="http://djlab.com/2010/10/fixing-rtl8111-8168b-driver-debian-ubuntu/comment-page-1/#comment-126">some stuff</a> on the web about it.  Basically you use dkms to build a module that supposed to be updated everytime you update the kernel.  It actually worked pretty well for a while but I had to undo it all because of the next problem.</p>
<p>So I had a working box at this point and I built up all the DBs, loaded code and tools (rails3, rvm, etc).  I documented all of the install as I went and made a cheat sheet that's come in handy ever since (I'll post it later).</p>
<p>Unforunately, I ran into massive problems with the usb-serial port driver.  My bridge script cat_faucet_bridge.rb wouldn't start because it can't open /dev/ttyS0 or /dev/ttyUSB0.  The new kernel had a problem with the usb-serial driver.  So I was stuck.  I could either have:</p>
<ol>
<li>a box that works with my Arduino but crashes under 90MB of network traffic transfer (or who knows under what load)</li>
<li>a box that doesn't work with the Arduino but has a rock-solid network driver</li>
</ol></p>
<p>Awesome!  Either options are useless because I needed both.  I tried building my own kernel from source (which I've done many times back in the day) but it was turning out to be a lot of work because of how Ubuntu packages it's thing and runs grub-update.  Also, picking modules can be tricky.  I didn't want to get in my <a href="http://en.wikipedia.org/wiki/Back_to_the_Future">Delorean</a> and be a sysadmin again.  So I gave up.  Which turned out to be the right solution because another Ubuntu PPA hit (2.6.38-020638rc5-generic) that fixed everything.</p>
<h2>False hits</h2><p>
So now the Arduino is running, sending data to the <em>cat bridge</em> which is posting JSON to rails which is storing everything in MongoDB.  It works great.  Now I can figure out at what hour in the day my cat drinks the most.  Except when I wash my hands in the sink and trip the IR sensor.  Now I have a MongoDB entry in the versions document that's a false positive.  I need to go into the DB and remove it manually (or add an interface to do this).</p>
<p>My collection looks like this:</p>
<pre lang="javascript">
{ "_id" : ObjectId("5d5c9d56f2c31e1d0f000001"),
"collected_at" : "Tue Mar 01 2011 18:12:12 GMT-0500 (EST)",
"created_at" : "Wed Feb 16 2011 23:00:23 GMT-0500 (EST)",
"name" : "basement",
"proximity" : false,
"running" : false,
"updated_at" : "Fri Mar 04 2011 19:39:18 GMT-0500 (EST)",
"version" : 5,
"versions" : [
        {
                "version" : 1,
                "collected_at" : "Wed Feb 16 2011 23:00:32 GMT-0500 (EST)",
                "created_at" : "Wed Feb 16 2011 23:00:23 GMT-0500 (EST)",
                "name" : "basement",
                "proximity" : false,
                "running" : false,
                "updated_at" : "Wed Feb 16 2011 23:00:32 GMT-0500 (EST)",
                "_id" : ObjectId("4d6879ddf2c31e2ede000001")
        },
        {
                "version" : 2,
                "collected_at" : "Thu Feb 17 2011 22:16:05 GMT-0500 (EST)",
                "created_at" : "Wed Feb 16 2011 23:00:23 GMT-0500 (EST)",
                "name" : "basement",
                "proximity" : true,
                "running" : true,
                "updated_at" : "Thu Feb 17 2011 22:16:05 GMT-0500 (EST)",
                "_id" : ObjectId("4d6879ddf2c31e2ede000002")
        },
        {
                "collected_at" : "Thu Feb 17 2011 22:16:13 GMT-0500 (EST)",
                "created_at" : "Wed Feb 16 2011 23:00:23 GMT-0500 (EST)",
                "name" : "basement",
                "proximity" : false,
                "running" : false,
                "updated_at" : "Thu Feb 17 2011 22:16:13 GMT-0500 (EST)",
                "version" : 3,
                "_id" : ObjectId("4d6879ddf2c31e2ede000003")
        },
        {
                "collected_at" : "Fri Feb 25 2011 22:56:13 GMT-0500 (EST)",
                "created_at" : "Wed Feb 16 2011 23:00:23 GMT-0500 (EST)",
                "name" : "basement",
                "proximity" : true,
                "running" : true,
                "updated_at" : "Fri Feb 25 2011 22:56:13 GMT-0500 (EST)",
                "version" : 4,
                "_id" : ObjectId("4d6879e4f2c31e2ede000004")
        }
</pre>
So let's say that I just tripped the sink.  The sink has a versions[] nested document because Mongoid has its versioning feature set to on.  Version 2 has a running:true attribute, Version 3 has running:false and the current version (5) is false.  That means the sink started off, turned on (by a cat) and turned off.  Then I accidentally turned it on (version 4).  I only graph and care about running:true because I'm graphing what hour the sink turns on.  So all I have to do is rollback the version in the versions embedded document.</p>
<p>Well it's not that easy on the command line.  First of all, I really want to pop off a version and substitute the current version with what I popped off the versions[] array.  I don't know how to do that in the mongo shell.  Maybe it's possible.  I can explain (however temporary) how I fix problems like this until I do it in the ORM layer (Mongoid) and build a proper UI around it.</p>
<p>First, make a backup.  MongoDB is unforgiving.  The command <code>mongodump -d database_name -o ~/tmp</code> will dump a binary dump that is not plain-text like mysqldump (unfortunately).  I was able to drop and re-import a collection like this:</p>
<pre>
// drop the collection I just eff'd up in the mongo shell
> db.mycollection.remove();</p>
<p># now I can restore my collection from the Unix shell
$ mongorestore -d database_name -c mycollection ~tmp/database_name/mycollection.bson
</pre></p>
<p>Of course there are many options other than this.  But now that I have some confidence in messing with my data directly, so I updated the false positive.  To do this, I need to delete 2 versions from my versions[] embedded document and possibly update the current document's date.  I don't always need to update the data (if it's running:false I don't care) but I thought I'd mention how to do it anyway.</p>
<pre>
// rollback the current document's date, replace the string in new Date() with a timestamp
db.sinks.update( { _id:ObjectId("5d5c9d56f2c31e1d0f000001") },
{$set: {'collected_at' : new Date("Tue Mar 01 2011 18:12:12 GMT-0500 (EST)") }});
// delete versions, sets to nulls
db.sinks.update( { _id:ObjectId("5d5c9d56f2c31e1d0f000001") }, {$unset: {'versions.3':1}});
db.sinks.update( { _id:ObjectId("5d5c9d56f2c31e1d0f000001") }, {$unset: {'versions.4':1}});
</pre></p>
<h2>Lessons Learned</h2></p>
<ol>
<li>The Arduino has very little memory and is annoying to code on.  This is because I'm used to rapid high level languages and embedded C is very far away from that.  I'm not trolling, it was really annoying when doing simple MD5 things took a night or two.  There's also memory problems and when things crash they crash hard with no exception handling.  My best advice is to try to get your problems off the Arduino as soon as possible.</li>
<li>The adjustable nature of Microrax means you don't have to be 1/16" accurate on your hacksaw skills.  This is nice.</li>
<li>If you build something intricate with Microrax, <a href="http://www.lynxmotion.com/c-144-microrax.aspx">order lots of</a> extra bolts, back-plates and joint pieces.  The lengths of aluminum channels don't go quick but the joint pieces do.</li>
<li>Servo torque changes depending on the voltage given.</li>
<li>Installation is a bit tricky.  Don't be afraid to change your design.</li>
<li>Calibration of the physical space is key.  Environmental and slight adjustments will be necessary unless you have many, many safeguards and overlapping functionality.
</li></p>
<li>Iterate, iterate, iterate</li>
<li>Don't over-engineer.  Check your assumptions with simple tests.</li>
</ol></p>
<h2>The Biggest Lesson</h2><p>
The biggest thing I learned from all this is how a project like this resonates with people more than software.  When a friend would come over, it was a more interesting presentation because of the physical component versus just a pure software demo.</p>
