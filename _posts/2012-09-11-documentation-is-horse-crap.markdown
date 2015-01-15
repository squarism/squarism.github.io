---
layout: post
status: publish
published: true
title: Documentation is Horse Crap
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 1642
wordpress_url: http://squarism.com/?p=1642
date: !binary |-
  MjAxMi0wOS0xMSAyMjo1MjozOSAtMDQwMA==
date_gmt: !binary |-
  MjAxMi0wOS0xMiAwMzo1MjozOSAtMDQwMA==
categories:
- Blog
tags: []
comments: []
---
![](/uploads/2012/09/doc_horse_crap-300x199.png "doc_horse_crap")

> "We need to write down how it works, what we are doing and all the little tricks so that if you get hit by a bus someone else knows what's going on."
> "So how do you keep the documentation in sync with what's really going on?"
> "You have to do that."

Documentation gets you a document.  It doesn't get you guarantees.

I've had this conversation a few times and it doesn't matter who or where it is.  It's the same story.  When someone is surprised, someone asks "why wasn't this documented!?".  Documentation is good, I agree.  But only in the general sense.  If you watch DHH's keynote talk on [progress](http://www.youtube.com/watch?v=VOFTop3AMZ8), overstating the general case is very similar.  He says progress is good in the general sense.  But when you start asking people to change, they get mad.  They'll say things like "why can't we have it the way it used to work?".

The same goes for documentation.  Everyone agrees that it's good. But if you ask for time to gather the content for it, we can't do that right now.  If you ask for a tool that might help you automate "documentation" then we can't fit that in a schedule.  How many times have people not documented or written an email because they don't want a paper trail to bite them in the ass? What about closed door, stealth meetings and initiatives? Do industry secrets get written down? Does McDonalds's secret sauce get documented?

If the documentation has content that someone doesn't like, maybe we'll skip that or edit it. How about this:

> _Section 5.41.29_
> Our system is finicky and buggy because no one wants to take risks and we couldn't try to solve this problem in the middle of development. So you have to restart the service every 5 minutes. Here's how you do that.

An important point! We could write down "restart this every 5 minutes" but wouldn't someone want to know why we are restarting things all the time? What was the reasoning for this kludge? What's the history?

Obviously the tone above is bad. Let's talk about the tone. When you ask someone to write something down so that it's saved for future humanity, what are you really expecting? What style or model did you originally imagine when the desire for a doc hit you:

*   Do you expect a training manual?
*   A thesis explaining the theory and problem space the solution lives in?
*   Do you expect an encyclopedia full of facts and truths?
*   An insider's fast-track guide to understanding what's going on?
*   A slick sheet full of capabilities and bragging rights?
*   A wikipedia full of references, links and related material?
*   A history-filled story with very few facts but reads cover to cover easily?</p>

Each of these things have a style and an audience.  Did you think about these things before you just said documentation? Did you communicate that to anyone?  Does anyone understand your vision?  Are we writing our docs to an audience full of laymans or experts?  Do we even know?  Most projects I've been on write to a really insulting level.  XYZ for Dummies.  That's not good!  Dummy books are not good!

You probably already have documentation out there.  What does a wiki not solve for you? What does the README say?  What is on your FAQ page? Do you have a test suite? Do you have an API?  Do you have a demo or help file? Do you have a development and project methodology and does it have paper output like status reports?  Does anyone really care about the content of status reports or are they just checking "are people working?" in which case that's solving HR and people resources instead of showing what's going into "the product".

Every place I've been at values documentation.  And when people leave the project or the company, it's still a huge deal.  All the documentation in the world doesn't save the team from the shock of hearing that a valued team member is moving on to greener pastures never to talk to us again.  Schedules slip, morale takes a nose-dive and someone is left holding the poop bag.  If you are lucky, there's a back-fill plan. For years, people will talk about employees who used to "be here".  And no one really runs to the documentation to find out how, what and why they worked.  You tell the employee who's leaving, "for the next two weeks, train someone and write down what you know".  And even then, that plan doesn't work 100%.  Loss still happens.

So if documentation is so valuable then why doesn't it work?  Are worker-bees revolting against doing it?  Is our documentation even done? How do we know when our docs are done?  Are they close to done now?

Just stop with the doc thing. Write your normal stuff.  Your README or user manual.  Develop a business methodology, keep it simple. Use jargon words and defined concepts to keep it short.  Have hands-on people document USEFUL THINGS IN USEFUL WAYS THAT THEY WILL LIKE AND USE.  If you ask them to open MS Word and start documenting, you have failed.  Documentation is not a document.

Here are some things that hands-on people might like:

*   A .plan file, dev log or equivalent to remind them what they were doing on Friday when they come in on Monday. - They will like this because Mondays will hurt less.
*   A Kanban board for status. They will like this because status reports won't be the only way to communicate what we are doing.
*   [Executable User Stores](http://cukes.info/) as answering the question "how it's supposed to work". They will like this because you won't have to write a seperate test plan and test steps. Also, it lets devs take risks because they KNOW when everything is working. Also, it's executable requirements because it's your stories. I'm talking about Cucumber/Gherkin.*   A project blog. They'll like this because it's outward facing beyond status reports.</p>

Ultimately, documentation is not the problem.  Even when suggesting things above, it's the stodgy management that is forcing everyone to write docs.  If the customer wants a waterfall doc product then they are going to get one.  Maybe there's no choice. But is there? Do they like huge and out of date deliverables?  Does anyone really know for sure?

Documentation is not the problem, it's the whole project, it's the whole culture.  They don't want to change their deliverables but they have never done anything different.  They need to know that the project is going to succeed when in reality waterfall is designed to keep people from taking responsibility for when it doesn't work.  "We passed that gate! We can't be blamed! You signed off on it!"  And that's really the point.  Documentation is the tell-tale sign of infinite bureaucracy.  Work for a car dealership and write down a doc on how to ride a horse.  They'll think "I didn't know we had horses!" but no one will fire you for documenting a bunch of horse crap.