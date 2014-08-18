---
layout: post
status: publish
published: true
title: Rspec output formats
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 1403
wordpress_url: http://squarism.com/?p=1403
date: !binary |-
  MjAxMS0xMS0xNyAxNzo1OToxNiAtMDUwMA==
date_gmt: !binary |-
  MjAxMS0xMS0xNyAyMjo1OToxNiAtMDUwMA==
categories:
- Ruby
tags: []
comments: []
---
<p>Some examples of rspec2 output formats.  If you are using Guard and Spork to speed up your test suite, you pass --format blah in the Guardfile.  For example:</p>

{% highlight ruby %}
guard 'rspec', :version => 2, :cli => '--drb --color --format doc' do
  watch(%r{^spec/.+_spec\.rb$})
  ...
end
{% endhighlight %}

<p>You can specify multiple formats with <code>--format one --format two</code>.</p>
<p>Anyway, here are some shots of what the output looks like:</p>
<p><code>--format doc</code>
<img src="/uploads/2011/11/rspec_format_doc.png" alt="" title="rspec_format_doc" width="480" height="113" class="aligncenter size-full wp-image-1404" /></p>
<p><code>--format progress</code>
<img src="/uploads/2011/11/rspec_format_progress.png" alt="" title="rspec_format_progress" width="348" height="69" class="aligncenter size-full wp-image-1407" /></p>
<p><code>--format nested --format progress</code>
<img src="/uploads/2011/11/rspec_format_progress_nested.png" alt="" title="rspec_format_progress_nested" width="487" height="130" class="aligncenter size-full wp-image-1408" /></p>
<p><code>--format nested</code>
<img src="/uploads/2011/11/rspec_format_nested.png" alt="" title="rspec_format_nested" width="485" height="91" class="aligncenter size-full wp-image-1406" /></p>
<p><code>--format html</code>
<img src="/uploads/2011/11/rspec_format_html.png" alt="" title="rspec_format_html" width="483" height="103" class="aligncenter size-full wp-image-1405" /></p>
<p>HTML format is also the same as the Textmate format.  I couldn't get the output to go to a file like the documentation says.  Maybe it hasn't been updated for rspec2?</p>
