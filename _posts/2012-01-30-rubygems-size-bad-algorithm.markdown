---
layout: post
status: publish
published: true
title: Rubygems Size, Bad Algorithms and a Bad Data Structure
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 1507
wordpress_url: http://squarism.com/?p=1507
date: !binary |-
  MjAxMi0wMS0zMCAyMzowMTo0MiAtMDUwMA==
date_gmt: !binary |-
  MjAxMi0wMS0zMSAwNDowMTo0MiAtMDUwMA==
categories:
- Ruby
tags: []
comments: []
---
![](/uploads/2012/01/pixel_disk.png "pixel_disk")
I mirrored ruby gems just to see how big it would be.  I used the  rubygems-mirror gem.  It's pretty simple.  Just cd into a directory with a lot of space (ie: /opt/gems or something) and type `gem mirror`.

After a massive initial load of 155k gems, the size was about 45GB (currently, it grows pretty quick per week).  The rubygem and gem mirror command is smart enough to just download just the deltas when you run it again:

`
$ gem mirror
Fetching: http://rubygems.org/specs.4.8.gz
Total gems: 170843
Fetching 16176 gems
................................................................
`

Then I [wanted to know](http://twitter.com/#!/squarism/status/162574507817697280) the size of all the latest gems only.  If I had to do a lazy sneakernet, this might be one method of grabbing a whole bunch of dependencies (of course this would never work).  Regardless of that, I still wanted to know what percentage of ruby gems space is old versions.

So I wrote a ruby program to find all the latest versions of the gem files and total up their size.  I was not very happy about my experiments with #sort and #sort_by.  The biggest problem is that it took **64 HOURS** to run.  I knew it had lots of problems but I didn't want to kill it.  I wanted to see how bad it really ran.

I'm not going to post the actual code.  You can see the old version at this [git commit url](https://github.com/squarism/sandbox/commit/7208efed6eba5ea588e4c76e8f34626feac003d2).  The basic gist of the crappy algorithm was something like this:

<pre>
Find all the files in the gem mirror off the filesystem.
Get the basename of the file name (ie: strip the path).  /tmp/foo-0.1.gem -> foo-0.1.gem
Go through all the basenames (gem names) find the gem family.
</pre>

Here's the problem.  I had a massive list of 170k gems and then I'm trying to do a find_all right here to sort the gems into gem families.  For example: there might be foo-0.1.gem, foo-0.2.gem and foo-async-0.1.gem.  In this example, there are two gem families out of the three gems.  Foo-async and foo are two different gems with their own versions.  Later on, I would:

<pre>
Do a version compare.
Push the latest version name to an array.
Delete the gem family name from the gem_names array.
</pre>

Sounded good on paper.  And then it took 65 hours to run (227305.19 seconds) and CPU was absolutely pegged the entire time.  This algorithm was easy to come up with in IRB using a small test data set but scaling up in the real use case completely sucked.  So I pushed it to github for versioning and rewrote the loop.

The [latest version](https://github.com/squarism/sandbox/blob/master/latest_gem_sizes.rb) runs in 8.5 seconds and spits out a total size of all the latest ruby gems at 6.5GB.  Of course, this information is useless since it's not going to check compatibility or anything.  I was just curious to know how much space is back versions.

The real key to the new version is the fact that I'm using a proper "grouped" data structure (Hash) instead of a massive flat Array.  This allows the regexes and other operations to work on a smaller data set.  The compound nature of the previous inefficiency is pretty amazing (hours to seconds).

![](/uploads/2012/01/gems_algorithm_1.png "gems_algorithm_1")

![](/uploads/2012/01/gems_algorithm_2.png "gems_algorithm_2")

![](/uploads/2012/01/gems_algorithm_3.png "gems_algorithm_3")

So hopefully you see above that a huge array of a File glob is flat and makes regex's or grouping operations very time consuming.  Ruby's magic group_by method sorts and groups the data structure once and then it's much easier to regex out versions and do other things.

See below for the code inline or [take a look at the github repo](https://github.com/squarism/sandbox/blob/master/latest_gem_sizes.rb).

{% highlight ruby %}
# refactored the 63 hour version to a much better 8.5 second version

require 'action_view'
include ActionView::Helpers

# change to location of rubygems mirror
GEM_DIR = "/opt/rubygems/gems"

gems = Dir.glob("#{GEM_DIR}/**/*.gem"); 1
gems = gems.collect {|g| g.split("/").last};

class Version
  include Comparable
  attr_reader :major, :feature_group, :feature, :bugfix, :version_string

  def initialize(version="")
    @version_string = version
    @major = "0"; @feature_group = "0"; @feature = "0"; @bugfix = "0"

    v = version.split(".")
    # puts v.join("|")

    if v[0]; @major = v[0]; else; raise "Major number blank."; end
    if v[1]; @feature_group = v[1]; end
    if v[2]; @feature = v[2]; end
    if v[3]; @bugfix = v[3]; end
  end

  # strangely enough .to_i works even for
  # >> "6-mswin32".to_i
  # => 6
  def <=>(other)
    return @major <=> other.major if ((@major.to_i <=> other.major.to_i) != 0)
    return @feature_group <=> other.feature_group if ((@feature_group.to_i <=> other.feature_group.to_i) != 0)
    return @feature <=> other.feature if ((@feature.to_i <=> other.feature.to_i) != 0)
    return @bugfix <=> other.bugfix if ((@bugfix.to_i <=> other.bugfix.to_i) != 0)
    # we probably have two things equal here
    return -1
    puts "FALLING THROUGH in <=>, not good"
  end

  def self.sort
    self.sort!{|a,b| a <=> b}
  end

  def to_s
    @version_string
  end
end

# temporary benchmarking
RubyProf.start

group_r = Regexp.new(/(.*)-(\d+\.\d+.*)\.gem$/)
gems_grouped = gems.group_by {|g| g.scan(group_r).flatten[0] }
# => {"firewool"=>["firewool-0.1.0.gem", "firewool-0.1.1.gem"}], ... }

latest_gems = []

gems_grouped.each do |g|
  versions = g[1].collect {|ver| ver.scan(group_r).flatten[1] }
  # => ["0.1.0", "0.1.1", "0.1.2"]

  begin
    latest = versions.collect {|v| Version.new(v)}.sort.reverse.first
    # => "0.1.2"
  rescue ArgumentError
    puts g
  rescue NoMethodError
    # somebody's got some crazy gem naming conventions
    # for example: chill-1.gem
    gems_grouped.delete g
  end

  latest_gems << "#{g[0]}-#{latest}.gem"
end

total = 0
latest_gems.each do |gem|
  begin
    total = total + File.size("#{GEM_DIR}/#{gem}")
  rescue Errno::ENOENT => e
    puts "WTF no #{gem}"
  end

end

puts "Total size of newest gems in #{GEM_DIR} is #{number_to_human_size(total)}"
{% endhighlight %}

Algorithm win.  Rubygem mirror size curiosity complete.  6.5GB is current gems out of 45GB (right now).