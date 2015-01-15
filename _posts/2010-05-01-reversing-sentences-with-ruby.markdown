---
layout: post
status: publish
published: true
title: Reversing sentences with Ruby.
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 433
wordpress_url: http://squarism.com/?p=433
date: !binary |-
  MjAxMC0wNS0wMSAxNDowMToyOCAtMDQwMA==
date_gmt: !binary |-
  MjAxMC0wNS0wMSAxOTowMToyOCAtMDQwMA==
categories:
- Blog
tags: []
comments:
- id: 6627
  author: andy
  author_email: public.inbox@gmail.com
  author_url: ''
  date: !binary |-
    MjAxMS0wOC0xOSAyMDo1NzowOSAtMDQwMA==
  date_gmt: !binary |-
    MjAxMS0wOC0yMCAwMTo1NzowOSAtMDQwMA==
  content: ! "@text.scan(/\\s*(?:(.*?)([.!?]))\\s*?/).map{|sentence,punct|\r\n
    \     words = sentence.scan(/([\\w']+)([\\W,]+)*/).flatten.compact\r\n
    \     words[0] = words[0].downcase\r\n      words[-1] = words[-1].capitalize\r\n
    \     words.reverse.join + punct\r\n    }.join(\"  \") # expects two spaces. would
    require another ([\\W]+)\r\n                 # and the splitting of sentence into
    sentence,space\r\n                 # for more generic inter sentence space handling."
---
A question came up today about how to reverse a sentence.  Word by word, preserving periods etc.  I've done stuff like this before but I really saw an opportunity to solve this _contrived_ quiz type question with [TDD](http://en.wikipedia.org/wiki/Test-driven_development).  It's perfect really.  Tedious string checking?  Screw it.  Let my test tell me when I'm done.

Ok so I could have probably done this more comfortably in Java but it would have been more lines.  I banged this out in Ruby, including "learning" test cases (it's really easy) in about an hour.  At one point I realized how easy string manipulation is in Ruby for this and I literally said, "holy shit Ruby is amazing".  And then the edge cases started happening.  I was only handling periods and my algorithm fell over flat on three sentences because I was trying to do a string[start, end] when it's really string[start, length].  I fixed it with learning the String#slice syntax.

Ok enough fanboi service.  There's two files.  One's the test and one's the class.  Run the test and not the class (ie: ruby tc_reverser.rb).

tc_reverser.rb:

{% highlight ruby %}
require 'test/unit'
require 'reverser'

# Be wary of newlines in the test and expected trings.
# Do not try to word wrap with escapes.  It's very picky.
class TestReverser < Test::Unit::TestCase
  # Optional
  #def setup
  #end

  def teardown
    if @test_passed then
      puts "\n #{@r.reverse}"  # more verbose for successful passes
      puts "#{@method_name.upcase} OK.\n\n"
    else
      puts "#{@method_name.upcase} FAIL.\n\n"
    end
  end

  # simple test
  def test_reverser
    test = "You space bastard.  You killed my pine."
    expected = "Bastard space you.  Pine my killed you."
    @r = Reverser.new(test)
    assert_equal(expected, @r.reverse, "Fail.")
  end

  # Test multiple sentence delimiters
  def test_multiple_sentence_delimiters
    test = "Shape up, man.  You're a slacker.  Do you want to be a slacker for the rest of your life?"
    expected = "Man, up shape.  Slacker a you're.  Life your of rest the for slacker a be to want you do?"
    @r = Reverser.new(test)
    assert_equal(expected, @r.reverse, "Fail.")
  end

  # Test no periods, question mark and commas
  def test_question_comma
    test = "Then tell me, future boy, huh, who's president of the United States in 1985?"
    expected = "1985 in States United the of president who's, huh, boy future, me tell then?"
    @r = Reverser.new(test)
    assert_equal(expected, @r.reverse, "Fail.")
  end

  # Big test
  def test_everything
    test = "Our first television set. Dad just picked it up today. Do you have a television? Well, yeah, you know, we have two of them. Wow! You must be rich. Oh, honey, he's teasing you. Nobody has two television sets."
    expected = "Set television first our.  Today up it picked just dad.  Television a have you do?  Them of two have we, know you, yeah, well.  Wow!  Rich be must you.  You teasing he's, honey, oh.  Sets television two has nobody."
    @r = Reverser.new(test)
    assert_equal(expected, @r.reverse, "Fail.")
  end

end
{% endhighlight %}

I have to apologize for the scrollbars in the above posted code.  I tried many different ways of escaping carriage returns for better formatting but it would have required a lot of changes to deal with the \n and so on in the tests.  I had something nicely formatted working but the tabs and spaces for alignment then screwed the test and broke the pretty formatting a different way.

reverser.rb:

{% highlight ruby %}
# A class that reverses sentences.
# "My dog has fleas." --> "Fleas has dog my."

class Reverser

  # tasty constructor, full of taste
  def initialize(text)
    @text = text
  end

  def reverse
    delim_location = 0  # char by char, remember !?. for sentence determination
    delim_last_location = 0  # allows us to move on to the next sentence
    delim_i = 0  # an iterator

    new_sentence = ""  # inits an empty string for string methods to work

    new_sentence_array = Array.new
    punc_array = Array.new  # list of punctuation marks in order
    @text.each_char do |char|
      delim_i += 1  # iterator
      if (char == "." || char == "?" || char == "!")
        # we hit a deliminter (?!.), remember it
        sentence = @text.slice(delim_last_location..delim_i)
        sentence.strip!
        new_sentence_array.push(sentence)
        punc_array.push(char)
        delim_last_location = delim_i  # remember our substring position
      end
    end

    i = 0
    new_sentence_array.each do |s|
        returned_sentence = do_reverse(s)  # reverse words sentence by sentence
        new_sentence += "#{returned_sentence}#{punc_array[i]}"  # append the delimiter back

        if (i+1 != new_sentence_array.length)  # look ahead for last sentence
          new_sentence += "  "  # only append spaces if this is not the last sentence
        end
        i += 1

    end

    new_sentence  # return new_sentence

  end

  def do_reverse(s)
    s.chop!  # trim delimiter
    text_array = s.split(" ")  # split on spaces to array
    text_array[0].downcase!  # downcase first word
    text_array.reverse!  # destructive reverse

    # need to move commas back
    text_array_i = 0
    text_array.each do |e|
       text_array_i += 1
        if e.include? ","
          e.chop!   # modify original array
          text_array[text_array_i - 2] += ","
        end
    end

    text_array[0].capitalize!
    text_array = text_array.join(" ")  # destructive join
    text_array.to_s  # return reversed array
  end

end
{% endhighlight %}

When you run the test case it looks like this:

<pre>
Loaded suite ~/src/ruby/tc_reverser
Started

Set television first our.  Today up it picked just dad.  Television a have you do?  Them of two have we, know you, yeah, well.  Wow!  Rich be must you.  You teasing he's, honey, oh.  Sets television two has nobody.
TEST_EVERYTHING OK!
.
Man, up shape.  Slacker a you're.  Life your of rest the for slacker a be to want you do?
TEST_MULTIPLE_SENTENCE_DELIMITERS OK!
.
1985 in States United the of president who's, huh, boy future, me tell then?
TEST_QUESTION_COMMA OK!
.
Bastard space you.  Pine my killed you.
TEST_REVERSER OK!
.
Finished in 0.003567 seconds.
</pre>
`
  <font color="green">4 tests, 4 assertions, 0 failures, 0 errors</font>
`

Marty McFly would be proud.  So, some limitations.  First, I don't handle elipsis (...) characters at all.  It splits on sentence delimiters which one is a period.  The eplisis would cause major weirdness.  I also don't handle recapitalizing the word "Dad" as you can see in the "test_everything" test.  This would require language parsing or a massive pick list.  I also don't handle slang or abbreviations.  For example, "You told 'em?"  would turn into "'em told you?" which might not be exactly right.

There are many other edge cases that this thing would fall flat on.  My test case tests what functionality I wanted and nothing more.

Ruby's String#slice was super handy on this as well as capitalize, reverse and even a regex split that I didn't use (amazing!).  You can see it here.  It would split text into an array really easily:

{% highlight ruby %}
sentence_array = @text.split(/[\.\!\?]/)  # split with regular expression
new_sentence_array = Array.new
sentence_array.each do |s|
    new_sentence_array.push(do_reverse(s))
end
puts sentence_array[2]
return
{% endhighlight %}

But then I'd lose the delimiter character (!?. etc) and would have to save it, search it or some other nonsense.  Still, really neat that you can split on a regex.