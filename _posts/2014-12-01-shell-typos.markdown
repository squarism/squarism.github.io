---
layout: post
status: published
published: false
date: 2014-12-01
title: Analyzing Shell Typos
---
Let's create a list of our most common typos on the shell.  First, let's
go over the algorithm.

1. Find all the single word commands from our shell history.  (We are cheating here to avoid complexity)
1. Uniq the list to find a list of commands we've typed.
1. Compare this list against everything in our $PATH plus built-ins.  Call this typos.
1. Count typos in history.
1. Sort.

First, let's look at an example of our `.zsh_history` file.  I'm sorry that this is zsh and not bash but I don't have as much history in my bash history because I switched a while back.  Here's an excerpt:

{% highlight bash %}
: 1391998765:0;touch .vimrc
: 1391998766:0;vim
: 1391998768:0;cd dotfiles
: 1407998777:0;tree -CL 2
{% endhighlight %}


Alright.  Let's write an auditor.  This is shell-scripty stuff so let's do it in Ruby.  This would be fun to do in Go as well.

{% highlight ruby %}
require 'json'


# or require 'active_support/core_ext' for .slice on hash
module HashExtensions
  def subhash(*keys)
    keys = keys.select { |k| key?(k) }
    Hash[keys.zip(values_at(*keys))]
  end
end
Hash.send(:include, HashExtensions)


class TypoAuditor

  def history_file
    "#{ENV['HOME']}/.zsh_history"
  end

  def read_history_file
    File.open(history_file, "r", :encoding => 'iso-8859-1').readlines
  end

  def strip_history history
    history.collect do |line|
      # Get just the command from the history format
      # : 1407964003:0;vi tmux.conf
      line.split(/\:\s\d+\:\d\;(.*)\n/)[1]
    end
  end

  def single_command text
    if text.include?(" ")
      text.split(" ").first
    else
      text
    end
  end

  def ignore_arguments commands
    commands.collect do |cmd|
      single_command cmd
    end
  end

  def word_count commands
    h = Hash.new(0)
    commands.reduce(h) { |counts, command| counts[command] += 1; counts }
  end

  def what_we_typed
    history = read_history_file
    typed_commands = strip_history history
    single_commands = ignore_arguments typed_commands.compact
    word_count single_commands
  end

  # I hate relying on bash here but ... it's easy.
  # zsh needs compgen compatibility installed.  Not great for a blog post.
  def valid_commands
    cmds = `bash -c 'compgen -cabk'`.split(/\n/)
    zsh_aliases = `zsh -c 'alias'`.split(/\n/).collect {|a| a.split('=').first }
    cmds + zsh_aliases
  end

  def audit
    typed_counts = what_we_typed
    valid_typed = typed_counts.subhash *valid_commands
    typoes = what_we_typed.keys - valid_typed.keys
    typo_counts = typed_counts.subhash *typoes
    Hash[typo_counts.sort_by{|_, v| -v }]
  end

end


# This program is scripty style.
# So let's just embrace it like an awkward hug.
if __FILE__ == $0
  auditor = TypoAuditor.new
  puts JSON.pretty_generate auditor.audit
end
{% endhighlight %}


Here's a bit of the output.

{% highlight json %}
{
  "j": 79,
  "./configure": 3,
  "meow": 2,
  "ks": 1,
  "v": 1,
  "s": 1,
  "rmv": 1,
  "sl": 1,
  "l": 1,
  "frunt": 1,
  ...
}
{% endhighlight %}

It doesn't pick up on `oh-my-zsh` plugins (j is autojump).  And it doesn't know how to find relative path scripts because those files are probably gone (for like src compiling and installing).  Maybe in a future version I could figure out a quick way to do that.  For now, it gives me a list of possible things I could alias if the counts get too high.  Out of 5400 lines of history, I don't see a lot of win here.

But I like having this auditor around for the future.