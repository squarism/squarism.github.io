---
layout: post
status: publish
published: true
title: 10 Friggin Useful Linux Tips
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
excerpt: ! "A friggin run through 10 really friggin useful friggin Linux tips.\r\n"
wordpress_id: 20
wordpress_url: http://squarism.com/2003/04/09/10-friggin-useful-linux-tips/
date: !binary |-
  MjAwMy0wNC0wOSAxMzowOToxMCAtMDQwMA==
date_gmt: !binary |-
  MjAwMy0wNC0wOSAxODowOToxMCAtMDQwMA==
categories:
- Unix
tags: []
comments:
- id: 4
  author: ''
  author_email: ''
  author_url: ''
  date: !binary |-
    MjAwMy0wNC0xNCAwMDowNzowOSAtMDQwMA==
  date_gmt: !binary |-
    MjAwMy0wNC0xNCAwNDowNzowOSAtMDQwMA==
  content: ! 'nice tips... although I find them F''in unfriggin believable

'
---
<p>A friggin run through 10 really friggin useful friggin Linux tips.
<a id="more"></a><a id="more-20"></a></p>
<p>
These tips are quick and dirty.  I encourage everyone to try to learn the mechanics behind these "just do it" instructions.
</p></p>
<h4>1. Filename completion in Bash</h4></p>
<p>
This may be an obvious one to some, but bear with me.  By far the most useful thing is speed and quickness on the command line.  Bash makes the shell quick and easy to use.  You can find commands that you didn't know about with command completion.  You can complete long filenames without having to type the whole thing.
</p></p>
<p>
The tab key, [tab], is the filename and command completion key.  You can hit [tab] to complete directory names, filenames and even commands that are in your $PATH environment variable.  [tab] can be hit twice to list files, directories and commands matching your input thus far.  For example, let's say we have three commands: show, shift and set.  If I type "s, [tab]", nothing happens because "s" is the 1st letter in all three commands.  "s" is not unique.  However, I can type "s, [tab], [tab]" to display all the commands that start with "s" (this would display all three).  If I type "sh, [tab], [tab]", then show and shift are displayed.
</p></p>
<p>
You get the idea.  The best way to learn more is to try it out for yourself.  Most Linux distros come with Bash, if you aren't sure what your current shell is, do a `echo $SHELL' to find out.  If you aren't running bash, just type `bash' to run bash.
</p></p>
<h4>2. Customizing your environment with profiles</h4></p>
<p>
There are many environment variables that you don't want to have to set manually everytime you log in.  You can set these variables automatically with profile scripts.  There are a few files that execute in a certain order:</p>
<ol>
<li>/etc/profile <i>system wide profile, maintained by root</i></li>
<li>.bash_profile</li>
<li>.bash_login <i>if .bash_profile is not found</i></li>
<li>.profile <i>if .bash_profile and .bash_login not found</i></li>
</ol></p>
<p>There's nothing special about /etc/profile except for two things: 1. every user picks it up when they log in  2. it's usally a root writable file only.  Typically, if more than one user uses a environment variable (like $JAVA_HOME) then you should throw it into /etc/profile.
</p></p>
<p>
So what kinds of things do you put in your profile?  Before we take a look at an example, remember that the profile gets executed in order.  If you are changing a default /etc/profile, typically you'll want to throw your own stuff at the bottom of the file.</p>
<pre>
# Ant/Java stuff
export PATH=$PATH:/usr/local/apache/bin:/usr/local/jakarta-ant-1.5/bin:/usr/java/j2sdk1.4.0/bin
export JAVA_HOME=/usr/java/j2sdk1.4.0
export CLASSPATH=.:/usr/java/castor:/usr/java/xerces/tools/xml-apis.jar:/usr/java/castor/castor-0.9.4.jar</p>
<p>MANPATH=$MANPATH:/usr/local/man
export MANPATH</p>
<p></pre></p>
<p>Take a look at the PATH statement.  PATH has been defined earlier and I don't want to throw away its contents, so we include $PATH.  If we did PATH=/usr/local/bin, PATH would only be /usr/local/bin.  Seeing how there are many useful things in directories like /bin and /usr/bin, this would be bad.
</p></p>
<p>
A few other things, MANPATH holds the directories for man pages and colons separate directories and files in a list.  Also, if you want to read in a profile without having to log out and log back in, try: `. /etc/profile' or `source /etc/profile'.  You can substitute /etc/profile with "whatever" profile file.
</p></p>
<h4>3. Jobs and background processes</h4></p>
<p>
You can start up a background process by appending an ampersand.  You can view the background jobs with `jobs'.  You can bring a job back to the foreground with `fg [job number]' where [job number] is the number of the job.  Let's create a quick script and put it into the background:</p>
<pre>
echo 'while (true); do echo yay; sleep 1; done' > yay.sh
</pre></p>
<p>Now we have a yay.sh script.  Let's make sure that is full of what we want.</p>
<pre>
[chris@server /tmp]$ cat yay.sh
while (true); do echo yay; sleep 1; done
</pre></p>
<p>Good.  Now let's run the script.</p>
<pre>
[chris@server /tmp]$ sh yay.sh
yay
yay
yay
...
</pre></p>
<p>So this is running and it's annoying us.  Hit [ctrl+z] to stop it and then type `bg 1' to put it into the background.  Note that it keeps outputing to the screen.  This is probably because `echo' writes to STDOUT which is what our terminal is on.  Normally, [ctrl+c] will send a break but since it's in the background, the [ctrl+c] doesn't work like you'd expect it to, it's tricking you.  Through the madness, type `fg 1'.  Now hit [ctrl+c].
</p></p>
<pre>
[chris@server /tmp]$ sh yay.sh
yay
yay</p>
<p>[1]+  Stopped                 sh yay.sh
[chris@server /tmp]$ bg 1
[1]+ sh yay.sh &amp;
[chris@server /tmp]$ yay
yay
yay
fgyay
 yay
1
sh yay.sh
yay
yay</p>
<p>[chris@server /tmp]$
</pre></p>
<p>One more thing on background jobs.  If a job is running in the background and you log out, the jobs is going to stop.  You can make a job persist in the background by starting it with the utility 'nohup'.  For example: `nohup ncftpget ftp://ftp.netscape.com/hugedownload.zip &amp;' would start the ncftpget program (a FTP downloader) with nohup in the background.  It'll run until we `kill' it, even if we log out.</p>
<h4>4. History expansion variables</h4></p>
<p>
Whether you use csh or bash, there are a few variables to make your life easier when trying to recall previous commands.
</p></p>
<p>
Let's say we are trying to create a directory called "/tmp/aDirectory/aSubDirectory/ohMyThisIsLong".  We create the directory and now we want go there quickly:</p>
<pre>
[chris@server /]$pwd
/
[chris@server chris]$ mkdir -p /tmp/aDirectory/aSubDirectory/ohMyThisIsLong
[chris@server chris]$ cd !:2
cd /tmp/aDirectory/aSubDirectory/ohMyThisIsLong
[chris@server ohMyThisIsLong]$ pwd
/tmp/aDirectory/aSubDirectory/ohMyThisIsLong
</pre></p>
<p>What is "!:2"?  ! calls the last command and :2 means "substitute the 3rd command parameter" (remember that the list starts with 0).  You can even print a history parameter with ":p":</p>
<pre>
[chris@server /]$ dog cat bird worm dirt
bash: dog: command not found
[chris@server /]$ !:1:p
cat
[chris@server /]$
</pre></p>
<p>You get the idea.  Again, the best way to learn is to try.
</p></p>
<h4>5. The fuser command</h4></p>
<p>
Let's say you can't figure out what's accessing a file or directory.  You need to kill the job, maybe you want to eject the CD, maybe you want to move the file ... Use fuser to view all the processes acessing a file or directory resource:
</p></p>
<pre>
fuser /mnt/cdrom
</pre></p>
<h4>6. Screen</h4></p>
<p>
I've written about screen before.  Can't preach enough about it.  So much better than nohup.  Run `screen' to start screen.  Hit [ctrl+a, ctrl+-] to open another virtual terminal, hit [ctrl+a, ctrl+c] to open a shell on that v-terminal.  Hit [ctrl+a, ctrl+d] to detach and run `screen -r' to reattach.  Very useful for logging in somewhere and keeping your sessions open when you go home or switch workstations.  For example:</p>
<ul>
<li>You could ssh to home, start a huge download, detach, drive home and reattach after your commute.</li>
<li>You can grab a text mode ICQ client and stay connected all the time whether you are logged in or not.</li>
<li>You can start a long compile job and log out without erasing any errors.</li>
<li>You don't have to set up your "One True Way" every time you log in.  For example, I like to have a browser in window #1, a shell in window #2 and something else in #3.  You'd just have to set this up once.</li>
<li>You can stay connected to IRC.</li>
</ul></p>
<h4>7. Text mode browsers</h4></p>
<p>
Can't get a GUI started up?  Try `links' or `lynx'.  Links does better frames, lynx can do HTTP authentication.  Get started with `links www.google.com' or `lynx www.google.com'.
</p></p>
<h4>8. RPMFind.net</h4></p>
<p>
The best place to grab missing RPMs is from <a href="http://www.rpmfind.net">RPMFind.net</a> hosted by the nice people at SpeakEasy (Speakeasy rocks as an ISP).  Let's say you're on your windows box and you want to install nethack (a famous rpg game).</p>
<ol>
<li>Open IE and goto www.rpmfind.net</li>
<li>Search for nethack</li>
<li>Find the rpm best matching your Linux distro</li>
<li>Right click on the rpm file itself and "Copy Link Location"</li>
<li>ssh into your linux box</li>
<li>Either download the rpm and install it later - `wget [paste]'</li>
<li>Or have rpm download it and install it in one motion - `rpm -ivh [paste]'</li>
</ol>
Of course, if the rpm install fails, you have to download it again (like if you're missing the ncurses library for nethack).
</p></p>
<h4>9. Working with processes</h4></p>
<ul>
<li>
List all processes:</p>
<pre>ps aux</pre></p>
<li>
List all process matching 'String':</p>
<pre>ps aux | grep String</pre></p>
<li>
Monitor top CPU utilizing processes:</p>
<pre>top</pre></p>
<li>
Display what processes spawned what:</p>
<pre>pstree [process id]</pre></p>
<li>
Kill a process:</p>
<pre>kill [process id]</pre></p>
<li>
Kill a process with authority:</p>
<pre>kill -9 [process id]</pre></p>
<li>
Try to restart a process by sending it the SIGHUP signal.  (The program has to be coded to restart if it receives this signal):</p>
<pre>kill -HUP [process id]</pre></p>
<li>
Kill a process by its process name, for example: apache runs as httpd</p>
<pre>killall httpd</pre>
</ul></p>
<h4>10. Finding stuff</h4></p>
<p>
It's not easy finding files and folders.  UNIX is full of antiquated terms and abbreviations.  Someone asked me, "What does /etc stand for?".  It stands for 'et cetera'.  /etc is where people used to put miscellaneous files.  Now you typically find all the configuration files there.  How can you know all this?  Experience?
</p></p>
<p>
Nah.  Just use the `locate' command.  Like "locate httpd.conf" or "locate ssh".  Locate looks in a database for file info.  The database update typically runs as a cron job.  If you just copied a file 5 minutes ago, chances are that locate won't find it.  You can force a database update with `updatedb'.  Or...
</p></p>
<p>
You can use the `find' command.  Like `find / | grep httpd.conf' would search for httpd.conf starting at the root directory.
</p></p>
