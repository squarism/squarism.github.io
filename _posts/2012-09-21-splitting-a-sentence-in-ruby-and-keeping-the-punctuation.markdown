---
layout: post
status: publish
published: true
title: Splitting a sentence in Ruby and keeping the punctuation
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 1368
wordpress_url: http://squarism.com/?p=1368
date: !binary |-
  MjAxMi0wOS0yMSAyMTo1MToxNCAtMDQwMA==
date_gmt: !binary |-
  MjAxMi0wOS0yMiAwMjo1MToxNCAtMDQwMA==
categories:
- Ruby
tags: []
comments: []
---
![](/uploads/2012/09/reversing_sentences.png "reversing_sentences")

**Update:**Doh!  You can just do text.split(/(\.)\s+/) to make the regex keep the delimiter with the parens group match.  Then you have to join in groups and some other stuff.  I keep the post below for posterity. :)

When you split a string on a character, you get an array back without the split character.  When splitting sentences, the period goes away with the split.  So we can employ some rather nasty behind regex tricks to remember the puntuation and still do the split.  Pretty great!

Here's some code I stole from stackoverflow that splits sentences fairly well.  Pay no attention to the complexity of this unchained beast.

{% highlight ruby %}
# oniguruma regex to split on multiple sentence
# delimeters but preserve delimeter character.

text = "Hipsters are everywhere! Even in Home Depot? Flannel wrench set in ma face."

result = text.split(/((?<=[a-z0-9)][.?!])|(?<=[a-z0-9][.?!]"))\s+(?="?[A-Z])/)

puts result
{% endhighlight %}

When you run it:
`
Hipsters are everywhere!
Even in Home Depot?
Flannel wrench set in ma face.
[Finished in 0.3s]
`

That's great but it does a fat lot of good when trying to modify it to reverse sentences.  Not to mention, regexes falling down on edge cases (the above doesn't work for shouting sentences like this one?!!

Ok, whatever.  That's regex stuff.  Let's try applying what we've learned from our [last post](http://squarism.com/2012/09/15/a-different-repl-workflow-in-ruby/) and create an inline rspec test to do what we want.

First, we'll test the simplest case with _See spot run._  And then we'll add multiple sentences in.

{% highlight ruby %}

# oniguruma regex engine testing to split on multiple sentence
# delimeters but preserve delimeter character.

require 'pry'

class Reverse

  def sentences(text)
    split_everything = text.strip.split(/(\.|\?|\!)/)
    sentences = split_everything.each_slice(2).to_a.map {|pair| pair.join}

    sentences.collect do |sentence|
      punc = sentence[-1]
      sentence.chop!
      sentence.downcase!
      words = sentence.split(" ")
      reversed = words.reverse.join(" ") << punc
      reversed.capitalize!
    end.join("  ")
  end

end

describe Reverse do
  it "reverses words in one sentence" do
    text = "See spot run."
    reversed = subject.sentences(text)
    reversed.should == "Run spot see."
  end

  it "reverses all sentences in some text" do
    text = "See spot run.  Run spot run.  Your soul is mortal spot."
    reversed = subject.sentences(text)
    reversed.should == "Run spot see.  Run spot run.  Spot mortal is soul your."
  end

end
{% endhighlight %}

Works pretty well.  We can keep adding edge case tests to handle weird punctuation situations or the dreaded "Mr. Smith goes to college!" sentence.