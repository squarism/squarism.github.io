---
layout: post
status: published
published: true
title: Encoding in Ruby and Everywhere
---
I gave a lightning talk at pdxruby recently.
I was trying to explain the gotchas but was doing live coding in
pry and it wasn't enough time for me to figure out some nice succinct
take-aways.  My bigger point was something like _"our industry seems to keep
forgetting certain things"_.  This is not to say *Yer Doin It Wrong*.  I just
think it's interesting that some things keep coming up because they are very rare.

* How to generate an SSL cert
* Encoding and utf-8
* Database salts
* HTTP and RFCs - I personally have forgotten or misremembered something

Even if you've done it many times, you haven't done it recently (like just now)
so we all forget.  This theme is interesting!  Different teams, people, states
and projects ... some common patterns maybe?  Many times with these hard
subjects, I often come across as "wrong!" and that's not what I'm trying to do.
I just want to point out where the key things are so that you can remember
where to look to google some more or trigger your memory.

So, this encoding thing.  Ruby 2.x changed lots of things.  First, your source
file is utf-8.  Your strings are utf-8 by default.  There's more to it than
that but it's all pretty much utf-8 now.  There's also no `iconv` in stdlib
anymore.  It's just `.encode` off the string class (we'll get to that in a
second).

## Your Encoding Friends

Open up pry (if you don't have pry, `gem install pry`).  It's all you'll need.
If you do `ls Encoding`, you'll see a list of encodings that Ruby supports.
You get this for free in every process.  You don't need to do anything special.
You'll notice that `"".encoding` is `=> #<Encoding:UTF-8>`.  That inspected
`Encoding:UTF-8` bit is coming from that list.

{% highlight text %}
pry> ls Encoding constants:
ANSI_X3_4_1968    Emacs_Mule
ISO8859_6         SJIS_DoCoMo     ASCII        EMACS_MULE
ISO8859_7         SJIS_KDDI       ASCII_8BIT   EUC_CN
ISO8859_8         SJIS_SoftBank   Big5         EUC_JIS_2004
ISO8859_9         SJIS_SOFTBANK   BIG5         EUC_JISX0213
ISO_2022_JP       ...

UTF_8
{% endhighlight %}

There's also a shorthand versions of these encoding names that you can use but I like using
the constants where I can because it's namespaced with `Encoding` so it's more
intention-revealing.  So let's write a file as utf-8 so I can explain the shorthand thing.

{% highlight ruby %}
File.open('/tmp/awesome.txt', 'w:utf-8') {|file| file.puts "awesome" }
{% endhighlight %}

This is pretty straight-forward.  It creates a file with awesome in it, encoded
in utf-8.

```
$ cat /tmp/awesome.txt
awesome
```

{% highlight ruby %}
File.open('/tmp/awesome.txt', 'w:iso-8859-1') {|file| file.puts "awesome" }
{% endhighlight %}

You can't say 'w:latin-1' here.  That's what iso-8859-1 is but it doesn't work
here for writing the file.

Now this is where culture/language trickiness comes in.

{% highlight text %}
# utf-8 written
$ xxd /tmp/awesome.txt
00000000: 6177 6573 6f6d 650a                      awesome.

# latin-1(iso-8859-1) written
$ xxd /tmp/awesome.txt
00000000: 6177 6573 6f6d 650a                      awesome.

# ascii written
$ xxd /tmp/awesome.txt
00000000: 6177 6573 6f6d 650a                      awesome.
{% endhighlight %}

Here's another friend.  If you do `Encoding::BINARY.to_s` you'll get
'ASCII-8BIT'.  This is the same as saying "I don't know".  It's not
the same as `Encoding::ASCII`.  You can tell because `.to_s` says
'US-ASCII'.  So `.to_s` can be handy here.

There is a method called `.encode`.  This takes the place of Iconv
in the stdlib.  It works just like the unix command `iconv`.  It
takes one encoding and converts the bytes into another.  This
isn't the same as `.force_encoding` as we'll see in a second.

## Lucky

All these things are the same bytes because we (sort of) got lucky on our
history, where ASCII came from (A is for American) and kind of how computer
keyboards and alphabets work.  Someone had a good counter argument to this
statement at the meetup and I agree.  What I mean is, some of this is
a bit [culturally sensitive](https://modelviewculture.com/pieces/i-can-text-you-a-pile-of-poo-but-i-cant-write-my-name)
and complicated.

What I really mean is:

* English works well on a keyboard
* Keyboards are the fastest input device
* ASCII was invented by English speakers
* UTF-8 is extended ASCII
* English was invented before the computer

So, world, I'm sorry (empathy not apology).

## What Encoding Is

Take this string `"\x20"`.  It's a space character.  If you look at `man ascii`
you'll see that 20 is " " in ASCII.  You might recognize this from `%20` in
URLs.  20 decimal is 20 in hex too.  The `\x` bit means hex.  URL encoding is
hex too so 20 is the same 20.  If I pick something higher in the codepage
like `"\xC3"`, things are going to get weird.  "\xC3" by itself isn't valid
utf-8.  And that's fine until I try to do something with it.  If I print it,
it's nothing.  Puts just gives me the normal newline.

{% highlight ruby %}
puts "\xC3"

=> nil
{% endhighlight %}

If I combine it with `\x20`, that's not valid.  ASCII space is at the top of
the UTF-8 codepage.  I can't just make up stuff.  Or maybe I can and get lucky.
But in this case, it prints the unknown utf-8 symbol: `<?>`  If I try something else,
just a different error message shows up:

{% highlight text %}
pry> "\xC3".encode('us-ascii')
Encoding::InvalidByteSequenceError: incomplete "\xC3" on UTF-8
from (pry):107:in `encode'

pry> "\xC3\x20".encode('us-ascii')
Encoding::InvalidByteSequenceError: "\xC3" followed by " " on UTF-8
from (pry):108:in `encode'
{% endhighlight %}

And not that this can't be done.  If I use something that definitely fits in the ascii range (low bytes), everything is fine by implicit coincidence.

{% highlight text %}
pry> "\x20".encode('us-ascii')
=> " "
{% endhighlight %}

So what's going on?  Let's look at this new string "YAY".


{% highlight ruby %}
"YAY".bytes
=> [89, 65, 89]
{% endhighlight %}

So 89 is what in hex ... um ... _piece of paper_

```
89.to_s(16)
=> 59
```

Right.  So "YAY" is

{% highlight ruby %}
"YAY".bytes.collect {|b| b.to_s(16) }
=> ["59", "41", "59"]
{% endhighlight %}

We can take this and get

{% highlight ruby %}
"\x59\x41\x59"
=> "YAY"

"\x59\x41\x59".encoding
=> "\x59\x41\x59"
{% endhighlight %}

Because ASCII fits inside the beginning of utf-8.

{% highlight ruby %}
"\x59\x41\x59".encode('ascii')
=> "YAY"
"\x59\x41\x59".encode('ascii').bytes
=> [89, 65, 89]
"\x59\x41\x59".encode('ascii').force_encoding('utf-8').bytes
=> [89, 65, 89]
{% endhighlight %}

We could do this all day and not flip a bit.  It's just not modifying the byte
sequence and that's really what the data is.

So that's the happy path with ASCII.  It just sort of luckily works
because of history and other things that are complicated.  The more
complicated path involves a few things.  First, what happens when
Ruby loses control of the encoding it knows about and finally
what happens when non-ASCII things start happening.

This is the Korean word for wizard.  I don't know Korean btw.  It's just an
easy alphabet and I think it's neat.

{% highlight ruby %}
wizard = "마법사"
wizard.bytes
=> [235, 167, 136, 235, 178, 149, 236, 130, 172]
{% endhighlight %}

Nothing in `.bytes` is going to be over 255 because bytes are 8-bit.
You'll never, ever see `.bytes` return anything over 255.  So what's the deal?
Why are there more bytes there?  Is it because Korean has more letters
inside each of those characters?  No, that guess doesn't make sense when I do
this with a single "character":

{% highlight ruby %}
"ㅅ".bytes
=> [227, 133, 133]
{% endhighlight %}

It's because utf-8 is dynamic.  ASCII fits in 1 byte.  If we force this to
`Encoding::UTF_16`, it has four bytes.  What we thing of as a letter is
irrelevant.  It's bytes and codepoints in an encoding scheme.  ASCII/English
just happens to be lucky at the top of the number chart.

So let's turn that single character into utf-16 (Java's default).

{% highlight ruby %}
"ㅅ".encode('utf-16').bytes
=> [254, 255, 49, 69]
{% endhighlight %}

But that doesn't mean we should.  And ... if we force this the wrong way, we'll
have a bad time.  Ruby won't change the bytes if you do `.force_encoding`.  But
it will if you `.encode`, as you can see.  It depends what you are trying to
do.

Next, I'm going to show what you can do with all of this.

## Data Corruption

Let's take a more practical example.  Let's say a file was written in the wrong
encoding.  This could be a database backup file that you really care about.
You could use iconv but let's play in pry because it's more fun and interactive.

Let's set up the failure scenario.

{% highlight ruby %}
File.open("/tmp/mysql-backup.sql", "w:UTF-8") {|file| file.puts wizard.force_encoding('iso-8859-1') }
import = File.open("/tmp/exported_garbage.txt", encoding:Encoding::ISO_8859_1).readlines.first
=> "\xC3\xAB\xC2\xB0\xC2\x94\xC3\xAB\xC2\x82\xC2\x98\xC3\xAB\xC2\x82\xC2\x98\n"
{% endhighlight %}

If you just try to `.force_encoding` it's not going to work.

{% highlight ruby %}
File.open("/tmp/mysql-backup.sql", "w:UTF-8") {|file| file.puts wizard.force_encoding('iso-8859-1') }
import.force_encoding('utf-8')
=> "ë°\u0094ë\u0082\u0098ë\u0082\u0098\n"
import.encoding
=> #<Encoding:UTF-8>
{% endhighlight %}

Interestingly, `.force_encoding` sticks.  So let's try again, knowing the path
that the data took.  We can reverse it:

1. First the data was utf-8.
1. Then it was forced to be latin1 but it's in a utf-8 file.
1. Then it was read as a latin1 file.

Since the read happened in Ruby-land, we can `force_encoding` the file reading
mistake.  Now it's a utf-8 string that was forced to latin1 in mistake 2.  So
we just have to re-encode those bytes back to latin1.  Finally, it was utf-8 in
mistake 1.  So we can just `force_encoding` the last step because it wasn't
written externally or re-encoded, the bytes were forced.

{% highlight ruby %}
pry> import.force_encoding('utf-8').  # undo the wrong file read
pry* encode('iso-8859-1').            # undo the file write
pry* force_encoding('utf-8')          # undo the force in the file.puts block

=> "바나나\n"
{% endhighlight %}

You can do it as one big line and play with this.  Just make sure to check your
encoding of your play variables.  The variable `import` is now utf-8 so weird
things will happen if you think it's latin1.  Re-read the file with `readlines`
to reset your playtime.

## UTF-8 Doesn't Just Solve Everything

Base64 encodes to ASCII.  So you'll have very similar problems like above.

{% highlight ruby %}
require 'base64'
encoded = Base64.encode64 'bacon is great'
=> "YmFjb24gaXMgZ3JlYXQ=\n"
decoded = Base64.decode64(encoded)
=> "bacon is great"
# Yay for ascii?

# Wait a minute ...
encoded = Base64.encode64 'ºåß¬∂˚∆ƒ'
=> "wrrDpcOfwqziiILLmuKIhsaS\n"
decoded = Base64.decode64(encoded)
=> "\xC2\xBA\xC3\xA5\xC3\x9F\xC2\xAC\xE2\x88\x82\xCB\x9A\xE2\x88\x86\xC6\x92"
decoded.force_encoding('utf-8')
=> "ºåß¬∂˚∆ƒ"
# The bytes didn't change, so force_encoding is correct here
{% endhighlight %}

## Conclusion

Encoding is hard.  It comes up a lot.  I forget what I have learned.
I hope this is a beacon to myself and others about some lessons and tricks.
Playing with this stuff now might save you stress later when something real
pops up.  I've seen backups be useless and then saved with `iconv` tricks and
Ruby's encode method is the same thing.
