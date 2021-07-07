---
layout: post
status: published
published: true
title: Database Ruin All Good Ideas
date: 2021-07-08
---

Stop me if you've heard this one before ...

<img alt="a typical three tier setup" style="margin: auto; width: 80%; " src="/uploads/2021/databases_ruin_01.png" />

Here is a three tier web stack.  It has lots of web and app servers but only one database box.  You can substitute this with cloud things but the principles are the same.  I bet your infrastructure looks really similar.

Why is there always only `db01`?  Your box might be called `prod-db1` or `mysql-01`.  You know the one I mean.  Maybe you have a `db02` but I bet it's running in a special mode.  It is another exception to the exception.

In fact we can summarize this whole stack like this:

* clients: not our problem, there's millions of them
* web tier: easy-peasy, it's a daemon plus a config file
* app tier: it's our "code", it's the most work but we have it in a pool
* database tier: don't touch it!

You might even have a team for the database tier.  What is going on here?

## The Good Ideas

### Let's Load Balance

Load balancer pools work great for tiers without state.  You can even use tricks like sticky sessions when you have some state.  But the request is short.  A database resists these ideas because connections are long and the data is local.  You can't put database volumes on a shared drive and expect it to work.  So the problem is state.

### Let's Dockerize

Docker works great for tiers without state.  You can dockerize your database but you don't get the scaling and uniformity advantages of the other tiers.  Docker is great for production and deployment but you are not deploying your database that often without a lot of fancy uptime tooling.  In addition, you have footguns with non-obvious behavior around volumes.  You **can** do it but it's the exception when the app and web tiers are so easy to explain and reason about.

### Let's Go Active-Active

Horizontal scaling doesn't work on the database tier.  You can't easily have a read/write (active) pair.  There are alternate daemons and methods but here I mean common relational SQL databases.

### Let's Do Immutable or Config Management

What about NixOS?  Or some other hot and trendy new idea?  My first concern and question is about the database layer.  I have [asked this question about NixOS](https://lobste.rs/s/2ayklq/erase_your_darlings_immutable) and apparently it's ok to do so.  I don't completely grok it.

You definitely can't do the [cattle thing](https://devops.stackexchange.com/questions/653/what-is-the-definition-of-cattle-not-pets) because you can't have a load balancer.  You wouldn't do the cattle thing in the app tier if you didn't have a load balancer.

### Let's Mock Our Database

During unit testing you might want your tests not to hit an API.  You can mock out the HTTP interface and test against a mock response.  This is basically mocking out someone else's (or your own) app server.  So why don't people do this with the database?

You can find fakeredis adapters in Python, fake caches in Ruby and in-memory databases in C#.  But it's all surrounded by exceptions.  It's just easier to create a test database because databases ruin all good ideas.

There is so much state and back-and-forth protocol in a relational database that treating it like client/server message passing is too simple.  All the state and data lives in the database.  Even triggers and internals would be too complicated to account for.  It's just easier to create a test database because database namespaces/collections are very easy to create.  Databases also have the advantage of rolling back in a transaction which works great for unit testing.

So your project might have fake adapters but not for mysql/postgres.


### Let's Use The Cloud

Renting large boxes usually doesn't make sense financially.  You'd be better off just buying.  The same is true for performance clusters and GPUs.


## A Horrible Story

I once worked on an Oracle cluster that required a ton of specialized software, hardware, admin and configuration.  Almost the entire idea was about availability and performance.  The CEO just couldn't stand the fact that half of the system is wasting money being read-only.  He wanted read-write on both nodes.  Active active.  This was a long time ago but the CAP theorum isn't going to change.  I learned a ton about splitbrain mostly through trauma.

You couldn't just download a (relational) database that will do horizontal scaling.  You had to buy all these options and stuff.  It was super expensive.  I forget the price, probably $40k for the db license and $20k for the clustering addon.  And then you needed specialized disk.  The hardware was really pricey because it was Sun at the time.
 
During install it tells you to plug in a crossover cable to a dedicated NIC.  Like, you had eth1 just sitting there or you had to buy a NIC for it.  The install isn't going to work unless you do this.  In addition, you need to set up a quorum disk on your SAN to act as a tiebreaker (more on that later).  All the traffic over this crossover cable is ssh.  All it's doing is doing relational database agreement.  There's no data sharding or splitting you have to do so it's all or nothing.  This is why you have a dedicated NIC.

So you finally beat the CAP theorum.  You got your active-active database and you didn't have to change your app at all.  Now comes the trade off the the devil details.  ACID means we have to 100% agree on every query.  That means, all nodes, all the time.  Your nervous system is this crossover cable (actually a pair).  What happens if I take some scissors to it?  

Well, db01 thinks it's up.  And db02 thinks it's up.  But db02 thinks db01 is gone.  And db01 thinks db02 is gone.  So, now what?  What happens if a write comes in to both db01 and db02?

```
db01:  foo=bar
db02:  foo=ohno
```

What's foo supposed to be?  _s p l i t b r a i n_

So this is why you configured a quorum disk.  When the cluster looses quorum, there's a race to the quorum disk.  It writes a magic number to the start of the disk sector (not even like in the normal part of the disk iirc) and whoever arrives 2nd, panics on purpose.  Now you have survived split brain.  But you needed crazy shared disk technology to even do this for arbitrary reasons.

It was a crazy time and I should share this as production horror chops sometime later.  A lot of the technology in this story is super old.  But some of it hasn't changed.  When I learned Mongo, I had a high degree of context and I didn't have to ask "yeah but why" a lot.

Way back when, our CEO couldn't stand to have half the hardware sitting around doing nothing.  He wanted it involved.  It's not like it's a "dumb idea".  It's a good idea and a lot of people have good ideas around the database but databases ruin all good ideas.