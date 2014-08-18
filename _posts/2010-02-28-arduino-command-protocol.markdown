---
layout: post
status: publish
published: true
title: Arduino command protocol
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
excerpt: ! "<strong>UPDATE:</strong> Use <a href=\"http://arduino.cc/playground/Code/CmdMessenger\">CmdMessenger</a>
  instead of Messenger.\r\n\r\nHere's my IRC Arduino Bot.  It uses a regular <a href=\"http://www.sparkfun.com/commerce/product_info.php?products_id=666\">Arduino
  328</a> and an <a href=\"http://www.sparkfun.com/commerce/product_info.php?products_id=9026\">Ethernet
  Shield</a> both from sparkfun.  As for software, I'm using the Ethernet2 library
  (see <a href=\"http://squarism.com/2010/02/06/ethernet2-arduino-library-fix-on-0017/\">my
  previous post</a> about this), the <a href=\"http://www.arduino.cc/en/Tutorial/TextString\">WString
  library</a> and a homerolled <a href=\"http://www.ietf.org/rfc/rfc1459.txt\">IRC
  protocol</a> parser.  The breadboard's power is connected to arbitrary pin 5
  and some resistors to keep the LED from burning out.\r\n\r\n<img src=\"/uploads/2010/02/arduino_irc_light-580x435.png\"
  alt=\"arduino_irc_light\" title=\"arduino_irc_light\" width=\"580\" height=\"435\"
  class=\"aligncenter size-large wp-image-355\" />\r\n\r\nBasically, my bot joins
  an IRC channel and then listens for PRIVMSG commands starting with a password.  It
  takes those commands and controls an LED.  For example, I'd send this privately
  to the Arduino:\r\n<code>command password LEDON</code>\r\n\r\nAnd then the red
  LED comes on.  I tell it \"LEDOFF\" and it turns off.  Ok, it's not a new RFC spec
  worthy of IEEE recognition and international adoption.  But it got the job done
  in a human-readable manner.  Previously on my facebook status light project, I had
  done much of the processing on my laptop and only send hex codes to the Arduino
  to light up LEDs.  The difference now is that the Arduino is doing the processing
  and no computer is needed.\r\n\r\nWhile I was working on this little project, I
  had the bot join the channel and announce itself.\r\n<img src=\"/uploads/2010/02/irc_log.png\"
  alt=\"irc_log\" title=\"irc_log\" width=\"556\" height=\"372\" class=\"aligncenter
  size-full wp-image-356\" />\r\n\r\nAt one point, I was working on code and then
  my bot would disconnect.  I checked the serial monitor and the server seemed to
  drop me after a few minutes.  The channel would say that I timed out.  I realized
  that I wasn't responding to the PING from the server.  So I threw in some code that
  checks for anything from the server that starts with \"PING :\".  I then respond
  with \"PONG\".  I remember seeing PING?/PONG! messages in mIRC back in the day.
  \ Now it makes sense why mIRC was doing that in the console window.\r\n\r\nIt works
  great and I was excited about how much this little board could do in 14KB.  And
  then I kept testing it.  After about 7 or 8 \"turn on\" and \"turn off\" commands,
  the Arduino wouldn't do anything anymore.  It's like it just froze.  If I typed
  5 commands, it'd stay connected for a long time.  But every time I'd send it 7 to
  8 commands, it would lock up.  And by lock up, I mean the commands wouldn't work
  anymore and it would time out from the server.  WTF.  So close!\r\n\r\nSo I figure
  that it's something to do with pointers and memory.  I really don't have a solid
  grasp on pointers and C.  I got a lot of this working by iterative experimentation
  over many days.  So I was looking for a better way to send human readable commands
  to my bot.  By human readable I mean something that works like a unix command \"command
  arg1 arg2\".  Of course this human readable bit introduces strings which is tricky
  enough in C (for me) and even worse on the Arduino.  I figured this was a problem
  that someone smarter than me had solved.\r\n\r\nI found a library called <a href=\"http://www.arduino.cc/playground/Code/Messenger\">Messenger</a>.
  \ It's pretty simple to install, just throw it in your ~/Documents/Arduino/libraries
  folder on Mac and um ... the equivalent on Windows?  There are examples in the Messenger
  folder that you can checkout.  HOWEVER the whole point of me posting this big long
  thing is the following.\r\n\r\nThe example checkString really threw me for a loop.
  \ It did exactly what I need it do to in a much cleaner way.  I uploaded to the
  Arduino and then broke out to a shell.\r\n\r\n<code>$ screen /dev/tty.usbserial-A9005bCr
  115200</code>\r\n\r\nSubstitute your virtual usb device for the /dev/tty
  path.  Note that the sketch uses 115k serial speed.  You won't see anything when
  you type but if you hit \"enter\" (to clear the buffer) \"on[enter]\" in screen
  LED 13 will turn on.  Type \"off[enter]\" ([enter] means the enter key) and it will
  turn off.  Great!  Exactly what I need.  But then I tried typing \"on\" then \"off\"
  then \"muffins\" then \"on\" and the light stayed off.  Any garbage gets the Arduino
  stuck like my sketch.  Ok, is what I'm trying to do impossible or is this just coincidence?\r\n\r\nI
  modified the checkString example to look like this:\r\n<pre lang=\"Java\" line=\"1\">//
  This example demonstrates Messenger's checkString method\r\n// It turns
  on the LED attached to pin 13 if it receives \"on\"\r\n// It turns it off
  if it receives \"off\"\r\n\r\n\r\n#include <Messenger.h>\r\n\r\n\r\n// Instantiate
  Messenger object with the message function and the default separator \r\n//
  (the space character)\r\nMessenger message = Messenger(); \r\n\r\n\r\n//
  Define messenger function\r\nvoid messageCompleted() {\r\n  // This loop
  will echo each element of the message separately\r\n  while ( message.available()
  ) {\r\n    if ( message.checkString(\"on\") ) {\r\n      digitalWrite(13,HIGH);\r\n
  \   } else if ( message.checkString(\"off\") ) {\r\n      digitalWrite(13,LOW);\r\n
  \   } else {       // ADD THIS\r\n      break;     // ADD THIS\r\n
  \   }                // ADD THIS\r\n  }\r\n  \r\n  \r\n}\r\n\r\nvoid setup()
  {\r\n  // Initiate Serial Communication\r\n  Serial.begin(115200); \r\n
  \ message.attach(messageCompleted);\r\n  \r\n  pinMode(13,OUTPUT);\r\n  \r\n}\r\n\r\nvoid
  loop() {\r\n  \r\n  // The following line is the most effective way of \r\n
  \ // feeding the serial data to Messenger\r\n  while ( Serial.available()
  ) message.process( Serial.read() );\r\n\r\n\r\n}\r\n</pre>\r\n\r\nI added the
  break and it's able to deal with garbage.  I tested more than 20 commands with banging
  on the keyboard in between and it seems pretty solid.  Now I just need to integrate
  this with my IRC bot and I might have something that can stay online for a while.\r\n\r\nBy
  the way, after you use screen to connect to a serial port, hit \"Ctrl+A, k\" to
  kill the window and break out of screen.\r\n\r\n<strong>Update</strong>: People
  have asked for the code.  It's posted after the break.\r\n"
wordpress_id: 354
wordpress_url: http://squarism.com/?p=354
date: !binary |-
  MjAxMC0wMi0yOCAxMTo0MDo1NyAtMDUwMA==
date_gmt: !binary |-
  MjAxMC0wMi0yOCAxNjo0MDo1NyAtMDUwMA==
categories:
- Arduino
tags: []
comments:
- id: 1880
  author: Kid
  author_email: coding-kid@hotmail.com
  author_url: http://coding-kid.tk
  date: !binary |-
    MjAxMC0wNS0wMSAwMzo0ODozNCAtMDQwMA==
  date_gmt: !binary |-
    MjAxMC0wNS0wMSAwODo0ODozNCAtMDQwMA==
  content: Hey, this is awesome! Could you please post the code?
- id: 1955
  author: Jamie Trenchard
  author_email: jtrenchard@lxsys.co.cc
  author_url: ''
  date: !binary |-
    MjAxMC0wNS0xNiAxNDozMToyOCAtMDQwMA==
  date_gmt: !binary |-
    MjAxMC0wNS0xNiAxOTozMToyOCAtMDQwMA==
  content: Nice! Would you  be able to post the code for us?? I'd love to see how
    you did it, as I'm trying to build myself an IRC "box" that plugs into my TV,
    so I can use it for IRC. (IRC is way better than the crap on bbc at 3 in the morning.)
- id: 2193
  author: Kid
  author_email: coding-kid@hotmail.com
  author_url: http://coding-kid.tk
  date: !binary |-
    MjAxMC0wNi0xOSAxNDoyODoxOCAtMDQwMA==
  date_gmt: !binary |-
    MjAxMC0wNi0xOSAxOToyODoxOCAtMDQwMA==
  content: ! 'A little note to everybody else writing his own bot:  use ''if(c !=
    ''\n''){B}else{A}'' and not ''if(c == ''\n''){A}else{B}'', because the last one
    will be always true.'
- id: 5183
  author: Marby
  author_email: Marby@yahoo.com
  author_url: ''
  date: !binary |-
    MjAxMS0wMS0yOCAxOTozMDozMCAtMDUwMA==
  date_gmt: !binary |-
    MjAxMS0wMS0yOSAwMDozMDozMCAtMDUwMA==
  content: I am very thankful to this topic because it really gives great information.
- id: 5645
  author: Min2liz
  author_email: min2lizz@gmail.com
  author_url: ''
  date: !binary |-
    MjAxMS0wMy0yMCAwNTozMzoyOCAtMDQwMA==
  date_gmt: !binary |-
    MjAxMS0wMy0yMCAxMDozMzoyOCAtMDQwMA==
  content: ! "Thanks for your code, but maybe can you help me with some issues:\r\n\r\nI
    have some Arduino IDE: 0022, 0017, 0019 and paste your code. \r\nI have only one
    problem with WString, and don't know how to solved it.\r\nHere is error:\r\n\r\nirc.cpp:
    In function 'int readIRCRequest(Client)':\r\nirc:89: error: 'class String' has
    no member named 'append'\r\nirc:93: error: no matching function for call to 'debug(String&amp;)'\r\nirc.cpp:23:
    note: candidates are: void debug(char*)\r\nirc.cpp:24: note:                 void
    debug(String*)\r\nirc.cpp:25: note:                 void debug(int)\r\nirc:96:
    error: 'class String' has no member named 'contains'\r\nirc:100: error: 'class
    String' has no member named 'contains'\r\nirc:103: error: 'class String' has no
    member named 'contains'\r\n\r\nand so on.\r\n\r\nCan explain how to solve this
    error. I'm tryed different Arduino IDE's but still no luck."
- id: 6964
  author: Elwood Menter
  author_email: Emmerling56@yahoo.com
  author_url: ''
  date: !binary |-
    MjAxMi0wNS0xNiAxNzo0NjozNyAtMDQwMA==
  date_gmt: !binary |-
    MjAxMi0wNS0xNiAyMjo0NjozNyAtMDQwMA==
  content: Thx for information.
---
<p><strong>UPDATE:</strong> Use <a href="http://arduino.cc/playground/Code/CmdMessenger">CmdMessenger</a> instead of Messenger.</p>
<p>Here's my IRC Arduino Bot.  It uses a regular <a href="http://www.sparkfun.com/commerce/product_info.php?products_id=666">Arduino 328</a> and an <a href="http://www.sparkfun.com/commerce/product_info.php?products_id=9026">Ethernet Shield</a> both from sparkfun.  As for software, I'm using the Ethernet2 library (see <a href="http://squarism.com/2010/02/06/ethernet2-arduino-library-fix-on-0017/">my previous post</a> about this), the <a href="http://www.arduino.cc/en/Tutorial/TextString">WString library</a> and a homerolled <a href="http://www.ietf.org/rfc/rfc1459.txt">IRC protocol</a> parser.  The breadboard's power is connected to arbitrary pin 5 and some resistors to keep the LED from burning out.</p>
<p><img src="/uploads/2010/02/arduino_irc_light-580x435.png" alt="arduino_irc_light" title="arduino_irc_light" width="580" height="435" class="aligncenter size-large wp-image-355" /></p>
<p>Basically, my bot joins an IRC channel and then listens for PRIVMSG commands starting with a password.  It takes those commands and controls an LED.  For example, I'd send this privately to the Arduino:
<code>command password LEDON</code></p>
<p>And then the red LED comes on.  I tell it "LEDOFF" and it turns off.  Ok, it's not a new RFC spec worthy of IEEE recognition and international adoption.  But it got the job done in a human-readable manner.  Previously on my facebook status light project, I had done much of the processing on my laptop and only send hex codes to the Arduino to light up LEDs.  The difference now is that the Arduino is doing the processing and no computer is needed.</p>
<p>While I was working on this little project, I had the bot join the channel and announce itself.
<img src="/uploads/2010/02/irc_log.png" alt="irc_log" title="irc_log" width="556" height="372" class="aligncenter size-full wp-image-356" /></p>
<p>At one point, I was working on code and then my bot would disconnect.  I checked the serial monitor and the server seemed to drop me after a few minutes.  The channel would say that I timed out.  I realized that I wasn't responding to the PING from the server.  So I threw in some code that checks for anything from the server that starts with "PING :".  I then respond with "PONG".  I remember seeing PING?/PONG! messages in mIRC back in the day.  Now it makes sense why mIRC was doing that in the console window.</p>
<p>It works great and I was excited about how much this little board could do in 14KB.  And then I kept testing it.  After about 7 or 8 "turn on" and "turn off" commands, the Arduino wouldn't do anything anymore.  It's like it just froze.  If I typed 5 commands, it'd stay connected for a long time.  But every time I'd send it 7 to 8 commands, it would lock up.  And by lock up, I mean the commands wouldn't work anymore and it would time out from the server.  WTF.  So close!</p>
<p>So I figure that it's something to do with pointers and memory.  I really don't have a solid grasp on pointers and C.  I got a lot of this working by iterative experimentation over many days.  So I was looking for a better way to send human readable commands to my bot.  By human readable I mean something that works like a unix command "command arg1 arg2".  Of course this human readable bit introduces strings which is tricky enough in C (for me) and even worse on the Arduino.  I figured this was a problem that someone smarter than me had solved.</p>
<p>I found a library called <a href="http://www.arduino.cc/playground/Code/Messenger">Messenger</a>.  It's pretty simple to install, just throw it in your ~/Documents/Arduino/libraries folder on Mac and um ... the equivalent on Windows?  There are examples in the Messenger folder that you can checkout.  HOWEVER the whole point of me posting this big long thing is the following.</p>
<p>The example checkString really threw me for a loop.  It did exactly what I need it do to in a much cleaner way.  I uploaded to the Arduino and then broke out to a shell.</p>
<p><code>$ screen /dev/tty.usbserial-A9005bCr 115200</code></p>
<p>Substitute your virtual usb device for the /dev/tty path.  Note that the sketch uses 115k serial speed.  You won't see anything when you type but if you hit "enter" (to clear the buffer) "on[enter]" in screen LED 13 will turn on.  Type "off[enter]" ([enter] means the enter key) and it will turn off.  Great!  Exactly what I need.  But then I tried typing "on" then "off" then "muffins" then "on" and the light stayed off.  Any garbage gets the Arduino stuck like my sketch.  Ok, is what I'm trying to do impossible or is this just coincidence?</p>
<p>I modified the checkString example to look like this:</p>
<pre lang="Java" line="1">// This example demonstrates Messenger's checkString method
// It turns on the LED attached to pin 13 if it receives "on"
// It turns it off if it receives "off"</p>
<p>#include <Messenger.h></p>
<p>// Instantiate Messenger object with the message function and the default separator
// (the space character)
Messenger message = Messenger(); </p>
<p>// Define messenger function
void messageCompleted() {
  // This loop will echo each element of the message separately
  while ( message.available() ) {
    if ( message.checkString("on") ) {
      digitalWrite(13,HIGH);
    } else if ( message.checkString("off") ) {
      digitalWrite(13,LOW);
    } else {       // ADD THIS
      break;     // ADD THIS
    }                // ADD THIS
  }</p>
<p>}</p>
<p>void setup() {
  // Initiate Serial Communication
  Serial.begin(115200);
  message.attach(messageCompleted);</p>
<p>  pinMode(13,OUTPUT);</p>
<p>}</p>
<p>void loop() {</p>
<p>  // The following line is the most effective way of
  // feeding the serial data to Messenger
  while ( Serial.available() ) message.process( Serial.read() );</p>
<p>}
</pre></p>
<p>I added the break and it's able to deal with garbage.  I tested more than 20 commands with banging on the keyboard in between and it seems pretty solid.  Now I just need to integrate this with my IRC bot and I might have something that can stay online for a while.</p>
<p>By the way, after you use screen to connect to a serial port, hit "Ctrl+A, k" to kill the window and break out of screen.</p>
<p><strong>Update</strong>: People have asked for the code.  It's posted after the break.
<a id="more"></a><a id="more-354"></a></p>
<pre lang="java">// UNSTABLE IRC BOT
// TODO: Integrate with Messenger.h for stability
#include <Ethernet2.h>
#include <WString.h></p>
<p>#define STRING_BUFFER_SIZE 128
String buffer = String(STRING_BUFFER_SIZE);</p>
<p>// string variable to hold server name detection
String hostString = String(50);</p>
<p>byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };</p>
<p>// CHANGE ME
byte ip[] = { 1, 2, 3, 4 };  // arduino IP: 1.2.3.4
byte gateway[] = { 1, 2, 3, 4 };  // your router IP: 1.2.3.4
byte subnet[] = { 255, 255, 255, 0 };  // your network mask</p>
<p>// irc.freenode.net
byte ircServer[] = { 74, 208, 174, 239 };  // IP of freenode.net</p>
<p>int responseWait = 100;         // default: 1000
int joinWait = 100;             // default: 1000
int pingCheckThrottle = 10000;  // check for PING event every 10 seconds once connected
int reconnectWait = 5000;</p>
<p>// CHANGE ME
char ircNick[20] = "DuinoFace";
char channel[20] = "#freebsToTheDee";
boolean isLoggedIn = false;</p>
<p>Client client(ircServer, 6667);</p>
<p>// turn on when debugging
boolean isDebugOn = true;</p>
<p>// logged in (in channel) status light
int ledPin = 2;</p>
<p>void setup()
{
  //router time?
  delay(500);
  Serial.begin(9600);	// opens serial port, sets data rate to 9600 bps</p>
<p>  // Say hello:
  debugNoLine("String Library version: ");
  debug(buffer.version());</p>
<p>  Ethernet.begin(mac, ip, gateway, subnet);
  delay(responseWait);</p>
<p>  debug("client.connect()");
  if (!client.connect()) {
    debug("client.connect() failed.");
  }</p>
<p>  // status light
  pinMode(ledPin, OUTPUT);</p>
<p>}</p>
<p>void loop()
{
  if (client.available() && client.connected()) {
    // parse the incoming buffer
    readIRCRequest(client);
  }</p>
<p>  if (!client.connected()) {
    debug("Disconnected");
    client.stop();
    delay(reconnectWait);</p>
<p>    debug("Reconnecting...");
    isLoggedIn = false;
    setStatusLight();
    client.connect();
  }
}</p>
<p>int readIRCRequest(Client client) {
  char inChar = client.read();</p>
<p>  if (inChar != '\n') {
    buffer.append(inChar);
  }
  else {
    debugNoLine("Buffer: ");
    debug(buffer);</p>
<p>    if (!isLoggedIn) {
      if (buffer.contains("NOTICE * :*** No Ident response")) {
        login();
        buffer = "";
      }
      else if (buffer.contains(":End of /MOTD command.")) {
        join();
      }
      else if (buffer.contains(":End of /NAMES list.")) {
        say();
        isLoggedIn = true;
        setStatusLight();
      }
    }
    else {
      checkCommand();
      checkPing();
      //delay(pingCheckThrottle);
    }</p>
<p>    // clear out buffer for next line read
    buffer = "";</p>
<p>  }
}</p>
<p>/* We need to send something that looks like this
 *   NICK yaytofu
 *   USER yaytofu 0 * yaytofu
 * Where yaytofu is our nickname
 */</p>
<p>void login() {
  String msg = String(50);
  msg = "NICK ";
  msg.append(ircNick);
  //if (debug) Serial.println(msg);
  debug(msg);
  client.println(msg);
  delay(responseWait); /* wait for a response */</p>
<p>  msg = "USER ";
  msg.append(ircNick);
  msg.append(" 0 * ");
  msg.append(ircNick);
  debug(msg);
  client.println(msg);</p>
<p>  delay(responseWait); /* wait for a response */
}</p>
<p>void join() {
  delay(joinWait);
  debug("JOIN...");
  client.println(strcat("JOIN ", channel));
  delay(responseWait);
}</p>
<p>void say() {
  //if (debug) Serial.println("Sending something to the channel.");
  debug("Sending something to channel.");
  client.println("PRIVMSG #freebsToTheDee :Arduino with Ethernet Shield is here.");
}</p>
<p>void say(char *msg) {
  debug("Sending something to channel.");
  client.print("PRIVMSG #freebsToTheDee :");
  client.println(msg);
}</p>
<p>void checkPing() {
  if (buffer.startsWith("PING :")) {
    debug("GOT PING!");</p>
<p>    // parse and store hostname in string
    if (hostString.length() == 0) {
      hostString = buffer.substring(5, buffer.length()-1);
    }</p>
<p>    // respond to ping
    debug("PONG!");
    client.print("PONG ");
    client.println(hostString);
    setStatusLight();</p>
<p>  }
}</p>
<p>void checkCommand() {
  // :nick!~nick@static-1-13-5-1.domain.com PRIVMSG #freebsToTheDee :wut
  // state codes 0=DNS   1=PRIVMSG   2=channel  3=message</p>
<p>  if (buffer.startsWith(":") && buffer.contains("PRIVMSG")) {</p>
<p>    int state = 0;
    int spaces[3] = { 0, 0, 0};</p>
<p>    // split on spaces, TODO: state check
    char *bufferArray = buffer.getChars();
    for (int i=0; i < buffer.length(); i++) {
      char test = bufferArray[i];
      if (test == ' ') {
        debugNoLine("found space at:");
        debug(i);
        spaces[state] = i;
        state++;
      }
    }</p>
<p>    String dnsName = buffer.substring(0, spaces[0]);
    String privMsg = buffer.substring(spaces[0]+1, spaces[1]);
    String channel = buffer.substring(spaces[1]+1, spaces[2]);
    String cmd = buffer.substring(spaces[2]+2, buffer.length());</p>
<p>    debugNoLine("dnsName:");
    debug(dnsName);
    debugNoLine("privMsg:");
    debug(privMsg);
    debugNoLine("channel:");
    debug(channel);
    debugNoLine("cmd:");
    debug(cmd);
  }
}</p>
<p>void setStatusLight() {
  if (isLoggedIn) {
    debug("Setting status light to ON.");
    digitalWrite(ledPin, HIGH);
  }
  else {
    debug("Setting status light to OFF.");
    digitalWrite(ledPin, LOW);
  }
}</p>
<p>// No carriage return
void debugNoLine(char *msg) {
  if (isDebugOn) Serial.print(msg);
}</p>
<p>// No carriage return overloaded
void debugNoLine(String *msg) {
  if (isDebugOn) Serial.print(*msg);
}</p>
<p>void debugNoLine(int *msg) {
  if (isDebugOn) Serial.print(*msg);
}</p>
<p>// Carriage return
void debug(char *msg) {
  if (isDebugOn) Serial.println(msg);
}</p>
<p>// Carriage return overloaded
void debug(String *msg) {
  if (isDebugOn) Serial.println(*msg);
}</p>
<p>void debug(int msg) {
  if (isDebugOn) Serial.println(msg);
}
</pre></p>
<p>Be sure to change the two sections of CHANGE ME.  Also please note that like I said in my post, I never integrated these two source files together.  So the IRC bot is unstable after about 8 commands.</p>
