---
layout: post
status: draft
published: true
title: Sidekiq Rate Limiting
date: 2016-02-12
---
![birds_on_a_wire](/uploads/2016/birds.png)

Sidekiq Enterprise has a rate limiting feature.  Note that this is not throttling.  The perfect use case is the exact one that's mentioned in [the wiki](https://github.com/mperham/sidekiq/wiki/Ent-Rate-Limiting#concurrent): limit outbound connections to an API.  We had a need for this between two of our own services.  I spiked a little bit and I thought the behavior was interesting so I thought I'd share.

<!-- more -->

When people talk about buckets, jobs, limiters and these very generic and often used terms; it's good to clarify.  I think [Mike](https://github.com/mperham) does a great job of explaining what Sidekiq *isn't*.  So make sure you find out what your own problem *isn't* too.  We didn't want a throttler.  A throttler would throttle even a single job with respect to a resource.  A rate limiter limits things to a very specific resource: time.  Sidekiq Enterprise has a concurrent rate limiter that limits your workers to N concurrent operations at any moment in time.  The limiter is shared just like any ruby object is shared.  The wiki uses a constant variable.

{% highlight ruby %}
require 'sidekiq-ent'

COUNT_LIMITER = Sidekiq::Limiter.concurrent('number_counter', 2, wait_timeout: 5, lock_timeout: 30)


class NumberCounter
  include Sidekiq::Worker

  def perform(number_to_count_to, name)
    COUNT_LIMITER.within_limit do
      1.upto(number_to_count_to) do |i|
        puts "#{name} counting #{i}"
        sleep 1
      end
    end
  end

end
{% endhighlight %}

The key parts are `COUNT_LIMITER` and when it's used later in the perform block `COUNT_LIMITER.within_limit`.
Also, note that `lock_timeout: 15` is significant.  This part will be hard to read in the asciienma video below because
of my vim colors.  The line is the same above.

The interesting thing is what this *isn't*.  It doesn't explicitly saturate the limiter.  The lock_timeout schedules
the work to be done in the future if the lock is busy.  Timing might mean it tries in 30 seconds.
Timing at runtime might mean that it checked after 15 seconds and put it in the future by 30 seconds effectively making it
45 seconds.  Maybe when an old job comes back, the queue is still full and it schedules that job off into the future even more?

Sidekiq schedules jobs that hit the limit just like other failed jobs, with an increasing backoff.  If a job can't run, it's considered a failure (OverLimit exception).

{% highlight ruby %}
pry> Sidekiq::LimiterSet.new.first.helper
=> #<Sidekiq::Limiter::Status::Concurrent:0x007fe69f7d6468
 @available=1,
 @metrics=
  {"name"=>"number_counter",
   "held"=>"70",
   "held_ms"=>"702532",
   "immediate"=>"39",
   "overrated"=>"18",
   "wait_ms"=>"66668",
   "waited"=>"31"},
 @size=2,
 @used=1>
{% endhighlight %}

Here is some internal metrics regarding the limiter. As jobs hit the limit, overrated ticks up and wait_ms goes up as well.  I don't know if wait_ms ever comes down.  I couldn't figure out how the decrementing works.  It might not actually decrement.  I know the behavior is sound.

When the queue is full, it retries.  If the queue is still full, it will retry further into the future.  Now my
first reaction to this was: What! `❨╯°□°❩╯︵┻━┻`.  But _Calm down, yo_.  If your API limit is saturated your API limit is saturated.  If you want some guaranteed order then Batches might work better.  If you want only a certain number of
workers against a remote resource at a time and you want them to run in order, you can just use a regular
priority queue.

- Create a new queue for your outbound things: `pants_api_queue`
- Run a worker against that queue with the concurrency level that you want.  `sidekiq -q pants_api_queue -c 2`

See the video below for a quick demo of all this running.  Play it fullscreen.

<script type="text/javascript" src="https://asciinema.org/a/36318.js" id="asciicast-36318" data-autoplay="false" async>
</script>

The vim colors are hard to read because of 256 stuff.  The source code is [here](https://github.com/squarism/throttle_redis).

