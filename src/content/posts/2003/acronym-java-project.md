---
title: "The Acronym Project"
description: "A 2003 attempt to write a J2EE web app from scratch, without Struts, as a way to learn Java. Eight dev log posts from that year compressed into one summary."
date: 2003-02-17T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

**Update.** This post is a summary of eight posts written between February and November 2003. The originals were a running dev log with a lot of code pasted in, most of it not worth reading now. They have been compressed into this one and unpublished.

The Acronym Challenge was going to be a posting game. An acronym goes up, people submit expansions for it, like TCP as tangy chocolate popsicles, and the entries get voted on. Anonymous to start, maybe logins later. It was mostly an excuse to learn J2EE.

<!-- more -->

## The setup

Java, on purpose without a framework. Struts looked useful but the whole point was to build the pieces by hand and understand them. Eclipse for the IDE, Tomcat 4.1 for the container, MySQL because that was the only database I knew. Eclipse did packaging and deployment through the Lomboz plugin and generated the Javadoc. CVS tracked changes for a team of one.

JBoss was the first choice for its hot deploy, but deploys were slow and it never worked cleanly, so Tomcat won. Cactus for servlet testing was on the list but I could not figure out how to instantiate a servlet from outside the container, so I ordered the O'Reilly Java Extreme Programming Cookbook and waited for it.

## The controller

Most of the early work went into a front controller, since MVC said I needed one. The design that stuck:

1. Every user action is a URL under the controller, like `/controller/post` or `/controller/login`.
2. The controller reads a properties file named in `web.xml` that maps the last path segment to a class name, one line per action: `post = com.squarism.acronym.action.PostAction`.
3. It grabs the path with `getPathInfo()`, strips the leading slash, looks up the class, instantiates it by name, and calls `perform(servlet, request, response)` on it.
4. An unknown path falls through to a `default` action so a typo or dead link lands somewhere sane.

The `Action` interface was one method:

```java
public interface Action {
  public void perform(HttpServlet servlet,
    HttpServletRequest req,
    HttpServletResponse res)
    throws IOException, ServletException;
}
```

The first attempt at the mapping serialized a `Hashtable` of action objects to disk with `ObjectOutputStream`. That produced a binary file nobody could edit, which defeated the goal of adding actions without touching the controller. A plain `Properties` file plus `Class.forName` was the answer, which is roughly what every framework of the era was doing internally.

Actions forward to a JSP when they finish, so the URL never changes and the technology stays hidden. The first version went up on the server at the end of February.

## What came after

In March the XP cookbook arrived and it was worth the wait. Voting got cleaned up and cookies stopped people from voting twice on the same entry.

The build was a mess for a while. Getting Ant and JUnit to run inside Eclipse hit a Xerces class conflict between the bundled Ant and the external one, a `VerifyError` that turned out to be a known Eclipse bug at the time. After a day of adding and removing jars I gave up on tight IDE integration and ran Ant from a shell instead.

By November there was a validator that checks whether a list of words actually spells the acronym, first letter of each word, case insensitive. Length mismatch or a wrong letter fails it. That was the last piece I wrote up. The project never shipped as a game, which is the normal fate of learning projects, but it did its job.

## What I would say now

The controller pattern I derived by hand is the one Struts already had, and later everything else. That was the lesson, even if it did not feel like one. Writing it from scratch was the right call for learning and the wrong call for finishing.
