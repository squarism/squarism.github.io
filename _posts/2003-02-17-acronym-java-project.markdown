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
I am going to document my progress through a personal challenge so to help others and myself learn about steps A-Z in creating a web app from scratch.



The Acronym Challenge is going to be a posting game (I use this term loosely) where an acronym will be posted and people submit entries that match the acronym.  For example, TCP = tangy chocolate popsicles.  Then the entries can be voted on.  A set number of top scoring entries will be displayed, etc, etc.  The entire system will be anonymous to start with and may or may not incorporate login functionality.  I want it to be easy to use.



### Technologies

It's going to be written in Java because I want to learn more about J2EE and Java in general.  My goal is to _write it from scratch_ without using frameworks even though Struts looks very useful.  I'm using the [Eclipse](http://www.eclipse.org/) IDE and Tomcat 4.1.x as my web app server (more on that later).  Database support is going to have to be limited to MySQL because that's all I know.  Eclipse does the packaging a deployment for me with the [Lomboz J2EE plugin](http://eclipse-plugins.2y.net/).  Eclipse also takes care of a lot of the Javadoc work.  I'm sparsely using CVS to track changes and keep a backup copy even though I'm the only one on my team.  :)

<!-- more -->

Originally, I had planned on using JBoss instead of Tomcat because of its hot-deploy features.  Unfortunately, I found that this didn't work very cleanly and my deploy time was too long.  I had also toyed with Cactus, but I don't quite understand how to externally instantiate a servlet.  So I ordered [a book that's not out yet](http://www.oreilly.com/catalog/jextprockbk/).  Hopefully, it will shed some light on JUnit as well.



I decided that I needed a controller.  It's a necessary part of the [MVC model](http://java.sun.com/blueprints/patterns/MVC.html).  The controller will handle all the actions that a user or internal process can generate.  When a user posts an acronym response, the controller will forward the request to a "Post servlet" or maybe post.jsp.  Post.jsp may show the user that the post was successful and then forward them back to the default display or main page.



## TODO

## Progress

The focus of my efforts so far has been on the controller.  I have a controller that gets an initialization parameter from web.xml for a "command map" that externalizes the mappings of commands to business logic:

1.  User clicks on action that goes to http://server/controller/login
2.  The controller loads a file I call commandMap.properties that contains key/value pairs like "myCommand=login.jsp"
3.  I grab the end of the URL with getPathInfo() and strip off the beginning slash with a utility class
4.  The login.jsp page will be displayed (not functional yet)


**Code Bits**


Here's a utility class that I use to strip off the beginning character from the path that's submitted.  I'll continue to expand as I need it.  Use it like this:
`String pathInfo = UrlParser.stripLeadingCharacter(req.getPathInfo());`

{% highlight java %}
// -- UrlParser.java --
package net.fuzzylemon.util;

/**
 * @author chris
 * @file UrlParser.java
 * @date Feb 17, 2003
 *
 */
public class UrlParser {

  /**
   * Method stripLeadingCharacter
   * strips leading character from String.
 Useful for getPathInfo()
   */
  public static String stripLeadingCharacter(String string) {

    StringBuffer sb = new StringBuffer();
    sb.append(string);
    sb.deleteCharAt(0);

    return sb.toString();
  }

  public static void main(String[] args) {
    System.out.println(UrlParser.stripLeadingCharacter("/test"));
  }
}
{% endhighlight %}




I also made a utility class called Debug which prints out info easily.  I'm under Linux so I can just tail this file (it's hardcoded -- very bad) and observe _whatever_:


{% highlight java %}
// Debug.java
package net.fuzzylemon.util;

import java.io.BufferedReader;
import java.io.BufferedWriter;
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;
import java.io.InputStreamReader;
import java.io.PrintWriter;

/**
 * Logs errors to default /tmp/myDebug file unless overridden.

 * Only handy for **me**. :)
 *
 * @author  chris
 * @file  Debug.java
 * @date  Feb 4, 2003
 */
public class Debug {
  /**
   * Method println.
   * @param string
   */

  public static void println(String logValue) {
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
  }

  public static void println(String logValue, File logfile) {
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
  }

  public static void main(String[] args) {

    String input = null;
    System.out.println("Enter test text to log:");

    try {
      while (true) {
        BufferedReader br =
          new BufferedReader(new InputStreamReader(System.in));
        input = br.readLine();
        Debug.println(input);
      }
    } catch (IOException ioe) {
      System.out.println("IOException error:");
      ioe.printStackTrace();
    }

  }
}
{% endhighlight %}
