---
layout: post
status: published
published: true
title: Testing is a Gradient Spectrum
date: 2018-11-08
---

I'm reading the n-th article where someone mentions TDD (test-driven
development) as a magic word that means "doing testing" or something else and I
thought I'd write down a few things as a note.   There have been nearly
_infinity plus one_ articles and discussions about testing and TDD. I don't mean
to pile on the old, dead and old-dead horse here but I just keep hearing
language that makes me want to pull out a tobacco pipe near a fireplace and puff
_Well Actually ..._ and that's not great without helpful context and more
detail.

So, let me TLDR this real quick.  There is no right or wrong way to test if
you've tried many different types and flavors and have your own personal
preference.  There probably *is* a wrong way to test your project if you have
never had time, don't care that much or someone sent you this link and this is
just another [opinion
man](https://www.imdb.com/title/tt0118715/quotes/qt0464776).

The TLDR here is:
* Every project is different and has different testing needs and opportunities.
* Testing increases confidence and reduces "whoops" moments.
* There's no such thing as no testing.  When you say you don't have time for
    tests, you mean automated tests. Everyone tests, you are just doing manual
    and slow (over the project) testing.
* Testing is a spectrum and TDD does not mean "I am doing testing".
* There are many flavors of testing and even though TDD is usually the most
  dogmatic form of testing, it's not "best".


## The Spectrum

![a testing spectrum](/uploads/2018/testing_spectrum.png)


### No Testing

> Me:       Do you have tests?<br />
> Someone:  Hehe, I know.  We didn't really have
>   time for this project.  Look, I joined late and ...

No one does "No Testing" but people think they do.  This is typing the code,
never running it and shipping it to production or scheduling it to run for real.
You never observe it running.  No one does this but they think they have no tests
when they only have manual tests.

Think about this with "hello world".  You would type hello world code, save it
and put it somewhere as production. You would dust off your hands, say _"another
job well done!"_ and go home.  No one does this.  From here on out, this isn't
what I mean by testing vs no testing.  By testing, I mean automated testing
and that includes your local machine.

Pros:
* You are infallable and you type the correct solution perfectly
* You don't waste any time by checking what you did at all
* You are a physical manifestation of _Ship It!_

Cons:
* As a perfect being, you feel alienated from your fellow man
* You are an impossible construct

No one does No Testing.  What they mean is Manual Testing.  And this is the
point about time.  They didn't have time then for automated tests and they
are running manual tests now.  Do they have time for manual tests now?  Maybe.
I'm fine with it as long as it's an informed decision and it's not causing bugs/outages/delays.


### Manual Testing

This is what most people do when they don't have a test suite.  You type hello
world, run it, look at the output.

```
$ ./some_program
  Hellow orld

"Whoops!  Let me fix that real quick.  Ok.  I think I fixed it, let me see …"

$ ./some_program
  Hello world
```
Great.  It's "done".  It worked right?

Pros:
* Saves time short term
* You won't need more tools

Cons:
* You have no idea if your change is going to break everything
* You will wonder and hope each time you change anything
* The only way to verify correctness is with your fragile and tired human eyes
* You are definitely going to be running `./some_program` a lot


### Some Partial Testing

This is when there are tests but maybe only small coverage or one type (like
unit tests only).

There's a huge inflection between partial testing and manual testing.  The
manual testing project has never had time, doesn't deeply care (or deeply know) and
has had little positive experience (if any) with testing.  There is a huge gap
here in culture and minds. It could be developer minds, it could be boss minds,
who knows. This is the mind-gap where you have to explain what testing is.  This
is the mind-gap where you try to tell stories and impart wisdom.  This is where
you try to explain the feelings of having tests at your back when you are
trying to refactor or understand legacy code.  Sometimes, you might sound crazy
or religious.

Cutting the team some slack, maybe there are constraints.  Usually there are
constraints.  Constraints can keep a project or team from making their tests
better.  Maybe the domain, language, history or some other constraint is keeping
the tests from becoming better.  But there is a test suite and someone cares or
understands at least some aspect of testing.

Maybe people are trying their best.  But I would argue that partial test teams
haven't deeply felt tests helping them stay on track and ship quality projects.
If they can explain this blog post then I believe them.  If they can't, they
haven't had time yet and maybe they will.  It's not their fault but they also
aren't requiring that testing is a required tool of the trade.

Pros:
* At least you tried to write tests
* Less developer time (in the short term)
* Maybe you don't waste effort trying to automate testing some horrible legacy
  GUI with a hack
* Minimal tests run fast

Cons:
* Major aspects of the system aren't covered
* Confidence isn't really there
* Maybe it's testing theater, maybe you give up on your tests
* If you have a UI or web frontend, that bit probably breaks a lot with unit
  tests only
* Lack of testing ecosystem understanding and strategies to enable more coverage

Excuses can live here too.  And some products are hard to test.  But have these
options been tried?

* I/O and Third-Party APIs (can be faked or the seams designed away with
  dependency injection)
* GUIs and Mobile device specifics (could be mocked?)
* The product is actually on the moon, how can we simulate the moon?  (decrease gravity?)

I would argue some of these things can be mitigated and you really need to
reach for a lot of tooling and language features to fake some of this stuff.
And maybe it's hard to test everything But that's why you don't need 100%
test coverage.  But yes, some projects are hard to test. Some code is hard to
test too but sometimes that can be fixed and the developer learns a ton about
refactoring, their language and design.

I had a project where I thought AWS services were hard to test and my app
was breaking in weird ways everytime I pushed it out.   Then I researched a bit and
found some tricks and my app wasn't so different between my laptop tests and public reality.


### Complete Practical Testing

Some form of complete testing where units are tested and the system is tested
(like UI testing or regression tests).

Engineers on the team have a culture of including tests with work estimates and
expectation.  The organization either supports this kind of work explicitly or
implicitly.  It doesn't really matter. This is a purely practical decision and
there is limited value in _"abstract testing values"_.  Tests exist, that's good
enough.

This probably means the project probably run many different test suites where
regression tests are run occasionally but some other group of tests are run more
often as code happens.

Your repo:
```
src/...           # the source
test/...          # unit tests (fast)
integration/...   # end-to-end tests (slow)
```
This is trickier than it seems.  That means that git commits, pushes, CI and
other tools all have this culture baked in.  You aren't going to run integration
tests all the time.  Everyone has to know that to be the quickest they can be.
Scripts to separate tests have to exist.  You can't just run all tests that
match under `test/*`.

Where this ends is in philosophy and world view.  There's no perceived value (at
least as far as schedule, job, work, too busy etc) in doing anything
differently.  As long as tests exist, that's good enough.  It stops production
bugs.

Pros:
* Probably good enough for a lot of projects.
* Production bugs are caught before-hand as long as the feature is correct.
* Pragmatic and religion-free.

Cons:
* Requirements might be misunderstood or misremembered.  Implementation comes
    first and the test comes later, how good are your notes?
* Doesn't really enable higher-level domain and customer modeling with things
    like BDD or user story, plain-english requirements gathering.


### Test First Development

You simply write your tests before you start coding implementation.  There's a
key difference to TDD that I will get to.

You can start top-down or bottom up.  You can start a top-down test first:
```
When a user logs into the site
Then they see a logout button
```

Or you can start a bottom-up test first:
```
This function/method returns a token
  (expectation matcher for a unit testing library goes here)
```
It doesn't matter.  The thing you don't do is write any code in `src` or `lib`.
You don't even start.  You don't even spike.  You write a test.  Hopefully your
test is in a reaction to a conversation you just had with someone who is paying
you.  Hopefully your quickness to writing a test captures a conversation in an
executable format that is checked in and lives and acts.  Compare this with an
email or a Slack message which sits and rots.

Pros/Cons: I don't know many projects doing purely this.  I guess the pro is not
being religious about letting tests drive the design


### Test Driven Development

You let the tests lead design decisions.  This is hands-off-the-wheel dogmatic
stuff.  You limit your thinking really.  Requirements are captured early and
tests are written first.  But more so, you let go of the wheel. If something is
hard to test, that means the design is wrong.  If a test can't be written then
you don't start the feature.  If you can't start the test, you ask someone a
question.  See how testing is the thing?

You don't really need to do TDD to have confidence before deployment.  But it's
trying to fight human behavior.  Almost each step is trying to fight some
historically problematic behavior.  Except for manual and no testing.  Those
aren't doing a lot (unless testing has become an anti-pattern).

You probably need a tight feedback loop, tooling and automation to make this
happen.  It's also *not the best way to test* just because it's at the end of
this list.

Cons:
* If you are completely lost, it doesn't work
* It can be more annoying at the start of the project if working bottom up

Pros:
* It can be a creative tool where a design emerges, the problem is solved and by
    definition the code is easy to test
* It limits getting distracted while working on a feature - this is subtle and
  non-obvious from the outside


## Enablers and Multipliers

<img alt="testing multipliers" style="float: right;" src="/uploads/2018/testing_enablers.png" />

### Automation

Let's say your flow is something like this:
1. Work on feature
1. Write tests
1. Run tests (old ones and new ones)
1. Ship it!

While working, you might just run your tests or tests that are relevant to your
feature/work. But before you ship it to production, you're going to make sure
you don't break everything right? So, just have a tool that runs your tests.
Have the tool tell you when it passes.  Don't deploy until it passes.  Call this
_continuous integration_ (CI).

Now something else happens when you have continous testing.  You can have
continous deployment. So, tests passed and you have a build that those tests ran
against right?  Then that build is good to go! Why throw it away?  Why deploy
from your laptop?  Deploy it!  This is _continous deployment_ (CD). Note that
you don't need to do CI or CD but testing is enabling you to do so.


### Confidence

After everything beyond manual testing, a non-obvious thing happens.  Automation
and tooling.

Let's say your flow is something like this:
1. An idea appears.  It seems doable.
1. Start work, maybe start tests.
1. Finish work.
1. Write tests maybe after.
1. Tests seem to work.
1. Maybe refactor your code and cleanup.
1. Tests still work.  Looks good?  Maybe cleanup tests and try one more thing?
1. Tests still work.  Wow, this came out nice and I know I didn't break
   anything.

Would you have refactored and tried one more thing if you didn't have tests?

> Boss: "Hey, right now our calculator only has numbers on it.  Could we put a
> plus sign on there and call it addition?" You: "Sure!"

You go to the repo and start work.  You add some code to handle the addition, in
this contrived world life is simple.

1. Add a function/method called add that takes two numbers
1. Write a test for the happy path (numbers like 1 and 2)
1. Write a few tests for failing paths (strings plus strings, not allowed)
1. You don't need to cover all permutations, in your head you probably have an
   idea of what bad data is, do that

Ready to deploy?  Great!  Oops.  Someone noticed that you forgot to add a test
in case an emoji character shows up. Ok, write a test for that.  What is your
confidence like now?  You have a lot of edge cases covered.  Is it going to
work?


### Executable Documentation

How does this code work?  What is it supposed to do?  Maybe you have code
comments (but they bit-rot), maybe you have language features like annotations,
typespecs or something.  Maybe you don't.  But how do you use the calculator
from the previous example?  Can it handle numbers that are strings?  It can't!
Did you write that down? Can you, yourself remember in a few months?  Tests
really aren't docs but they are executable and they can stand-in as docs,
especially as API usage.  So until you write docs (and maybe you won't), tests
can act as capability documentation.  "What was the developer thinking"


### Hooks and Addons

You have this testing habit now, why not add some libraries?

When you run your tests:

1. Notify a channel in Slack that master has failed (broken build)
1. Pass a random seed in to see if tests, modules or files interfere with each
   other
1. See if race conditions happen
1. See how much of your code executes (coverage)
1. Load dummy data in to test against (fixtures and test factories)

Notice all these enablers and multipliers happening now that you have a test
step.


## Wrapping Up

Let me head back to the start of the spectrum.  _"We don't have tests"_

Compare the workflow where someone just types a program and copies it to a
server and then closes their laptop.  It seems insane from the very dogmatic
land of TDD because their point of view is beyond just "having tests".  But that
doesn't mean it's "best".  But there is a knowledge gap between each of the
points on the spectrum.  I'm ok with ignoring parts of the spectrum for a
project if it's understood.  If you can explain this blog post to me then we're
cool.  If you cannot then I feel like there is a blind spot and any pain points
the project is feeling is fair game to improve. If you can explain this post
then I'll mark it up to semantics.  If you cannot explain the spectrum to me,
then the term TDD is being misused as "testing" and I'd like to explain and help
because there is some wisdom to be shared.

There's very little right or wrong in all this.  I am trying to communicate that
"no tests" does not mean "no testing".  You are probably doing manual testing.
And for certain projects, who cares?  Do you care?  Do you see yourself hating
the manual testing?  Then automate it.  Are you manually typing in a test user
and password, clicking a login button and then clicking around to see if
anything broke?  Does that annoy you even to talk about it?  Then automate it.
Are you hand-crafting test data and sharing it with colleagues?  Then automate
the creating of your test data.

There's no such thing as _no testing_ and TDD is not completely required
although I have enjoyed TDD or Test-First quite a bit when I've had the
opportunity to use it as an approach. It's not required to go all the way to TDD
because testing is a gradient spectrum.
