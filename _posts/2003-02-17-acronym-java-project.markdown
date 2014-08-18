---
layout: post
status: publish
published: true
title: Acronym Java Project
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
excerpt: ! "<p>\r\nI am going to document my progress through a personal challenge
  so to help others and myself learn about steps A-Z in creating a web app from scratch.\r\n</p>\r\n<p>\r\nThe
  Acronym Challenge is going to be a posting game (I use this term loosely) where
  an acronym will be posted and people submit entries that match the acronym.  For
  example, TCP = tangy chocolate popsicles.  Then the entries can be voted on.  A
  set number of top scoring entries will be displayed, etc, etc.  The entire system
  will be anonymous to start with and may or may not incorporate login functionality.
  \ I want it to be easy to use.\r\n</p>\r\n\r\n<p><b>Technologies</b></p>\r\n\r\n<p>\r\nIt's
  going to be written in Java because I want to learn more about J2EE and Java in
  general.  My goal is to <i>write it from scratch</i> without using frameworks
  even though Struts looks very useful.  I'm using the <a href=\"http://www.eclipse.org/\">Eclipse</a>
  IDE and Tomcat 4.1.x as my web app server (more on that later).  Database support
  is going to have to be limited to MySQL because that's all I know.  Eclipse does
  the packaging a deployment for me with the <a href=\"http://eclipse-plugins.2y.net/\">Lomboz
  J2EE plugin</a>.  Eclipse also takes care of a lot of the Javadoc work.  I'm
  sparsely using CVS to track changes and keep a backup copy even though I'm the only
  one on my team.  :)\r\n</p>\r\n\r\n"
wordpress_id: 8
wordpress_url: http://squarism.com/2003/02/17/acronym-java-project/
date: !binary |-
  MjAwMy0wMi0xNyAxOTozMDoxMSAtMDUwMA==
date_gmt: !binary |-
  MjAwMy0wMi0xOCAwMDozMDoxMSAtMDUwMA==
categories:
- Blog
tags: []
comments: []
---
<p>
I am going to document my progress through a personal challenge so to help others and myself learn about steps A-Z in creating a web app from scratch.
</p></p>
<p>
The Acronym Challenge is going to be a posting game (I use this term loosely) where an acronym will be posted and people submit entries that match the acronym.  For example, TCP = tangy chocolate popsicles.  Then the entries can be voted on.  A set number of top scoring entries will be displayed, etc, etc.  The entire system will be anonymous to start with and may or may not incorporate login functionality.  I want it to be easy to use.
</p></p>
<p><b>Technologies</b></p></p>
<p>
It's going to be written in Java because I want to learn more about J2EE and Java in general.  My goal is to <i>write it from scratch</i> without using frameworks even though Struts looks very useful.  I'm using the <a href="http://www.eclipse.org/">Eclipse</a> IDE and Tomcat 4.1.x as my web app server (more on that later).  Database support is going to have to be limited to MySQL because that's all I know.  Eclipse does the packaging a deployment for me with the <a href="http://eclipse-plugins.2y.net/">Lomboz J2EE plugin</a>.  Eclipse also takes care of a lot of the Javadoc work.  I'm sparsely using CVS to track changes and keep a backup copy even though I'm the only one on my team.  :)
</p></p>
<p><a id="more"></a><a id="more-8"></a></p>
<p>
Originally, I had planned on using JBoss instead of Tomcat because of its hot-deploy features.  Unfortunately, I found that this didn't work very cleanly and my deploy time was too long.  I had also toyed with Cactus, but I don't quite understand how to externally instantiate a servlet.  So I ordered <a href="http://www.oreilly.com/catalog/jextprockbk/">a book that's not out yet</a>.  Hopefully, it will shed some light on JUnit as well.
</p></p>
<p>
I decided that I needed a controller.  It's a necessary part of the <a href="http://java.sun.com/blueprints/patterns/MVC.html">MVC model</a>.  The controller will handle all the actions that a user or internal process can generate.  When a user posts an acronym response, the controller will forward the request to a "Post servlet" or maybe post.jsp.  Post.jsp may show the user that the post was successful and then forward them back to the default display or main page.
</p></p>
<p><b>TODO</b></p></p>
<ol>
<li>I need to map the commands to something more useful than strings.
<li>I need to get the controller bit done and then work on more of the actions or commands.
<li>I need to decide how this app will be presented.  Portlet? / Able to be embedded in PHP? / Full browser layout?
</ol></p>
<p><b>Progress</b></p></p>
<p>
The focus of my efforts so far has been on the controller.  I have a controller that gets an initialization parameter from web.xml for a "command map" that externalizes the mappings of commands to business logic:<br></p>
<ol>
<li>User clicks on action that goes to http://server/controller/login</li>
<li>The controller loads a file I call commandMap.properties that contains key/value pairs like "myCommand=login.jsp"</li>
<li>I grab the end of the URL with getPathInfo() and strip off the beginning slash with a utility class</li>
<li>The login.jsp page will be displayed (not functional yet)</li>
</ol>
</p></p>
<p><b>Code Bits</b></p></p>
<p>
Here's a utility class that I use to strip off the beginning character from the path that's submitted.  I'll continue to expand as I need it.  Use it like this:
<code>String pathInfo = UrlParser.stripLeadingCharacter(req.getPathInfo());</code></p>
<p>
-- begin UrlParser.java --</p>
<pre>
package net.fuzzylemon.util;</p>
<p>/**
 * @author chris
 * @file UrlParser.java
 * @date Feb 17, 2003
 *
 */
public class UrlParser {</p>
<p>	/**
	 * Method stripLeadingCharacter
	 * strips leading character from String.<br> Useful for getPathInfo()
	 */
	public static String stripLeadingCharacter(String string) {</p>
<p>		StringBuffer sb = new StringBuffer();
		sb.append(string);
		sb.deleteCharAt(0);</p>
<p>		return sb.toString();
	}</p>
<p>	public static void main(String[] args) {
		System.out.println(UrlParser.stripLeadingCharacter("/test"));
	}
}
</pre>
-- end UrlParser.java --
</p></p>
<p>
I also made a utility class called Debug which prints out info easily.  I'm under Linux so I can just tail this file (it's hardcoded -- very bad) and observe <i>whatever</i>:
</p></p>
<p>
-- begin Debug.java --</p>
<pre>
package net.fuzzylemon.util;</p>
<p>import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;</p>
<p>/**
 * Logs errors to default /tmp/myDebug file unless overridden.<br>
 * Only handy for <b>me</b>. :)
 *
 * @author	chris
 * @file 	Debug.java
 * @date 	Feb 4, 2003
 */
public class Debug {
	/**
	 * Method println.
	 * @param string
	 */</p>
<p>	public static void println(String logValue) {
		try {
			File logfile = new File("/tmp/myDebug");
			PrintWriter printWriter =
				new PrintWriter(
					new BufferedWriter(new FileWriter(logfile, true)));
			printWriter.println(logValue);
			printWriter.close();
		} catch (IOException e) {
			e.getStackTrace();
		}
	}</p>
<p>	public static void println(String logValue, File logfile) {
		try {
			PrintWriter printWriter =
				new PrintWriter(
					new BufferedWriter(new FileWriter(logfile, true)));
			printWriter.println(logValue);
			printWriter.close();
		} catch (IOException e) {
			System.out.println("file can't be written to.  check permissions.");
			e.printStackTrace();
			System.exit(1);
		}
	}</p>
<p>	public static void main(String[] args) {</p>
<p>		String input = null;
		System.out.println("Enter test text to log:");</p>
<p>		try {
			while (true) {
				BufferedReader br =
					new BufferedReader(new InputStreamReader(System.in));
				input = br.readLine();
				Debug.println(input);
			}
		} catch (IOException ioe) {
			System.out.println("IOException error:");
			ioe.printStackTrace();
		}</p>
<p>	}
}
</pre>
-- end Debug.java --
</p></p>
