---
layout: post
status: published
published: true
title: Golang gb project example
date: 2017-05-23
---

![machinery](/uploads/2017/machinery.jpg)

Gb is a fantastic tool for Golang that let's you define dependencies but more importantly (to me) is it lets
you work out of a 
_normal_<a href="#footnote-1"><sup>1</sup></a>
`src` directory wherever you want.  You don't have to mess with `$GOPATH` and you don't have to put your
own creations next to libraries.  You could even code directly in Dropbox if you wanted to be super lazy
about source control and sharing.  Overall, I really like gb for projects.  It's more normal to other
languages and I don't have to have Go be the exception to my project backups / paths / scripts / everything.

But I think examples are lacking.  The gb docs are great, I'm not saying that.  I just wanted to walk through
growing a project from small to medium to large and see how organization changes.  First, we'll start by
building a fake calculator with no working pieces so it doesn't need a lot of organization.  Then as we add
features, we'll pretend that it needs lots of separation and structure for future expansion and work.

You'll need to install [gb](https://getgb.io/) with `go get`.  You probably already have it installed and you
know how to google so I'll just skip that stuff. 

I'm going to use the terms small / medium / large but please note that doesn't mean stupid / insignificant /
important.  These size terms are just for labeling and explanation, don't read anything else into it.  If you
make a small project, it's not _"stupid"_ just as a large project is not automatically _"important"_
<a href="#footnote-2"><sup>2</sup></a>.


## Minimum GB

First, a gb project is really just a directory with a `src` directory in it.  Of course, nothing will work
without some files for it to build.  Below is the same error you'll get even if you make `gb_project/src`
(which gb looks under for source files).

{% highlight bash %}
$ mkdir gb_project && cd gb_project
$ gb build
FATAL: command "build" failed: no packages supplied
{% endhighlight %}

So, delete that directory and let's do something more useful.

Gb wants a subdirectory for a package under src to tell it what to build.  For our examples let's make a pretend calculator.
Our working directory is going to be `pretend_calculator`.  This can be anywhere.  Under your home, tmp or
Desktop.  Put it wherever you want.  Just assume we're in `pretend_calculator` as the project root after this point.

{% highlight bash %}
$ mkdir -p pretend_calculator/src/calculator
{% endhighlight %}

Let's write minimal code for this to build.
{% highlight go %}
// src/calculator/calculator.go
package main

func main() {
}
{% endhighlight %}

{% highlight bash %}
$ cd pretend_calculator
$ gb build
calculator  # showing us gb built the pkg, I'm going to omit this output from here on out
{% endhighlight %}

So our project tree looks like this:

    .
    ├── src
        └── calculator
            └── calculator.go

When you `gb build`, it will create a binary `./bin/calculator` that doesn't print anything (not surprising,
our main is empty).  This project layout isn't that great because the main is really a `cmd`.  If we wanted to
add more than executable, we'd have to change where the `main()` is and rename a few directories and files.
So this isn't great if we're building an equivalent of _Hello World_, it's hard to tell where `func main()` is
if you just look at the filesystem.

    $ tree -I pkg
    .
    ├── bin
    │   └── calculator
    └── src
        └── calculator
            └── calculator.go

So let's make this more obvious.  Let's create the start of a simple gb project with a command entry point.


## Small Gb Project Example

In this case, we want some actual code that runs something.  We'll have everything in one file under `cmd/`.
Later, we'll move some code out to a package as the project examples grow in size.  The cmd folder in gb
projects tell gb to build binaries of that same name of the file or the package.  It's the executable we're going
to run from `./bin`.

Now this is a bit tricky.  If you name your source file `src/cmd/calculator.go` then you'll get a binary
called `cmd`.  So what I'd do is name it something like `src/cmd/calculator/main.go` just show that this is
where the main lives for this binary.  You can name the file something other than `main.go` but it needs to be
in a subdirectory.  [The gb docs](https://getgb.io/examples/sample-project/) are a bit vague in their example
tree output describing this.  Also, note that binaries will always show up in `./bin`.  So I'm skipping that
output in the tree listings.

{% highlight go %}
// src/cmd/calculator/main.go
package main

import "fmt"

func main() {
    fmt.Println("Calculator Fun Time™")
    fmt.Printf("2 + 2 = %d\n", 2+2)
}
{% endhighlight %}

    .
    └── src
        └── cmd
            └── calculator
                └── main.go  # <-- file can be named anything, needs .go extension

{% highlight bash %}
$ gb build && ./bin/calculator

Calculator Fun Time™
2 + 2 = 4
{% endhighlight %}

So this is a nice layout for a small CLI app with not too much logic that would be ok to put into a single
file under cmd.  If I wanted to break it apart more where the entry point (the main) and the app logic and
functions were separated and kept organized, I'd use the medium project layout which we're going to
talk about next.

You could also just add functions to main.go to keep that file clean and then later move the functions around
to different packages later.


## Medium Gb Project Example

Let's move some of the app logic to another file and package.  This can be super confusing and yet it's the
most common thing to do (in my opinion) when working with Go projects.  We're going to make an add function in
a new file and a new package called `calculator`.  Note that this package is sort of arbitrary, it doesn't
need to be your project folder name or anything.  Packages are subfolders under src.  This will be more clear in
the next gb project examples.

{% highlight go %}
// src/cmd/calculator/main.go
package main

import (
    "fmt"

    "calculator" // <- this is really our local package in src/calculator/*
)

func main() {
    fmt.Println("Calculator Fun Time™")

    result := calculator.Add(2, 2)
    fmt.Printf("2 + 2 = %d\n", result)
}
{% endhighlight %}

{% highlight go %}
// src/calculator/calculator.go
package calculator

// Let's not name them num1 and num2 if we can :)
func Add(number int, addend int) int {
	return number + addend
}
{% endhighlight %}

    .
    └── src
        ├── calculator
        │   └── calculator.go
        └── cmd
            └── calculator
                └── main.go


{% highlight bash %}
$ gb build && ./bin/calculator

Calculator Fun Time™
2 + 2 = 4
{% endhighlight %}

Note that we would be planning on putting all functions into `src/calculator/calculator.go` here.  If we
wanted to only put the `Add` function into `src/calculator/add.go`, we could do that.  In the context of a
medium sized Go project, we might not want to do that.

Also note that the `main.go` needs to import `calculator`.  This refers to the package we created.  If we want
sub-packages and more sub-division, we can do that but we'll get to that in a bit.


## Large-ish Gb Project Example

_Just a reminder, my label of large is very arbitrary._

Ok, now what if we want to add more functions and packages.  We can continue to do so across files and
packages.  Let's add subtraction and the concept of memory storage (you know the MR button?).

Adding subtraction is the same as addition.  We just add a `Subtract` function to
`src/calculator/calculator.go` with a Capital letter to export it.  It's the same as Add.  We could split this
out to different files if we wanted.  Maybe that's more interesting.  We'll do that in the next example. 


{% highlight go %}
// src/calculator/calculator.go
package calculator

// Nothing changes here.
func Add(number int, addend int) int {
    return number + addend
}

// Subtract 1 from 4 is 3.
func Subtract(from int, number int) int {
    return number - from
}
{% endhighlight %}


Let's add memory storage.  We need to create a struct to store stuff in.  So our `memory.go` code is going to
have a struct initializer in it.  The function naming is just Go convention, nothing here is specific to gb.


{% highlight go %}
// src/calculator/memory.go
package calculator

type memory struct {
    register int
}

func NewMemory() memory {
    return memory{
        register: 0,
    }
}

// MR means memory recall, it returns the contents of a number in memory
func (m *memory) MR() int {
    return m.register
}

// MS means memory store, it stores a number (normally would be the screen)
func (m *memory) MS(number int) {
    m.register = number
}
{% endhighlight %}


We only export the NewMemory function to keep people from creating structs themselves.
Using this struct in `main.go` for the command goes like this:


{% highlight go %}
package main

import (
    "fmt"

    "calculator"
)

func main() {
    fmt.Println("Calculator Fun Time™")

    add_result := calculator.Add(2, 2)
    fmt.Printf("2 + 2 = %d\n", add_result)

    subtract_result := calculator.Subtract(1, add_result)
    fmt.Printf("%d - 1 = %d\n", add_result, subtract_result)

    fmt.Println() // spacing

    // memory functions
    memory := calculator.NewMemory()
    fmt.Println("Storing the result in memory ...")
    memory.MS(subtract_result)                          // store
    fmt.Printf("Memory has <%d> in it.\n", memory.MR()) // recall
}
{% endhighlight %}


Running this now produces:

{% highlight bash %}
$ gb build && ./bin/calculator

Calculator Fun Time™
2 + 2 = 4
4 - 1 = 3

Storing the result in memory ...
Memory has <3> in it.
{% endhighlight %}


Our current tree structure looks like this.  We are doing file organization at this point but we really still
have one package (other than main).

    .
    └── src
        ├── calculator
        │   ├── calculator.go
        │   └── memory.go
        └── cmd
            └── calculator
                └── main.go

What does a more complicated project look like?


## Larger Gb Example

Let's split out every function into a file to make the project very easy to navigate.  Intuition should drive
file search.  Add and subtract will go in functions.go.  We'll add the concept of a tape to display
information that will also have the opportunity to save state that will make the memory feature more realistic
to how physical calculators work.

I said we'd break out functions into intuitive files.  Let's put `Add()` into `add.go`
{%highlight go %}
// src/calculator/function/add.go
package function

func Add(number int, addend int) int {
    return number + addend
}
{%endhighlight %}

And the same for `Subtract`
{%highlight go %}
// src/calculator/function/subtract.go                                               1 ↵
package function

func Subtract(from int, number int) int {
	return number - from
}
{%endhighlight %}

Next, let's make a tape.

{%highlight go %}
// src/calculator/tape/tape.go
package tape

import "fmt"

// represents an empty memory instead of using nil which does not communicate well
const emptyRegister = 0

// For simplicity's sake, the calculator tape is essentially the entire electronics 
// of this fake calculator.  A tape probably wouldn't care about current previous 
// values for undo functionality.
type tape struct {
    lastNumber    int
    CurrentNumber int
}

func NewTape() tape {
    return tape{
        lastNumber: emptyRegister,
    }
}

func (s *tape) Clear() {
    s.CurrentNumber = emptyRegister
}

// Updates the internal state of the tape
func (s *tape) Update(number int) {
    s.lastNumber = s.CurrentNumber
    s.CurrentNumber = number
}

// Displays the current number
func (s *tape) Display(message string) {
    fmt.Printf("| %-22s|%7.1f|\n", message, float32(s.CurrentNumber))
}

// Just print a blank line like the calculator tape is advancing
func (s *tape) Advance() {
    fmt.Printf("|%31s|\n", "")
}

// Roll the tape back, behaves kind of like one-time undo
func (s *tape) Rollback() {
    s.CurrentNumber = s.lastNumber
    s.lastNumber = emptyRegister
}

func formatNumber(number int) string {
    if number == emptyRegister {
        return " "
    } else {
        return fmt.Sprintf("%1.0f", number)
    }
}
{%endhighlight %}

It's very similar to the last examples, just more code.  We have some types and structs in this file
but you can see that any Capitalized anything is expected to be used externally.  The package has no hierarchy
but later when we use it, we'll need to alias it.


The changes to the last project are simpler that it seems.  All we did was:

  * We made a directory called `src/calculator/function`.  The package is now `calculator/function`.
  * We split `Add` and `Subtract` into files named `add.go` and `subtract.go`.  We don't explicitly need to care
    about this when importing.
  * Each of these new files have `package function`.  You can't declare `package calculator/function` at the
    top.  Doing that won't even pass `go fmt`, it will error.

`Memory.go` stays the same, it's in the root `calculator` package just because.

{%highlight go %}
// src/cmd/calculator/main.go
package main

import (
    "fmt"
    "strings"

    "calculator"
    fn "calculator/function"
    tape "calculator/tape"
)

func main() {
    fmt.Println("Calculator Fun Time™")
    fmt.Println(strings.Repeat("-", 32))

    tape := tape.NewTape()

    tape.Update(fn.Add(2, 2))
    tape.Display("2 + 2")

    tape.Update(fn.Subtract(1, tape.CurrentNumber))
    tape.Display("Subtract 1")

    tape.Advance()

    // memory functions
    memory := calculator.NewMemory()
    memory.MS(tape.CurrentNumber) // store
    tape.Display("Hit Memory Store")

    tape.Clear()
    tape.Display("Cleared screen")

    tape.Update(fn.Add(10, memory.MR()))
    tape.Display("Add 10 to memory")

    tape.Advance()

    // rollback feature
    tape.Clear()
    tape.Update(fn.Add(1, 1))
    tape.Display("1 + 1")
    tape.Update(fn.Add(1, tape.CurrentNumber))
    tape.Display("+ 1")
    tape.Rollback()
    tape.Display("Rolled the tape back")
}
{%endhighlight %}

Our main file has expanded dramatically as we try to exercise the new packages and files we're making.
We need to give `calculator/function` an alias (in this case `fn`) to use a hierarchical package.
It's very arbitrary.  We still are using `Memory` out of the `calculator` package so we need to import
that explicitly like we were before.  If you wanted to break memory out, you'd follow what we did with add &
subtract.

Our tree now looks like this:

    .
    └── src
        ├── calculator
        │   ├── function
        │   │   ├── add.go
        │   │   └── subtract.go
        │   ├── memory.go
        │   └── tape
        │       └── tape.go
        └── cmd
            └── calculator
                └── main.go


Running it shows how main.go works.  It might be easier to skim the code and just read the output.
It's a very contrived example but more "real".

{% highlight bash %}
$ gb build && ./bin/calculator

Calculator Fun Time™
--------------------------------
| 2 + 2                 |    4.0|
| Subtract 1            |    3.0|
|                               |
| Hit Memory Store      |    3.0|
| Cleared screen        |    0.0|
| Add 10 to memory      |   13.0|
|                               |
| 1 + 1                 |    2.0|
| + 1                   |    3.0|
| Rolled the tape back  |    2.0|
{%endhighlight %}


## Wrap Up

I hope this was interesting.  I've been wanting an article like this to exist ever since I started using gb as
a tool.  I've found example gb projects on github that were useful examples but believe me when I'm blogging
all this for myself as a future reference.  Shoot me a note on twitter if you liked this or would like to see
something else, it's nice to know who's reading.

<p id="footnote-1"><sub>[1] Nothing is normal</sub></p>
<p id="footnote-2"><sub>[2] I prefer better/worse over good/bad.  In this case it'd be smaller and larger
which is awkward in this case.  The only rock we have to stand on in C.S. is metrics, everything else is opinion (like
this very statement!).</sub></p>
