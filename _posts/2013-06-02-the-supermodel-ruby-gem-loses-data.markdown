---
layout: post
status: publish
published: true
title: The Supermodel Ruby Gem Loses Data
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 2004
wordpress_url: http://squarism.com/?p=2004
date: !binary |-
  MjAxMy0wNi0wMiAyMjo0MjowOCAtMDQwMA==
date_gmt: !binary |-
  MjAxMy0wNi0wMyAwMzo0MjowOCAtMDQwMA==
categories:
- Ruby
tags: []
comments: []
---
<p><img src="/uploads/2013/05/pixel-ribbon_northface.png" alt="pixel-ribbon_northface" width="576" height="24" class="aligncenter size-full wp-image-2005" />
Actually no.</p>
<p>I love <a href="https://github.com/maccman/supermodel">Supermodel</a>.  It might be overcome by ActiveModel::Model in Rails 4 but until then Supermodel is a fantastic in-memory database for Ruby that has a lot of advantages over using just a plain hash or trying to roll your own.</p>
<p>However using it with a large amount of data, we noticed it loses data.  Sometimes, a few records.  Other times, a few more.  It was really random.  We were confused.  Looking at the docs, this is the default class maccman has in his README.</p>

{% highlight ruby %}
class Test < SuperModel::Base
end
{% endhighlight %}


<p>That works no problem.  We looked at the IDs that it uses and saw that it's using the Ruby ObjectID which is about 14 digits long.</p>

{% highlight ruby %}
#<Test:0x007f80e41dbd18 @new_record=false, @attributes={"bacon"=>"tasty",
 "id"=>70095779847820}, @changed_attributes={}, @validation_context=nil,
@errors={}, @previously_changed={"bacon"=>[nil, "tasty"]}>
{% endhighlight %}


<p>Ok, that ID of 70095779847820 seems good enough right?  Let's see!</p>

{% highlight ruby %}
require 'supermodel'

class FancyPants < SuperModel::Base
end

# create one thousand pairs of fancy pants
1_000.times {
  FancyPants.create(glitter: true)
}

raise "Nooo!  My fancy pants!" if FancyPants.count < 1_000
{% endhighlight %}


<p>Run it.</p>
<pre>
RuntimeError: Nooo! My fancy pants!
</pre>

<p>What.</p>
<p>Well.  I'm no expert but I bet the object_ids in ruby aren't very random.  I would hope they wouldn't be.  Because you're creating objects all the time right?  Ruby is slow enough without some super accurate id field.  Should we abandon all hope and scatter our dreams in despair?  Nope.</p>
<p>Supermodel has a documented solution for this.  Just add this mixin into your class.</p>

{% highlight ruby %}
include SuperModel::RandomID
{% endhighlight %}


<p>This will make the IDs more random and you'll find 1,000 pairs of fancy pants in your class.  The odd ball thing for me was realizing that supermodel 'loses data'.  But it doesn't.  IMHO, this mixin should probably be the default.  I find Supermodel an awesome quick and dirty database but a database shouldn't lose records silently.</p>
<p>I still love Supermodel.  I've played around with other in memory databases such as Rails3, Rails4, sqlite3 with datamapper and Supermodel works like I want it to.</p>
