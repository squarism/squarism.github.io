---
layout: post
status: publish
published: true
title: Rbenv vs RVM
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 1611
wordpress_url: http://squarism.com/?p=1611
date: !binary |-
  MjAxMi0wOS0wOSAxODozODo0MyAtMDQwMA==
date_gmt: !binary |-
  MjAxMi0wOS0wOSAyMzozODo0MyAtMDQwMA==
categories:
- Ruby
tags: []
comments: []
---
![](/uploads/2012/09/bundler_px.png "bundler_px")
I used to use RVM with gemsets and loved it.  Wayne's work is amazing and way beyond any shell-fu I know.  I was super impressed as I started and used it for at least a year on my main dev box.

Then I upgraded ruby a few times and that was ok.  But then I sudo'd to root and got:
`# ~/.rvm does not exist (or something)`

Here are some things I didn't like:

*   Gemsets are great except when you are managing different global gemsets on different boxes.
*   Maybe you work on a project that maybe doesn't use RVM and you wonder if they really want an .rvm-gemset file in their project root.
*   I loved upgrading my default ruby using RVM until it failed and I had to recreate all gemsets and reinstall all gems.
*   Gemset exporting I never really got.</p>

## Rbenv is better?

So I've switched to no gemsets and rbenv.  I just use rbenv and ruby-build.  Rbenv seems to runs a lot lighter and doesn't complain on sudo.

## RVM is better?

RVM beats rbenv in gemsets though.  Rbenv gemsets don't have global so you have to create a pre-install rails just to `rails new`.  It's a chicken before the egg thing.  There's no global gemset so rails doesn't exist and you don't have a directory to create the .rbenv-gemsets file in.  So you have to create a tmp rails project with like the Rails 3.0 generator.  And then you have to upgrade that project or something.

**update:**This might not be true.  If you delete your .rbenv-gemsets file out of your home directory and make sure that each project has it's own gems installed then `gem` will be global and you can install/remove gems as normal.  So your global gemset is when `rbenv gemset active` returns nothing.

Upgrading ruby versions with rbenv does not import your gems.  So you have to wait until you need them and install them with `bundle` or pre-cd into each of your projects to install them?

So that's why I went with a third option.

## No Gemsets at all!

Bundler works but with no gemsets, you end up with a lot of dupe versions that don't hurt anything.  You can bundle exec foo and the correct version of foo will be loaded.  However, I do miss having clean gemsets.  This list grows and grows without end.
`
> gem search rails
*** LOCAL GEMS ***
rails (3.2.8, 3.2.2, 3.0.16)
`

Having dupe versions is kind of annoying after a while, especially if you wanted to create a mobile rails dev env on a usb key.  You don't know what your dependencies are.  Or do you?  You can go until a project with Bundler and do:
`
> bundle list
Gems included by the bundle:
  * abstract (1.0.0)
  * actionmailer (3.0.16)
  * actionpack (3.0.16)
  * activemodel (3.0.16)
  ...
`

Then I guess I could copy all the gems somewhere.  But it's not automatic.  With gemsets, each project was in a directory and I could just grab all the *.gem files.

## tl;dr

So there's pros and cons to each method.  I have no problems without gemsets but I don't have cleanliness.  I just don't know what the downside to having a messy system is.  Honestly, a patch to `gem` where gem list would just colorize the list from bundle list would be awesome.