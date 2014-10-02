---
layout: post
status: publish
published: true
title: DRY up Methods with Ruby Blocks
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 2104
wordpress_url: http://squarism.com/?p=2104
date: !binary |-
  MjAxMy0wOS0xMyAyMDowNzoyMCAtMDQwMA==
date_gmt: !binary |-
  MjAxMy0wOS0xNCAwMTowNzoyMCAtMDQwMA==
categories:
- Blog
tags: []
comments:
---
Let's do something terrible by hand.  First, here's our data.  It comes from a database.

{% highlight ruby %}
db_results = [
  { id: 1, login: 'mjay', roles: ['user'], projects: ['muffins'] },
  { id: 2, login: 'rroke', roles: ['admin', 'user'], projects: ['security'] },
  { id: 3, login: 'tpain', roles: ['user'], projects: ['muffins'] },
  { id: 4, login: 'ghaz', roles: ['admin', 'user'], projects: ['muffins', 'cakes'] },
  { id: 5, login: 'bbarker', roles: ['user'], projects: ['pies'] }
]
{% endhighlight %}

Now when working with these people, we probably could get away with doing something like this for a while:

{% highlight ruby %}
# find all admins
admins = db_results.select {|user| user[:roles].include? 'admin' }
{% endhighlight %}


Which is fine.  Until you want to find out what people are on the Muffin Project:

{% highlight ruby %}
# find all people working on the muffins project
people_on_muffins = db_results.select {|user| user[:projects].include? 'muffins' }
{% endhighlight %}


<p>But as you keep working, you might be getting a feeling of deja-vu.  The two methods above are very similar.  You might be inspired by other Ruby libraries which give you a tiny DSL or at least allow you to pass blocks into methods to be more expressive.</p>

<h2>The Smell</h2>
Here's the complete code smelly example.

{% highlight ruby %}
db_results = [
  { id: 1, login: 'mjay', roles: ['user'], projects: ['muffins'] },
  { id: 2, login: 'rroke', roles: ['admin', 'user'], projects: ['security'] },
  { id: 3, login: 'tpain', roles: ['user'], projects: ['muffins'] },
  { id: 4, login: 'ghaz', roles: ['admin', 'user'], projects: ['muffins', 'cakes'] },
  { id: 5, login: 'bbarker', roles: ['user'], projects: ['pies'] },
]

admins = db_results.select {|user| user[:roles].include? 'admin' }
people_on_muffins = db_results.select {|user| user[:projects].include? 'muffins' }
meeting = admins + people_on_muffins
meeting_ids = meeting.collect {|user| user[:login] }.uniq

puts meeting_ids
# => rroke ghaz mjay tpain
{% endhighlight %}


<p>We're having a meeting between the admins and people who are on the Muffin Project.  The only person not matching these rules in this case is Bob Barker (bbarker).  He must be busy enjoying retirement eating pie, who knows.</p>

<h2>Inspiration</h2>
<p>
Let's take a look at Faraday.  Faraday uses blocks to great effect to communicate intent just like most libraries in Ruby.  In Faraday, this is how a HTTP POST is done using Faraday:
</p>

{% highlight ruby %}
conn.post do |req|
  req.url '/nigiri'
  req.headers['Content-Type'] = 'application/json'
  req.body = '{ "name": "Unagi" }'
end
{% endhighlight %}


<p>This is kind of nice!  You can get more than one thing done at a time and it doesn't require a lot of temporary variables.  Let's see if we can use blocks like this.  We'll get to blocks in a miniute.  Let's first refactor a little bit first.</p>

<h2>The Fix</h2>
<p>There's a certain similarity between the two selects.  We really want to get "admins" and "project people" all together, so let's just do that.  We'll create two methods that essentially replace the instance methods but can be used in the future for other rules.  We'll call them .with_roles and .with_projects.</p>

{% highlight ruby %}
def with_roles(results, role)
  results.select {|user| user[:roles].include? role }
end

def with_projects(results, project)
  results.select {|user| user[:projects].include? project }
end
{% endhighlight %}


<p>Next, we'll create a method that takes a block.</p>
{% highlight ruby %}
def user_ids(results, &block)
  rows = yield block
  ids = rows.collect {|user| user[:login] } if rows
  ids.uniq
end
{% endhighlight %}


<p>The &block argument and yield block is optional.  You could write this as:</p>
{% highlight ruby %}
 def user_ids(results)
   rows = results.dup
   rows = yield if block_given?
   ids = rows.collect {|user| user[:login] }
   ids.uniq
 end
{% endhighlight %}

<p>
But in that case, the block is optional, so you'll want to check for block_given?.  For this example, it's easier for us to require a block to make this a shorter post ... err, well I guess it's longer now.</p>

<p>In any event, this method's job is to filter results (users) with whatever code is passed in.  Then it uniques the collected array because user IDs are assumed here to be unique.  Finally, it returns just user_ids like it's name implies.</p>

<p>The usage of this user_ids method that takes a block ends up reading very well.</p>
{% highlight ruby %}
admins = user_ids(db_results) do
  with_roles(db_results, 'admin') +
  with_projects(db_results, 'muffins')
end

puts admins
# => rroke ghaz mjay tpain
{% endhighlight %}

<p>Here's the completed, less smelly example.</p>
{% highlight ruby %}
db_results = [
  { id: 1, login: 'mjay', roles: ['user'], projects: ['muffins'] },
  { id: 2, login: 'rroke', roles: ['admin', 'user'], projects: ['security'] },
  { id: 3, login: 'tpain', roles: ['user'], projects: ['muffins'] },
  { id: 4, login: 'ghaz', roles: ['admin', 'user'], projects: ['muffins', 'cakes'] },
  { id: 5, login: 'bbarker', roles: ['user'], projects: ['pies'] }
]

def with_roles(results, role)
  results.select {|user| user[:roles].include? role }
end

def with_projects(results, project)
  results.select {|user| user[:projects].include? project }
end

def user_ids(results)
  rows = results.dup
  rows = yield if block_given?
  ids = rows.collect {|user| user[:login] }
  ids.uniq
end

admins = user_ids(db_results) do
  with_roles(db_results, 'admin') +
  with_projects(db_results, 'muffins')
end

puts admins
# => rroke ghaz mjay tpain

# usage without a block, showing that it's a little more flexible
# puts user_ids(db_results)
# => returns everyone because no filtering block was passed
{% endhighlight %}


<h2>Wrap Up</h2>
<p>This is pretty procedural.  I'll leave it to you to put it into a class, maybe add something better than a "plus" operator to combine the user list together.  Maybe a UserList abstraction class could help get away from hashes too.</p>
<p>I like going down these paths because you end up with more expressive code that is flexible to change.  At the same time, little hints of DSLs come out when using blocks to this effect.  This is starting down the path of a Ruby DSL. I'll be posting about that pretty soon.</p>
