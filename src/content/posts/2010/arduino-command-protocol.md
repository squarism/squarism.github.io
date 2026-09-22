---
title: "Arduino command protocol"
description: "UPDATE: Use CmdMessengerhttp://arduino.cc/playground/Code/CmdMessenger instead of Messenger."
date: 2010-02-28T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

**UPDATE:** Use [CmdMessenger](http://arduino.cc/playground/Code/CmdMessenger) instead of Messenger.

Here's my IRC Arduino Bot.  It uses a regular [Arduino 328](http://www.sparkfun.com/commerce/product_info.php?products_id=666) and an [Ethernet Shield](http://www.sparkfun.com/commerce/product_info.php?products_id=9026) both from sparkfun.  As for software, I'm using the Ethernet2 library (see [my previous post](/posts/ethernet2-arduino-library-fix-on-0017/) about this), the [WString library](http://www.arduino.cc/en/Tutorial/TextString) and a homerolled [IRC protocol](http://www.ietf.org/rfc/rfc1459.txt) parser.  The breadboard's power is connected to arbitrary pin 5 and some resistors to keep the LED from burning out.

![arduino_irc_light](/uploads/2010/02/arduino_irc_light.png "arduino_irc_light")

Basically, my bot joins an IRC channel and then listens for PRIVMSG commands starting with a password.  It takes those commands and controls an LED.  For example, I'd send this privately to the Arduino:
`command password LEDON`

And then the red LED comes on.  I tell it "LEDOFF" and it turns off.  Ok, it's not a new RFC spec worthy of IEEE recognition and international adoption.  But it got the job done in a human-readable manner.  Previously on my facebook status light project, I had done much of the processing on my laptop and only send hex codes to the Arduino to light up LEDs.  The difference now is that the Arduino is doing the processing and no computer is needed.

While I was working on this little project, I had the bot join the channel and announce itself.
![irc_log](/uploads/2010/02/irc_log.png "irc_log")

At one point, I was working on code and then my bot would disconnect.  I checked the serial monitor and the server seemed to drop me after a few minutes.  The channel would say that I timed out.  I realized that I wasn't responding to the PING from the server.  So I threw in some code that checks for anything from the server that starts with "PING :".  I then respond with "PONG".  I remember seeing PING?/PONG! messages in mIRC back in the day.  Now it makes sense why mIRC was doing that in the console window.

It works great and I was excited about how much this little board could do in 14KB.  And then I kept testing it.  After about 7 or 8 "turn on" and "turn off" commands, the Arduino wouldn't do anything anymore.  It's like it just froze.  If I typed 5 commands, it'd stay connected for a long time.  But every time I'd send it 7 to 8 commands, it would lock up.  And by lock up, I mean the commands wouldn't work anymore and it would time out from the server.  WTF.  So close!

So I figure that it's something to do with pointers and memory.  I really don't have a solid grasp on pointers and C.  I got a lot of this working by iterative experimentation over many days.  So I was looking for a better way to send human readable commands to my bot.  By human readable I mean something that works like a unix command "command arg1 arg2".  Of course this human readable bit introduces strings which is tricky enough in C (for me) and even worse on the Arduino.  I figured this was a problem that someone smarter than me had solved.

I found a library called [Messenger](http://www.arduino.cc/playground/Code/Messenger).  It's pretty simple to install, just throw it in your ~/Documents/Arduino/libraries folder on Mac and um ... the equivalent on Windows?  There are examples in the Messenger folder that you can checkout.  HOWEVER the whole point of me posting this big long thing is the following.

The example checkString really threw me for a loop.  It did exactly what I need it do to in a much cleaner way.  I uploaded to the Arduino and then broke out to a shell.

`$ screen /dev/tty.usbserial-A9005bCr 115200`

Substitute your virtual usb device for the /dev/tty path.  Note that the sketch uses 115k serial speed.  You won't see anything when you type but if you hit "enter" (to clear the buffer) "on[enter]" in screen LED 13 will turn on.  Type "off[enter]" ([enter] means the enter key) and it will turn off.  Great!  Exactly what I need.  But then I tried typing "on" then "off" then "muffins" then "on" and the light stayed off.  Any garbage gets the Arduino stuck like my sketch.  Ok, is what I'm trying to do impossible or is this just coincidence?

I modified the checkString example to look like this:

```java
// This example demonstrates Messenger's checkString method
// It turns on the LED attached to pin 13 if it receives "on"
// It turns it off if it receives "off"
#include <Messenger.h>

// Instantiate Messenger object with the message function and the default separator
// (the space character)
Messenger message = Messenger();

// Define messenger function
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
  }

}

void setup() {
  // Initiate Serial Communication
  Serial.begin(115200);
  message.attach(messageCompleted);

  pinMode(13,OUTPUT);

}

void loop() {

  // The following line is the most effective way of
  // feeding the serial data to Messenger
  while ( Serial.available() ) message.process( Serial.read() );

}
```

I added the break and it's able to deal with garbage.  I tested more than 20 commands with banging on the keyboard in between and it seems pretty solid.  Now I just need to integrate this with my IRC bot and I might have something that can stay online for a while.

By the way, after you use screen to connect to a serial port, hit "Ctrl+A, k" to kill the window and break out of screen.

**Update**: People have asked for the code.  It's posted after the break.

<!-- more -->

```java
// UNSTABLE IRC BOT
// TODO: Integrate with Messenger.h for stability
#include <Ethernet2.h>
#include <WString.h>
#define STRING_BUFFER_SIZE 128
String buffer = String(STRING_BUFFER_SIZE);

// string variable to hold server name detection
String hostString = String(50);

byte mac[] = { 0xDE, 0xAD, 0xBE, 0xEF, 0xFE, 0xED };

// CHANGE ME
byte ip[] = { 1, 2, 3, 4 };  // arduino IP: 1.2.3.4
byte gateway[] = { 1, 2, 3, 4 };  // your router IP: 1.2.3.4
byte subnet[] = { 255, 255, 255, 0 };  // your network mask

// irc.freenode.net
byte ircServer[] = { 74, 208, 174, 239 };  // IP of freenode.net

int responseWait = 100;         // default: 1000
int joinWait = 100;             // default: 1000
int pingCheckThrottle = 10000;  // check for PING event every 10 seconds once connected
int reconnectWait = 5000;

// CHANGE ME
char ircNick[20] = "DuinoFace";
char channel[20] = "#freebsToTheDee";
boolean isLoggedIn = false;

Client client(ircServer, 6667);

// turn on when debugging
boolean isDebugOn = true;

// logged in (in channel) status light
int ledPin = 2;

void setup()
{
  //router time?
  delay(500);
  Serial.begin(9600); // opens serial port, sets data rate to 9600 bps

  // Say hello:
  debugNoLine("String Library version: ");
  debug(buffer.version());

  Ethernet.begin(mac, ip, gateway, subnet);
  delay(responseWait);

  debug("client.connect()");
  if (!client.connect()) {
    debug("client.connect() failed.");
  }

  // status light
  pinMode(ledPin, OUTPUT);

}

void loop()
{
  if (client.available() && client.connected()) {
    // parse the incoming buffer
    readIRCRequest(client);
  }

  if (!client.connected()) {
    debug("Disconnected");
    client.stop();
    delay(reconnectWait);

    debug("Reconnecting...");
    isLoggedIn = false;
    setStatusLight();
    client.connect();
  }
}

int readIRCRequest(Client client) {
  char inChar = client.read();

  if (inChar != '\n') {
    buffer.append(inChar);
  }
  else {
    debugNoLine("Buffer: ");
    debug(buffer);

    if (!isLoggedIn) {
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
    }

    // clear out buffer for next line read
    buffer = "";

  }
}

/* We need to send something that looks like this
 *   NICK yaytofu
 *   USER yaytofu 0 * yaytofu
 * Where yaytofu is our nickname
 */

void login() {
  String msg = String(50);
  msg = "NICK ";
  msg.append(ircNick);
  //if (debug) Serial.println(msg);
  debug(msg);
  client.println(msg);
  delay(responseWait); /* wait for a response */

  msg = "USER ";
  msg.append(ircNick);
  msg.append(" 0 * ");
  msg.append(ircNick);
  debug(msg);
  client.println(msg);

  delay(responseWait); /* wait for a response */
}

void join() {
  delay(joinWait);
  debug("JOIN...");
  client.println(strcat("JOIN ", channel));
  delay(responseWait);
}

void say() {
  //if (debug) Serial.println("Sending something to the channel.");
  debug("Sending something to channel.");
  client.println("PRIVMSG #freebsToTheDee :Arduino with Ethernet Shield is here.");
}

void say(char *msg) {
  debug("Sending something to channel.");
  client.print("PRIVMSG #freebsToTheDee :");
  client.println(msg);
}

void checkPing() {
  if (buffer.startsWith("PING :")) {
    debug("GOT PING!");

    // parse and store hostname in string
    if (hostString.length() == 0) {
      hostString = buffer.substring(5, buffer.length()-1);
    }

    // respond to ping
    debug("PONG!");
    client.print("PONG ");
    client.println(hostString);
    setStatusLight();

  }
}

void checkCommand() {
  // :nick!~nick@static-1-13-5-1.domain.com PRIVMSG #freebsToTheDee :wut
  // state codes 0=DNS   1=PRIVMSG   2=channel  3=message

  if (buffer.startsWith(":") && buffer.contains("PRIVMSG")) {

    int state = 0;
    int spaces[3] = { 0, 0, 0};

    // split on spaces, TODO: state check
    char *bufferArray = buffer.getChars();
    for (int i=0; i < buffer.length(); i++) {
      char test = bufferArray[i];
      if (test == ' ') {
        debugNoLine("found space at:");
        debug(i);
        spaces[state] = i;
        state++;
      }
    }

    String dnsName = buffer.substring(0, spaces[0]);
    String privMsg = buffer.substring(spaces[0]+1, spaces[1]);
    String channel = buffer.substring(spaces[1]+1, spaces[2]);
    String cmd = buffer.substring(spaces[2]+2, buffer.length());

    debugNoLine("dnsName:");
    debug(dnsName);
    debugNoLine("privMsg:");
    debug(privMsg);
    debugNoLine("channel:");
    debug(channel);
    debugNoLine("cmd:");
    debug(cmd);
  }
}

void setStatusLight() {
  if (isLoggedIn) {
    debug("Setting status light to ON.");
    digitalWrite(ledPin, HIGH);
  }
  else {
    debug("Setting status light to OFF.");
    digitalWrite(ledPin, LOW);
  }
}

// No carriage return
void debugNoLine(char *msg) {
  if (isDebugOn) Serial.print(msg);
}

// No carriage return overloaded
void debugNoLine(String *msg) {
  if (isDebugOn) Serial.print(*msg);
}

void debugNoLine(int *msg) {
  if (isDebugOn) Serial.print(*msg);
}

// Carriage return
void debug(char *msg) {
  if (isDebugOn) Serial.println(msg);
}

// Carriage return overloaded
void debug(String *msg) {
  if (isDebugOn) Serial.println(*msg);
}

void debug(int msg) {
  if (isDebugOn) Serial.println(msg);
}
```

Be sure to change the two sections of CHANGE ME.  Also please note that like I said in my post, I never integrated these two source files together.  So the IRC bot is unstable after about 8 commands.
