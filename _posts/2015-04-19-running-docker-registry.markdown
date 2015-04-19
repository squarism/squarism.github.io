---
layout: post
status: published
published: true
title: How to Run the Docker Registry 2.0
date: 2015-04-19
---

The docker registry is a daemon/service that you can run privately to push and pull images locally.  This is fantastic for sharing images within a team, caching images locally and hacking on docker without polluting the world.  There's been a python version of the docker registry for some time but recently there has been work to rewrite it in golang.  I've been waiting for the golang port because go projects are usually very easy to install and provide binaries.

Running the docker registry 2.0 (hereafter called Distribution) isn't intuitive.  Typically on github you'll do something like this:

{% highlight bash %}
git clone https://github.com/bleh/bleh
cd bleh
# ./configure && make | go run bleh.go | bundle && rake | pip install -r requirements.txt | bower
# or something ...
{% endhighlight %}

That doesn't work here.  Distribution is expecting to be in a go workspace.  That means that this doesn't work:

{% highlight bash %}
cd ~/src/vendor
git clone https://github.com/docker/distribution
cd distribution
# oooh there's a Makefile!
make

../../go/src/github.com/docker/distribution/manifest/verify.go:6:2:
cannot find package "github.com/Sirupsen/logrus" in any of:
{% endhighlight %}

Oh!  It's using godep.  We'll just grab the dependencies.

{% highlight bash %}
$ godep get
  can't load package: package ~/src/vendor/distribution: cannot find package "~/src/vendor/distribution"
  in any of:
{% endhighlight %}

Hmm.  That doesn't work either.  Well I know we could probably `go get` the whole thing but that's going to put binaries in a golang workspace path.  I kind of just want binaries in the current working directory.  I'm not really sure what the intent here is.  Distribution comes with a `Dockerfile` so I'm assuming that this is the best option to getting it up and running on a server somewhere without having to set up a temporarity golang dev environment (language runtimes as program distribution anti-pattern).

## More Than One Way To Do It

### We can run docker build Dockerfile

{% highlight bash %}
$ git clone https://github.com/docker/distribution
$ cd distribution
$ docker build .
{% endhighlight %}

The problem with this approach is that it gives us an image that we have to further customize.  The binary `registry` isn't in the path and godeps is in a special work dir as specified by the `Dockerfile`.

{% highlight bash %}
$ ls /go/src/github.com/docker/distribution/Godeps/_workspace/bin
godep
{% endhighlight %}

So we could go down that road but you'll have to commit the changes and tag it yourself.


### We can go get it

If we do this:

{% highlight bash %}
$ go get github.com/docker/distribution
{% endhighlight %}

This will put a binary in our path somewhere but then we'll have to put it on a server.  This also requires us to `cd` into our gopath workspace and copy a binary.  Alternatively we could clone Distribution into a tmp golang workspace but this is effectively the same thing just in a different location.

Originally this is how I tried but later realized it's worse than below (thoughts anyone?).


### We can pull the registry from docker hub

{% highlight bash %}
# create some directories - change to your tastes
$ mkdir /opt/docker_data/registry
$ cd /opt/docker_data
$ wget https://raw.githubusercontent.com/docker/distribution/master/cmd/registry/config.yml
$ mv config.yml registry.yml

$ docker run -d -p 5000:5000 -e STORAGE_PATH=/registry -v \
  /opt/docker_data:/data -v /opt/docker_data/registry:/registry \
  --restart=always --name docker_registry registry:2.0 /data/registry.yml

# set it to autostart, bob's your uncle
# see below for usage with boot2docker
{% endhighlight %}

This is pretty nice.  We have to be careful to specify the `registry:2.0` tag in order to get the golang version.  Latest will grab the python version.  You can see this if you run the image interactively (not sure the 2.0 can be run interactively because of `ENTRYPOINT` -- but there's your clue).


### Boot2Docker and insecure-registry

Once you are running a private registry, it's up to you to generate an SSL cert.  If you are on mac, you don't even have a _docker daemon_ locally so this part is confusing.  When you push to your registry, you'll get a warning/error.

    FATA[0000] Error response from daemon: v1 ping attempt failed with error: Get https://hostname:5000/v1/_ping: tls: oversized record received with length 20527. If this private registry supports only HTTP or HTTPS with an unknown CA certificate, please add `--insecure-registry hostname:5000` to the daemon's arguments. In the case of HTTPS, if you have access to the registry's CA certificate, no need for the flag; simply place the CA certificate at /etc/docker/certs.d/hostname:5000/ca.crt

This is like your browser warning message on a unknown self-signed cert.  But how do we add an exception?  The official [boot2docker docs](https://github.com/boot2docker/boot2docker) have an answer but I have an addition.  Add the port number to the hostname.  If you server is called `bleep` then add `bleep:5000` to the boot2docker image file at `/var/lib/boot2docker/profile`

{% highlight bash %}
# on your mac
$ boot2docker ssh "echo $'EXTRA_ARGS=\"--insecure-registry bleep:5000\"' | sudo tee -a /var/lib/boot2docker/profile && sudo /etc/init.d/docker restart"

# now you can push
$ docker push bleep:5000/busybox
The push refers to a repository [bleep:5000/busybox] (len: 1)
8c2e06607696: Image already exists
6ce2e90b0bc7: Image successfully pushed
cf2616975b4a: Image successfully pushed
Digest: sha256:3cc6b183efb34ff773f81ce230362ef67288375fdeb9cc8d50c221820fbe5e3b

# testing
$ docker run -it --rm bleep:5000/busybox /bin/busybox env

# on the host
$ ls /opt/docker_data/registry/docker/registry/v2/repositories
busybox
{% endhighlight %}


### Deleting Images

I couldn't get this to work.  I commented on [an issue](https://github.com/docker/docker-registry/issues/988#issuecomment-94318312), someone had the same question as me.

{% highlight bash %}
$ curl -XGET http://private-host:5000/v2/busybox/manifests/latest
# GET included for effect only  :)
{% endhighlight %}

The API doc says that DELETE should work. So I just substitute above and get:

{% highlight bash %}
$ curl -XDELETE http://private-host:5000/v2/busybox/manifests/latest
{"errors":[{"code":"UNSUPPORTED","message":"The operation is unsupported."}]}
{% endhighlight %}

So I'm not sure what's up there.


## Sidenote

I ran into a weird issue while testing Distribution on ubuntu.

    FATA[0000] Error response from daemon: Cannot start container
    aa2a7765d5c67625fea17f1c5f0d8b90216418d44db95df5268822d8e3bcf21e: write /sys/fs/cgroup/cpu/docker/
    aa2a7765d5c67625fea17f1c5f0d8b90216418d44db95df5268822d8e3bcf21e/cgroup.procs: no space left on device

My disk has plenty of space.  `docker info` shows it using aufs which I believe doesn't have the same disk space limits that devicemapper (like CentOS) has.  By that, I mean the docker host + kernel combination.  I'm actually not sure of where that interaction lies.  I just know that `docker info` on different kernels show different output.

So how do I start over?  I have my docker data in a docker directory.  For this case, when all your data is safe and secure then you can just blow away everything and start over.  For me, this was the fix.  I had some package garbage (docker.io and lxc-docker packages installed).  So I `apt-get remove --purge`-d everything and installed docker 1.6 through apt-get.  That fixed this weird problem and kept my containers/data in tact.

## Conclusion

The docker image is the best way to run the registry but it requires a tiny bit of setup beforehand.  There's also some things that aren't covered here:

* SSL cert
* Logstash support is mentioned as an output format
* Redis caching
* Authentication / reverse proxy / webgate

Regardless, happy to see a golang version of the registry.

