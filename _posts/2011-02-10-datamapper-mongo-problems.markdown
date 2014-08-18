---
layout: post
status: publish
published: true
title: DataMapper Mongo Adapter problems
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 930
wordpress_url: http://squarism.com/?p=930
date: !binary |-
  MjAxMS0wMi0xMCAyMzoyOToxMiAtMDUwMA==
date_gmt: !binary |-
  MjAxMS0wMi0xMSAwNDoyOToxMiAtMDUwMA==
categories:
- Ruby
tags: []
comments: []
---
<p><img src="/uploads/2011/02/PoweredMongoDBbeige50.png" alt="" title="PoweredMongoDBbeige50" width="129" height="61" class="alignright size-full wp-image-931" />
Ok, so some background.  I'm curious as to <a href="http://www.lunarlogicpolska.com/blog/2010/02/15/mysql-and-mongodb-working-together-in-kanbanery.html">this post</a> at lunarlogicpolska.com which shows mysql and mongodb living together in harmony.  Some data is in mysql (nice and structured), some data is in a crazy-fast document database.  It doesn't matter.  Datamapper combines many sources into a common abstraction layer that your models can pick and choose which to use.  At least that's the dream.  I was going to play around with this but hit a bit of a snag.</p>
<p>First the post at lunarlogicpolska.com basically boils down to this bit:</p>
{% highlight ruby %}
require 'rubygems'
require 'dm-core'</p>
<p>DataMapper.setup(:default, "mysql://localhost/examples")
DataMapper.setup(:logs, "mongo://localhost/examples")
{% endhighlight %}</p>
<p>Unfortunately, this wouldn't run on my box.  I had installed my gems like so:  `gem install dm-mongo-adapter --pre` and got a big ol problem while install rdoc (weird):
<code>RDoc::Parser::Ruby failure around line 220 of
lib/dm-core/query/conditions/operation.rb
[snip]
The internal error was:
        (RDoc::Error) Name or symbol expected (got #<RDoc::RubyToken::TkAMPER:0x00000005509380>)
ERROR:  While generating documentation for dm-core-0.10.2
... MESSAGE:   Name or symbol expected (got #<RDoc::RubyToken::TkAMPER:0x00000005509380>)
</code></p>
<p>Doing the same gem install command got rid of the rdoc error.  Ok, no problem.  This is a prototype I'm trying to build, no sweat if rdoc installation is a bit flaky.  Unfortunately, I didn't get much farther than this with the actual code until I changed lunarlogicpolska's example to this:</p>
{% highlight ruby %}require 'mongo_adapter'</p>
<p>DataMapper.setup(:default, "mysql://user:pass@localhost/database")
DataMapper.setup(:logs, "mongo://host:port/database")
{% endhighlight %}</p>
<p>I found this out by playing around with irb.  The order matters:</p>
{% highlight ruby %}
ruby-1.9.2-p136 :001 > require 'rubygems'
 => false
ruby-1.9.2-p136 :002 > require 'dm-core'
 => true
ruby-1.9.2-p136 :003 > DataMapper.setup(:logs, "mongo://localhost/examples")
LoadError: no such file to load -- dm-mongo-adapter
        from <internal:lib/rubygems/custom_require>:29:in `require'
        from <internal:lib/rubygems/custom_require>:29:in `require'
        from adapters.rb:163:in `load_adapter'
        from adapters.rb:133:in `adapter_class'
        from adapters.rb:13:in `new'
        from dm-core.rb:266:in `setup'
        from (irb):3
        from irb:16:in `<main>'
ruby-1.9.2-p136 :004 > require 'mongo_adapter'
LoadError: no such file to load -- mongo_adapter
        from <internal:lib/rubygems/custom_require>:33:in `require'
        from <internal:lib/rubygems/custom_require>:33:in `rescue in require'
        from <internal:lib/rubygems/custom_require>:29:in `require'
        from (irb):4
        from irb:16:in `<main>'
{% endhighlight %}
You can see here that I required dm-core first but then it doesn't know what dm-mongo-adapter or mongo_adapter is.  Quit irb and try it a different way:</p>
{% highlight ruby %}
> require 'mongo_adapter'
 => true
> DataMapper.setup(:logs, "mongo://localhost:27017/examples")
 => #<DataMapper::Mongo::Adapter:0x000000015b1a70 @name=:logs ...
{% endhighlight %}</p>
<p>Works great.  I have a DataMapper::Mongo::Adapter object.  Unfortunately, I didn't get any farther than this because the current prerelease isn't compatible with mongo 1.6.  It just complains about :slave_ok needs to be set to true.  Even though I'm connecting to the master node of my replica set.
<code>Mongo::ConfigurationError: Trying to connect directly to slave; if this is what
you want, specify :slave_ok => true.</code></p>
<p>So even though this isn't a complete fix, when the <a href="http://groups.google.com/group/dm-mongo-adapter/browse_thread/thread/6d60bb3cab266eb8">new drop of dm-mongo-adapter</a> hits, this little test will be useful.  And then I can figure out if datamapper is as awesome as I think it is.</p>
