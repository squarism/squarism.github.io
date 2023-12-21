---
layout: post
status: published
published: true
title: Microframeworks Are Too Small
date: 2023-12-20
---

I want to talk about what microframeworks don't solve but also why there has been and continue to be so many of them.  First, I guess we should identify some terms. Identifying if a web framework is a microframework is debatable but I would call it a microframeworks if:

- The author calls it a microframework
- It has a small hello world example that looks like Sinatra in the README or the homepage
- It doesn't pre-solve a common problem for you

So, Flask / Express / Sinatra are microframeworks as opposed to their sister projects Django / Next.js or others / Rails.  If the language ecosystem offers a pair like Django vs Flask then comparatively, Flask is the microframework by comparison and not just because [wikipedia also classifies it](https://en.wikipedia.org/wiki/Flask_(web_framework) this way.  It's because it's smaller than Django.  This is not obvious if a language does not have a bigger framework.

The "pre-solve a common problem for you" is the big one.  To make this more concrete, I will be using the use
case of adding a database to your project as an inflection point.  Larger frameworks usually have some kind of story around adding a database and the microframeworks do not.


## It Started with Sinatra

<img alt="Old Sinatra Website" style="width: 50%; margin: auto;" src="/uploads/2023/sinatra.jpg" />

There are many microframeworks in every language but it started with [Sinatra](https://sinatrarb.com/).  Sinatra had this very cute and
small README snippet on their home page.  _"Put this in your pipe and smoke it"_ was the original tagline.  The picture above is from The Wayback Machine.  It
was compelling and provocative at the time.  You wire up a route and you get some plain text
back.  The whole idea fits in a code snippet and this was hard to ignore.

```ruby
require 'sinatra'

get '/' do
  'Hello world!'
end
```

The trade-offs of Sinatra are not obvious in the above Hello World.  To me, the simplicity trade-off is inticing to juniors when they don't know what the trade-off is.  The API surface is small which is easier to learn.  But confusing things start to happen after that.  If you start a Sinatra
project, you will realize that when you change your code, you have to `ctrl-c` to stop the dev server and start your app again with `ruby myapp.rb`.  Every code change, switch terminal, `ctrl-c`, `up-arrow`, `enter`.  That was just changing code, manual
testing.  Yes, there was a plugin to do dev reloading but so many other questions and concerns would appear after this most basic flow.  It doesn't come with dev reloading and common use cases continue from there:

> Where do I put passwords? <br />
> How can I add a database? <br />
> How do I build or deploy this thing?

So, as the project grew or if you simply kept
working with it you would have to solve, research or enhance Sinatra yourself.  Many times, myself and others
would copy whole files out of Rails default projects.  Like, we'd generate a Rails project off to the side and steal `.rb` files from it.  Or, we'd end up stealing ideas from Rails.  Ideas like development server reloading, where to put configs, test fixtures or the concept of dev/test/prod.

But I think these DX nit-picks are not where the test is.  I think adding a database to a microframework is the inflection point where the lack of features makes things tedious and confusing.


## The Database is the Inflection Point

I think configuring a database stresses the framework and most microframeworks fail here.  This isn't quite [The Database Ruins All Good Ideas](https://squarism.com/2021/07/08/databases-ruin-all-good-ideas/), it's more like, The Database Makes the Framework Creak.

Some teams running Flask might say "we have a database in Flask already, it's easy" but what they really have is a bunch of hidden context. Take this example of how some work with Flask:

1. There's a production database which a Flask app connects to.  This is the only database in the world for
this application.  There is no dev database, even on a laptop.
2. The SQL to create this empty database was copied to something like Dropbox, email or a file share.  Or maybe it never was.  "Why would you need an empty database?"
3. The database rarely changes but not by intent.  When a change needs to happen,
stress and confusion levels are high.  It might even be deemed impossible.
4. The password for the database connection is in git and the repo is set to private.  This password is never rotated when team members leave.
5. When you boot Flask to do development, Flask connects to the production database because that's where the data is ("what else could we do?").

In some cases, the fact that this setup works at all is sometimes related to the circumstance that the application
is a read-only visualization or dashboard.  If the application had become read-write, this entire idea would
fall apart.  Or, maybe there's a "database person" that essentially is a mutex for the team.  Or, maybe the app is so small in scope that this is fine.

So far, this hasn't been my experience.  My experience has been to take ideas as needed from full frameworks and bring them into Flask.  These concepts are not obvious in Flask because Flask do not have these concepts in them.  Take dev/test/prod.  In order to add dev/test/prod, we need to:

- Get the passwords out of git and introduce the dotenv library
- Add some configuration files, maybe with Dynaconf
- Add database migrations and seeding
- Have every dev have a local database
- Have some example data or factories or something

If we get this far, a pull request could have code and schema changes proposed.  Without it, we're unlikely to mess around with the database structure.

You might be quick to blame the team.  I'm quick to blame the tool but blame isn't interesting here.  I think Flask influences thinking and trades-off too far in the direction of simplicity.  There is no dev/test/prod in Flask so I have to invent it by composing libraries
together on top of Flask.  Actually getting this to work with tests and `conftest.py` is non-trivial.  I'm not saying there is no trade-off either.  There is absolutely a trade-off.  Adding a dev database might confuse juniors.  We might have to introduce Docker or [try to solve](https://devenv.sh/) development environments.  I might have just invented my own [flask-unchained](https://flask-unchained.readthedocs.io/en/latest/) by selecting libraries.

For very simple applications, this simple setup might work fine.  I don't think it works for long.  I think applications usually grow in complexity and features.  I think it is common to have Flask fall apart in your hands  I think teams in this situation have only been exposed to Flask.  My experience in these cases has been to introduce ideas from other frameworks to Flask-only teams.  My experience is that even small apps outgrow Flask because most apps have state in the database and the default experience (not just Flask) is awful.


### Most of the Work is Explanation

For dev/test/prod and Flask, the change in thinking had to be the following.  There isn't just one database.  There are many instances of this
database in different environments for different purposes.  This is a flawed "shared development server" style of thinking where the only database available is the production one.  It's not A database, it's THE database.
```
┌────────────────┐
│ "THE" Database │
│                │
└────────────────┘
         ▲        
         │        
         │        
┌────────────────┐
│ Flask (laptop) │
│                │
└────────────────┘
```

Instead, thinking of it like as many instances in different contexts or environments this opens up many options.
```
┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐
│ A Database (dev)  │  │ A Database (test) │  │ A Database (prod) │
│                   │  │                   │  │                   │
└───────────────────┘  └───────────────────┘  └───────────────────┘
          ▲                      ▲                      ▲          
          │                      │                      │          
          │                      │                      │          
┌──────────────────┐   ┌──────────────────┐   ┌──────────────────┐ 
│   Flask (dev)    │   │   Flask (test)   │   │   Flask (prod)   │ 
│                  │   │                  │   │                  │ 
└──────────────────┘   └──────────────────┘   └──────────────────┘
```
There are many databases and not just one.  There is no shared development server or shared state.  There is no shared development anything.  Test might be CI but test can
also be your laptop.  It is the dev -&gt; test -&gt; prod [progression](https://12factor.net/config).

Thinking of it this way solves problems like:
- how can we rotate passwords or get them out of git?
- how can I change the database structure while it is running?
- how can we scale from 1 developer to 5?

But this is not what Flask comes with in the Hello World example nor does Flask teach you by example what this
concept is.  In order to get there you need to add plugins, libraries and configuration.  Of course, full frameworks cannot solve all your problems (you have to code something).  But when you need to diverge from the framework is usually much later in the project's life and a good framework will be solving common problems for you (better than you could have done).  It's reuse.


## Trade Offs

I think a lot of this is inevitable given an assumption of what class of application your application will
turn out to be.  Even with this viewpoint that I and others have, it was annoying when a greenfield would come
along and we didn't want to include all of Rails but we also knew that we'd regret picking Sinatra later
because we'd have to at least handle things like passwords, ENVs, a database connection pool and development
quality of life things.  The trade-offs were known, which is why a microframework was being considered.
But, do we need all of Rails, all the time?  It's annoying to have to have every concern included by default.  Maybe we
don't have and won't have an admin interface.  Maybe we will never send email.  But then we think through all the missing features and realize that we'd have to copy and steal ideas.  This is also what happens in FastAPI to [configure the database](https://fastapi.tiangolo.com/tutorial/sql-databases/).  Because FastAPI has "no database ideas" in it, you have to copy and paste configuration from documentation.  Ideally, I'd want to opt-out of features in a full-framework and have it be configurable.  Even with opt-out, the complexity is still there so I understand the draw to a small API surface area.


Flask was inspired by Sinatra.  It has the same trade-offs as Sinatra.  If you try to enhance Flask to have more concepts in
it then you end up with your own framework.  Look at
[flask-unchained](https://flask-unchained.readthedocs.io/en/latest/).  The features that flask-unchained are
the features that Flask does not have.  It comes with an opinion on databases, it has a structure for APIs
etc.  The issue with these projects is they are not authored by Flask Unchained.  So the trade-off is a
flexible plugin system counter open-source maintainance issues.  Many Flask plugins are not maintained.  The
same issue happens in other languages.  Full-featured frameworks usually control more of the stack.  So, when
they do a release, those things that they include or have written are bumped or fixed so they work in the new
release.  In theory, a plugin system sounds ideal because it has flexibility.  What I'm arguing is that CORS,
authentication and database state are extremely common and these things should be in the framework.

More than that, copying and pasting configs from FastAPI docs is one-way and subject to [bit-rot](https://squarism.com/2019/06/04/sprinkle-time-on-that-thing/).  Controlling configuration even in a full framework is extremely challenging but usually there can be step-to-step upgrade guides but this only works when you can name the version you are on.  If you are copying and pasting configuration and code, what version of FastAPI are you on?


## A Tour of Small READMEs

There are many microframeworks in many languages.  Most of them have a small hello world README just like [Sinatra](https://sinatrarb.com/intro.html) did.

[Echo in Go](https://github.com/labstack/echo)

```go
package main

import (
  "github.com/labstack/echo/v4"
  "github.com/labstack/echo/v4/middleware"
  "net/http"
)

func main() {
  // Echo instance
  e := echo.New()

  // Middleware
  e.Use(middleware.Logger())
  e.Use(middleware.Recover())

  // Routes
  e.GET("/", hello)

  // Start server
  e.Logger.Fatal(e.Start(":1323"))
}

// Handler
func hello(c echo.Context) error {
  return c.String(http.StatusOK, "Hello, World!")
}
```

[Kemal in Crystal](https://kemalcr.com)
```ruby
require "kemal"

# Matches GET "http://host:port/"
get "/" do
  "Hello World!"
end

# Creates a WebSocket handler.
# Matches "ws://host:port/socket"
ws "/socket" do |socket|
  socket.send "Hello from Kemal!"
end

Kemal.run
```



[Express in Node](https://expressjs.com/en/starter/hello-world.html)
```javascript
const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
```

These examples are easily understood which is a _pro_ in the complexity trade off.  What is not shown is the other side of the trade off.


## There are Few Fully-Featured Frameworks

There are very few fully-featured frameworks and there is usually only one or two in each language.

- Python has Django
- Javascript has Next or Remix or RedwoodJS
- Java has Spring Boot
- PHP has Laravel
- Ruby has Rails
- C# has .NET
- Elixir has Phoenix

But there are very few others.  It seems that language communities tend to rally around one or two full
frameworks and these frameworks last a long time.  The microframeworks might churn a lot more because there is less to throw away or because they are easy to invent?  Flask interest turns to FastAPI.  Sinatra interest turns to [Grape](https://github.com/ruby-grape/grape).  Express interest turns to Fastify.  But Django interest rarely turns into anything except a newer version of Django.  [Masonite](https://docs.masoniteproject.com/) is a rare exception (I have not tried it at scale).  It's much easier to create a hobby microframework project that is small in scope.

I think this is because full frameworks take 7 years to do right and this is assuming a productive or
high-level language.  The amount of work it takes to make a framework that is documented, tested and
feature-rich is huge.  Usually it seems to require a sponsored company or extraction out of a working business.  Django
was extracted out of a newspaper company.  Rails was extracted out of a team management company.  Next was
extracted or built in parallel out of a hosting company.  RedwoodJS is from [an exited Github
founder](https://github.com/mojombo).  I think it is interesting that this is the scale that
is required but it also might help us predict what is possible.  Can a hobbyist disrupt a full-framework?  Can
a single person invent a Django or Rails killer?

We can almost skip microframework attention because they will be the first to go.  I am not trying to FUD people out of
hobby projects.  Do it, make your thing.  But unless it has some very novel idea in it, then it's unlikely to
stick.  We've [had hundreds of microframeworks
already](https://www.techempower.com/benchmarks/#hw=ph&test=fortune&section=data-r22&c=d).  So if the real reason
for invention is "I did it because I could" then this isn't good enough.  We need more "what we need" even if
it takes years.  This is my main point.  Full-featured frameworks are harder to make and harder to learn.  But they have ideas in them that you should probably know about.  Critically think about the Hello World README example in Flask / Sintra / Express.
