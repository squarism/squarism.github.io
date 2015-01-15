---
layout: post
status: publish
published: true
title: Acronym Project Update
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 9
wordpress_url: http://squarism.com/2003/02/17/acronym-project-update/
date: !binary |-
  MjAwMy0wMi0xNyAyMTozMjo1NiAtMDUwMA==
date_gmt: !binary |-
  MjAwMy0wMi0xOCAwMjozMjo1NiAtMDUwMA==
categories:
- Blog
tags: []
comments: []
---
Accomplished a few things today ... I finally figured out how to create an externalized mapping of commands to classes.  I was reading a chapter in the book [JavaServer Pages by Oreilly](http://www.oreilly.com/catalog/jserverpages/index.html?CMP=IL7015).  They described a popular technique of creating an Action Interface and then extending this interface to give you a mapping of actions to class names.  This is the code snippet they show:

<!-- more -->

{% highlight java %}
private void initActions() {
    actions = new Hashtable();
    actions.put("authenticate", new AuthenticateActions());
    actions.put("logout", new LogoutAction());
    actions.put("login", new LoginAction());
}
{% endhighlight %}

So I made an action interface, made an action class (has to be serializable) and tried writing this Hashtable to a file with ObjectOutputStream and then I viewed it.  The file was in binary format and wouldn't be maintainable because I need a flat text file that I can easily edit.  My goal is to have a controller that I don't have to touch when I add functionality.  Something maintainable.  I realized that this method might be good for writing objects to files, but wouldn't help me here.

So then I tried this:

{% highlight java %}
package net.fuzzylemon.util;

import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;

import net.fuzzylemon.acronym.action.Action;

/**
 * @author chris
 * @file HashTable.java
 * @date Feb 17, 2003
 *
 */
public class HashTableTest2 {

  public static void main(String[] args) {
    try {
      FileInputStream f = new FileInputStream("/tmp/testme.txt");
      Properties p = new Properties();
      try {
        p.load(f);

        try {
          Action o = (Action) Class.forName(p.getProperty("post")).newInstance();
          System.out.println(o.toString());
        } catch (InstantiationException e) {
        } catch (IllegalAccessException e) {
        } catch (ClassNotFoundException e) {
        }

      } catch (IOException e) {
      }
      System.out.println("hey");

    } catch (FileNotFoundException nfne) {
      nfne.printStackTrace();
    }
  }
}
{% endhighlight %}

And all I have to have in /tmp/testme.txt is the following line: `post = net.fuzzylemon.acronym.action.PostAction`.



Here's my action interface:

{%highlight java %}
package net.fuzzylemon.acronym.action;

import java.io.IOException;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author chris
 * @file Command.java
 * @date Feb 17, 2003
 *
 */
public interface Action {
  public void perform(HttpServlet servlet,
    HttpServletRequest req,
    HttpServletResponse res)
    throws IOException, ServletException;
}
{% endhighlight %}



And here's my PostAction class:

{%highlight java %}
package net.fuzzylemon.acronym.action;

import java.io.IOException;
import java.io.PrintWriter;
import java.io.Serializable;

import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

/**
 * @author chris
 * @file PostAction.java
 * @date Feb 17, 2003
 *
 */
public class PostAction implements Action, Serializable {
  /**
   * @see net.fuzzylemon.acronym.actions.Action#perform(javax.servlet.http.HttpServlet, javax.servlet.http.HttpServletRequest, javax.servlet.http.HttpServletResponse)
   */
  public void perform(
    HttpServlet servlet,
    HttpServletRequest req,
    HttpServletResponse res)
    throws IOException, ServletException {
      res.setContentType("text/plain");
      PrintWriter out = res.getWriter();
      out.println("**Woo!  PostAction!**");
  }

}
{% endhighlight %}

Of course, all this still needs to be cleaned up and implemented in a servlet, but it's progress.
