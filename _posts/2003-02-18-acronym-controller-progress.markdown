---
layout: post
status: publish
published: true
title: Acronym Controller Progress
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
excerpt: ! '<p>

  Finally got a useful action map coded.  Before, the controller was just simply printing
  Strings.  Now, Classes are being instantiated from a Properties file and the Action
  interface is working as it should.  The latest version of the Controller is posted.

  </p>

'
wordpress_id: 10
wordpress_url: http://squarism.com/2003/02/18/acronym-controller-progress/
date: !binary |-
  MjAwMy0wMi0xOCAwMToxNzo0MiAtMDUwMA==
date_gmt: !binary |-
  MjAwMy0wMi0xOCAwNjoxNzo0MiAtMDUwMA==
categories:
- Blog
tags: []
comments: []
---
<p>
Finally got a useful action map coded.  Before, the controller was just simply printing Strings.  Now, Classes are being instantiated from a Properties file and the Action interface is working as it should.  The latest version of the Controller is posted.
</p>
<a id="more"></a><a id="more-10"></a></p>
<p>
You can see that I have a default Action set up too.  If for unknown reasons, a user finds themselves in a place the Controller can't handle, the default Action kicks in.  This could be caused by a user mistype or by a dead link.
</p></p>
<pre>
package net.fuzzylemon.acronym;</p>
<p>/**
 * @file 	Controller.java
 * @Author 	chris
 * @date	Dec 8, 2002
 * @time	3:45:18 PM
 *
 * Scope:
 * 	- handles common tasks like authentication
 *	- examines the requests from the user
 * 	- invokes JavaBeans
 * 	- controls error handling
 * 	- controls module flow
 */</p>
<p>import java.io.IOException;
import java.io.InputStream;
import java.io.PrintWriter;
import java.util.Properties;</p>
<p>import javax.servlet.ServletConfig;
import javax.servlet.ServletContext;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServlet;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;</p>
<p>import net.fuzzylemon.acronym.action.Action;
import net.fuzzylemon.util.UrlParser;</p>
<p>public class Controller extends HttpServlet {</p>
<p>	private Properties actionMap = new Properties();</p>
<p>	private Action action = null;</p>
<p>	public void doGet(HttpServletRequest req, HttpServletResponse res)
		throws ServletException, IOException {
		doPost(req, res);
	}</p>
<p>	public void doPost(HttpServletRequest req, HttpServletResponse res)
		throws ServletException, IOException {</p>
<p>		PrintWriter out = res.getWriter();
		HttpSession session = req.getSession();
		String pathInfo = UrlParser.stripLeadingCharacter(req.getPathInfo());</p>
<p>		res.setContentType("text/plain");</p>
<p>		out.println("action was: " + session.getAttribute("action"));</p>
<p>		// if no matching action is found, set action to be default
		try {
			action = setAction(pathInfo);
			session.setAttribute("action", actionMap.getProperty(pathInfo));
			action.perform(this, req, res);
		} catch (NullPointerException ne) {
			action = setAction("default");
			session.setAttribute("action", actionMap.getProperty("default"));
			action.perform(this, req, res);
		}</p>
<p>		out.println("session ID: " + session.getId());
		out.println("action is: " + session.getAttribute("action"));</p>
<p>	}</p>
<p>	public void init() {
		try {
			ServletConfig config = getServletConfig();
			ServletContext context = config.getServletContext();
			String actionMapFile = config.getInitParameter("actionMapFile");
			System.out.println("actionMapFile is " + actionMapFile);</p>
<p>			//load file from jar file
			InputStream in = context.getResourceAsStream(actionMapFile);</p>
<p>			actionMap.load(in);
			in.close();
		} catch (IOException e) {
			log("cannot open action map.");
			e.printStackTrace();
		} catch (NullPointerException ne) {
			log("null action map!");
			ne.printStackTrace();
		}
	}</p>
<p>	private Action setAction(String string)
		throws NullPointerException {
		Action action = null;
		try {
			action = (Action) Class.forName(actionMap.getProperty(string)).newInstance();
		} catch (InstantiationException e) {
			log(e.getMessage());
		} catch (IllegalAccessException e) {
			log(e.getMessage());
		} catch (ClassNotFoundException e) {
			log("ClassNotFoundException in " + this.getClass().toString());
			log(e.getMessage());
		}
		return action;
	}
}
</pre></p>
