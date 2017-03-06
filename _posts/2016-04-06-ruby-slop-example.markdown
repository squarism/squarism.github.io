---
layout: post
status: published
published: true
title: Ruby Slop Example
date: 2016-04-06
---

## Slop 4

I had an older post about ruby and slop but that's with Slop 3 which is basically locked to Ruby 1.9.
No doubt, this post will bitrot too so please pay attention to the post date.  The current ruby
is about `2.3.0`, slop `4.3` is current, it's 2016 and the US election cycle is awful.

**update** _This CLI has since been ported to crystal as an example of that process._
[Porting a Rubygem to Crystal](http://squarism.com/2017/02/25/porting-ruby-to-crystal/)


### It's ok that you need help

I think the most confusing thing about slop is that it has great examples and documentation but
when you try to break this apart in a real app with small methods and single responsibilities
some things sort of get weird.  I think this is because of exception handling as logic control
but I'm not sure enough to say _slop is doing something wrong that makes this weird_.  In
my example

I refer back to _MY OWN BLOG_ quite often for slop examples so it's ok that you need help.


### Slop's example

Let's look at the example from the `README`.

{% highlight ruby %}
opts = Slop.parse do |o|
  o.string '-h', '--host', 'a hostname'
  o.integer '--port', 'custom port', default: 80
  o.bool '-v', '--verbose', 'enable verbose mode'
  o.bool '-q', '--quiet', 'suppress output (quiet mode)'
  o.bool '-c', '--check-ssl-certificate', 'check SSL certificate for host'
  o.on '--version', 'print the version' do
    puts Slop::VERSION
    exit
  end
end
{% endhighlight %}

I disagree with `-h` here for hosts.  I think `-h` should always be help.  This is especially true
when switching contexts.  When I switch to java or node or go or python, I have no idea
what those communities' standards are.  I rely on what unix expects: *dash aitch*.
I disagree also with this example because figuring out how to handle `-h` for help
is the most confusing thing about using slop because you have to use exceptions
as flow control (sort of an anti-pattern).

<!-- more -->


### A real example

Let's write a wrapper program called _What the Fi?_ for our Internet connection.
When Internet things get wonky there are a few sites and tools I use to see _is it just me?_.
This wrapper will combine all those things into a CLI.  We'll use Slop 4.3 to parse
the CLI options.  We'll even write tests!

The main structure of this program is subcommand based.  It's a particular type
of CLI example similar to git where there are branches of main commands.  After the
main branching logic, you could have options on each of the subcommands but I'll leave that as an
exercise to you.  I'd also recommend [thor](http://whatisthor.com/) if you want to
build a complicated CLI with subcommands.  What I mean to say is, the following
is just a CLI example that happens to follow this subcommand pattern.

Here's how you use it.

{% highlight sh %}
# paste in the script below into a file named whatthefi
# put it in ~/bin if you want, or put it $PATH
wget -O ~/bin/whatthefi https://raw.githubusercontent.com/squarism/whatthefi/v0.1.0/whatthefi

# make it executable
chmod u+x ~/bin/whatthefi
whatthefi -h
{% endhighlight %}

The relevant Slop options are in this bit.

{% highlight ruby %}
require 'slop'
require 'net/http'
require 'json'

class CLI

  # set up defaults in its own method
  def cli_flags
    options = Slop::Options.new
    options.banner =  "usage: tubes [options] ..."
    options.separator ""
    options.separator "Options:"
    options.boolean    "-i", "--ip", "What is my ip?"
    options.string    "-p", "--port", "Can I get to a port?"
    options.string    "-d", "--down", "Is this URL down for everyone or just me?"

    options
  end

  def parse_arguments(command_line_options, parser)
    begin
      # slop has the advantage over optparse that it can do strings and not just ARGV
      result = parser.parse command_line_options
      result.to_hash

    # Very important to not bury this begin/rescue logic in another method
    # otherwise it will be difficult to check to see if -h or --help was passed
    # in this case -h acts as an unknown option as long as we don't define it
    # in cli_flags.
    rescue Slop::UnknownOption
      # print help
      puts cli_flags
      exit
      # If, for your program, you can't exit here, then reraise Slop::UnknownOption
      # raise a custom exception, push the rescue up to main or track that "help was invoked"
    end
  end
{% endhighlight %}


Notice that the `rescue Slop::UnknownOption` needed for Slop parsing is inside of a method called parse_arguments.
On many tools/projects I've done this isn't enough to handle all cases.  Then, what I'll do
is roll a custom error class and throw that instead.  You could also instead just not
`begin;rescue;end` here and do it _higher up_ in the main.  If you find yourself losing
data/context, it means you are at the wrong level of method calls.  In the slop examples, this isn't
explicitly mentioned but I find this way to be the most unixy.  It print help on an unknown option
and it prints help if you don't define `-h or --help`.  If you have a `-h` option you want to use
then use the `on '--help'` example Slop mentions.

{% highlight ruby %}
o.on '--help' do
  puts o
  exit
end
{% endhighlight %}

### Full Example

I hesitate to post the whole script here because it is very long.  But here it is anyway.  If you prefer
a git repo to puruse like a sane and reasonable person then [here it is](https://github.com/squarism/whatthefi/tree/v0.1.0).

_Note that master has switched to Crystal for a [different blog post]()_.

{% highlight ruby %}
#!/usr/bin/env ruby

require 'slop'
require 'net/http'
require 'json'

class CLI

  # set up defaults in its own method
  def cli_flags
    options = Slop::Options.new
    options.banner =  "usage: tubes [options] ..."
    options.separator ""
    options.separator "Options:"
    options.boolean    "-i", "--ip", "What is my ip?"
    options.string    "-p", "--port", "Can I get to a port?"
    options.string    "-d", "--down", "Is this URL down for everyone or just me?"

    options
  end

  def parse_arguments(command_line_options, parser)
    begin
      # slop has the advantage over optparse that it can do strings and not just ARGV
      result = parser.parse command_line_options
      result.to_hash

    # Very important to not bury this begin/rescue logic in another method
    # otherwise it will be difficult to check to see if -h or --help was passed
    # in this case -h acts as an unknown option as long as we don't define it
    # in cli_flags.
    rescue Slop::UnknownOption
      # print help
      puts cli_flags
      exit
      # If, for your program, you can't exit here, then reraise Slop::UnknownOption
      # raise a custom exception, push the rescue up to main or track that "help was invoked"
    end
  end

  def flags
    [:ip, :port, :down]
  end

  def flags_error
    switches = flags.collect {|f| "--#{f}"}
    puts cli_flags
    puts
    abort "please set one of #{switches}"
  end

  # In a cli app where you essentially have subcommands like git
  # this method makes sure that one of the main "modes" is set.
  # Something like:
  #   person --run
  #   person --walk
  #   person --stop
  def number_of_required_flags_set(arguments)
    # --ip isn't required
    minimum_flags = flags - [:ip]
    valid_flags = minimum_flags.collect {|a| arguments.fetch(a) }.compact
    valid_flags.count
  end

  # slop does not take on the job of requiring arguments to be set
  # this method represents our validation rules
  def validate_arguments(arguments)
    # --ip is false by default because it's a Slop boolean
    if number_of_required_flags_set(arguments) < 1 && !arguments.fetch(:ip)
      flags_error
    end
  end

  def set?(arguments, flag)
    !arguments.fetch(flag).nil?
  end

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

  def http_get(url)
    response = nil
    begin
      response = Net::HTTP.get(URI(url))
    rescue SocketError, Net::HTTPBadResponse, Net::HTTPHeaderSyntaxError, Net::ProtocolError => e
      puts e.inspect
    end
    response
  end

  # outside of scope but you can see these are action methods here
  # these could easily be broken out to classes
  def what_is_my_ip
    response = http_get("https://httpbin.org/ip")
    "Your IP is #{JSON.parse(response)['origin']}"
  end

  def portquiz(port)
    response = http_get("http://portquiz.net:#{port}")
    if response
      "I can get to port #{port} on the Internet.  :)"
    else
      "I can't reach port #{port} on the Internet.  :("
    end
  end

  def is_it_up(url)
    response = http_get("http://www.downforeveryoneorjustme.com/#{url}")

    # lazy html parsing to avoid nokogiri
    html_match = response.match(/class="domain"\>.*\<\/a\>(.*)\./)
    if html_match[1].include? "is up"
      "#{url} seems up.  :)"
    elsif html_match[1].include? "looks down"
      "#{url} seems down.  :("
    end
  end

end

# this kind of sucks, you shouldn't ever change your code to accomodate tests
# but this is a main
CLI.new.main if !defined?(RSpec)
{% endhighlight %}

If you look at `main` and `validate_arguments`, you'll see that `--ip` being a boolean and not
a string caused special logic to spew everywhere.  It's because it's a switch and not a parameter with
a string value (it's not `--ip=1.2.3.4`, it's just `--ip` or nothing).  Because of this, we have
to treat this option differently.  Sometimes we need to know if it's been set but because Slop
will set an unset boolean to false, we can't check for nil like all the other flags.

I hope this post helps the googlers write their CLIs.  My
[older post](http://squarism.com/2014/09/25/slop-example/) about slop had
bit-rotted and at the same time gotten high up on the google rankings.  I hope
I have avenged myself (against myself?).  All hail the bit rot.

