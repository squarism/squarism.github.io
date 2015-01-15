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
Some examples of rspec2 output formats.  If you are using Guard and Spork to speed up your test suite, you pass --format blah in the Guardfile.  For example:

{% highlight ruby %}
guard 'rspec', :version => 2, :cli => '--drb --color --format doc' do
  watch(%r{^spec/.+_spec\.rb$})
  ...
end
{% endhighlight %}

You can specify multiple formats with `--format one --format two`.

Anyway, here are some shots of what the output looks like:

`--format doc`
![](/uploads/2011/11/rspec_format_doc.png "rspec_format_doc")

`--format progress`
![](/uploads/2011/11/rspec_format_progress.png "rspec_format_progress")

`--format nested --format progress`
![](/uploads/2011/11/rspec_format_progress_nested.png "rspec_format_progress_nested")

`--format nested`
![](/uploads/2011/11/rspec_format_nested.png "rspec_format_nested")

`--format html`
![](/uploads/2011/11/rspec_format_html.png "rspec_format_html")

HTML format is also the same as the Textmate format.  I couldn't get the output to go to a file like the documentation says.  Maybe it hasn't been updated for rspec2?