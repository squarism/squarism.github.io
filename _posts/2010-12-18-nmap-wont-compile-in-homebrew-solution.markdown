---
layout: post
status: publish
published: true
title: Nmap won't compile in homebrew solution
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 825
wordpress_url: http://squarism.com/?p=825
date: !binary |-
  MjAxMC0xMi0xOCAwMToxMToyNCAtMDUwMA==
date_gmt: !binary |-
  MjAxMC0xMi0xOCAwNjoxMToyNCAtMDUwMA==
categories:
- Development
- Unix
- Mac
tags: []
comments: []
---
<p><img src="/uploads/2010/12/nmap_homebrew-300x180.png" alt="" title="nmap_homebrew" width="300" height="180" class="alignright size-medium wp-image-827" />I recently moved my Mac Pro dev box to homebrew from macports.  Doing the mysql move (the lazy way -- moving the data directory) was easy enough but doing a massive `brew install` of a bunch of packages didn't work when I got to <a href="http://nmap.org/">nmap</a> (the network port scanner).</p>
<p>Specifically the linker error (maybe the linker ... looks to a stacktrace to a Ruby and Java guy) was this:</p>
<pre>Undefined symbols:
  "ScriptResult::get_id() const", referenced from:
      formatScriptOutput(ScriptResult)       in output.o
      printhostscriptresults(Target*)     in output.o
      printportoutput(Target*, PortList*)    in output.o
  "ScriptResult::get_output() const", referenced from:
      formatScriptOutput(ScriptResult)       in output.o
      printhostscriptresults(Target*)     in output.o
      printportoutput(Target*, PortList*)    in output.o
  "open_nse()", referenced from:
      nmap_main(int, char**)in nmap.o
  "close_nse()", referenced from:
      nmap_free_mem()     in nmap.o
  "script_scan(std::vector<Target*, std::allocator<Target*> >&)", referenced from:
      nmap_main(int, char**)in nmap.o
ld: symbol(s) not found
collect2: ld returned 1 exit status
make[1]: *** [nmap] Error 1
make: *** [all] Error 2
Exit status: 2</p>
<p>http://github.com/mxcl/homebrew/blob/master/Library/Formula/nmap.rb#L1
Error: Failure while executing: make
Please report this bug at http://github.com/mxcl/homebrew/issues
These existing issues may help you:
http://github.com/mxcl/homebrew/issues/#issue/3128
</pre></p>
<p>I love the little URL for more help at the bottom, unfortunately a redirect killed the help.  The correct URL is <a href="https://github.com/mxcl/homebrew/issues/3128">here</a>.  Maybe an anchor tag in the wrong place on the URL, who knows.  Anyway, I posted a note on the issue site as well, I got around the issue by doing this first:
<code>brew install lua</code></p>
<p>Then just install nmap like before:
<code>brew install nmap</code></p>
<p>Worked for me.</p>
