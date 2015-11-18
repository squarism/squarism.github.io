---
layout: post
status: published
published: true
title: Great dev log with vim and iTerm
date: 2015-11-13
---

> What did you do this week?
> _Um. Uh. (remembering intensifies)_


I have this problem a lot at work.  I'm cranking on stuff, figuring things out
day to day but if someone asks me what I've done, I have no clue.  Being put
on the spot sucks.  When something sucks, it's a problem.  Put it on the
[tool sharpening list](https://devchat.tv/ruby-rogues/129-rr-sharpening-tools-with-ben-orenstein).

So what can we do?  It's pretty easy and I don't want to drone on about it.
Just keep a *diary*.  But there are some specifics that I've worked out because
I've had lists of lists before.

I want to:

* Keep it simple.
* Have it be easy to use, non disruptive.
* Actually use it.  Something that I'm not going to hate, throw away or give up on.

### A Nice Setup

iTerm allows you to launch a terminal with a global hot key and run a command.
What's better is that it stays out of your way when you click away.


#### iTerm Setup
Configure a new profile in iTerm.  Set a command to run vim.

![iterm_profile_creation](/uploads/2015/dev_log_iterm_1.png)

Make the profile pop up with a hot key.

![iterm_hotkey](/uploads/2015/dev_log_iterm_2.png)

Voilà!

![iterm_hotkey](/uploads/2015/dev_log_log.png)

Combine this with a quick vim script to insert the date headers (including knowing what weekends are),
it's pretty nice.

#### Vim Setup

_(completely optional)_

Here's a shortcut that will add a header like `# 1999-99-99` at the top of the file.
Assign it to a shortcut and hit that at the beginning of the day.  It requires a sister
ruby script to figure out what 'tomorrow' means.  It's aware of the weekend.

{% highlight ruby %}
#!/usr/bin/env ruby
# put this in your path like ~/bin or something

require 'date'

# pass a date string like 2020-12-25 to this script and it will increment it by
# a day
starting_date = nil
if ARGV[0]
  starting_date = ARGV[0]
else
  starting_date = Date.today.to_s
end

original_date = Date.parse starting_date

# if today is Monday, increment by 3 because of the weekend
if (Date.today.wday == 1)
  puts original_date + 3
else
  puts original_date + 1
end
{% endhighlight %}

Vim shortcut

{% highlight vim %}
" Increment the date from yesterday.  Used for my development log (journal).
" If today is Monday, this should jump ahead three days.
function! NextDate()
  " get top line number
  let topline = getline(1)
  " trim the '# ' from a markdown header.  '# 2015-02-12' becomes '2015-02-12'
  let trimmed_line = substitute(topline, '\v^\#\s+(.*)', '\1', '')

  silent let next_date = system("tomorrow.rb " . trimmed_line)
  " trim newline from output
  let trimmed_next_date = substitute(next_date, '\n\+$', '', '')
  call append(0, [ ("# " . trimmed_next_date), "" ] )
  call append(1, "")
  execute "normal! ggjo"
endfunction
map <leader>N  :call NextDate()<CR>
{% endhighlight %}


### Awesome Things This Does

#### No more remembering during standups

During standups or retros, I can convert this quickly into a summary:

* What I worked on
* What I'm waiting on

Whatever your format is, your log is what you did and you won't forget stuff.


#### No more forgetting that cool command you typed

Sometimes I browse my history to find that `curl` that worked.  But which one?
In my dev log, I'll just paste in a command or _the thing_ that actually worked.
Maybe I was debugging something because I forgot something silly.  Writing that
down is like a tiny "hurrah" but also a breadcrump to *future me* what the hold-up was.


#### Weekend Me

I don't think about work on the weekend.  Monday me hates this.  With a dev log, this
isn't a problem.  I just review Friday and that's enough to jog my memory.

