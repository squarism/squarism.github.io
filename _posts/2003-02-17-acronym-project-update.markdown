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
excerpt: ! '<p>

  Accomplished a few things today ... I finally figured out how to create an externalized
  mapping of commands to classes.  I was reading a chapter in the book <a href="http://www.oreilly.com/catalog/jserverpages/index.html?CMP=IL7015">JavaServer
  Pages by Oreilly</a>.  They described a popular technique of creating an Action
  Interface and then extending this interface to give you a mapping of actions to
  class names.  This is the code snippet they show:

  </p>

'
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
<p>
Accomplished a few things today ... I finally figured out how to create an externalized mapping of commands to classes.  I was reading a chapter in the book <a href="http://www.oreilly.com/catalog/jserverpages/index.html?CMP=IL7015">JavaServer Pages by Oreilly</a>.  They described a popular technique of creating an Action Interface and then extending this interface to give you a mapping of actions to class names.  This is the code snippet they show:
</p>
<a id="more"></a><a id="more-9"></a></p>
<pre>
private void initActions() {
		actions = new Hashtable();
		actions.put("authenticate", new AuthenticateActions());
		actions.put("logout", new LogoutAction());
		actions.put("login", new LoginAction());
}
</pre></p>
<p>So I made an action interface, made an action class (has to be serializable) and tried writing this Hashtable to a file with ObjectOutputStream and then I viewed it.  The file was in binary format and wouldn't be maintainable because I need a flat text file that I can easily edit.  My goal is to have a controller that I don't have to touch when I add functionality.  Something maintainable.  I realized that this method might be good for writing objects to files, but wouldn't help me here.</p>
<p>So then I tried this:</p>
<pre>
package net.fuzzylemon.util;</p>
<p>import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.Properties;</p>
<p>import net.fuzzylemon.acronym.action.Action;</p>
<p>/**
 * @author chris
 * @file HashTable.java
 * @date Feb 17, 2003
 *
 */
public class HashTableTest2 {</p>
<p>	public static void main(String[] args) {
		try {
			FileInputStream f = new FileInputStream("/tmp/testme.txt");
			Properties p = new Properties();
			try {
				p.load(f);</p>
<p>				try {
					Action o = (Action) Class.forName(p.getProperty("post")).newInstance();
					System.out.println(o.toString());
				} catch (InstantiationException e) {
				} catch (IllegalAccessException e) {
				} catch (ClassNotFoundException e) {
				}</p>
<p>			} catch (IOException e) {
			}
			System.out.println("hey");</p>
<p>		} catch (FileNotFoundException nfne) {
			nfne.printStackTrace();
		}
	}
}
</pre></p>
<p>
And all I have to have in /tmp/testme.txt is the following line: <code>post = net.fuzzylemon.acronym.action.PostAction</code>.
</p></p>
<p>
Here's my action interface:</p>
<pre>
package net.fuzzylemon.acronym.action;</p>
<p>import java.io.IOException;</p>
<p>import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;</p>
<p>/**
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
</pre>
</p></p>
<p>
And here's my PostAction class:</p>
<pre>
package net.fuzzylemon.acronym.action;</p>
<p>import java.io.IOException;
import java.io.PrintWriter;
import java.io.Serializable;</p>
<p>import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;</p>
<p>/**
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
			out.println("<b>Woo!  PostAction!</b>");
	}</p>
<p>}
</pre>
</p></p>
<p>
Of course, all this still needs to be cleaned up and implemented in a servlet, but it's progress.
</p></p>
