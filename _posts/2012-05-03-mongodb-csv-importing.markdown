---
layout: post
status: publish
published: true
title: MongoDB CSV importing
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 1575
wordpress_url: http://squarism.com/?p=1575
date: !binary |-
  MjAxMi0wNS0wMyAxMDo0OTo1MSAtMDQwMA==
date_gmt: !binary |-
  MjAxMi0wNS0wMyAxNTo0OTo1MSAtMDQwMA==
categories:
- Ruby
tags: []
comments: []
---
<p>Following this tutorial over at <a href="http://www.mongovue.com/2010/11/03/yet-another-mongodb-map-reduce-tutorial/">mongovue</a> about mapreduce in mongodb.  They have you export data from MySQL to MongoDB using their .NET tool.  I'm on a Mac so here's what I did instead.</p>
<p>If you followed the instructions, you have the .txt files (which are CSVs) in your MySQL data directory (weird but ok).  Importing CSV is really easy in MongoDB.  Just make sure you are in the directory with the .txt files.</p>
<p><code>
mongoimport -d geobytes -c cities --type csv --file cities.txt --headerline
mongoimport -d geobytes -c regions --type csv --file regions.txt --headerline
mongoimport -d geobytes -c dmas --type csv --file dmas.txt --headerline
mongoimport -d geobytes -c countries --type csv --file countries.txt --headerline
</code></p>
<p>Now you can continue with the tutorial.
<code>
> db.cities.findOne();
{
	"_id" : ObjectId("4fa2a734779f0ea93dd13df6"),
	"CityId" : 42231,
	"CountryID" : 1,
	"RegionID" : 833,
	"City" : "Herat",
	"Latitude" : 34.333,
	"Longitude" : 62.2,
	"TimeZone" : "+04:30",
	"DmaId" : 0,
	"Code" : "HERA"
}
</code></p>
