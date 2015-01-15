---
layout: post
status: publish
published: true
title: Schemaless Data Collection
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 1421
wordpress_url: http://squarism.com/?p=1421
date: !binary |-
  MjAxMS0xMS0yNSAxMDozMjo1NCAtMDUwMA==
date_gmt: !binary |-
  MjAxMS0xMS0yNSAxNTozMjo1NCAtMDUwMA==
categories:
- Ruby
tags: []
comments: []
---
![](/uploads/2011/11/schemaless.png "schemaless")

I've had this idea for schemaless data collection for a while now.  It seems like everyone is trying to ETL data in.  Inevitably, people start writing mappers programs and documentation trying to build a massive Rosetta stone.  _"They call person_name name?  We'll call everything name.  Let's write this all down.  Person_name = name, so say we all."_  What happens is a lot of investigation and work in determining their ENTIRE schema just to make a copy of it.  In the case of XML parsing, sometimes I actually do need to know what the entire source looks like just so I can loop through it.  What a pain.  Not to mention if the source changes formats, I have to do all this work to re-understand their schema and change my mappers to reflect their change.  Maybe I even have to do a mass migration on my end to bring everything up to date.  Schemaless data collection will let you copy the data when the source changes and even be able to historically tell you when the schema changed.  In an RDBMS, this is impossible without blobs or something else horrible.

What this example shows is simply the collection of the data.  But the advantage here, I will show that any kind of querying can be done later very easily.  What I won't show is that normalization can be done in parallel and in batches later too and the whole thing lives in a horizontally scalable database.  Of course, the catch is, you need keys and a structured data source to start with.  This won't work with CSV and simple formats.

For example, if we wanted to load XML files into a database.  MongoDB is great for this because it can possibly make coding dead simple.  For each attribute and children, create attributes and children in the database.

In a normal database, I would have to parse out the XML file and create normalized rows all over the place or use blobs.  Of course blobs are useless for search.  Let me show you an example.

First, let's take a look at the XML returned by a [Wikipedia exporter URL](http://en.wikipedia.org/wiki/Special:Export/Ford_Motor) (trimmed the XSD line a bit for readability):

<pre lang="xml">
<mediawiki xmlns="http://www.mediawiki.org/xml/export-0.5/"
  xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
  xsi:schemaLocation="http://www.mediawiki.org/xml/export-0.5.xsd" version="0.5" xml:lang="en">
  <siteinfo>
    <sitename>Wikipedia</sitename>
    <base>http://en.wikipedia.org/wiki/Main_Page</base>
    <generator>MediaWiki 1.18wmf1</generator>
    <case>first-letter</case>
    <namespaces>
      <namespace key="-2" case="first-letter">Media</namespace>
      <namespace key="-1" case="first-letter">Special</namespace>
      <namespace key="0" case="first-letter" />
      <namespace key="1" case="first-letter">Talk</namespace>
      <namespace key="2" case="first-letter">User</namespace>
      <namespace key="3" case="first-letter">User talk</namespace>
      <namespace key="4" case="first-letter">Wikipedia</namespace>
      <namespace key="5" case="first-letter">Wikipedia talk</namespace>
      <namespace key="6" case="first-letter">File</namespace>
      <namespace key="7" case="first-letter">File talk</namespace>
      <namespace key="8" case="first-letter">MediaWiki</namespace>
      <namespace key="9" case="first-letter">MediaWiki talk</namespace>
      <namespace key="10" case="first-letter">Template</namespace>
      <namespace key="11" case="first-letter">Template talk</namespace>
      <namespace key="12" case="first-letter">Help</namespace>
      <namespace key="13" case="first-letter">Help talk</namespace>
      <namespace key="14" case="first-letter">Category</namespace>
      <namespace key="15" case="first-letter">Category talk</namespace>
      <namespace key="100" case="first-letter">Portal</namespace>
      <namespace key="101" case="first-letter">Portal talk</namespace>
      <namespace key="108" case="first-letter">Book</namespace>
      <namespace key="109" case="first-letter">Book talk</namespace>
    </namespaces>
  </siteinfo>
<page>
    <title>Ford Motor</title>
    <id>255240</id>
    <redirect />
    <revision>
      <id>16130856</id>
      <timestamp>2003-06-30T02:32:03Z</timestamp>
      <contributor>
        <username>Infrogmation</username>
        <id>4444</id>
      </contributor>
      <minor/>
      <comment>redir</comment>
      <text xml:space="preserve" bytes="32">#REDIRECT [[Ford Motor Company]]</text>
    </revision>
  </page>
</mediawiki>
</pre>

Even though this page is just a redirect (see the text element at the end in mediawiki markup), it's still very long.  For a multitude of posts or documents, creating a mapper and tightly handling the document might be very annoying.  Even worse, we might delay sucking data in because there is so much mapping work to do.  We might even start writing documents detailing the source format, what we will call the attributes internally and document schema changes as they occur.

What I propose is to forget all that mapping and just load the document as-is.  We will use a document database (MongoDB) to make this magic happen.

{% highlight ruby %}
# we are going to intentionally use the vanilla mongo driver
require 'mongo'
require 'nokogiri'
require 'open-uri'
require 'active_support/core_ext' # from rails

include Mongo
pages = Connection.new('localhost', 27017).db('loadtest').collection('pages')

wikipedia_page = "http://en.wikipedia.org/wiki/Special:Export/Ford_Motor"

# noblanks is magic here?  had problems without it
doc = Nokogiri::XML(open(wikipedia_page)) { |config| config.noblanks }
page = Hash.from_xml(doc.to_s)    # here's the magical method from rails
pages.insert page
{% endhighlight %}

Ok this is pretty cool.  In 10 lines of ruby, I'm downloading an XML file and inserting it into a new collection called 'pages' in a database that hasn't even been created (as long as mongodb is running).  Great!  But it quickly falls apart.

If you run it again, you now have two documents (rows) in Mongo.  Boo.  Not to mention, if you actually query mongo you see this (trimmed the XSD line a bit for readability):

<pre lang="javascript">
> db.pages.find()
{
   "_id":ObjectId("4ec6c07e5a498d64a1000001"),
   "mediawiki":{
      "xmlns":"http://www.mediawiki.org/xml/export-0.5/",
      "xmlns:xsi":"http://www.w3.org/2001/XMLSchema-instance",
      "xsi:schemaLocation":"http://www.mediawiki.org/xml/export-0.5.xsd",
      "version":"0.5",
      "xml:lang":"en",
      "siteinfo":{
         "sitename":"Wikipedia",
         "base":"http://en.wikipedia.org/wiki/Main_Page",
         "generator":"MediaWiki 1.18wmf1",
         "case":"first-letter",
         "namespaces":{
            "namespace":[
               "Media",
               "Special",
               {
                  "key":"0",
                  "case":"first-letter"
               },
               "Talk",
               "User",
               "User talk",
               "Wikipedia",
               "Wikipedia talk",
               "File",
               "File talk",
               "MediaWiki",
               "MediaWiki talk",
               "Template",
               "Template talk",
               "Help",
               "Help talk",
               "Category",
               "Category talk",
               "Portal",
               "Portal talk",
               "Book",
               "Book talk"
            ]
         }
      },
      "page":{
         "title":"Ford Motor",
         "id":"255240",
         "redirect":null,
         "revision":{
            "id":"16130856",
            "timestamp":"2003-06-30T02:32:03Z",
            "contributor":{
               "username":"Infrogmation",
               "id":"4444"
            },
            "minor":null,
            "comment":"redir",
            "text":"#REDIRECT [[Ford Motor Company]]"
         }
      }
   }
}</pre>

There's a whole lot of metadata in there and really all I care about is the content (maybe).  So in some cases, you might want to filter incoming data.  I have to actually look at my data and pick which attributes I want.  Now I'm tightly bound to the source document and have to worry about it changing etc.

But let's do it anyway.  All we have to do is change one line:

{% highlight ruby %}
pages.insert page["mediawiki"]["page"]
{% endhighlight %}

Now our inserted document looks like this:

<pre lang="javascript">
> db.pages.find()
{
   "_id":ObjectId("4ec6c1775a498d64f2000001"),
   "title":"Ford Motor",
   "id":"255240",
   "redirect":null,
   "revision":{
      "id":"16130856",
      "timestamp":"2003-06-30T02:32:03Z",
      "contributor":{
         "username":"Infrogmation",
         "id":"4444"
      },
      "minor":null,
      "comment":"redir",
      "text":"#REDIRECT [[Ford Motor Company]]"
   }
}
</pre>

Of course, we had to clear out the pages collection and re-run it.  That's just because we haven't written any logic yet to check for existence yet.  But let's take a break here and talk about what we could do even with this piddly little bit of 10 lines of Ruby running.  We can query:

<pre lang="javascript">
> db.pages.find({}, {'title':1} )
{ "_id" : ObjectId("4ec6c1775a498d64f2000001"), "title" : "Ford Motor" }
{ "_id" : ObjectId("4ecafffd5a498d0136000001"), "title" : "Nissan" }
</pre>

Here we are just showing that we have two pages from Wikipedia stored.  The title:1 is like `SELECT title FROM pages;` in SQL.  So if we wanted to search on attributes, it's pretty easy:

<pre lang="javascript">
> db.pages.find({ title:/^N/ }, {title:1})
{ "_id" : ObjectId("4ecafffd5a498d0136000001"), "title" : "Nissan" }
</pre>
It's pretty forgiving on the key quotes.

In the next part, we'll dive into handling updates and other formats.