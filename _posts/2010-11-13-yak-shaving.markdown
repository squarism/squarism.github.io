---
layout: post
status: publish
published: true
title: Yak Shaving
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 704
wordpress_url: http://squarism.com/?p=704
date: !binary |-
  MjAxMC0xMS0xMyAxMToxNDoyNiAtMDUwMA==
date_gmt: !binary |-
  MjAxMC0xMS0xMyAxNjoxNDoyNiAtMDUwMA==
categories:
- Development
tags: []
comments:
- id: 2479
  author: Jim
  author_email: Jmulvey123@gmail.com
  author_url: ''
  date: !binary |-
    MjAxMC0xMi0wMSAyMjoyMzoyMCAtMDUwMA==
  date_gmt: !binary |-
    MjAxMC0xMi0wMiAwMzoyMzoyMCAtMDUwMA==
  content: Thanks! I enjoyed this (with a cup of coffee in hand, I might add)
- id: 2484
  author: Dillon
  author_email: dillon@squarism.com
  author_url: http://
  date: !binary |-
    MjAxMC0xMi0wMiAxMzo0MDowOSAtMDUwMA==
  date_gmt: !binary |-
    MjAxMC0xMi0wMiAxODo0MDowOSAtMDUwMA==
  content: Ha!  Thanks for the comment.
---
![](/uploads/2010/11/yak_shaving-150x150.jpg "yak_shaving")
Let's say you're trying to be nice to your wife/girlfriend/whoever and want to get the coffee in the morning before they wake up.  So you set out to get a cup of coffee.

First, you can't find your keys.  Then you remembered that you loaned your house key to your neighbor Alice while you were out of town last week and you never got them back.  You don't want to wake up your special someone so you go to your neighbor Alice's house and knock on the door.  Alice says, "good morning!"
"Do you still have my house key?", you say.
"It's on my car's keyring and my car is at my brother Barry's house", they reply.
"Where is your brother?"
"Oh, he's across the street."

So you walk across the street and try to find Barry.  He's pulling out of the driveway and he says "hop in!".
"Well, actually I'm trying to get my car keys back", you say.
"I'm in a rush, I need to deliver this couch to my friend Calvin who's moving today.  Would you mind helping me unload this and then I'll give you your key back."
"Sure Barry."

So you unload the couch at Calvin's house but when you're putting the couch down, you rip a pillow.  Calvin is none too happy.
"These pillows were stuffed with my finest Yak hair!  You're going to have to fix them", says Calvin.
Barry says, "you get more stuffing and I'll go get my needle and thread kit from my house".

Barry leaves in his truck.  Calvin gives you some yak shears and points you to his private Yak holding pen.  Calvin goes inside and has some bacon and eggs.  You sit down on a Yak shaving stool and start shaving a Yak on a Saturday morning.  Suddenly you stand up and say, "why the frak am I shaving a Yak?!".

_"I just wanted some coffee!"_

[Yak Shaving](http://en.wiktionary.org/wiki/yak_shaving) is when you find yourself at the end of a long chain of implied tasks and find yourself suddenly shaving a Yak.  You'll find it a lot in technical tasks and projects but you'll also find it in errands and daily life.  Yak Shaving is wasted time or possibly some delusion of productivity.  You should be having coffee in bed with your sweetheart but instead you're loping off locks of Yak hair.

So let's summarize our little tale and how it would end.

*   You can't find your keys because Alice has them.
*   Alice sends you to Barry's house.
*   Barry takes you to Calvin's house.
*   You unload a couch and rip a Yak pillow.
*   Calvin makes you shave a Yak.
*   You finish shaving a Yak.
*   Barry comes back and fixes the pillow.
*   Barry takes you home and gives you your key back.
*   You get coffee for your sweetheart.
*   Your sweetheart can't believe you shaved a Yak today.

Notice that Yak shaving happens at step #5 but there are 10 steps total.  That's because we're in a chain.  Just because you shave the Yak doesn't mean you get your coffee.  You still have to exit the chain which at the very least is N steps back out.  Maybe on the way to get coffee, your car breaks (N+X).  Who knows.  So to avoid getting deep into a Yak chain, you need to break out of it as soon as possible.  For example, tell Alice to get your keys as soon as possible and wake up your sweetheart and ask her where her keys are.  Yes, it's sub-optimal.  But don't assume that your sweetheart is going to be mad about being woken up.  You could say, "honey I'm going out to get you a treat, where are your keys?".  It's not that you should predict the future and assume that steps past Alice are going to be chaining, long and Yak-y.  You should instead think of branching alternatives immediately and not just blindly follow Alice's instructions.

Ok, so let's forget about solving or avoiding the Yak problem.  Let's get into the meat of this.  Let's implement this chain in a few ways.

**Ruby**

<pre lang="ruby" line="0"># yak.rb
def get_coffee
        # getting coffee means two things, keys + car
        puts "I don't have my keys..."
        find_keys
        drive_to_coffee_shop
        puts "Got coffee."
end

def find_keys
        puts "Alice has my keys..."
        find_alice
        puts "Ok got keys."
end

def find_alice
        puts "Alice says Barry has my keys."
        find_barry
end

def find_barry
        puts "Barry wants me to help him unload a couch ..."
        unload_couch
        puts "Barry took me home and gave me my keys."
end

def unload_couch
        puts "I just ripped a Yak pillow unloading the couch."
        shave_yak
        puts "Done unloading couch."
end

def shave_yak
        puts "I'm shaving a Yak!"
end

def drive_to_coffee_shop
        puts "Driving to coffee shop..."
end

def surprise_sweetheart
        puts "Surprise honey!  Coffee!"
end

# Wake up, be nice to sweetheart
puts "I should surprise my sweetheart..."
get_coffee
surprise_sweetheart
puts "Awww..."
</pre>

We run it and get:
`$ ruby yak.rb
I should surprise my sweetheart...
I don't have my keys...
Alice has my keys...
Alice says Barry has my keys.
Barry wants me to help him unload a couch ...
I just ripped a Yak pillow unloading the couch.
I'm shaving a Yak!
Done unloading couch.
Barry took me home and gave me my keys.
Ok got keys.
Driving to coffee shop...
Got coffee.
Surprise honey!  Coffee!
Awww...
`

Obviously this is very procedural and just creating the chain using simple method calls.  But at least notice that the "main" of the program (the bottom five lines) just calls get_coffee and surprise_sweetheart.  That part is at least somewhat encapsulated and clean.  If we wanted to get really fancy we could create a generic action class that would receive messages and call a proc possibly.  We're still creating this chain in code which makes it extremely brittle and one-shot.  How would we use this again?  How would we put this in our toolbelt?

**XML**
Let's create a XML-based workflow and run it in Ruby.

Here's our steps from the bullets in an XML doc.

<pre lang="xml">
<?xml version="1.0" encoding="UTF-8"?>
<steps>
  <step stepId="0" stepName="Get Coffee">
    <message>I don't have my keys...</message>
    <step stepId="1" stepName="Find Keys">
      <message>Alice has my keys...</message>
      <step stepId="2" stepName="Find Alice">
        <message>Alice says Barry has my keys.</message>
        <step stepId="3" stepName="Find Barry">
          <message>Barry wants me to help him unload a couch ...</message>
          <step stepId="4" stepName="Unload Couch">
            <message>I just ripped a Yak pillow unloading the couch.</message>
            <step stepId="5" stepName="Shave Yak">
              <message>I'm shaving a Yak!</message>
            </step>
            <message>Done unloading couch.</message>
          </step>
          <message>Barry took me home and gave me my keys.</message>
        </step>
      </step>
      <message>Ok got keys.</message>
    </step>
    <step stepId="6" stepName="Drive to Coffee Shop">
      <message>Driving to coffee shop...</message>
    </step>
    <message>Got coffee.</message>
  </step>
  <step stepId="7" stepName="Surprise Sweetheart" onDone="Awww...">
    <message>Surprise honey!  Coffee!</message>
  </step>
</steps>
</pre>

And here's some code to step through the XML doc and print what's going on.

<pre lang="ruby" line="1">
require 'rexml/document'
include REXML

xmlfile = File.new("yak.xml")
xmldoc = Document.new(xmlfile)

# Now get the root element
root = xmldoc.root

# hack
module REXML
  def each_child_element(&block)
    self.elements.each {|node|
      block.call(node)
    }
  end
end

def recurse(the_element)
  the_element.each_child_element do |childElement|
    if !childElement.attributes.empty?
      puts "[#{childElement.attributes['stepName']}]"
    else
      puts childElement.text
    end

    recurse(childElement)
  end

end

recurse(xmldoc)
</pre>

When we run it, we get this:
`
[Get Coffee]
I don't have my keys...
[Find Keys]
Alice has my keys...
[Find Alice]
Alice says Barry has my keys.
[Find Barry]
Barry wants me to help him unload a couch ...
[Unload Couch]
I just ripped a Yak pillow unloading the couch.
[Shave Yak]
I'm shaving a Yak!
Done unloading couch.
Barry took me home and gave me my keys.
Ok got keys.
[Drive to Coffee Shop]
Driving to coffee shop...
Got coffee.
[Surprise Sweetheart]
Surprise honey!  Coffee!
`

It reads well but it's not that great.  First off, our XML file relies very heavily on the message elements being in the right order.  I'd much rather have an onDone attribute on the element that would act like a callback.  This is more in line with a workflow engine or something more dynamic that could execute code.  I didn't really have time to get this working.  The message coming after the action is happening is supposed to signify what to do when it's completed.  This is not really that elegant.  It'd be much better to create a queue and put messages onto it, then pop down the queue.

But that sounds like Yak Shaving to me ...