---
layout: post
status: publish
published: true
title: Perl vs Ruby
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
excerpt: ! "<img src=\"/uploads/2011/03/pearl-290x300.png\"
  alt=\"\" title=\"pearl\" width=\"290\" height=\"300\" class=\"alignright size-medium
  wp-image-1085\" />\r\nThis isn't like Perl vs Ruby: FIGHT!  This is more like
  walking vs running: COMPARE!.  They will both get you there, just in different times
  and sweat amounts.  :)\r\n\r\nI stopped doing Perl in about 2002 but not because
  I hated Perl.  I stopped doing Perl because started learning Java.  Java was where
  the jobs were.  Since all that, I know I've become a better developer so a lot of
  this is situational to me and not a reflection on the language.  Without a control
  group, you can't say that the language has made me any different.  I've learned
  things (not all things) from each language, environment and community as I've bounced
  around.  No doubt, I'm Ruby-biased so please post comments, corrections and better
  ways of doing things in Perl so that I'm the most accurate I can be.  Recently it's
  popped back up at work and I needed a refresher but \r\n\r\nOk, enough about that.
  \ I'm here to compare how you do things in each language.  Ruby is all about blocks,
  syntax sugar and a very different community than Perl.  Both share many idealistic
  values (such as <em>there's more than one way to do something</em>) and <a href=\"http://www.rootr.net/rubyfaq-2.html\">Ruby
  was inspired a lot by Perl</a>.  So this isn't a battle but more of a Rosetta
  stone.\r\n"
wordpress_id: 1073
wordpress_url: http://squarism.com/?p=1073
date: "2011-03-25"
categories:
- Development
- Ruby
tags: []
comments:
- id: 6609
  author: Ric Deez
  author_email: ric@next-level.com.au
  author_url: http://www.dapaz.net
  date: !binary |-
    MjAxMS0wNy0yMyAxNDo1NTowMSAtMDQwMA==
  date_gmt: !binary |-
    MjAxMS0wNy0yMyAxOTo1NTowMSAtMDQwMA==
  content: ! "In perl you can do:\r\n\r\nuse 5.010;\r\n@list = qw(one two red blue);\r\n@colors
    = qw(red blue);\r\nsay join \"\\n\", map {$_ = $_ ~~ @colors ?  uc $_ : $_ } @list;\r\n\r\nI
    think that it is perfectly readable, both now and in 10 years time if you know
    Perl.\r\n\r\nBTW in your snippet:\r\n\r\n# capitalize only colors\r\ncolors =
    %w(red blue)\r\nputs (list &amp; colors).map(&amp;:upcase).join(\", \")\r\n\r\nI
    think that you are doing an intersection of the two lists and sending the result
    to map, so if this is right you are not capitalising only colours and printing
    the rest, but rather filtering out the non-colour elements in the list.\r\n\r\nIf
    this is the case you could do this in Perl:\r\n\r\nuse 5.010;\r\n@colors = qw(red
    blue);\r\nsay join \"\\n\", map {uc $_ } grep { $_ ~~ @colors } qw(one two red
    blue);"
- id: 6610
  author: Ric Deez
  author_email: ric@next-level.com.au
  author_url: http://www.dapaz.net
  date: !binary |-
    MjAxMS0wNy0yMyAxNTowMDozMCAtMDQwMA==
  date_gmt: !binary |-
    MjAxMS0wNy0yMyAyMDowMDozMCAtMDQwMA==
  content: ! "Also, in:\r\n# capitalize only colors\r\n@colors = qw{red blue};\r\n@seen{@list}
    = ();\r\nfor (@colors) {\r\n  push(@capital_colors, uc $_) if exists($seen{$_});\r\n}\r\nprint
    \"Capitalize only colors in array: \"; <-- you didn&#039;t bother printing this
    in your shorter Ruby version!\r\nprint join(&#039;, &#039;, @capital_colors) .
    \"\\n\";\r\n\r\nDon&#039;t get me wrong, I know Ruby reasonably well and like
    the language. I absolutely love RoR too (although I like Django better)...  The
    point is that if you are going to make a comparison then compare apples with apples."
- id: 6668
  author: Brad Lhotsky
  author_email: brad.lhotsky@gmail.com
  author_url: http://divisionbyzero.net/blog
  date: !binary |-
    MjAxMS0wOS0xNCAxNjowNzoxMyAtMDQwMA==
  date_gmt: !binary |-
    MjAxMS0wOS0xNCAyMTowNzoxMyAtMDQwMA==
  content: ! "As pointed out.. you used the .each() method in Ruby, but used a foreach
    loop in Perl.  map {} would allow you to accomplish everything in a single line.\r\n\r\nIn
    regards to the CPAN, most folks now use CPAN Minus and cool tools like CPAN::Mini
    and CPAN::Inject.. Makes my job as a System Administrator awesome.. Mirror the
    latest CPAN Modules only, and then inject our teams modules into our local mirror.
    \ Now they can install their modules anywhere they like.\r\n\r\nIn regards to
    REPL in Perl, there's a pluggable Devel::REPL that allows you use plugins to create
    a custom REPL for the command line.  A lot of the Plack::Middleware namespace
    allows in browser REPL, even code editing in browser for development environments.
    \ It's really some amazing stuff.   As more of the Perl Web stuff moves to Plack,
    that means developing web apps with Perl will become much more interactive and
    fun.\r\n\r\nJust clearing some stuff up.. I'm far more effective in Perl than
    Ruby, because I've been programming Perl for 15 years now.. I suppose Ruby is
    easier to learn as it's not tainted by the horrible Matt's Script Era that Perl
    has haunting it.\r\n\r\nGreat article, thanks for the perspective."
- id: 6703
  author: contradev
  author_email: simon@contradev.com
  author_url: ''
  date: !binary |-
    MjAxMS0xMC0xMiAxNDo1ODoyOCAtMDQwMA==
  date_gmt: !binary |-
    MjAxMS0xMC0xMiAxOTo1ODoyOCAtMDQwMA==
  content: ! "# capitalize all in array\r\n@list = qw(one two red blue);\r\nprint
    uc $_ .\" \" for @list;\r\n\r\n#TMTOWTDI"
- id: 6744
  author: PJK
  author_email: me@pavelkalvoda.com
  author_url: http://pavelkalvoda.com
  date: !binary |-
    MjAxMS0xMS0wOSAxODoyNzo0NSAtMDUwMA==
  date_gmt: !binary |-
    MjAxMS0xMS0wOSAyMzoyNzo0NSAtMDUwMA==
  content: ! "The multiple parameters example can be replaced by a one-liner:\r\n\r\ndef
    add(*arguments)\r\n  arguments.inject(&amp;:+)\r\nend"
---

<img src="/uploads/2011/03/pearl-290x300.png" alt="" title="pearl" width="290" height="300" class="alignright size-medium wp-image-1085" />
This isn't like Perl vs Ruby: FIGHT!  This is more like walking vs running: COMPARE!.  They will both get you there, just in different times and sweat amounts.  :)

I stopped doing Perl in about 2002 but not because I hated Perl.  I stopped doing Perl because started learning Java.  Java was where the jobs were.  Since all that, I know I've become a better developer so a lot of this is situational to me and not a reflection on the language.  Without a control group, you can't say that the language has made me any different.  I've learned things (not all things) from each language, environment and community as I've bounced around.  No doubt, I'm Ruby-biased so please post comments, corrections and better ways of doing things in Perl so that I'm the most accurate I can be.  Recently it's popped back up at work and I needed a refresher but

Ok, enough about that.  I'm here to compare how you do things in each language.  Ruby is all about blocks, syntax sugar and a very different community than Perl.  Both share many idealistic values (such as <em>there's more than one way to do something</em>) and <a href="http://www.rootr.net/rubyfaq-2.html">Ruby was inspired a lot by Perl</a>.  So this isn't a battle but more of a Rosetta stone.
<a id="more"></a><a id="more-1073"></a>
<h2>Methods/Functions</h2>

In both languages you can skip the return statement.
{% highlight perl %}
sub add {
  # return statement is not needed
  $_[0] + $_[1];
}
print add(1,2) . "\n";
# 3
{% endhighlight %}

Notice that we have to print a newline.  In perl, there's no println or puts.  In Perl 6, there will be a say function which will do a print with a newline.  But <a href="http://en.wikipedia.org/wiki/Perl_6">Perl 6 is not out</a>.

A neat trick is the $_ variable which means "an array of arguments".  You can't do this in Ruby so you have to explicitly define arguments otherwise you raise an ArgumentError.  $_ is a little bit line-noisy but that's the way I remember Perl.

{% highlight ruby %}
def add(a,b)
  a + b
end
puts add(1,2)
# => 3
{% endhighlight %}


So both of these functions do the same thing (although horrible and useless).  Both can't take three numbers: add(1,2,3).  In Ruby, you get a run-time ArgumentError exception.  In Perl, the third number "3" is thrown away and it still adds 1 + 2.  Of course, this isn't how you would do this in Ruby.  You would use the splat operator and add could take any number of arguments.  You can do the same thing in Perl but it's not automatic or nearly as clean.

{% highlight perl %}
sub add {
  $total = 0;
  foreach $number (@_) {
    $total = $number + $total;
  }
  $total;
}
print add(1,2,3) . "\n";
# 6
print add(1,2,3,4) . "\n";
# 10
{% endhighlight %}


Now now our Perl function can take any numbers and add them up.  This is how we'd do this in Ruby.
{% highlight ruby %}
# thank you PJK in comments
def add(*arguments)
  arguments.inject(&:+)
end
puts add(1,2,3)
puts add(1,2,3,4)
{% endhighlight %}


We can even just pass one number in and it will work in both languages.  I think both are fairly readable except for the fact that Perl is starting to look line-noisy with the @_ and $ all over the place.  The advantage here is that you know what kind of object it is by looking at the code.  The disadvantage is, Ruby doesn't care because of <a href="http://en.wikipedia.org/wiki/Duck_typing">duck-typing</a>.
<h2>Method weirdness</h2>

One thing I forgot or never knew is how Perl does it's lifecycle.  As I'm writing this, I'm redefining functions (methods) and they aren't doing what they are supposed to.  For example, I would expect this to print muffin:
<code>$ perl -e 'sub food { print "muffin\n"; } food;'</code>

And it does.  But I would expect this to print muffin and then asphault:
<code>perl -e 'sub food { print "muffin\n"; } food; sub food { print "asphault\n"} food;'</code>

But it prints asphault twice.

You can get around this by using Sub::Override but omg this is horrifying.  I have to download a CPAN module, install it (which is easy) and then my code looks like this:
<code>perl -e 'use Sub::Override;  sub food { print "muffin\n"; } food; my $override = Sub::Override->new( food => sub { print "asphault\n"}); food;'</code>

This is not how Ruby works and I think that's bad because it makes more sense in Ruby.  If I redefine food(), then it should be redefined at runtime.  Ruby version:
<code>ruby -e 'def food() puts :muffin end; food; def food() puts :asphault end; food;'</code>

Note that writing ruby one-liners is messy as crap.  This is also horrifying!  I can't make it much better by using semi-colons:
<code>ruby -e 'def food;puts "muffin";end; food; def food;puts "asphault";end; food;'</code>

Perl one-liners are nicer.  Ruby method redefinition in a normal file/program is nicer.
<h2>Environment and Libraries</h2>

Gems and perl modules are almost the same thing.  I like Ruby's gem command for interactive installation more than the CPAN shell but both are about the same if you install from a tarball.  However, ruby gems don't need to be extracted.  Perl has a lot more modules but I never got far enough with Perl to learn what killer libraries are out there.  <a href="http://ruby-toolbox.com/">Ruby toolbox</a> has what I think is a killer list of libraries that get really high-level functionality done quick.  For example, the savon library for webservices does quite a lot of work in just a few lines of <em>your code</em>.

Perl modules have namespaces which is a O_o moment for me in Ruby.  I've never run into a namespace collision but if you've ever taken a look at what is actually in scope, I don't think this is going to scale forever.  I guess as long as people don't all use the same CONFIG symbols and stick to modules as namespaces, everything will be ok.  I still would prefer an option to import library.module or Library::Module or something like that.
{% highlight bash %}
$ ruby -e 'puts Symbol.all_symbols.size'
1562
$ ruby -e 'require "rails"; puts Symbol.all_symbols.size'
3706
$ ruby -e 'require "rails"; require "savon"; puts Symbol.all_symbols.size'
5976
$ ruby -e 'require "rails"; require "savon"; require "wirble"; puts Symbol.all_symbols.size'
6078
{% endhighlight %}

Perl wins in this regard.
<h2>Deployment</h2>

Massive generalizations incoming.  I can't cover every edge case.  So I'll just say that Perl is installed everywhere.  Ruby is installed someplaces.  On Windows, neither is there and both are a pain but not because of the interpreter itself but because you need a real dev environment (gcc etc).  DevKit in Windows might solve both problems.  I've followed EngineYard's lead and gotten Ruby on Windows up and running using their installer and DevKit.  But I haven't done it multiple times because it's a pretty new initiative by them.

So the Perl that ships with the OS is probably ok.  The new hotness right now seems to be some version of 5.10 which 10.10 comes with.  Ubuntu at least gives you 5.10 if you do an apt-get but Ruby is completely unusable.  If you're not a rubyist, 1.9.1 is taboo.  It doesn't run rails 3 and 1.9.2 is pretty much the current version (although a little bleeding edge).  I use it as my main now and haven't had any major gotchas.  On mac, Perl is probably broken.  On mac, Ruby is definitely broken, it ships with 1.8.6 as of 10.6.6 and that's completely old and busted.  So in either case, you probably have some work to do but Ubuntu/Linux gives Perl the edge.

RVM is absolutely awesome, it allows you to switch interpreters at will, create/switch collections of gems (modules) and installs the interpreter in your home directory so that you don't have to sudo everything.  If your home directory floats with you on a network, then it's even more awesome because your ~/.rvm directory has your entire dev environment exported over NFS or whatever.  But RVM is not the default way of installing ruby, it is not integrated into your OS package manager and it does not run on Windows.  So you have to discount RVM.
<h2>Powah</h2>

Ruby can do more in one line than Perl can do.  Who cares?  Well it speeds up development time and reduces bugs, at least in theory.  I know there's way more to development than syntax but there isn't a whole lot more to putting a smile on a developer's face when he thinks about how hard a problem <em>could have been</em>.

Ok, so let's take a bunch of strings and capitalize them.

{% highlight perl %}
# capitalize all in array
@list = qw(one two red blue);
print "Capitalize all in array: ";
foreach $item (@list) {
  print uc $item . " ";
}
print "\n";
{% endhighlight %}

This gives us: <code>Capitalize all in array: ONE TWO RED BLUE</code>

Now let's only capitalize colors.  Taken from <a href="http://langref.org/all-languages/lists/access/list-intersection">langref.org</a>.

{% highlight perl %}
# capitalize only colors
@colors = qw{red blue};
@seen{@list} = ();
for (@colors) {
  push(@capital_colors, uc $_) if exists($seen{$_});
}
print "Capitalize only colors in array: ";
print join(', ', @capital_colors) . "\n";
{% endhighlight %}

This gives us: <code>Capitalize only colors in array: RED, BLUE</code>.  Not great.  Lots of code, lots of weird symbols that won't make sense to you in a year (imo).  What is <code>@seen{@list} = ();</code> all about?  Even if you explain it, why do I have to do all that for what Ruby does with include?().  We'll get to that in a second.

First, let's capitalize (actually uppercase) all words in an array in Ruby:

{% highlight ruby %}# capitalize all in array
list = %w(one two red blue)
capital_colors = list.collect {|item| item.upcase }
puts capital_colors.join(", "){% endhighlight %}

Ok 4 vs 7 lines.  And we can shorten it too 3 lines.

{% highlight ruby %}
# capitalize all in array, shorter
list = %w(one two red blue)
puts list.collect {|item| item.upcase }.join(", ")
{% endhighlight %}

Shorter still:

{% highlight ruby %}# capitalize all in array, even shorter
list = %w(one two red blue)
puts list.map(&:upcase).join(", ")
{% endhighlight %}

Ok, what about only capitalizing color words then?  How much different does it look than Perl?

{% highlight ruby %}
# capitalize only colors
colors = %w(red blue)
puts (list & colors).map(&:upcase).join(", ")
{% endhighlight %}


So is this more readable?  Not really.  The & method of an Array in Ruby is pretty terse and cryptic just like Perl's shortcuts.  <a href="http://ruby-doc.org/core/classes/Array.html#M000274">But it is documented in the stdlib</a>.  But if we want to make it a little more readable then we can do this:

{% highlight ruby %}
# less terse
colors = %w(red blue)
capital_colors = Array.new
list.each do |item|
  capital_colors  << item.upcase if colors.include?(item)
end
puts capital_colors.join ", "
{% endhighlight %}

How ugly is it?  How long is it?  Which is better?  Well even the longer Ruby form of capitalizing colors is 7 lines including the comment whereas the Perl version is 8.  Well who cares?  The Ruby version is way more readable in either form.  I can add comments like "for each item in the list that intersects, capitalize and join with commas".  With the Perl version, I would have to explain what the temp variable is.  Perhaps this is a comfort opinion as a Perl person would wonder what the heck &:upcase means.  In any event, Ruby has methods that are at least named something meaningful and you can chain them along like Python.  However, unlike Python, Ruby has blocks.  And blocks are extremely powerful which is also why the Perl person wouldn't understand why &:upcase is so awesome.

Perl really only has one way to go through an Array.  You loop through it.  Ruby has that but more.  You can loop plainly with .each() but you can also pass a block in to do something.  You can even return a new Array with .collect() or .map().  But really it's not about looping over the Array that is the important part.  The distinguishing feature (again) in Ruby is blocks.  It's the fact that you can pass a block to .each() and .collect() and avoid having to iterate over and over again.  It's the fact that a block can be passed to a file iterator, a database result set, a hash and an array and they all acts the same.  For a really good presentation, you should check out <a href="http://blog.extracheese.org/2010/02/python-vs-ruby-a-battle-to-the-death.html">Gary Bernhardt's presentation</a> he did about Ruby to a room full of Python people.  Also, check out his <a href="http://peepcode.com/products/play-by-play-bernhardt">Play-by-Play at Peepcode</a>.

In any event, this contrived example is just the beginning.  Ruby gives you crazy powah and not just iteration.

<h2>REPL</h2>

Ruby has a shell called IRB that gives you REPL hotness.  Perl can do an eval loop too like this:
<code># put into .bashrc
alias 'perl-repl'='perl -MData::Dumper -MTerm::ReadLine -e '\''$r = Term::ReadLine->new(1);while(defined($_ = $r->readline("code: "))){$ret=Dumper(eval($_));$err=$@;if($err ne ""){print $err;}else{print $ret;}}'\'''</code>
But is that good?  Irb comes with Ruby.  It's not only part of it but there are gems that extend it.  Irb has autocompletion (like how you hammer the tab key in bash), colors and introspection tricks like the following.  Let's say I have a new library (gem) that I'm not familiar with.  I fire up irb:
<code>$ irb</code>

Now in irb, I can do stuff like this (colors not shown):

{% highlight ruby %}
>> require 'plucky'
=> false
>> Plucky.class
=> Module
>> Plucky.public_methods
=> [:!, :!, :!, :, :, :=>, :, :, :, :, :, :__id__, :__send__, :ai, :ancestors
{% endhighlight %}

I have no idea what <a href="https://github.com/jnunemaker/plucky">Plucky</a> is or what it does.  So I ran public_methods to see what it does.  The list of public_methods goes off the screen to the right.  There's a ton of them because it's inheriting from the class Object and who knows what else.  But following a trick found on stackoverflow, I can monkey-patch the Object class to only show what the difference is between it and Object (ruby has single inheritance so there's no chain).  So I put this in my .irbrc:

{% highlight ruby %}class Object
  # Return only the methods not present on basic objects
  def interesting_methods
    if self.is_a? Class
      (self.public_methods - Object.public_methods).sort
    else
      if self.is_a? Module
        (self.public_methods - Module.public_methods).sort
      else
        (self.public_methods - Object.new.public_methods).sort
      end
    end
  end
end
{% endhighlight %}
And now I can do this in irb:
{% highlight ruby %}
>> require 'plucky'
=> true
>> Plucky.interesting_methods
=> [:to_object_id]
>> Plucky.public_methods.size
=> 103
>> Plucky.interesting_methods.size
=> 1
{% endhighlight %}


Ok, so there's 1 method that is possibly interesting.  But what is this Plucky object?  If I call .class on it, I find out that it's a Module which is being handled in the .irbrc snippet above.  Well, a module usually doesn't have much use by itself.  Usually a module includes classes that actually does stuff.  So let's try to find a class by looking at Plucky's constants:
<code>Plucky.constants
[:Extensions, :CriteriaHash, :OptionsHash, :Query, :Version, :Pagination]
</code>

For each of those, we can see what it is with the .class method.

{% highlight ruby %}Plucky::Extensions.class
=> Module
>> Plucky::Query.constants
=> [:OptionKeys]
Plucky::Query::OptionKeys
=> [:select, :offset, :order, :fields, :skip, :limit, :sort,
:hint, :snapshot, :batch_size, :timeout]
{% endhighlight %}


Ok so Query looks interesting.  Let's take a look at it.

{% highlight ruby %}>> Plucky::Query.interesting_methods
=> [:def_delegator, :def_delegators, :def_instance_delegator,
:def_instance_delegators, :delegate, :instance_delegate]
{% endhighlight %}


Well, that's not very interesting.  Let's try creating and instance of Plucky::Query.

{% highlight ruby %}>> Plucky::Query.new.interesting_methods
ArgumentError: wrong number of arguments (0 for 1)
{% endhighlight %}


Ok, apparently it wants a parameter.  It's just make up something.

{% highlight ruby %}Plucky::Query.new("muffins").interesting_methods
=> [:[], :[], :all, :all?, :any?, :chunk, :collect, :collect_concat, :collection,
:count, :criteria, :cycle, :detect, :drop, :drop_while, :each, :each_cons,
:each_entry, :each_slice, :each_with_index, :each_with_object,
:empty?, :entries, :exist?, :exists?, :explain, :fields, :fields?, :find,
:find_all, :find_each, :find_index, :find_one, :first, :flat_map, :grep,
:group_by, :ignore, :include?, :inject, :last, :limit, :map, :max, :max_by,
:member?, :merge, :min, :min_by, :minmax, :minmax_by, :none?,
:object_ids, :offset, :one?, :only, :options, :order, :paginate, :partition,
:per_page, :reduce, :reject, :remove, :reverse, :reverse_each, :select,
:simple?, :size, :skip, :slice_before, :sort, :sort_by, :take, :take_while,
:to_a, :to_hash, :to_set, :update, :where, :zip]
{% endhighlight %}


Now we're getting somewhere.  Looks like Query mixes in Enumerable (there's an each method and others).  Let's check:
{% highlight ruby %}>> Plucky::Query.included_modules
=> [Enumerable, Wirble::Shortcuts, PP::ObjectMixin, Kernel]
{% endhighlight %}

Wirble::Shortcuts and PP::ObjectMixin don't count because we're in irb and those are irb mixins specific to "pretty print" and wirble which just make irb more pretty.  So Enumerable and Kernel are the modules that Query uses.  Enumerable most likely contains each.  Let's write a quick script to find out.

{% highlight ruby %}# what methods does Enumerable give you?
class Foo; end
base_methods = Foo.new.public_methods
class Foo; include Enumerable; end

enumerable_methods = Foo.new.public_methods
special_methods = enumerable_methods - base_methods

# monkey patch for interesting_methods outside of IRB
class Object
  # Return only the methods not present on basic objects
  def interesting_methods
    if self.is_a? Class
      (self.methods - Object.methods).sort
    else
      if self.is_a? Module
        (self.methods - Module.methods).sort
      else
        (self.methods - Object.new.methods).sort
      end
    end
  end
end

require 'plucky'
plucky_methods = Plucky::Query.new("muffins").interesting_methods

class Foo; include Kernel; end
kernel_methods = Foo.new.methods

# gets close but no cigar
puts (plucky_methods - special_methods - kernel_methods).join(",")
{% endhighlight %}

This outputs:
{% highlight ruby %}
[],[]=,all,collection,criteria,each,empty?,exist?,exists?,explain,
fields,fields?,find_each,find_one,ignore,last,limit,merge,
object_ids,offset,only,options,order,paginate,per_page,
remove,reverse,simple?,size,skip,to_hash,update,where
{% endhighlight %}

Unfortunately, this isn't quite right according to `ri Plucky::Query`.  But at least we have a clue as to what this thing is like.  If we hit up his <a href="https://github.com/jnunemaker/plucky/blob/master/test/plucky/test_query.rb">tests directory in the source</a>, we can see we were getting close.

The point of this extremely long section is all about REPL.  Here we are playing around with an API directly with no knowledge of it because we have IRB.  We at least learned that it has something to do with an iterator, fields and finding things.  That's pretty close to what is shown in <a href="http://railstips.org">Nunemaker's</a> tests.

In Perl, we don't have a REPL loop that's as good.  We can do a simple eval shell but it's not as polished nor as often used.

### IO Speed
In simple cases like "_find me all the things in this file that look like phon numbers_", Perl consistently beats the pants off of Ruby.  Maybe because Ruby has to allocate objects to do anything (like regex work).  Perl's I/O is very fast.  But then we end up with a mess of Perl code that is procedural.  So for simple apps, I/O is great but then all you end up with is a bunch of small Perl scripts.  How can you build a large Perl application?

So for `sed` and `awk` style one-liners, sometimes I will reach for Perl.  But when it becomes complex, I rewrite it in Ruby.  You don't have to learn Moose to get something other than procedural style.

### Conclusion

I can't really give one.  There's no final argument, no silver bullet.  There are many things that I have gotten used to in Ruby and switching to Perl, even for this post is very difficult.  I'm faster in Ruby now than I was in Perl.  I'm fairly sure that I couldn't be as fast or elegant in Perl.  But it's not just the language, it's the REPL experience.  It's "gem list" vs CPAN.  It's the community of test-driven-development and a whole bunch of other soft features.  None of it is a deal breaker and Perl isn't failing to solve real problems everyday.  Perl is portable, well established, installed by default and it excels at text manipulation.  But I would say, despite all the good of Perl, Ruby sucks less.
