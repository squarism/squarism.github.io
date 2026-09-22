---
title: "Rails Style Route Parsing"
date: 2016-01-20T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

At one point a while back, I had a config file outside a rails app
and what I wanted was something like this:

> Given this mappping definition `/order/:meal/:cheese`
> How can I turn these strings into parsed hashes?
> `/order/hotdog/cheddar -> {meal:'hotdog', cheese:'cheddar'}`

I knew that something in Rails was doing this. I just didn't know what.
I also didn't know what assumptions or abstraction level it was working at.

<!-- more -->

## Journey into Journey

The gem that handles parsing the routes file and creating a tree is journey.
Journey used to be (years ago) a separate gem but is not integrated into
`action_dispatch` which itself is a part of `actionpack`. So to install it you
need to `gem install actionpack` (or use bundler) but to include it in your
program you need to `require 'action_dispatch/journey'`. If you have
any rails 4+ gem installed on your system, you don't need to install
anything. Action pack comes with rails.

```ruby
require 'action_dispatch/journey'

# reorganize pattern matches into hashes
def hashify_match(matches)
  h = {}
  matches.names.each_with_index do |key, i|
    h[key.to_sym] = matches.captures[i]
  end
  h
end

pattern = ActionDispatch::Journey::Path::Pattern.from_string '/order/(:meal(/:cheese))'
matches = pattern.match '/order/hamburger/american'
puts hashify_match(matches)

matches = pattern.match '/order/hotdog/cheddar'
puts hashify_match(matches)

# {:meal=>"hamburger", :cheese=>"american"}
# {:meal=>"hotdog", :cheese=>"cheddar"}
```

We have to have `hashify_match` reorganize our objects because this is what
`pattern.match` returns:

```ruby
irb(main):001:0> matches = pattern.match '/order/hamburger/american'
=> #<ActionDispatch::Journey::Path::Pattern::MatchData:0x007f9d4d527aa0
@match=#<MatchData "/order/hamburger/american" 1:"hamburger" 2:"american">,
@names=["meal", "cheese"],
@offsets=[0, 0, 0]>
```

So we have to turn these ordered matches into a hash.

```ruby
irb(main):001:0> matches.names
=> ["meal", "cheese"]

irb(main):002:0> matches.captures
=> ["hamburger", "american"]
```

We could also zip the results together but we wouldn't have symbolized keys.

```ruby
irb(main):001:0> Hash[matches.names.zip(matches.captures)]
=> {"meal"=>"hamburger", "cheese"=>"american"}
```

You could symbolize them easily within a rails app or by including active support.

```ruby
require 'active_support'
require 'active_support/core_ext'
Hash[matches.names.zip(matches.captures)].symbolize_keys
```
