---
layout: post
status: publish
published: true
title: HBase Shell Color
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 1418
wordpress_url: http://squarism.com/?p=1418
date: !binary |-
  MjAxMS0xMi0wMyAxOTo1OToyOSAtMDUwMA==
date_gmt: !binary |-
  MjAxMS0xMi0wNCAwMDo1OToyOSAtMDUwMA==
categories:
- Systems
- Ruby
tags: []
comments: []
---
![](/uploads/2011/11/hbase_color.png "hbase_color")
Since the hbase shell is irb, I wanted to get color output because that's what I'm used to.  Although the appropriate place to put this is in an .irbrc file, that would conflict with any ruby development environment already on the system and luckily jruby and hbase don't seem to invoke it anyway.

First find a copy of wirble.  If you don't have it anywhere, [download it from github](https://raw.github.com/blackwinter/wirble/master/lib/wirble.rb):

`
cd ${hbase_home}/lib/ruby
wget https://raw.github.com/blackwinter/wirble/master/lib/wirble.rb
`

Now edit ${hbase_home}/bin/hirb.rb.  Add to the end but above IRB.start

{% highlight ruby %}
begin
  # load wirble
  require 'wirble'</p>

  # start wirble (with color)
  Wirble.init
  Wirble.colorize
rescue LoadError => err
  warn "Couldn't load Wirble: #{err}"
end

IRB.conf[:HISTORY_FILE] = "#{ENV['HOME']}/.hbase-history"

# add right before end but above this line
IRB.start
{% endhighlight %}

Now when you start hbase shell, you'll have lovely color output.  Why would you want this?  I don't know.  You probably don't want it.  But I was happy to understand how the hbase shell works.  It's just jruby irb that loads hirb automatically.