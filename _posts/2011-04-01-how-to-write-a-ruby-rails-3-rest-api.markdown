---
layout: post
status: publish
published: true
title: How to write a Ruby and Rails 3 REST API
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
excerpt: ! "<img src=\"/uploads/2011/04/pixel-ribbon_feet.png\"
  alt=\"pixel-ribbon_feet\" width=\"576\" height=\"24\" class=\"aligncenter size-full
  wp-image-2083\" />\r\n\r\n<h2>Background</h2>\r\nI've always wondered how
  I'd go about publishing a real REST API on the web to do something.  In this example,
  we'll create an employee manager app-thing.  It's not particularly interesting but
  it shows what \"API\" means.  In another bit, we'll create an \"API\" meaning a
  library to interact with this web service.\r\n\r\n<h2>Caveats</h2>\r\nIf you
  are just getting started with Rails and Ruby, you might find that this tutorial
  is really long and includes a lot of syntax.  I love Rails to death but many people
  say it has a \"large surface area\".  That means that it's hard to learn and the
  API is broad and vast.\r\n\r\nAs an alternative, I suggest taking a look at <a href=\"https://github.com/intridea/grape\">Grape</a>
  and <a href=\"http://www.sinatrarb.com/\">Sinatra</a> if you are
  finding Rails to be a little too heavy.  However, make sure you read up on what
  features you will lose when going thinner.  It's not always clear and you might
  find things like autoreloading were assumed in Rails but now you have to get a plugin
  for Sinatra (or Grape).  BTW, I think Grape by Intridea is the better Web API framework
  at least vs Sinatra.  For pure APIs, it may be better suited for the job than stripping
  down Rails.\r\n\r\n<h2>The rails app</h2>\r\nOk enough caveats and intro.  First,
  create a new rails app.  I'm going to assume you have RVM installed and know how
  to create gemsets.\r\n<code>rails new rest_api</code>\r\n<code>cd rest_api</code>\r\n\r\n<strong>update:</strong>This
  was last tested with 3.2.12.\r\n\r\n<h2>Database setup</h2>\r\nIn this example
  we are going to use Sqlite3 but you can easily substitute MySQL or some other database
  here.  To keep this post on topic and short, we'll use the sqlite3 default for spiking.\r\n\r\n"
wordpress_id: 1131
wordpress_url: http://squarism.com/?p=1131
date: 2011-04-01
categories:
- Ruby
- Rails
tags: []
comments:
- id: 5884
  author: mpurdy
  author_email: mpurdy@keywcorp.com
  author_url: ''
  date: !binary |-
    MjAxMS0wNC0xMSAxODo0ODozOCAtMDQwMA==
  date_gmt: !binary |-
    MjAxMS0wNC0xMSAyMzo0ODozOCAtMDQwMA==
  content: ! "create tutorial!\r\n\r\ni am new to ruby/rails (come from a c/c++/corba,
    java/rmi/jee/spring background).\r\n\r\neverything was easy to understand
    and everything ran as define with the exception of the client.\r\n\r\ni had to
    add the require 'rubygems' before it would run (see below).  however, i am using
    snow leapord with ruby 1.8.7 and gem 1.3.7\r\n\r\nrequire './lib/api.rb'\r\nrequire
    'rubygems'\r\nrequire 'nokogiri'\r\n\r\nagain great tutorial; just added in case
    someone else had the same problem."
- id: 5885
  author: Dillon
  author_email: dillon@squarism.com
  author_url: http://
  date: !binary |-
    MjAxMS0wNC0xMSAyMTozNjozMSAtMDQwMA==
  date_gmt: !binary |-
    MjAxMS0wNC0xMiAwMjozNjozMSAtMDQwMA==
  content: That's true.  1.8.7 needs the rubygems require.  1.9 does not.  Thanks
    for the feedback!
- id: 6618
  author: SQUARISM &Acirc;&raquo;until lambs become lions How to write a Ruby and
    Rails 3 REST API &laquo; Chandara
  author_email: ''
  author_url: http://lchandara.wordpress.com/2011/08/13/squarism-%c2%bbuntil-lambs-become-lions-how-to-write-a-ruby-and-rails-3-rest-api/
  date: !binary |-
    MjAxMS0wOC0xMiAyMzozNjo0NCAtMDQwMA==
  date_gmt: !binary |-
    MjAxMS0wOC0xMyAwNDozNjo0NCAtMDQwMA==
  content: ! '[...] : http://squarism.com/2011/04/01/how-to-write-a-ruby-rails-3-rest-api/  0.000000
    0.000000 Share this:FacebookTwitterLinkedInEmailPrintLike this:LikeBe the first
    to like [...]'
- id: 6621
  author: Ronaldo
  author_email: ronjr.paiva@gmail.com
  author_url: ''
  date: !binary |-
    MjAxMS0wOC0xNCAxOTozMjo0MSAtMDQwMA==
  date_gmt: !binary |-
    MjAxMS0wOC0xNSAwMDozMjo0MSAtMDQwMA==
  content: ! "Hi.\r\nThank you so much. This example helps a lot.\r\nA question: i
    could send the xml file to web service built in .net, for example?"
- id: 6622
  author: Dillon
  author_email: dillon@squarism.com
  author_url: http://
  date: !binary |-
    MjAxMS0wOC0xNSAwOToxOTozMiAtMDQwMA==
  date_gmt: !binary |-
    MjAxMS0wOC0xNSAxNDoxOTozMiAtMDQwMA==
  content: ! '@Ronaldo, Yes you can use webservices to bridge languages.  .NET can
    consume a webservice as a REST client and Rails can serve the REST service.'
- id: 6628
  author: Ronaldo
  author_email: ronjr.paiva@gmail.com
  author_url: ''
  date: !binary |-
    MjAxMS0wOC0yMCAxNDoxOTozNCAtMDQwMA==
  date_gmt: !binary |-
    MjAxMS0wOC0yMCAxOToxOTozNCAtMDQwMA==
  content: ok, rigth. thanks!
- id: 6718
  author: Chris
  author_email: h8windows@gmail.com
  author_url: ''
  date: !binary |-
    MjAxMS0xMC0yNiAxMTo1NTowNSAtMDQwMA==
  date_gmt: !binary |-
    MjAxMS0xMC0yNiAxNjo1NTowNSAtMDQwMA==
  content: ! '"Now run with ruby api_client.rb and you should see:" I''ve obviously
    missed something. If I run read from terminal in /rest_api, it just looks
    at me. What am I supposed to run?'
- id: 6719
  author: Dillon
  author_email: dillon@squarism.com
  author_url: http://
  date: !binary |-
    MjAxMS0xMC0yNiAxMzoxNjozMiAtMDQwMA==
  date_gmt: !binary |-
    MjAxMS0xMC0yNiAxODoxNjozMiAtMDQwMA==
  content: ! '@Chris: See the step "Create a file named api_client.rb in the root
    of the rest_api rails app".  Then open a Terminal (shell) or command prompt (Windows),
    run the script.  IE:  1) $ cd /where_you_put_your_rails_app  2) $ ruby api_client.rb  .  If
    the script doesn''t run, make sure ruby is in your path.  If you have other problems,
    just respond.'
- id: 6720
  author: Chris
  author_email: h8windows@gmail.com
  author_url: ''
  date: !binary |-
    MjAxMS0xMC0yNiAxOTowMToxNSAtMDQwMA==
  date_gmt: !binary |-
    MjAxMS0xMC0yNyAwMDowMToxNSAtMDQwMA==
  content: ! "@Dillon, Thanks, I was brain dead, and not typing \"ruby\" before the
    command. Create works, but the other 3 - no luck. I went back to the curl .../employees.xml,
    I get nothing. If I use the curl command omitting .xml, I get a response with
    the html. Ruby 1.8.7 (I did add the require above), gem 1.8.11 and Rails 3.1.1\r\n\r\nThanks
    for your help. This has been a great boost in my learning RoR!"
- id: 6721
  author: Chris
  author_email: h8windows@gmail.com
  author_url: ''
  date: !binary |-
    MjAxMS0xMC0yNiAxOToyOToxMyAtMDQwMA==
  date_gmt: !binary |-
    MjAxMS0xMC0yNyAwMDoyOToxMyAtMDQwMA==
  content: ! '@Dillon, the server console gave me a clue with "Processing by EmployeesController#show
    as XML". In the employees_controller.rb, I added the line "format.xml { render
    :xml => @employee }" in the show def. Interesting... I can curl with .json extension
    and I get the format that''s been requested for the project I''m working on.'
- id: 6836
  author: Mike
  author_email: michaelyuan1@yahoo.com
  author_url: ''
  date: !binary |-
    MjAxMi0wMi0wMSAxNTo0MjowNiAtMDUwMA==
  date_gmt: !binary |-
    MjAxMi0wMi0wMSAyMDo0MjowNiAtMDUwMA==
  content: Thanks for this tutorial! I was completely in the dark about how XML requests
    would work in Rails but now I've got an inkling.
- id: 6840
  author: Akshay
  author_email: akshayb04@gmail.com
  author_url: http://shwfgf17.ibls.gla.ac.uk/
  date: !binary |-
    MjAxMi0wMi0wNCAwNDoyNTowNyAtMDUwMA==
  date_gmt: !binary |-
    MjAxMi0wMi0wNCAwOToyNTowNyAtMDUwMA==
  content: ! "Hi There,\r\n\r\nI would like to send .xml files to  web service. I
    have been able to generate/write xml into a file and would like to use that
    file to be sent over HTTP.\r\n\r\nMy curl command is something like \r\ncurl -F
    \"SUBMISSION=@submission.xml\" -F \"STUDY=@study.xml\" -F \"SAMPLE=@sample.xml\"
    \"https://somesite.com/submit/box\"\r\n\r\nIs it possible using
    the tutorial you have explained. \r\n\r\nThank you"
- id: 6874
  author: TD
  author_email: guardian@wecentral.com
  author_url: ''
  date: !binary |-
    MjAxMi0wMy0wMiAxNDoyNjowNCAtMDUwMA==
  date_gmt: !binary |-
    MjAxMi0wMy0wMiAxOToyNjowNCAtMDUwMA==
  content: ! "How hard would it be to turn this XML to JSON?  Great Article either
    way!\r\n\r\n---\r\nAkshay,\r\n\r\nThis tutorial would do exactly what you need.
    \ It sends an xml file to the Server (host/url) for you; instead of CURL."
- id: 6905
  author: cam
  author_email: cam.fortin@gmail.com
  author_url: http://camfortin.com
  date: !binary |-
    MjAxMi0wMy0yMSAyMzozODowMiAtMDQwMA==
  date_gmt: !binary |-
    MjAxMi0wMy0yMiAwNDozODowMiAtMDQwMA==
  content: ! "Thanks for posting this!\r\n\r\nI'm sure I\"m missing something easy,
    but I'm hung up after getting mysql2 installed. I'm in my app's root directory
    and I'm using bash. When I try to create the database I get a bash error saying
    command not found. Any suggestions?\r\n\r\n$ mysql> create database rest_api\r\n-bash:
    mysql: command not found"
- id: 6939
  author: moosya
  author_email: moosya@me.com
  author_url: ''
  date: !binary |-
    MjAxMi0wNC0yMCAwNjoyMDoxMCAtMDQwMA==
  date_gmt: !binary |-
    MjAxMi0wNC0yMCAxMToyMDoxMCAtMDQwMA==
  content: ! "Great post!  thanks!\r\n\r\nFor some reason when I query for the \".xml\"
    content nothing is returned\r\nSo, for example, this cmd does not work curl http://localhost:3000/employees.xml\r\nbut
    the same one w/o the \".xml\" returns the html.\r\n\r\nIs there a special
    command or flag to ensure that xml is generated also?"
- id: 6960
  author: Alex
  author_email: alco19357@yahoo.com
  author_url: ''
  date: !binary |-
    MjAxMi0wNS0xMyAxMjo0NzoxNSAtMDQwMA==
  date_gmt: !binary |-
    MjAxMi0wNS0xMyAxNzo0NzoxNSAtMDQwMA==
  content: ! "@cam - Are you running mysql from the mysql command line? or just typing
    mysql > into the CL on linux/windows? if so, you gotta start the mysql command
    line\r\n\r\n@moosya - ditto... any help on this matter would be excellent! I'm
    getting an error that says \"error on line 1 at column 1: Extra content at the
    end of the document\"... I hit ctrl+u and it's empty source code."
- id: 6961
  author: Alex
  author_email: alco19357@yahoo.com
  author_url: ''
  date: !binary |-
    MjAxMi0wNS0xMyAxMzowMTozNSAtMDQwMA==
  date_gmt: !binary |-
    MjAxMi0wNS0xMyAxODowMTozNSAtMDQwMA==
  content: ! "UPDATE -- just figured out why the xml isn't showing up after some googling!\r\n\r\nMaybe
    the OP can correct me if I'm wrong, but you'll need to add a format to the controller
    file for the model you're using. Just edit the  controller file and add\r\n\r\nformat.xml{
    render xml: @model_name }\r\n\r\nafter the format.html. There should be one there
    fore json that's why you're getting json results and html results. Try again and
    it should work :)"
- id: 6979
  author: ines
  author_email: belhouchet.ines@gmail.com
  author_url: ''
  date: !binary |-
    MjAxMi0wNS0yNSAwNDoyNjoyNCAtMDQwMA==
  date_gmt: !binary |-
    MjAxMi0wNS0yNSAwOToyNjoyNCAtMDQwMA==
  content: ! "great tuto \r\njust a question ,can it a mobile client (webapp) interact
    with your example it means consume this restful web service ??\r\nand again it's
    a good tutorial which help me a lot \r\nthanks a lot :))"
- id: 7004
  author: Pravin
  author_email: pravinmishra88@gmail.com
  author_url: http://railskey.wordspress.com
  date: !binary |-
    MjAxMi0wNi0wNSAxMDoyNDoyNSAtMDQwMA==
  date_gmt: !binary |-
    MjAxMi0wNi0wNSAxNToyNDoyNSAtMDQwMA==
  content: Thanks a lot, Extremely concise and understandable. Clear idea about API
    and gem. Many many thanks for your time. keep going............
- id: 7472
  author: bacalao de calidad
  author_email: rickyeast@yahoo.de
  author_url: ''
  date: !binary |-
    MjAxMy0wMy0wNiAwNDozOToxNiAtMDUwMA==
  date_gmt: !binary |-
    MjAxMy0wMy0wNiAwOTozOToxNiAtMDUwMA==
  content: ! "I go to see daily a few websites and blogs to read articles, but this
    \r\nblog presents quality based posts."
---
<p><img src="/uploads/2011/04/pixel-ribbon_feet.png" alt="pixel-ribbon_feet" width="576" height="24" class="aligncenter size-full wp-image-2083" /></p>
<h2>Background</h2><p>
I've always wondered how I'd go about publishing a real REST API on the web to do something.  In this example, we'll create an employee manager app-thing.  It's not particularly interesting but it shows what "API" means.  In another bit, we'll create an "API" meaning a library to interact with this web service.</p>
<h2>Caveats</h2><p>
If you are just getting started with Rails and Ruby, you might find that this tutorial is really long and includes a lot of syntax.  I love Rails to death but many people say it has a "large surface area".  That means that it's hard to learn and the API is broad and vast.</p>
<p>As an alternative, I suggest taking a look at <a href="https://github.com/intridea/grape">Grape</a> and <a href="http://www.sinatrarb.com/">Sinatra</a> if you are finding Rails to be a little too heavy.  However, make sure you read up on what features you will lose when going thinner.  It's not always clear and you might find things like autoreloading were assumed in Rails but now you have to get a plugin for Sinatra (or Grape).  BTW, I think Grape by Intridea is the better Web API framework at least vs Sinatra.  For pure APIs, it may be better suited for the job than stripping down Rails.</p>
<h2>The rails app</h2><p>
Ok enough caveats and intro.  First, create a new rails app.  I'm going to assume you have RVM installed and know how to create gemsets.
<code>rails new rest_api</code>
<code>cd rest_api</code></p>
<p><strong>update:</strong>This was last tested with 3.2.12.</p>
<h2>Database setup</h2><p>
In this example we are going to use Sqlite3 but you can easily substitute MySQL or some other database here.  To keep this post on topic and short, we'll use the sqlite3 default for spiking.</p>
<p><a id="more"></a><a id="more-1131"></a></p>
<p>Generate some default UI with scaffolding.
<code>rails g scaffold employee name:string extension:integer</code></p>
<p>Create our database tables from what the scaffolding just generated.
<code>rake db:migrate</code></p>
<p>Ok, we're going to pretty up the scaffold here.  This is completely optional but I just hate the default.
Create app/assets/stylesheets/rest_api.css</p>
<pre lang="css" line="0">
body { background-color: #5f7395; color: #333; }</p>
<p>body, p, ol, ul, td {
  font-family: verdana, arial, helvetica, sans-serif;
  font-size:   13px;
  line-height: 18px;
}</p>
<p>pre {
  background-color: #eee;
  padding: 10px;
  font-size: 11px;
}</p>
<p>a { color: #000; }
a:visited { color: #666; }
a:hover { color: #fff; background-color:#000; }</p>
<p>#main {
	background-color: #fff;
	border: solid #000 1px;
	margin: 5em;
	height: 30em;
	padding: 1em;
}</p>
<p>#notice {
	background-color: #e1facf;
	border: solid #97C36d 1px;
	padding: 0.5em;
}
</pre></p>
<p>Change app/view/layouts/application.html.erb to be:</p>
<pre lang="html">
  <!DOCTYPE html>
  <html>
  <head>
    <title>RestApi</title>
    <%= stylesheet_link_tag 'rest_api' %>
    <%= javascript_include_tag "application" %>
    <%= csrf_meta_tag %>
  </head>
  <body></p>
<div id="main">
<p>    <%= yield %></p>
<p>    </div></p>
<p>  </body>
  </html>
</pre></p>
<p>Start rails.
<code>rails s</code></p>
<p>Browse to http://localhost:3000/employees/.  Click Create New Employee and create some records.  There's no validations or anything fancy yet so just fill in both fields accurately.  Now you have some data to work with that should look something like this:
<img src="/uploads/2011/03/rails_api_data.png" alt="" title="rails_api_data" width="346" height="197" class="aligncenter size-full wp-image-1132" /></p>
<h2>CRUD with curl</h2></p>
<p>Crud is Create, Read, Update, Delete.  I'll walk through each verb with curl first.</p>
<p><strong>Create</strong>
This will create a new employee using curl.  Create a new file called new.xml:</p>
{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<employee>
  <extension type="integer">3456</extension>
  <name>Randy Rhodes</name>
</employee>
{% endhighlight %}

<p><code>curl -v -H "Content-Type: application/xml; charset=utf-8" --data-ascii @new.xml http://localhost:3000/employees.xml</code></p>
<p>Now you have a new entry in the database.  You can refresh the rails /employees URL listing to watch it change.
<img src="/uploads/2011/03/rails_api_curl_add.png" alt="" title="rails_api_curl_add" width="335" height="169" class="aligncenter size-full wp-image-1133" /></p>
<p>Now let's add xml rendering to our controller.  Edit the file:
<code>app/controllers/employees_controller.rb</code>
Add the two format.xml lines below.</p>

{% highlight ruby %}
 # GET /employees
 # GET /employees.xml
 # GET /employees.json
 def index
    @employees = Employee.all

    respond_to do |format|
      format.html # index.html.erb
      format.xml  { render xml: @employees }
      format.json { render json: @employees }
    end
  end

  # GET /employees/1
  # GET /employees/1.xml
  # GET /employees/1.json
  def show
    @employee = Employee.find(params[:id])

    respond_to do |format|
      format.html # show.html.erb
      format.xml  { render xml: @employee }
      format.json { render json: @employee }
    end
  end
{% endhighlight %}

<p><strong>Read</strong>
Get all employees:
<code>curl http://localhost:3000/employees.xml</code></p>
<p>Get one employee:
<code>curl http://localhost:3000/employees/1.xml</code></p>
<p>These will just return XML to the screen.  We'll do something with this in a bit.</p>
<p><strong>Update</strong>

Create update.xml:</p>
{% highlight xml %}
<?xml version="1.0" encoding="UTF-8"?>
<employee>
  <extension type="integer">7890</extension>
  <id type="integer">1</id>
  <name>Fairy Faucet</name>
</employee>
{% endhighlight %}

<p><code>curl -v -H "Content-Type: application/xml; charset=utf8" -T update.xml http://localhost:3000/employees/1.xml</code></p>
<p>Make sure that you have an ID of 1 in your database, otherwise you'll get a 404 or some rails rendered error message.</p>
<p><strong>Delete</strong>
I assume that you have an ID of 3 in your database.  In that case, the user's URL for the controller action show() is /3 so we can send an HTTP delete to that URL like this.</p>
<p><code>curl --request DELETE http://localhost:3000/employees/3.xml</code></p>
<p>The record will be gone from the database now if you go to the /employees page in your browser.</p>
<h2>Ruby API Client</h2><p>
Now let's make this less bound to curl.  Let's write a class called Api that represents a gem or ruby library that does some work.  In our case, it's going to make web calls (not DB calls) to update employees exactly how we were doing it with curl.</p>

<p>Create a new file in the rest_api/lib directory called api.rb:</p>

{% highlight ruby %}
require 'net/http'

class Api
  attr_accessor :url
  attr_accessor :uri

  def initialize
    @url = "http://localhost:3000/employees"
    @uri = URI.parse @url
  end

  # Create an employee using a predefined XML template as a REST request.
  def create(name="Default Name", extension="9999")
    xml_req =
    "<?xml version='1.0' encoding='UTF-8'?>
    <employee>
      <extension type='integer'>#{extension}</extension>
      <name>#{name}</name>
    </employee>"

    request = Net::HTTP::Post.new(@url)
    request.add_field "Content-Type", "application/xml"
    request.body = xml_req

    http = Net::HTTP.new(@uri.host, @uri.port)
    response = http.request(request)

    response.body
  end

  # Read can get all employees with no arguments or
  # get one employee with one argument.  For example:
  # api = Api.new
  # api.read 2 => one employee
  # api.read   => all employees
  def read(id=nil)
    request = Net::HTTP.new(@uri.host, @uri.port)

    if id.nil?
      response = request.get("#{@uri.path}.xml")
    else
      response = request.get("#{@uri.path}/#{id}.xml")
    end

    response.body
  end

  # Update an employee using a predefined XML template as a REST request.
  def update(id, name="Updated Name", extension=0000)
    xml_req =
    "<?xml version='1.0' encoding='UTF-8'?>
    <employee>
      <extension type='integer'>#{extension}</extension>
      <id type='integer'>#{id}</id>
      <name>#{name}</name>
    </employee>"

    request = Net::HTTP::Put.new("#{@url}/#{id}.xml")
    request.add_field "Content-Type", "application/xml"
    request.body = xml_req

    http = Net::HTTP.new(@uri.host, @uri.port)
    response = http.request(request)

    # no response body will be returned
    case response
    when Net::HTTPSuccess
      return "#{response.code} OK"
    else
      return "#{response.code} ERROR"
    end
  end

  # Delete an employee with an ID using HTTP Delete
  def delete(id)
    request = Net::HTTP::Delete.new("#{@url}/#{id}.xml")
    http = Net::HTTP.new(@uri.host, @uri.port)
    response = http.request(request)

    # no response body will be returned
    case response
    when Net::HTTPSuccess
      return "#{response.code} OK"
    else
      return "#{response.code} ERROR"
    end
  end

end
{% endhighlight %}


This program is just like curl except we're able to programmatically be more precise with what we're querying and deleting.  However, you'll notice that the XML document is hardcoded in the program.  So it's not infinitely flexible.  If you're nodes are not named employees then this isn't going to work so well.  But this is just an example.</p>

Now we'll create a program to use api.rb.  You'll need nokogiri.  So add this to your Gemfile (anywhere):</p>

<code>gem 'nokogiri'</code>
And then run
<code>bundle</code></p>

This program will be a rest client that will use our api class.  This api could be something you've published and this could be how you'd document the use of your gem to the world in your README.</p>

Create a file named api_client.rb in the root of the rest_api rails app.</p>

{% highlight ruby %}
require './lib/api.rb'
require 'nokogiri'

# CRUD example with an api

def list_employees(api_object)
  puts "Current Employees:"
  doc = Nokogiri::XML.parse api_object.read
  names = doc.xpath('employees/employee/name').collect {|e| e.text }
  puts names.join(", ")
  puts ""
end

api = Api.new
list_employees(api)

# Create
puts "Creating someone..."
api.create "Bobby Flay", 1999
list_employees(api)

# Read one and do nothing with it
api.read 1

# Read all and get valid IDs
doc = Nokogiri::XML.parse api.read
ids = doc.xpath('employees/employee/id').collect {|e| e.text }

# Update last record
puts "Updating last record ..."
api.update ids.last, "Robert Flaid", 2001
list_employees(api)

# Delete
puts "deleting last record ..."
api.delete ids.last
list_employees(api)

{% endhighlight %}


Now run with ruby api_client.rb and you should see:
<code>
Current Employees:
Fairy Faucet, Sandy Salt

Creating someone...
Current Employees:
Fairy Faucet, Sandy Salt, Bobby Flay

Updating last record ...
Current Employees:
Fairy Faucet, Sandy Salt, Robert Flaid

deleting last record ...
Current Employees:
Fairy Faucet, Sandy Salt
</code>
<p>Depending on what dummy data you put in to begin with, the output might look different.</p>
<h2>Rdoc</h2><p>
Optionally, you can create Rdoc for app.  Run this rake task in the rails root:</p>
<p><code>rake doc:app</code></p>
<p>If you open doc/app/Api.html, you'll see the Rdoc from the comments above.  This is especially useful when publishing an API to the world.  It'll suck in comments from your methods, in this case the api.rb file has comments over every method definition that gets turned into pretty HTML.
<img src="/uploads/2011/03/rails_api_rdoc.png" alt="" title="rails_api_rdoc" width="368" height="285" class="aligncenter size-full wp-image-1146" /></p>
<h2>Wrap up</h2><p>
So we have published an API over the web with Rails.  It's pretty easy because the scaffolding handles the xml requests in the respond_to blocks in the controllers.  But we also wrapped this API in a utility class that we were able to run from the command line.  This could easily be converted to a gem and published just as the rails app could easily be pushed to Heroku and published.</p>
<p>This example mimics a CRUD layer for a DB so closely that you'd never do this exactly.  But hopefully it illustrates how you'd make a wrapper to a web service that you don't have direct DB access to.  For me, it was interesting to see what API really means.  In terms of REST and the web, it's simply publishing methods and data over HTTP (in this case wrapped up in XML).  In terms of a library or gem, it means giving someone an object and methods to do something inside a black box you've designed.</p>
