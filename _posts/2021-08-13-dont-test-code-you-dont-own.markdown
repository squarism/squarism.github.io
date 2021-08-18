---
layout: post
status: published
published: true
title: Don't Test Code You Don't Own
date: 2021-08-13
---

## The Concept

I wanted to describe a concept of not testing code you don't own but it also touches on other bits about pushing I/O to the edges.  I think pushing I/O to the edges and the concept of messages is a much more important thing to learn here but it's ok if you want to solve specific problems like _"how do I test a thing without it really writing a file / charging a credit card?"_.

These examples are in Python just to change things up a bit.  These concepts apply to Ruby, Javascript, Go, Elixir, Java and almost any language.  The key difference is that dynamic languages make stomping on real methods very easy through their dynamic nature.  So how you mock in Go might be harder (maybe you need to use an interface or use a protocol) but the concept of pushing I/O to the edges is still the core here (to me).

When I use the term _stomp on a method_, I mean the test library overwrites the real method.  In python this might be `.mock` in pytest or `MagicMock`.  In Ruby, it's `expect` or `allow`.  In Javascript, it's Jest's syntax or Sinon's (Jest is fine).  Stomp just means overwrite at testing time.

Finally, this is a unit testing perspective.  There's a section that talks about mocking trade-offs which you should be covering by other levels of testing depending on criticality.


## The Start

If I make a call out to python's `open()`, you could write a test that tries to stomp on that at runtime. But instead, I try to name what it's doing in a method like `save_game()` and then I would test that my `save_game()` method takes some game state.  I don't need to test python's stdlib.  So I don't need to mock `open()`. I do however sometimes want to make sure the wiring between my code and the stdlib is ok.  Sticking with the save_game example ...

First, I test my `save_game(game_state)` takes some state and would call some file writing method.  
In this case, I'd want another method called `write_save_file("a_hard_coded_path")`, just assuming the game has one save file and I didn't have a parameter to `save_game`.

```python
import json

class Game:
  # when you read this method, list its jobs and who owns the code
  def save_game(game_state):
    f = open("game.dat", "w+")       # opening a file, python stdlib
    f.write(json.dumps(game_state))  # game_state as JSON is our choice, write is stdlib
    f.close()                        # this is still part of opening a file, stdlib


# main, imagine the __name__ python trick here
game_state = { 'name': "Annoying Youtube Let's Play Series S24E49" }

game = Game()
game.save_game(game_state)
```

So in these lines ...
```python
1  f = open("game.dat", "w+")
2  f.write(json.dumps(game_state))
3  f.close()
```
Line 2 is the weird one.  Writing a file in python takes 3 lines to do.  But our business rule of writing the game state as JSON is our own rule.  We could split up the line with two jobs into two lines and make this 4 lines to make it more obvious:

```python
1  f = open("game.dat", "w+")
2  formatted_game_data = json.dumps(game_state)
3  f.write(formatted_game_data)
4  f.close()
```
In this case now, line 2 is not I/O.  It's our business logic but it's not I/O.  You can tell because it's in python memory and it stays in python memory.  Lines 1, 3 & 4 are external to python (really).  The actual I/O happens (I am guessing) on line 4 when it closes the file handle and lets the OS write the file, flush the buffer or whatever system call actually happens.  The point here is, line 2 is not I/O.  We won't count memory as I/O for this discussion.

Another aspect to the original 3 lines is that the method has two jobs.  One is opening a file (which is in python docs) and another is converting to JSON (which is also in the python docs).  But we can split these jobs up.  We can change how it looks from the outside (refactoring).  But I wants tests before I start refactoring.

So here's a test and code change all at once.  We're changing quite a bit all at once  which really isn't fair to the original.  Mostly to enable testing we need to get rid of that main code at the bottom.  Even if this was using the pythonic `__name__` trick, the concept of pushing I/O around is still not realize.  I'll revisit this in a section about CLIs at the end.


## The Refactor

```python
# sorry this is all in one file for clarity

# test file imports
from unittest.mock import MagicMock

# code under test imports
import json

class Game:
    def save_game(self, game_state):
        save_data = json.dumps(game_state)
        self.write_game_file(save_data)

    def write_game_file(self, save_data):
        f = open("game.dat", "w+")
        f.write(save_data)
        f.close()


def test_save_game():
    # test setup
    game_state = { 'name': "Annoying Youtube Let's Play Series S24E49" }
    game = Game()
    game.write_game_file = MagicMock()

    # execute
    game.save_game(game_state)

    # verify
    expected_game_data_as_json = json.dumps(game_state)
    game.write_game_file.assert_called_with(expected_game_data_as_json)
```

Now you can see that the file writing job and the JSON formatting job are in one method each.  The tradeoff is more code and more code tracing.  The payoff is that I can mock the I/O.  With the I/O on the edge, I can mock the seam.

There's a tradeoff to mocking though.  If you comment out the `f.write(save_data)` in `write_game_file()` then the test still passes.  Stubbing and especially over-stubbing can create lies.  It's obvious when you are being lied to because tests pass but prod blows up.  So, if this piece is important (game saving probably is), then I'd do some more design/refactoring and make a serializer class and add more tests.

Some tools disagree with the article and stub out an entire filesystem. I did that in Go.  It worked fine.  Probably overkill.  In Go, options are more limited.  You have to test through an interface.  You're changing a lot of code to accommodate testing.  In other words, your app kind of _knows_ it's under test.  It's not as bad as having a flag of `if test_mode == true` but the design **is** changing. I don't super love that.  In general, I don't want my app to know about tests.  If I deleted my tests, my app would stay the same.  Ideally.  But with Go/types, this is harder.  You probably didn't make this part of your app so flexible.

In short:
- Don't test code you don't own.  Don't test stdlib.  That's someone else's job.
- Push I/O problems and code to the outside edge.  Then test everything except that tiny piece.  That way,
you have high code coverage but have a blindspot that is runtime/environmental.  Imagine that disk permissions
are wrong for the player of this game.  What can you do about that anyway?
- Write small methods.
- If you don't like this or if your tests lie to you, change the rule.  Do whatever gives you confidence.
Mock all file reading and writing, mock all network calls and sockets, go nuts.  Some libraries do this.
In Go, I haven't found this.

Even in this example, stdlib writes a file.  We could stub out the IO using the same mocking library.  So that
the `write_game_file` method doesn't write to the disk.  It's a matter of taste if this is worth it.  Or
software design if you wanted to swap an "adapter" or some other abstraction.  In this case, (since saving a
game is a rare event and important) I would probably stub out as much as I could so my test suite never writes
a file.  If it does write a file, I better be using that as some test artifact or asserting something by
reading the file.  My code should be flexible enough in this case to accept a path to write the file to and
then I mock out stdlib.  So, I am still writing tests for python stdlib?  No.  I would simply assert that my
method is calling stdlib methods and those methods are mocked so they don't hit the disk.


## About CLIs

In the original code, we had a main section with a literal main comment.  Code like this is untestable because it fires when we load the file.  We can't load the file in a test environment because the code runs.  This happens a lot with untested code because no one ever thought about loading the code in a test environment.  So the first thing you can do is add an "if", this might be python's `if __name__ == __main__` trick but the bigger idea is this.

### Put Your Lib in Lib and Your Main in Bin

If you had a project named `foo` like this:
```
foo.py
README.md
```
This is very hard to test even if you have tiny methods.  Most CLIs read top to bottom like a script.  So they are hard to test.  They have inline variables that make it hard to mock.  Additionally, the top-to-bottom script has argument concerns as well as "the app".  You don't need to do this.

First make two jobs and split up these jobs into two files
1. bin/foo - Read CLI arguments, invoke the foo module
2. foo/foo.py - whatever the foo module does, plain old coding time

```
bin/foo
foo/__init__.py
   foo.py
README.md
```
This is nice because now you can load the foo package in `test`.  Then make `bin/foo` as small as possible.  This CLI example **is also** about pushing I/O to the edges.  A CLI is simply an app that runs on the command line where some of the trickiest I/O is the arguments.  If you are using a CLI library like cliq, you don't need to test that library's capability, you just need to make sure that your app is able to deal with the options dictionary that comes from cliq.

So here are the big ideas about CLI:
- Your main is a thin script that handles arguments and then invokes your "lib" style code which is plain old code.
- Your code doesn't know about arguments as strings, it knows about options or switches or something that is parsed.
- Your code is testable because it's plain old code.
- The I/O you push to the edges first is CLI arguments.  You can continue to push I/O to the edges with files or network as described above with the save_game examples.
- You don't need to test a CLI argument library.  You do need to test how your program accepts arguments.
- You do not need to really invoke your program to test all arguments (permutations).  You don't need a simulator.  You don't need a fake filesystem.  If you do need these things, they are rare and more like seldomly run integration tests.  Your CLI would need to be very large to need this complexity.  It's probably not your situation.


## Conclusion

Pushing I/O to the edges to me is the same as _"don't test code you don't own"_.  But it can be applied to lots of things.  I/O is everywhere and using this strategy can help you solve the following problems:

- How can I test email code without emailing people?
- How can I test a credit card charger without charging a credit card?
- How can I fake a filesystem?
- How can I test my AWS cloud manager widget without costing me money?  (AWS runs on HTTP)
- How can I mock a database?
  - whoa there partner, this isn't the same thing - [databases ruin all good ideas](http://squarism.com/2021/07/08/databases-ruin-all-good-ideas/)

Some of these problems are bigger than others.  Mocking a database is a bad time, [good idea though](http://squarism.com/2021/07/08/databases-ruin-all-good-ideas/).  Faking a filesystem also might be a bad time.  But if you have a class/function whose job is to interact with files and it's not horribly complicated then you can use the above example almost verbatim and not have a bad time.  The rest of the examples are really about messages.  The reason why HTTP and Email are similar in I/O mocking is because the message metaphor is very strong (because the technology backing these things are essentially messages).  The database I/O is a different ball of wax.  An RDBMS is not just a message metaphor.  It's more of an interactive language.  It's possible to do but the seam is messier.  I might have another post about this later.  My point for now is don't go crazy with this concept.
