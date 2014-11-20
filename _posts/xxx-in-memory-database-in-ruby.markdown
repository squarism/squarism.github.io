---
layout: post
status: published
published: false
# date: 2014-12-01
title: In Memory Database in Ruby
---

### In memory ruby database techniques

Gems:

* ephermeral is good for api loading but not general cases
* supermodel requires a really old version of activemodel (3.0) but there are PRs
* activerecord-nulldb-adapter wants a rails project although you might be able to fake it out, started going down that path a little bit but it turned weird.
* active_hash - good option, has some caveats with AR associations, not a big deal.

Like everything ... it depends on what you are doing.

{% highlight ruby %}
# Active Model in-memory database
require 'active_model'
class Person
  # please turn these on below as needed
  # -------------------------------------
  # include ActiveModel::AttributeMethods
  # extend ActiveModel::Callbacks
  # include ActiveModel::Conversion
  # include ActiveModel::Dirty
  # include ActiveModel::Validations

  attr_accessor :name, :age
end
p = Person.new
p.name = "Joe"
p.age = 21

# No storage so you can't do Person.where at this point.  By itself this is worse than struct or ostruct.
# Adding the other mixins makes active_model a good route to take.
{% endhighlight %}


