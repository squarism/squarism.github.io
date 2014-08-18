---
layout: post
status: publish
published: true
title: Ruby p385 benchmarks
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 1814
wordpress_url: http://squarism.com/?p=1814
date: !binary |-
  MjAxMy0wMi0xNiAxNDoxNDo1NiAtMDUwMA==
date_gmt: !binary |-
  MjAxMy0wMi0xNiAxOToxNDo1NiAtMDUwMA==
categories:
- Ruby
tags: []
comments: []
---
<p><img src="/uploads/2013/02/pixel-ribbon_electric_fun.png" alt="pixel-ribbon_electric_fun" width="576" height="24" class="aligncenter size-full wp-image-1991" /></p>
<p>I was playing around with the falcon p385 patch to see if it's any faster than some of the more recent MRI rubies.
<strong>TL;DR version: looks like p192 is faster than p385 of any type or tweak.</strong></p>
<p>Here's how to get a p385 Ruby version patched with funny falcon's performance patches using RVM.
<code>
mkdir ~/.rvm/patches/ruby/1.9.3/p385
curl https://github.com/funny-falcon/ruby/compare/p385...p385_falcon.diff > \
$rvm_path/patches/ruby/1.9.3/p385/falcon.patch
rvm install 1.9.3-p385 -n perf --patch falcon
</code>
Then rvm use 1.9.3-p385-perf or set it as your global ruby.  </p>
<h3>Test Setup</h3><p>
The following benchmarks were run on an i7 server with a RAID5 array.  The disk is slow (lack of large cache) but the benchmarks were run on the same box so it should compare apples-to-apples.</p>
<p>From here on out, here are the definitions for the Ruby versions.
p194 = 1.9.3p194 default
p385 = 1.9.3p385 default
falcon = 1.9.3p385 with the above falcon diff patch applied
gcc_tweak = the falcon patches with GCC compile flags tweaked.</p>
<p>So what are these GCC tweaks?  Explicitly setting the CFLAGS for your machine's CPU type and recompiling ruby with the Falcon patches applied.</p>
<h3>Micro and Macro Benchmarks</h3><p>
I used the <a href="https://github.com/acangiano/ruby-benchmark-suite">ruby-benchmark-suite</a> to run these tests.</p>
<p>Here are some example results.  I can't list them all.  There are over 100 benchmarks.  These are results for the mean times in seconds.</p>
<table>
<th>test</th></p>
<th>1.9.3p194</th></p>
<th>1.9.3p385</th></p>
<th>falcon</th></p>
<th>gcc_tweak</th></p>
<tr>
<td>bm_sudoku.rb</td></p>
<td>1.379112226</td></p>
<td>1.598182153</td></p>
<td>1.495923579</td></p>
<td>1.526717563</td>
</tr></p>
<tr>
<td>bm_open_many_files.rb</td></p>
<td>0.175602996</td></p>
<td>0.197096826</td></p>
<td>0.197673286</td></p>
<td>0.194135045</td>
</tr></p>
<p></tr>
<td>... etc etc</td></tr></p>
<p></table></p>
<p>Here's the winner summary for mean times.  This is the number of times the ruby version was the fastest for a particular benchmark.
1.9.3p194 - 64 wins
1.9.3p385 - 29 wins
1.9.3p385-falcon with GCC tweaks - 10 wins
1.9.3p385-falcon 5 wins</p>
<h3>Boot time and IO</h3><p>
Timing rails boot time is a bit more important to me.  If you want to know how to really save "rails boot time" see the <a href="https://www.destroyallsoftware.com/screencasts/catalog/fast-tests-with-and-without-rails">DAS screencast on not loading Rails at all</a>.</p>
<p>Even when using domain objects and lib tricks, it's nice to have Rails and all I/O boot fast.  The main thing that funny falcon's patches do is speed up requires and I/O.</p>
<p>So let's benchmark booting a Rails app.
$ time bundle exec rake environment</p>
<table>
<th>Ruby Version</th>
<th>Seconds</th></p>
<tr>
<td>p385 patched with falcon and GCC tweaks</td>
<td>2.481 total</td></tr></p>
<tr>
<td>p374 defaults</td>
<td>3.336 total</td></tr></p>
<tr>
<td>2.0.0-rc2</td>
<td>2.613 total</td></tr>
</table></p>
<p>In conclusion, p194 looks faster on the macro and micro benchmarks but Falcon patches boot Rails faster.</p>
