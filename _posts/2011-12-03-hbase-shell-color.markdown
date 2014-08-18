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
<p><img src="/uploads/2011/11/hbase_color.png" alt="" title="hbase_color" width="586" height="365" class="aligncenter size-full wp-image-1455" />
Since the hbase shell is irb, I wanted to get color output because that's what I'm used to.  Although the appropriate place to put this is in an .irbrc file, that would conflict with any ruby development environment already on the system and luckily jruby and hbase don't seem to invoke it anyway.</p>
<p>First find a copy of wirble.  If you don't have it anywhere, <a href="https://raw.github.com/blackwinter/wirble/master/lib/wirble.rb">download it from github</a>:</p>
<p><code>
cd ${hbase_home}/lib/ruby
wget https://raw.github.com/blackwinter/wirble/master/lib/wirble.rb
</code></p>
<p>Now edit ${hbase_home}/bin/hirb.rb.  Add to the end but above IRB.start</p>

{% highlight ruby %}
begin
  # load wirble
  require 'wirble'</p>
<p>  # start wirble (with color)
  Wirble.init
  Wirble.colorize
rescue LoadError => err
  warn "Couldn't load Wirble: #{err}"
end</p>
<p>IRB.conf[:HISTORY_FILE] = "#{ENV['HOME']}/.hbase-history"</p>
<p># add right before end but above this line
IRB.start
{% endhighlight %}

<p>Now when you start hbase shell, you'll have lovely color output.  Why would you want this?  I don't know.  You probably don't want it.  But I was happy to understand how the hbase shell works.  It's just jruby irb that loads hirb automatically.</p>
