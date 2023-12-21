---
layout: post
status: published
published: true
title: Microframeworks Are Too Small
date: 2023-12-20
---

I want to talk about what microframeworks don't solve but also why there have been and continue to be so many of them.  First, I guess we should identify some terms. Identifying if a web framework is a microframework is debatable but I would call it a microframeworks if:

- The author calls it a microframework
- It has a small hello world example that looks like Sinatra in the README or the homepage
- It doesn't pre-solve a common problem for you

So, Flask / Express / Sinatra are microframeworks as opposed to their sister projects Django / Next.js or others / Rails.  Usually the choice within an ecosystem is Django vs Flask, etc.

The "pre-solve a common problem for you" is the big one.  To make this more concrete, I will be using the use
case of adding a database to your project as an inflection point.  Larger frameworks usually have some kind of story around adding a database and the microframeworks do not.


## It Started with Sinatra

<img alt="Old Sinatra Website" style="width: 50%; margin: auto;" src="/uploads/2023/sinatra.jpg" />

There are many microframeworks in every language.  It started with [Sinatra](https://sinatrarb.com/).  Sinatra had this very cute and
small README snippet on their home page.  _"Put this in your pipe and smoke it"_ was the original tagline.  It
was really really compelling and provocative at the time.  You wire up a route and you get some plain text
back.  Why would you bother with anything else?

```ruby
require 'sinatra'

get '/' do
  'Hello world!'
end
```

The trade-offs are not obvious and the simplicity trap is enticing to juniors.  If you ever started a Sinatra
app, you realized that when you change your code, you'd have to ctrl-c and start your app again `ruby
myapp.rb`.  Every code change, switch terminal, ctrl-c, up-arrow, enter.  That was just changing code, manual
testing.  So many questions and concerns would appear after this most basic flow.  Where do I put passwords?
How can I add a database?  How do I build or deploy this thing? So, as the project grew or if you simply kept
working with it you would have to solve, research or enhance Sinatra yourself.  Many times, myself and others
would copy whole files out of Rails.  Or, we'd end up needing ideas from Rails.  Ideas like development server reloading, where to put configs, test fixtures or the concept of dev/test/prod.

## The Database is the Inflection Point

On the topic of databases and dev/test/prod, the conversation needs to dive a bit deeper.  I think the database can break the framework.  This isn't quite [The Database Ruins All Good Ideas](https://squarism.com/2021/07/08/databases-ruin-all-good-ideas/), it's more like, The Database Makes the Framework Creak?

Because some running Flask might say "we have a database in Flask already, it's easy" but what they really have is a bunch of hidden context. Take this example
of how many fictional teams work with Flask:

1. There's a production database which a Flask app connects to.  This is the only database in the world for
this application.  There is no dev database, even on a laptop.
2. The SQL to create this empty database was copied to something like Dropbox, email or a share.  Or maybe it never was, "why would you need it"?
3. The database rarely changes but not necessarily intentionally.  When a change needs to happen,
stress and confusion levels are high.  It might even be deemed impossible.
4. The password for the database connection is in git and the repo is set to private.  This password is never rotated when team members leave.
5. When you boot Flask to do development, Flask connects to the production database because that's where the data is ("what else could we do?").

In some cases, the fact that this setup works at all is sometimes related to the circumstance that the application
is a read-only visualization or dashboard.  If the application had become read-write, this entire idea would
fall apart.  Or, maybe there's a "database person" that essentially is a mutex for the team.  Or, maybe the app is so small in scope that this is fine.  So far, this hasn't been my experience.  My experience has been to take ideas as needed from full frameworks and bring them into Flask.  These concepts are not obvious in Flask because Flask do not have these concepts in them.,  Take dev/test/prod.  In order to add dev/test/prod, we need to:

- Get the passwords out of git and introduce the dotenv library
- Add some configuration files, maybe with Dynaconf
- Add database migrations and seeding
- Have every dev have a local database
- Have some example data or factories or something

You might be quick to blame the team.  I'm quick to blame the tool but blame isn't interesting here.  I think Flask influences thinking and trades-off too far in simplicity.  There is no dev/test/prod in Flask so I have to invent it by composing libraries
together.  Actually getting this to work with tests and `conftest.py` is non-trivial.  I'm not saying there is no trade-off either.  There is absolutely a trade-off.  Adding a database might confuse juniors.  We might have to introduce Docker or [try to solve](https://devenv.sh/) development environments.

For very simple applications, maybe this entire setup might work fine.  But, do applications usually grow in features, stay the same or shrink in features?  Is this really common to have Flask fall apart in your hands and have no other comparative experience?  Is Flask the team's only known tool?  My experience has been to introduce ideas from other frameworks to Flask-only teams.


For dev/test/prod and Flask, the change in thinking had to be the following.  There isn't just one database.  There are many instances of this
database in different environments for different purposes.  This is the development phase thinking where the
database is just "the database" but it's really an instance of the database on a server in production.
```
┌────────────────┐
│    Database    │
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

Instead, thinking of it like this
```
┌───────────────────┐  ┌───────────────────┐  ┌───────────────────┐
│  Database (dev)   │  │  Database (test)  │  │  Database (prod)  │
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
There are many databases and not just one.  There is no shared development server.  Test is CI but test can
also be your laptop.  It is the dev -&gt; test -&gt; prod [progression](https://12factor.net/config).

Thinking of it this way solves problems like:
- how can we rotate passwords or get them out of git?
- how can I change the database while it is running?
- how can we scale from 1 developer to 5?

But this is not what Flask comes with in the Hello World example nor does Flask teach you by example what this
concept is.  In order to get there you need to add plugins, libraries and configuration.  Of course, full frameworks cannot solve all your problems (you have to code something) but when this needs to happen is usually much later in the project's life and a good framework will be solving common problems for you (better than you could have done).  It's reuse.


## Trade Offs

I think a lot of this is inevitable given an assumption of what class of application your application will
turn out to be.  Even with this viewpoint that I and others have, it was annoying when a greenfield would come
along and we didn't want to include all of Rails but we also knew that we'd regret picking Sinatra later
because we'd have to at least handle things like passwords, ENVs, a database connection pool and development
quality of life things.  The trade-offs were known, this is why a microframework was even being considered.
It's annoying to have to have every concern by default.  Maybe we
don't have and won't have an admin interface.  Maybe we will never send email.  Configurability or opt-out is important but I think this
is a different situation than "this framework has no database ideas in it" or [a partially solved database
story](https://fastapi.tiangolo.com/tutorial/sql-databases/) where you need to copy and paste configuration
from documentation.  Ideally, I'd want to opt-out of a feature but I think the forces of complexity makes that
feature unlikely to appear in the microframework.  It just won't be in the docs.


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



There are many microframeworks in many languages.  Most of them have a small hello world README just like [Sinatra](https://sinatrarb.com/intro.html).

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
frameworks and these frameworks last a long time.  The microframeworks might churn a lot more because there is less to throw away or because they are easy to invent?  Flask interest turns to FastAPI.  Sinatra interest turns to Grape.  Express interest turns to Fastify.  But Django interest doesn't turn into anything except a newer version of Django.  No one is going to build something that complicated.  It's much easier to do a hobby project.

I think this is because full frameworks take 7 years to do right and this is assuming a productive or
high-level language.  The amount of work it takes to make a framework that is documented, tested and
feature-rich is huge.  Usually it seems to require a sponsor or extraction out of a working business.  Django
was extracted out of a newspaper company.  Rails was extracted out of a team management company.  Next was
extracted or parallel built out of a hosting company.  RedwoodJS is from [an exited Github
founder](https://github.com/mojombo).  I think it is interesting that this is the scale that
is required but it also might help us predict what is possible.  Can a hobbyist disrupt a full-framework?  Can
a single person invent a Django or Rails killer?  I think not and yet I think this is what we need more of.

We can skip microframework attention because they will be the first to go.  I am not trying to FUD people out of
hobby projects.  Do it, make your thing.  But unless it has some very novel idea in it, then it's unlikely to
stick.  We've [had hundreds of microframeworks
already](https://www.techempower.com/benchmarks/#hw=ph&test=fortune&section=data-r22&c=d).  So if the real reason
for invention is "I did it because I could" then this isn't good enough.  We need more "what we need" even if
it takes years.  This is my main point.  Full-featured frameworks are harder to make and harder to learn.  But they have ideas in them that you should probably know about.  Critically think about the Hello World README example in Flask / Sintra / Express.
