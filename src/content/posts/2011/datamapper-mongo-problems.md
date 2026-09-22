---
title: "DataMapper Mongo Adapter problems"
description: "Blog post about datamapper mongo adapter problems"
date: 2011-02-10T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

![](/uploads/2011/02/PoweredMongoDBbeige50.png "PoweredMongoDBbeige50")
Ok, so some background.  I'm curious as to [this post](http://www.lunarlogicpolska.com/blog/2010/02/15/mysql-and-mongodb-working-together-in-kanbanery.html) at lunarlogicpolska.com which shows mysql and mongodb living together in harmony.  Some data is in mysql (nice and structured), some data is in a crazy-fast document database.  It doesn't matter.  Datamapper combines many sources into a common abstraction layer that your models can pick and choose which to use.  At least that's the dream.  I was going to play around with this but hit a bit of a snag.

First the post at lunarlogicpolska.com basically boils down to this bit:

```ruby
require 'rubygems'
require 'dm-core'

DataMapper.setup(:default, "mysql://localhost/examples")
DataMapper.setup(:logs, "mongo://localhost/examples")
```

Unfortunately, this wouldn't run on my box.  I had installed my gems like so:  `gem install dm-mongo-adapter --pre` and got a big ol problem while install rdoc (weird):
```yaml
RDoc::Parser::Ruby failure around line 220 of
lib/dm-core/query/conditions/operation.rb
[snip]
The internal error was:
        (RDoc::Error) Name or symbol expected (got #<RDoc::RubyToken::TkAMPER:0x00000005509380>)
ERROR:  While generating documentation for dm-core-0.10.2
... MESSAGE:   Name or symbol expected (got #<RDoc::RubyToken::TkAMPER:0x00000005509380>)
```

Doing the same gem install command got rid of the rdoc error.  Ok, no problem.  This is a prototype I'm trying to build, no sweat if rdoc installation is a bit flaky.  Unfortunately, I didn't get much farther than this with the actual code until I changed lunarlogicpolska's example to this:

```ruby
require 'mongo_adapter'

DataMapper.setup(:default, "mysql://user:pass@localhost/database")
DataMapper.setup(:logs, "mongo://host:port/database")
```

I found this out by playing around with irb.  The order matters:

```ruby
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
```
You can see here that I required dm-core first but then it doesn't know what dm-mongo-adapter or mongo_adapter is.  Quit irb and try it a different way:

```ruby
> require 'mongo_adapter'
 => true
> DataMapper.setup(:logs, "mongo://localhost:27017/examples")
 => #<DataMapper::Mongo::Adapter:0x000000015b1a70 @name=:logs ...
```

Works great.  I have a DataMapper::Mongo::Adapter object.  Unfortunately, I didn't get any farther than this because the current prerelease isn't compatible with mongo 1.6.  It just complains about :slave_ok needs to be set to true.  Even though I'm connecting to the master node of my replica set.
```ruby
Mongo::ConfigurationError: Trying to connect directly to slave; if this is what
you want, specify :slave_ok => true.
```

So even though this isn't a complete fix, when the [new drop of dm-mongo-adapter](http://groups.google.com/group/dm-mongo-adapter/browse_thread/thread/6d60bb3cab266eb8) hits, this little test will be useful.  And then I can figure out if datamapper is as awesome as I think it is.
