---
layout: post
status: published
published: true
title: Porting Ruby to Crystal
date: 2017-02-25
---

So let's say I have some CLI I want to exist ...

The concrete example I'm going to use is [my previous blog post](http://squarism.com/2016/04/06/ruby-slop-example/)
about Slop where I demonstrated how to use the slop
gem.  The code in that post is slightly contrived and certainly not clean but I think it demonstrates how to
test CLI _scripts_ which suffer from some testability problems (how do you capture STDOUT?).  The thing that
it *does not* demonstrate is long term maintenance problems that happen after it's written once for a blog
post.

Code review aside, this desire to have a binary CLI was inspired from a very real work situation where we had
a CLI utility and not surprisingly it was damaged from some gem and dependency problems.  Mainly, if I use
(consume as a user) the slop gem it's in my bundle.  If my list of gems grows forever eventually I might want
want to develop another gem that uses slop as a dev.  So now I need to use RVM's gemsets or gem_home or
otherwise keep my gems and projects sandboxed.  Because (as it did happen) pry uses slop and when pry stayed
behind causing slop problems between projects.  Distributing this gem to our team was problematic because
different people used different gem isolation tools.

So ... uh ... what if I just want a CLI?  Why can I just live and die in `/usr/local/bin` like "normal" unix-y
utilities do?


## Golang to the Rescue?

So for the past few years I've experimented with Go as a tool in the toolbelt for the above problem.  It has
fast compile times, can cross-compile to other cpu types and you can get a binary even for a web service.
Shipping a binary for an api service sounds pretty neat!  However, it lacks high-level density (usually called
expressiveness).  So without starting a language war, what if I want something in-between loose shell scripts
and strict compiled C (not that I'm specifically talking about shell or C)?

Ruby is so close to shell script sometimes and then you can drop into the "real stuff" for the heavy lifting
and then just continue in happy script land.  I feel like a lot of shell script problems align with this flow.
Looping over images and doing mass conversion for example.  It's just a little bit of heavy algorithm
surrounded by a lot of shell stuff, which is great.  So Ruby has been fine in that way.  But then not fine
for it to live in `$PATH`.

Go as an experiment has been fine while I've sought a panacea for $PATH.  Go has a lot of interesting things
in it and I'm not giving up on it.  But porting isn't real.  Rewriting is real.  Porting Ruby to Go is a
rewrite.  You really need to go back to requirements / thinking and you will feel tempted to refactor.  It's
closer to rewriting I mean.  It works the other way too.  I've seen "Java in Ruby" in a lot of libraries.

> There's no such thing as porting.  Only rewriting.

I'll show otherwise later.


## What Sharing Ruby is Like
So if I make a hello world CLI in Ruby called `utility`, how do I share it?

![binaries vs scripts](/uploads/2017/binaries_vs_scripts.jpg)

Here I list the dependencies that are implied in the top box.  In ruby there are many.
Many times they aren't listed or described.  If you are a ruby dev, you just know that things start with
`bundle exec`, you probably have it aliased.  If you aren't, you are confused and probably don't use the thing
because the `README` didn't work.

Maybe this above in the middle is the source code I'm trying to share.  Scripts can be commited with file
permissions so the chmod on the left isn't entirely needed.  What is definitely needed is some path setup
which may or may not already be configured.  I suppose you could put `utility` into `/usr/local/bin` but then
it's like an oddball exception.  `brew list` won't show it and it'll never be updated.  You'll just have to
remember you installed utility as a one-off?  Uhh ...

Basically it boils down to this:

> "Please install a dev environment" vs "Please use a package manager."

You can see that on the left I'm basically asking a user to install a dev environment for a Ruby program.  And
then as time progresses, what happens to that dev environment?  Does it bit-rot?  Does homebrew break it?

And maybe you might say "just gem publish".  Phusion used to do this for passenger.  And logstash.  But then
they stopped.  Using rubygems to distribute ruby code is sometimes done but then sometimes it's frowned upon.
I'm not sure exactly why and I don't have a source [although codegangsta kinda hints at
it](https://codegangsta.io/blog/2013/07/21/creating-cli-applications-in-go/).

This isn't a ruby problem.  The same thing happens with node & python.  But when I run into a utility written in
Go, I breathe a sigh of relief.

> It's written in golang.  Woo!  This should be easy to install and run.

Worst case it's a `go get`.  Sometimes it's a `brew install`.  I think these mechanics keep people from
packaging ruby utilities into homebrew.  I know there are packages that help with this like [Phusion's
tool](http://phusion.github.io/traveling-ruby/) and [FPM](https://github.com/jordansissel/fpm) but I just
don't see that a lot.  Most of the time the README just says `gem install` but they skip all the context that
I diagrammed up there.  Even my own projects blow up on me.  Sometimes I have to reset bundler and ruby (OSX
upgrades).  Then I'm missing a gem.

{% highlight bash %}
# My own goddamn project
~ > whatthefi
~/bin/whatthefi:80:in `main':
  uninitialized constant Slop::Parser (NameError)
  from ~/bin/whatthefi:136:in `<main>'
{% endhighlight %}

The fix: `gem install slop`.  I had already done bundle before but cleaning out gems, upgrading homebrew,
upgrading to Sierra or switching from rbenv/chruby/rvm and back and forth can leave this script "broken".

So, what to do?  *I just want a command in my path*.  Do I have to switch languages?

<!-- more -->


## Porting Ruby to Crystal
Crystal is a (very) Ruby-like language that can be built to a binary.  It's an entire language so it's hard to
sum up but here are some interesting attributes of Crystal according to me:

- It sits on top of LLVM.  This is how you get a binary.
- The stack traces are pretty verbose.
- It's Ruby-like but not exactly.  If you know Ruby, you know it already.
- Adding types aren't that bad.

So let's say that I wanted to port the `whatthefi` utility to Crystal.  To recap, `whatthefi` is a command who's
purpose is to be run when your wifi (really Internet) is acting up.  The ruby version has a few modes.

{% highlight bash %}
usage: whatthefi [options] ...

Options:
    -i, --ip    What is my ip?
    -p, --port  Can I get to a port?
    -d, --down  Is this URL down for everyone or just me?

please set one of ["--ip", "--port", "--down"]
{% endhighlight %}

So the usage help text is all generated from Slop which is really nice.  Automatic proliferation of standards
in the usage formatting and text.

{% highlight bash %}
~ > whatthefi --ip
Your IP is 1.2.3.4
{% endhighlight %}

Neat.  It's really a contrived utility created for a previous blog post but I do occasionally use it and I
expect it to be in my `$PATH` so it's very-first-world annoying when it breaks because of gem problems.


## Starting a Crystal Project

It's a script but it's really a binary.  Even the ruby project had a folder.  We should make a folder.
So let's do that and set up some basic files and structure.

{% highlight bash %}
mkdir whatthefi
cd whatthefi

whatthefi > touch LICENSE  # do better than this.  :)
whatthefi > mkdir spec src
{% endhighlight %}

You need crystal installed.  `brew install crystal-lang`


### What Did We Have?

We had a utility that basically takes command line arguments and then switches on what "mode" the user wants
and then calls a method that does a HTTP call out to services that in reality do the heavy lifting (like
checking if a website is up).  The ruby version used slop to parse ARGV and then a stdlib HTTP get.  Basically
the code breaksdown into sections like this.

![cli_breakdown](/uploads/2017/cli_breakdown.jpg)

Then there were rspec tests that tested the flags.  Here is the entire test suite, it's very small.

{% highlight ruby %}
# original ruby / rspec test

describe CLI do

  it "lets you check your ip address" do
    expect {
      CLI.new.main ["--ip"]
    }.not_to raise_error
  end

  it "lets you see if you can hit a port on the internet" do
    expect {
      CLI.new.main ["--port=1234"]
    }.not_to raise_error
  end

  it "lets you see if a site is down for everyone" do
    expect {
      CLI.new.main ["--down=github.com"]
    }.not_to raise_error
  end

end
{% endhighlight %}

You can see that we are testing the different CLI flags.  We'll do the same in the crystal version
except we'll actually capture STDOUT.


### Starting the Crystal Version

We'll make shard.yml file for our dependencies.  I'll explain the 3 shards we're going to use.

{% highlight yaml %}
# shard.yml is just like Gemfile

name: whatthefi
version: 0.1.0

authors:
  - Chris Dillon <email>

license: WTFPL

dependencies:
  cli:
    github: mosop/cli

  spec2:
    github: waterlink/spec2.cr
    version: ~> 0.9

  stdio:
    github: mosop/stdio
{% endhighlight %}

`cli` is a shard (gem) for crystal that helps in handling flags and building a CLI.  It's equivalent to slop or
perhaps more like thor since it supports subcommands.  The shard `spec2` is used to make testing a bit nicer.
Spec2 isn't quite as flushed out as rspec (understandably).  But that's ok.  Lastly, `stdio` is a shard which is going to help
just for testing, the annoying problem of capturing STDOUT text when trying to test a _main_ type script.

Note that these are compile type and developer only dependencies.  In ruby, we'd require these to be
available at run time because _interpreted bro_.  Not hating on Ruby here!  This is just how this works
which has advanages for distribution when we compile this all down.

We just run `shards` to install dependencies and this is the same as `bundle`.  If we want to update, run
`shards update` like `bundle update`.

In the ruby version, we had some setup for the option parser where we basically define the flags for our
project, then later we have a main or `run` and then the options are detected and methods are run.  It's very
simple.  Basically a big case/when depending on the CLI flags that are passed just like the breakdown image
above shows.  The methods for the actions are very small and they stand on their own:

{% highlight ruby %}
# ruby

# main style entry point
def main(command_line_options=ARGV)
  parser = Slop::Parser.new cli_flags
  arguments = parse_arguments(command_line_options, parser)
  validate_arguments arguments

  # --ip is a boolean, it is set to false even if left off by slop
  if arguments.fetch(:ip)
    puts what_is_my_ip
  elsif set?(arguments, :port)
    puts portquiz arguments[:port]
  elsif set?(arguments, :down)
    puts is_it_up arguments[:down]
  end
end

...

# the CLI action method
def what_is_my_ip
  response = http_get("https://httpbin.org/ip")
  "Your IP is #{JSON.parse(response)['origin']}"
end
{% endhighlight %}

If `--ip` is passed then it fires the `what_is_my_ip` method.  There's the case/when kinda behavior.
We can do the same with crystal just with a different library so the details change a little.

{% highlight ruby %}
# crystal

# main style entry point
#   I tried to use the on.foo { } style callbacks from the cli shard
#   but then you lose access to the options variable, so that wouldn't work
def run
  if options.ip?
    puts what_is_my_ip
  elsif options.port?
    puts check_port(options.port)
  elsif options.down?
    site_is_down = is_it_down(options.down)
    if site_is_down
      puts "#{options.down} seems down according to people."
    else
      puts "#{options.down} seems up according to people."
    end
  else
    # no options were passed
    help!
  end
end

...

# the CLI action method
def what_is_my_ip
  ip_status_url = "https://httpbin.org/ip"
  response = http_get(ip_status_url)
  begin
    origin = JSON.parse(response.body)["origin"]
    "Your IP is #{origin}"
  rescue ex : Socket::Error
    puts "Network problem connecting to #{ip_status_url}"  # TODO: not great, ex.inspect is a huge stacktrace
    exit!
  end
end
{% endhighlight %}

There's some differences in error handling here because the stack traces in Crystal are much more machine
formatted.  The same basic flow exists though.

The repo for `whatthefi` is tagged at the rewrite point.

* The ruby version is here as a [v0.1.0 tag](https://github.com/squarism/whatthefi/tree/v0.1.0).
* The crystal port is here as a [v0.2.0 tag](https://github.com/squarism/whatthefi/tree/v0.2.0).

_Newer versions and improvements will continue as the crystal version 0.2.0+._


### The Crystal Specs

Just like the Ruby version, we'll test the CLI flags so we don't have to manually test.  I'll just show one
test so you can see the general look of a test for brevity.

{% highlight ruby %}
require "./spec_helper"

require "../src/cli"

Spec2.describe CLI do

  # multiple nested contexts and describes don't quite work like rspec
  # so these tests are structured pretty flat with it-s
  describe "when arguments come from the command line" do

    it "has a mode for checking your public IP address" do
      # This is how we can capture stdout streams.
      # This is better than changing the code to output a string
      # and making a class that prints the return statement.
      # The task class can be free to do what it wants.
      output = nil
      Stdio.capture do |io|
        CLI.run(%w(--ip))
        output = io.out.gets
      end

      expect(output).to match(/Your IP is/)
    end

    ...
{% endhighlight %}
Note how we can use a block to capture STDOUT.  This isn't super clean or reliable so watch out
for terminal weirdness.  But I'd rather really test a CLI than not.

We can run our test suite like this:
{% highlight bash %}
whatthefi > crystal spec

Finished in 5.25 milliseconds
0 examples, 0 failures, 0 errors, 0 pending

    CLI
        when arguments come from the command line
            has a mode for checking if a port is accessible
            outputs the version
            outputs help on help
            has a mode for checking your public IP address
            checks a site on --down
            outputs help on no arguments

Finished in 8.29 seconds
Examples: 6, failures: 0
{% endhighlight %}

Note that the first 5.25ms time isn't wall time.  I don't know what that's from.  The test suite runs
in about 8 seconds.  It's not doing anything smart here.  It really hits the internet.  Sub-optimal.
I'm not sure about VCR in crystal or mocking external calls.  For a project this size, YAGNI.


### Quick Note on "Porting"

> I don't believe porting exists.  I think to port something between a lot of languages
> you actually need to rethink about it and almost rewrite it.  It's more of a rewrite process.

But in this exercise, I really did *port*.  It's a simple program, sure but I *really did* copy
ruby methods over and translate them.  Many lines remained unchanged and most of the changes came
from static typing or the changes between gems to shards.

Overall this is the most port-y port I've ever done.  So that's cool.


## Creating a Homebrew Formula for Crystal or Ruby

It is absolutely possible to create ruby projects without resorting to rubygems as a distribution mechanism.
I'm not implying that Crystal is required in order to make custom homebrew taps.  I am asserting that
binaries and homebrew (in my mind) go together more naturally because the requirements are less to get
a binary going.  Granted, I'm avoiding any downsides of managing binaries and platforms.  Not on purpose,
that's just going to take time and I'll have to do a follow up blog post.

Steps to create homebrew for a ruby gem:

* Create a new repo called `username/homebrew-tap` (not tap, homebrew-tap)
* Write a formula definition for your project in your homebrew-tap repo.
  * Download your release zip and run `shasum -a 256 release.zip` to get the sha256 for the formula.
* Push master to homebrew-tap to publish.
* Tag a release as a zip in the project you want to distribute.
* `brew tap you/tap` (my tap is `squarism/tap`)
* `brew install your_project` (this will auto-update taps as of recent hombrew versions)
* Run your command out of `/usr/local/bin`!

Now this skips things like bundler and dependencies.  If you have gems, this will fail for people
using your formula at runtime which is not nice.  I'm going to skip this since my goal is to get to
a binary CLI tool with Crystal.

{% highlight ruby %}
# the ruby version
class Whatthefi < Formula
  desc "CLI for answering the question: WTF is up with my Wifi?"
  homepage "https://github.com/squarism/whatthefi"
  url "https://github.com/squarism/whatthefi/archive/v0.1.0.zip"
  version "0.1.0"
  sha256 "e199fb9c2a84f1a01fccd965419c6a0d5141930334588462be1eaf86a310dfb6"

  def install
    bin.install buildpath/"whatthefi"
  end

  test do
    system "#{bin}/whatthefi --version"
  end

end
{% endhighlight %}

### Dev Loop

I made a Makefile for running common tasks like building a binary.  There may be
a more Crystal specific tool out there but I didn't look.

{% highlight ruby %}
all: bin

test:
	crystal spec

bin: clean
	crystal build -s --release -o whatthefi src/main.cr

clean:
	rm -f whatthefi

run:
	crystal run src/whatthefi.cr
{% endhighlight %}

Now `make` by itself will make a binary in our project root.  Just run with `./whatthefi`.
We're almost done!  Just put this in your path and then it's "installed" although this
is very manual and prone to error.  We probably want to make this maintainable with homebrew.


### Doing a Release

Let's say you've make changes and you want to cut a new version.

* Git tag it.
* Build the binary with `make`.
* Zip it up.

{% highlight bash %}
# Your git commits are done (in master) and ready
# We're going to bump to 0.2.0
whatthefi > git tag v0.2.0
whatthefi > git push origin master --tags
{% endhighlight %}

Github will make a release automatically based on that tag.
We're going to attach files to that release tag in a second.


### Attaching a Binary to a Release

Now that we have a project that builds to a binary, we can publish the binary so people
don't need a dev environment to run the project.  This can be done with a git tag and then
pushing that git tag.

_NOTE: This example is a very manual process.  For a larger and ongoing project, a better way would be to have
Travis-CI (or other CI tool) build the binaries and cut github releases.  For a good example of this in
crystal check out [crul](https://github.com/porras/crul/blob/master/RELEASE.md) and the repo's config.  Looks
like they cross compile to Linux using Docker as a build server._

{% highlight bash %}
whatthefi > make
rm -f whatthefi
crystal build -s --release -o whatthefi src/main.cr
Parse:                             00:00:00.0006970 (   0.19MB)
Semantic (top level):              00:00:00.1568300 (  44.05MB)
Semantic (new):                    00:00:00.0019980 (  44.05MB)
Semantic (type declarations):      00:00:00.0217310 (  44.05MB)
Semantic (abstract def check):     00:00:00.0007740 (  44.05MB)
Semantic (cvars initializers):     00:00:00.0163570 (  52.05MB)
Semantic (ivars initializers):     00:00:00.0051240 (  52.05MB)
Semantic (main):                   00:00:00.3167950 ( 108.24MB)
Semantic (cleanup):                00:00:00.0018050 ( 108.24MB)
Semantic (recursive struct check): 00:00:00.0008960 ( 116.24MB)
Codegen (crystal):                 00:00:00.4833900 ( 124.49MB)
Codegen (bc+obj):                  00:00:14.1489760 ( 124.49MB)
Codegen (linking):                 00:00:00.0691860 ( 124.49MB)

whatthefi > file whatthefi
whatthefi: Mach-O 64-bit executable x86_64

whatthefi > zip whatthefi-0.2.0.osx.zip whatthefi
adding: whatthefi (deflated 68%)

whatthefi > ls -lh whatthefi\*
-rwxr-xr-x  1 user staff   723K Mar  1 19:24 whatthefi
-rw-r--r--  1 user staff   232K Mar  1 19:25 whatthefi-0.2.0.osx.zip
{% endhighlight %}

Ok, now we have a zip.  Find the 0.2.0 release in your repo.  Click edit.
Then drag that zip within the release edit page like this.

![binaries vs scripts](/uploads/2017/attaching_binaries_to_releases.jpg)

Now homebrew has a zip file to download that's attached to a release.  You'll
want to cross-compile for other platforms you want to support.  Then wire up
the package manager for that platform.  I'm only showing Mac here.


### Update Your Homebrew Tap

{% highlight ruby %}
# the crystal port
class Whatthefi < Formula
  desc "CLI for answering the question: WTF is up with my Wifi?"
  homepage "https://github.com/squarism/whatthefi"
  url "https://github.com/squarism/whatthefi/releases/download/v0.2.0/whatthefi-0.2.0.osx.zip"
  version "0.2.0"
  sha256 "f8bd3b4f4759b0ff1a8d78c079bd9a29c1361e8bd9a387ee868147a0d32eb60d"

  def install
    bin.install buildpath/"whatthefi"
  end

  test do
    system "#{bin}/whatthefi --version"
  end

end
{% endhighlight %}


### Testing Homebrew Without Publishing

So let's say you want to play with homebrew before you publish?  Do you have
to make people mad while you play?  No.  You can just work off your local
Formula.

If you tap your own custom repo then it will live in a place that looks like this.
You could either work in there or work out of your homebrew git repo and copy into
here.

{% highlight bash %}
# Play around with whatthefi.rb in here.
#   confusing: whatthefi.rb is the homebrew formula, not the actual CLI program
#   Homebrew is written in Ruby.
/usr/local/Homebrew/Library/Taps/squarism/homebrew-tap/

# This brew install will follow whatever formula changes you did
~ > brew reinstall whatthefi

# If you are messing with your formula, you might need to clear the download cache
# if you are reinstalling in place.  Homebrew will give you a hint about this.
~ > rm ~/Library/Caches/Homebrew/whatthefi-0.2.0.zip
{% endhighlight %}

Then once you are happy do a commit to `you/homebrew-tap` and push to origin.


### The Payoff

After all this is setup, updates can be done to homebrew-tap and do your repo
in the steps listed above.  Going between Ruby and Crystal netted this fabulous change:

{% highlight text %}
~ > file `which whatthefi`
whatthefi: ASCII text

~ > brew uninstall whatthefi  # uninstall 0.1.0 the ruby version

# port to crystal

~ > brew install whatthefi  # install the crystal version
==> Installing whatthefi from squarism/tap
==> Downloading https://github.com/squarism/whatthefi/releases/download/v0.2.0/whatthefi-0.2.0.osx.zip
==> Downloading from https://github-cloud.s3.amazonaws.com/releases/...
######################################################################## 100.0%
  /usr/local/Cellar/whatthefi/0.2.0: 3 files, 724.3K, built in 2 seconds

~ > file `which whatthefi`
whatthefi: Mach-O 64-bit executable x86_64

~ > whatthefi --version
0.2.0

~ > whatthefi --down github.com
github.com seems up according to people.
{% endhighlight %}

Awesome.
