---
layout: post
status: published
published: true
title: The Docker Image Store Is Cache
date: 2021-11-05
---

When you type `docker images` you get a list of docker images on your system.  The image itself is basically a tar file with a content hash.  It's cryptographically guaranteed (like git) to be the content you want because of this hash.  You have a local image store because it's much faster to load content locally than over the internet.  So, in this way, docker images are a cache like any other cache.

```bash
$ docker images
REPOSITORY    TAG       IMAGE ID       CREATED         SIZE
<none>        <none>    77af4d6b9913   19 hours ago    1.089 GB
postgres      latest    746b819f315e   4 days ago      213.4 MB
```


## Cache Invalidation is Hard

What's the hardest problem with caching?  Expiration!  So knowing when to "expire" a docker image must be pretty tricky.  Spoiler: it is.  First, let's talk about why we'd want to expire or even manage our docker images to begin with.

Docker has this image store but in the beginning they didn't have a clear procedure for what you were supposed to do when you accumulate more and more images.  You either fill your physical disk on Linux or fill a virtual disk on Mac/Windows and then docker stops working.  There are [countless threads](https://github.com/docker/for-mac/issues/371) about the `qcow` file but there was never any guidance as to what people were supposed to do to manage the images.

Spotify created [a helper script called](https://github.com/spotify/docker-gc) `docker-gc` to help manage this problem.  It's been archived in favor of `docker system prune` but this is not a complete solution.  Removing images is like expiring the cache, the tricky part is knowing when to do so.

When you are building images, docker will print out intermediate steps as SHAs that you can enter and debug.  When you tag a SHA hash, you are tagging a `<none>`.  If you `docker system prune` then you could throw away data you care about and `image prune` is not much better.  More so, you are blowing away your cache so builds will take longer.  Spotify's docker-gc let you specify images you want to keep which is useful for the previous examples when you are making images.

Sometimes, people suggest cron'ing the prune so the disk never fills up.  If I cron `docker system prune` I'll lose data (or at least cache hits) every day and might not know why.  And it's still not solving expiring the cache.  Eventually your disk could fill up with tagged images and `system prune` will not have saved you.  Your image store is a cache and you can't tell if it's out of date or full of unused things.  What's worse is, given no running containers these prune commands will basically empty your image store.  So what's the point of the image store?

You could devise a way to filter docker images using Go templates but this is far too advanced for the use case Docker is aiming for.


## My Suggestions

I don't have a list of quick fixes for the difficult problem of cache invalidation.  However, in a perfect world:

1. Docker would run on all OS's natively so the disk usage would be more obvious.
2. Keep using docker-gc and ignore their advice.
3. Write an updater that works like `apt` where it tells you that your images are old.  This isn't easy but this is event-driven and not time-driven.  Event-driven caches are more precise.
4. Write an alternate utility that works like docker-gc using Go templates to tag and manage images.
5. Docker would provide tooling or some advice as to what to do when people use their product enough to fill their disk.
6. Run a local caching server to mitigate internet pulls?  You're still building all the time and losing partial images if you are cron'ing or running prune.
7. Do the typical cache shrug thing of using time as when to expire.  `docker system prune -af --filter "until=$((30*24))h"` You'll lose cache hits and lose data, just delayed.  At least you'll eventually get new images of `latest` I guess.

I hope this post explains a bit of what's really going on and why this is so tricky.  The docker image store is a cache.
