---
layout: post
status: publish
published: true
title: SVN vs Git Speed
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 1754
wordpress_url: http://squarism.com/?p=1754
date: !binary |-
  MjAxMi0xMC0xMiAyMjowMDo1NyAtMDQwMA==
date_gmt: !binary |-
  MjAxMi0xMC0xMyAwMzowMDo1NyAtMDQwMA==
categories:
- Development
tags: []
comments: []
---
<p><img src="/uploads/2012/10/git_logo-300x125.png" alt="" title="git_logo" width="300" height="125" class="alignright size-medium wp-image-1758" />
This is a bit of shooting fish in a barrel but I really wanted to see if for myself.  After using SVN for many years, I knew Git was fast.  Funny enough, I didn't know SVN was slow until I saw Git was fast.  Hah.</p>
<p>Anyway, I wrote a script that does this:</p>
<ul>
<li>Creates a repo</li>
<li>Unzips Linux 3.6.1 source</li>
<li>Add all files / commit all files</li>
<li>Branch / Modify / Commit / Merge (3 times)</li>
<li>Cleans up branches, cleans up temp directories</li>
</ul></p>
<p>The Linux kernel source is 79MB, ~42,000 files.  So this is a bit excessive.  You probably won't be working with a project this large.  However, it's a good way to show speed and performance.</p>
<p>The other interesting thing that I found while doing this test is how much longer my SVN script turned out to be.  Both scripts do the same thing but the Git script was much shorter.  So in a way, Git seems to be faster and easier (or at least less typing) at the same time.</p>
<p>A note about the benchmarks.  The Raid 5 test was done on a web server with a Raid controller that has very little cache.  No question that these spinning disks are a bit slow under load.  However, the tests were done on the same box so it's still a fair comparison.  The SSD row is a virtual ubuntu machine on an SSD; a different machine all together.</p>
<p><strong>Benchmark Times mm:ss</strong></p>
<table>
<th>Disk type</th>
<th>SVN</th>
<th>Git</th></p>
<tr>
<td>Raid5</td>
<td>14:56</td>
<td>01:08</td>
</tr></p>
<tr>
<td>SSD</td>
<td>17:12</td>
<td>02:09</td>
</tr>
</table></p>
<p>Git has a bit of an advantage by doing 3 branches because it does its garbage collection only once on the first merge.  So I apologize for the bias.  I can say for sure that the one branch test was something like this: SVN 20min, Git 2min.</p>
<p>Here are the links to the scripts I wrote if you want to try them yourself.
<a href="https://gist.github.com/3882985">svn_stress.sh</a>
<a href="https://gist.github.com/3882986">git_stress.sh</a></p>
<p>Run the scripts with the time command:</p>
<pre lang="bash">
$ time ./svn_stress.sh /tmp/stress_test
233.78s user 81.81s system 35% cpu 14:56.48 total
</pre></p>
