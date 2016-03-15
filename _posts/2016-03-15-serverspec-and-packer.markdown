---
layout: post
status: published
published: true
title: Serverspec and Packer
date: 2016-03-15
---

Thoughtbot [has an excellent and much desired article](https://robots.thoughtbot.com/tdd-your-dockerfiles-with-rspec-and-serverspec) on getting Docker + Rspec + Serverspec wired up but I couldn't find anything about images generated from Packer.  Packer generates its own images and so we can't just `build_from_dir(.)`.  Our images are already built at that point.  We're using Packer to run Chef and other things beyond what vanilla Docker can do.

The fix is really simple after I was poking around in pry looking at the serverspec API.

First of all, what am I even talking about?  [Serverspec](http://serverspec.org/) is like rspec for your server.  It has matchers and objects like

{% highlight text %}
describe file('/etc/passwd') do
  it { should exist }
end

describe file('/var/run/unicorn.sock') do
  it { should be_socket }
end
{% endhighlight %}

So although we have application tests of varying styles and application
monitors, serverspec allows us to test our server just like an integration test
before we deploy.  I had previously tried to go down this route with test
kitchen to test our chef recipes but it was sort of picky about paths.
Additionally, going with serverspec and docker doesn't even require Chef.  Chef
has already been run at this point!  What this means is _fast tests_.  Just
booting a docker image and running a command is fast.


{% highlight text %}
# single test
$ time bundle exec rspec
1.415 total
{% endhighlight %}

Nice!

So how does this work?  Well, like I said the thoughtbot article is really good but I wanted to add to the
'net about packer specifcally.  The critical piece to make Serverspec work with a Docker image
created from Packer is in your spec itself (`spec/yer_image_name/yer_image_name_spec.rb`).


{% highlight ruby %}
# spec_helper and a lot of spec/ came from `serverspec-init1`

require 'spec_helper'
require "docker"


describe "yer_packer_image" do

  before(:all) do
    image = Docker::Image.get("yer_package_image")

    set :os, family: :debian   # this can be set per spec
    # describe package('httpd'), :if => os[:family] == 'redhat' do
    #   it { should be_installed }
    # end

    set :backend, :docker
    set :docker_image, image.id
  end

  it "has bash installed" do
    expect(package("bash")).to be_installed
  end

end
{% endhighlight %}


See that `image = Docker::Image.get("yer_package_image")` bit in the before block?  This 
is the difference between _build my image_ (what the thoughtbot article uses)
and _run an existing image_.  Since packer builds the image, we can just reuse
the one we have from our local store.  Then later `:docker_image, image.id` sets
the image to use during the test.  It knows about docker because of `require "docker"` from
serverspec.  I'll mention what versions of these gems I'm using at the time of this post
since this might bit-rot.

{% highlight text %}
docker-api (1.26.2)
rspec (3.4.0)
serverspec (2.31.0)
specinfra (2.53.1)  # from serverspec
{% endhighlight %}

## An idea that didn't work

Ok this is cool!  How about we have packer run our tests after the
`packer build`.  **Unfortunately** this is mostly useless.  :( The tests will run but
they won't do anything if the tests fail.

Here's the post-processor bit of our packer config.  It just tells Packer
to do things after it's done building.  The first bit is _tag our image_ so we can
push it out to our registry.

{% highlight json %}
  "post-processors": [
    [
      {
        "type": "docker-tag",
        "repository": "your-company/yer_packer_image",
        "tag": "latest",
        "force": true
      },
      {
        "type": "shell-local",
        "inline": ["bundle exec rspec ../../spec/yer_packer_image"],
        "_useless": "don't do this"
      }
    ]
  ]
{% endhighlight %}

The path structure is arbitrary above.  We have a project we're currently
working on that I'll explain in another blog post or talk.  The only specifics
about this file structure is that typically you'd want to do something like
`require 'spec_helper'` but if you are building an image from a subdirectory
and then running tests from another nested subdirectory then you'll need to
`require_relative 'spec_helper'`.  I actually don't know why this isn't the
default anyway.

But like I said, running tests with Packer as a post processor doesn't do
anything.  You could run it with PACKER_DEBUG or something but I don't like any
of that.  I'll be following up with a more complete workflow as we figure this
out.  So you don't need to do this last bit with the post-processors.  I just
wanted to leave a breadcrumb for myself later.
