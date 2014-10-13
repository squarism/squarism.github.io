---
layout: post
status: draft
published: false
title: Analyzing Shell Typos
---
Let's create a list of our most common typos on the shell.  First, let's
go over the algorithm.

1. Find all the single word commands from our shell history.  (We are cheating here to avoid complexity)
1. Uniq the list to find a list of commands we've typed.
1. Compare this list against everything in our $PATH plus built-ins.  Call this typos.
1. Count typos in history.
1. Sort.

This is shell-scripty stuff so let's do it in Ruby.
