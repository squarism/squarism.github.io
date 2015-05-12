---
layout: post
status: published
published: true
title: Mocking in Golang
date: 2014-11-28
---
This was originally a stackoverflow but it got down voted and suggested it be a blog post.  Ok!  Here's my toy program. I had it separated into package files but I figured that would be harder for you guys to run it yourself. Please bear with me while I step through this.

The first iteration:

`charge.go`
{% highlight go %}
package main

import "fmt"

type VisaGateway struct {
    Name string
    Url  string
}

func NewVisaGateway() *VisaGateway {
    return &VisaGateway{
        Name: "Visa",
        Url:  "visa.com...",
    }
}

func (v *VisaGateway) Charge() {
    fmt.Println("I am charging Visa -->")
}

type PaymentGateway interface {
    Charge()
}

func ChargeCustomer(g PaymentGateway) {
    g.Charge()
}

func main() {
    gateway := NewVisaGateway()
    ChargeCustomer(gateway)
}
{% endhighlight %}

Running it.

{% highlight bash %}
$ go run charge.go
I am charging Visa -->
{% endhighlight %}

So we can test this with a mocking library (separate question) maybe but for now let's just use this interface and make a test that passes in a fake gateway so our test suite doesn't hit a real system.

`charge_test.go`

{% highlight go %}
package main

import (
    "fmt"
    "testing"
)

type MockGateway struct {
    Name string
    Url  string
}

func (m *MockGateway) Charge() {
    fmt.Println("This is a fake gateway.  --> [no-op] <---")
    fmt.Println("Yay!  :) ")
}

func TestCharging(t *testing.T) {
    m := &MockGateway{}
    ChargeCustomer(m)
}
{% endhighlight %}

Great!

{% highlight bash %}
$ go test
This is a fake gateway.  --> [no-op] <---
Yay!  :)
PASS
ok      github.com/squarism/credit_card 0.010s
{% endhighlight %}

What I'd probably want to do is use a library to help with the mocking setup. Previously I was trying to use a dependency injection style without interfaces and it didn't work out.

Imagine that my Charge() method signature looks more like this (from [joneisen.tumblr.com](http://joneisen.tumblr.com/post/53695478114/golang-and-default-values).

{% highlight go %}
func ChargeCustomer(args ...interface{})
// code to init args and defaults -- see blog post linked above
{% endhighlight %}

This doesn't work because type checking args breaks when you pass in a mock object with no interface. I'm not even sure if interfaces would fix this.

I was hoping to have a default value of the real type/struct and then in my test pass in a mock object. This is one nice side effect of default parameters and dependency injection. But that's dynamic language style that I have to teach myself to let go of.

Ok. Let's now using testify for mocking. Let's add a return value so we can test something.

`charge.go`

{% highlight go %}
...

func (v *VisaGateway) Charge() bool {
    fmt.Println("I am charging Visa -->")
    return true
}

type PaymentGateway interface {
    Charge() bool
}

func ChargeCustomer(g PaymentGateway) bool {
    return g.Charge()
}

func main() {
    gateway := NewVisaGateway()
    ChargeCustomer(gateway)
}

...
charge_test.go

package main

import (
    "github.com/stretchr/testify/assert"
    "github.com/stretchr/testify/mock"
    "testing"
)

type MockGateway struct {
    mock.Mock
}

func (m *MockGateway) Charge() bool {
    args := m.Mock.Called()
    return args.Bool(0)
}

func TestCharging(t *testing.T) {
    m := MockGateway{}
    m.On("Charge").Return(true)

    r := ChargeCustomer(m)
    m.Mock.AssertExpectations(t)

    assert := assert.New(t)
    assert.True(r, true)
}
{% endhighlight %}

The run result:

{% highlight bash %}
$ go test
PASS
ok      github.com/squarism/credit_card 0.018s
{% endhighlight %}

In the mocking example we also added m.Mock.AssertExpectations there.
That is additional test that captures and remembers the calls.  If
the wiring is wrong and the expected call is not called, the test will
fail.  For a while I was not testing this and I would have had a test
coverage gap.  Another mistake I made while figuring out the
AssertExpectations test was not passing by reference.  I continue to
make this mistake because I'm pointer-nooby.  For more information on
this see my [question on
stackoverflow](http://stackoverflow.com/questions/17125497/oo-style-struct-objects-in-go).

Ok, so that's my first foray with mocking in Go.  So here are some questions:

* Do you use a mocking library?
* Do you see how default arguments wouldn't work to help with mocking? You can't really DI. I'm ok with this. I just need to learn.
* Do you like interfaces for (not only) testing reasons?
* Do you like the interfaces version more than the mocking version?
* It seems that mocking really needs an interface somewhere? Otherwise won't you get a cannot use gateway (type *VisaGateway) as type PaymentGateway in argument to ChargeCustomer. I might have gotten this wrong from the testify docs. It wasn't obvious until I wrote this question.

If you have anything to say or answers to this question tweet me at
@squarism.

_... and once again, rubber ducking on stackoverflow. Writing the question made me figure it out._
