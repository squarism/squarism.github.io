---
layout: post
status: published
published: true
title: Pry and Slop
date: 2016-04-19
---

If you are working on a gem that uses slop itself (your gem uses slop) then
you might run into this error when adding pry.  Because the latest published
pry gem uses slop 3.6 but you are probably using slop 4.  Slop 4 and 3 aren't
the same API.

{% highlight ruby %}
require 'my_cool_gem_im_working_on'

Gem::ConflictError: Unable to activate my_cool_gem_im_working_on-0.2.0, 
because slop-3.6.0 conflicts with slop (~> 4.2)
from .../rubygems/specification.rb:2284:in `raise_if_conflicts'
{% endhighlight %}

On `bundle install` you'll probably get a different error.


{% highlight bash %}
Resolving dependencies...
Bundler could not find compatible versions for gem "slop":
  In snapshot (Gemfile.lock):
    slop (= 4.2.1)

  In Gemfile:
    my_cool_gem_im_working_on was resolved to 0.2.0, which depends on
      slop (~> 4.2)

    pry (= 0.10.1) was resolved to 0.10.1, which depends on
      slop (~> 3.4)

Running `bundle update` will rebuild your snapshot from scratch, using only
the gems in your Gemfile, which may resolve the conflict.
{% endhighlight %}

This is true for pry `0.10.2` too.  There are two options I've found that works:

### Update Pry

_tl;dr_ Do this

Install 0.10.3 or newer.  Make sure your bundle is resolving to that exact version.
This means

{% highlight ruby %}
# your Gemfile
"pry", "= 0.10.3"
{% endhighlight %}

in your Gemfile.  If you are working on a gem and
don't really have a Gemfile but have a gemspec file then put this dev dependency in your gemspec.

{% highlight ruby %}
# your .gemspec file
spec.add_development_dependency "pry", '= 0.10.3'
{% endhighlight %}

### Install From Master

You could also install pry from github master.  This might show up as 0.10.3 depending on when
you are reading this.  Version numbers only increment when pry does a release.  I found
that pry git master did not have this issue.

Now the problem here is, if you are working on a gem yourself, you don't have a `Gemfile`.
Afaik, you can't install a gem from github source instead of a gemspec (that wouldn't make sense
because you are going to distribute a gem!).  But perhaps, you maybe want pry
temporarily in your gemspec like this:

{% highlight bash %}
# your_gem.gemspec
spec.add_development_dependency "pry", '=0.10.3'
{% endhighlight %}

Here's how you can install a gem from source in a gemspec temporarily.

{% highlight bash %}
# do what you want here but I clone into a global place called ~/src/vendor
mkdir -p ~/src/vendor
cd ~/src/vendor
git clone https://github.com/pry/pry
cd pry
gem build pry.gemspec
# it will spit out a pry gem with a version on it
gem install pry-0.10.3  # or whatever `.gem` file is created
{% endhighlight %}

Now we have pry 0.10.3.  Bundle doesn't care it came from pry master.  So when it
picks up on the `spec.add_development_dependency` it will install the version
you already have.  **BUT BIG PROBLEM**  You probably don't want to commit this
because people will get the same error you got on bundle install if
that version doesn't resolve.  As far as I can tell, this pry version
works with slop so perhaps you just want to use 0.10.3 and be done with this.
I just wanted to illustrate how you can manipulate bundler.


## Pry Vendored Slop

The reason this is happening is because of [the slop namespace](https://github.com/pry/pry/issues/1497).
Pry fixed this in a commit associated with that issue.  It's fixed because they inlined
the gem as `Pry::Slop` so now `Slop` (your version) doesn't conflict/activate.

Hope this saves someone's day!  :)
