---
title: "Ruby Koans Notes and Solutions"
description: "Blog post about ruby koans notes and solutions"
date: 2010-12-27T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

![](/uploads/2010/12/rubykoans.png "rubykoans")Just finished EdgeCase UK's rubykoans test/project.  It's a test driven development style learning session that you should really check out even if you're only partial curious in what ruby is.  If you've got some ruby experience under your belt, you should go through the exercise too because it's good practice, reference and you'll probably learn something new.

I'm not posting this so someone can cheat.  I'm posting this for the me out there who wants to see if they did it the same.  There were many "THINK ABOUT IT" sections that were open-ended or tricky.  The whole thing took me about 4 days while on vacation.  Maybe 16-20 hours of solid work.  It's good, just do it!

I used auto_enlighten.rb which I nabbed from [davesquared.net](http://www.davesquared.net/2010/08/continually-running-script-with-ruby.html).  It was really handy.  Using watchr, all I had to do was save an .rb file and the test ran again.  So I could just try my answer and continually monitor my progress and get feedback on errors.  This was very much the #1 bullet point in the Ted talk [7 ways games reward the brain](http://blog.vongraf.com/2010/11/06/7-ways-games-reward-the-brain/).  The whole exercise is one long experience bar with continuous feedback.  Excellent!  Books should be this way!

I definitely had some learning experiences along the way and I've posted my solutions with notes on gotchas to [github](https://github.com/squarism/rubykoans).  And there were many gotchas.  Sometimes, I would nail a solution, first shot, very elegantly.  Other times, I would churn on a test for many minutes and research for more information.  There were some very, very deep and specific issues that I would read more about.

For example, take this excerpt one of the early tests: test_slicing_arrays.  For the ruby koans, they created a special __ method that is equal to "FILL ME IN" (slick move EdgeCase).  So you just have to change the __ for the test to pass.  In this case, I expected it to be nil.  So I filled in nil and it failed.

```ruby
def test_slicing_arrays
    array = [:peanut, :butter, :and, :jelly]
    # snip for blog post
    # Learned: this is crazy!  empty when beyond range but at .size, nil when beyond .size
    assert_equal __, array[4,0]
    # snip for blog post
end
```
Notice my Learned: note there in the middle.  This was surprising.  If you open up irb and follow along, you'll find that slicing an array of 4 things from 4 to 0 gives you an empty array.  Wow.  That's a bug if you ask me.  There's a bunch of notes marked "Learned:" like this in the [github](https://github.com/squarism/rubykoans) project.  The README has a grep example you can use to find all the things I thought were gotchas.  But do them yourself first!  It's way more fun to do this interactively.
BTW, Internet, I would love a node.js koans project.
