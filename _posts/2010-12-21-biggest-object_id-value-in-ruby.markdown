---
layout: post
status: publish
published: true
title: Biggest object_id value in Ruby
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 836
wordpress_url: http://squarism.com/?p=836
date: !binary |-
  MjAxMC0xMi0yMSAxNjozODo1OSAtMDUwMA==
date_gmt: !binary |-
  MjAxMC0xMi0yMSAyMTozODo1OSAtMDUwMA==
categories:
- Ruby
tags: []
comments: []
---
0 = 1, 1 = 3, 2 = 5, 100 = 201.  What is going on?  Ruby has object_ids on objects but they are shorter on small integers.  Fire up irb and follow along:

{% highlight ruby %}
> obj = Object.new
 => #<Object:0x100362a30>
> obj.object_id
 => 2149258520
{% endhighlight %}

The value of object_id is the normal looking ids I've seen in the past.  But then I did this:

{% highlight ruby %}
 0.object_id
 => 1
> 1.object_id
 => 3
> 2.object_id
 => 5
> 100.object_id
 => 201
{% endhighlight %}


Ok, why the values?  Why is 0's id 1 and 100's id 201?  It looks like it's doubling the value and adding one but that seems a little random and probably not what it's actually doing.  So I read a bit by Caleb Tennis on [Oreilly](http://www.oreillynet.com/ruby/blog/2006/02/ruby_values_and_object_ids.html) and found a tip off that it's related to binary:

> Thus 0&Atilde;&mdash;0101 (5) becomes 0&Atilde;&mdash;1011 (11).

Notice that Caleb is noting that "101" is shifting left and adding 1 at the lowest bit.  So then this should work:

{% highlight ruby %}
x = 0
puts x.object_id == ( (x << 1) + 1 )
true
=> nil
{% endhighlight %}


And it does.  We can set a bigger number and run it again and it still works.

{% highlight ruby %}
x = 65536
puts x.object_id == ( (x << 1) + 1 )
true
=> nil
{% endhighlight %}


I will call this predictable behavior later.  x.object_id is 131073 on both sides because we know how object_id is generated:

{% highlight ruby %}
x = 65536
 => 65536
> puts x.object_id
131073
> puts ( (x << 1) + 1 )
131073
{% endhighlight %}


So what is going on?  Well first, let's print out the binary.  Taken from [icfun.blogspot.com](http://icfun.blogspot.com/2008/04/ruby-number-conversion-from-one-base-to.html), we'll define a number to binary string method in irb.

{% highlight ruby %}
def dec2bin(number)
   number = Integer(number);
   if(number == 0)
      return 0;
   end
   ret_bin = "";
   ## Untill val is zero, convert it into binary format
   while(number != 0)
      ret_bin = String(number % 2) + ret_bin;
      number = number / 2;
   end
   return ret_bin;
end
{% endhighlight %}


We can test that it works with any integer.  Let's test with the number 5 like this: `puts dec2bin(5)`.  Prints out 101.  If we shift left by one bit like this: `dec2bin((5 << 1))` then we'll get 1010.  Add 1 bit and we get the binary of eleven: 1011.  We can see if this is eleven with dec2bin(11) and we get "1011" which is what we expected.  It makes sense.

So wtf.  Why know this stuff?  Well, when doing object comparisons, I always expected some garbage or randomness and length similar to a hash.  Like when doing `(Object.new).object_id` but this isn't dependable or consistent when getting the object_id of a Fixnum.  And even that is not consistent.  The examples above are using small numbers.  When we try this:

{% highlight ruby %}
x = 4; puts x.object_id == ( (x << 1) + 1 )
true
{% endhighlight %}
It works fine.  4 is small.  Let's call this "predictable".  We can bit shift and add 1 to get the same value as ruby does with object_id.

But a big enough number like 5000000000000000000 is false.  So what's the inflection point?  Maybe the inflection point is 2^32 because it's memory related:

{% highlight ruby %}
x = 4294967296; puts x.object_id == ( (x << 1) + 1 )
{% endhighlight %}

Nope.  Strange.

So I played around manually and started finding that 4 quintillion is true but 5 quintillion is false.  Weird.  If it's memory related, it's no number I recognize.  So we know that there's some inflection point between 4 quintillion and 5 quintillion.  I'm not about to figure this thing out by hand.  Let's write a program to find our magic number.

Note: the current version (if any) is [on github](https://github.com/squarism/sandbox/blob/master/object_id_inflection.rb).

{% highlight ruby %}
# find the inflection point of how ruby calculates object_ids predictably
# for example:
# x = 4; x.object_id == ( (x << 1) + 1 )
# => true
# however,
# x = 5000000000000000000; x.object_id == ( (x << 1) + 1 )
# => false

# answer = 4611686018427387903

# we'll start with a number that's close
starting_number = 4000000000000000000

# this will be the number we'll try with
current_number = starting_number

# our decimal position that will be used for the loop
# we don't need to start with 4, which is starting_nmber[0..0]
index = 1
digit_at_index = current_number.to_s[index..index].to_i

# digit state
digit_second = 0
digit_third = 0

# vector for current_number
# true = up, false = down
direction = true
last_direction = direction
changed_directions = 0

# have we exhausted all digits for the current rank/position
# if so, we move on to the next position
digit_done = false

jump = 5

# is our result the same as shift left plus one?
def predictable?(number)
  number.object_id == ( (number << 1) + 1 )
end

# go until we've iterated along the length of starting_number
while (index <= starting_number.to_s.length - 1)
  digit_done = false

  digit_at_index = current_number.to_s[index..index].to_i

  # shift our cheap history variables
  digit_third = digit_second
  digit_second = digit_at_index

  # this tests whether we went over our solution
  if predictable?(current_number.to_i)
    # if true, try incrementing but only if we can later
    direction = true
  else
    # if false, number is too high
    direction = false
  end

  #puts "index: #{index}"
  if last_direction != direction
    jump -= jump / 2
    changed_directions += 1
  else
    jump -= 1 unless jump == 1
  end

  last_direction = direction

  # split the distance
  # if we start with 0, this becomes 5 if going up
  # if we start with 5, this becomes 3 if going down
  # it's a half to target number

  # increase
  if direction
    digit_at_index += jump unless digit_at_index == 9

    #puts digit_at_index
    if digit_at_index == 9 && digit_second == 9
      digit_done = true
    else
      digit_done = false
    end

  # decrease
  else
    digit_at_index -= jump unless digit_at_index == 0

    if digit_at_index == 0 && digit_second == 0
      digit_done = true
    else
      digit_done = false
    end

  end

  # if we flip-flop back and forth between finding our number is too high
  # or too low then our number is probably in the middle
  # 4 swaps will leave us with the lower number
  # which then the next digit will need to increase
  # TODO: if this flops the wrong way, the algorithm breaks.
  if changed_directions == 4
    digit_done = true
    digit_at_index = digit_second
  end

  # substitute our done digit in place
  current_number_string = current_number.to_s
  current_number_array = current_number_string.chars.to_a
  current_number_array[index] = digit_at_index
  current_number = current_number_array.join.to_i

  # move on to the next digit
  if digit_done
    index += 1
    digit_at_index = current_number.to_s[index..index].to_i
    digit_ceiling = 10
    digit_floor = 0
    jump = 5

    changed_directions = 0
    direction = true

    digit_second = 0
    digit_third = 0
  end

  puts current_number

  # bug avoid
  if current_number.to_s.length != starting_number.to_s.length
   exit
  end

  # not needed but useful for watching how the algorithm works
  sleep 0.1

end
{% endhighlight %}

When we run this little number searcher we find our overflow (or inflection) point.  It will run for a while, finding each digit like this:
`4400000000000000000
4700000000000000000
4500000000000000000
.
.
.
4611686018427387900
4611686018427387904
4611686018427387902
4611686018427387903
4611686018427387904
4611686018427387903
4611686018427387903`

Eventually we'll have a final value of 4611686018427387903 which we can test like this:

{% highlight ruby %}
4611686018427387903.object_id => 9223372036854775807
4611686018427387904.object_id => 2152612560
{% endhighlight %}

You can see it overflow making 9223372036854775807 the largest object_id in Ruby.

This program is not very efficient or well written.  There's a better way to find a number but I decided to go with a digit-by-digit algorithm.  It was not very easy and quick to write.  I nearly scrapped it and did it the right way but managed to get it working around midnight one night.  I hope it makes for a good (or anti-pattern) example.