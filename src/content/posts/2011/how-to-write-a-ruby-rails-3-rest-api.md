---
title: "How to write a Ruby and Rails 3 REST API"
description: "I've always wondered how I'd go about publishing a real REST API on the web to do something.  In this example, we'll create an employee manager app-th"
date: 2011-04-01T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

### Background

I've always wondered how I'd go about publishing a real REST API on the web to do something.  In this example, we'll create an employee manager app-thing.  It's not particularly interesting but it shows what "API" means.  In another bit, we'll create an "API" meaning a library to interact with this web service.

### Caveats

If you are just getting started with Rails and Ruby, you might find that this tutorial is really long and includes a lot of syntax.  I love Rails to death but many people say it has a "large surface area".  That means that it's hard to learn and the API is broad and vast.

As an alternative, I suggest taking a look at [Grape](https://github.com/intridea/grape) and [Sinatra](http://www.sinatrarb.com/) if you are finding Rails to be a little too heavy.  However, make sure you read up on what features you will lose when going thinner.  It's not always clear and you might find things like autoreloading were assumed in Rails but now you have to get a plugin for Sinatra (or Grape).  BTW, I think Grape by Intridea is the better Web API framework at least vs Sinatra.  For pure APIs, it may be better suited for the job than stripping down Rails.

### The rails app

Ok enough caveats and intro.  First, create a new rails app.  I'm going to assume you have RVM installed and know how to create gemsets.

```bash
rails new rest_api
cd rest_api
```

**update:** This was last tested with Rails 3.2.20.

### Database setup

In this example we are going to use Sqlite3 but you can easily substitute MySQL or some other database here.  To keep this post on topic and short, we'll use the sqlite3 default for spiking.

<!-- more -->

Generate some default UI with scaffolding.

```bash
rails g scaffold employee name:string extension:integer
```

Create our database tables from what the scaffolding just generated.

```bash
rake db:migrate
```

Ok, we're going to pretty up the scaffold here.  This is completely optional but I just hate the default.

Create `app/assets/stylesheets/rest_api.css`

```css
body { background-color: #5f7395; color: #333; }
body, p, ol, ul, td {
  font-family: verdana, arial, helvetica, sans-serif;
  font-size:   13px;
  line-height: 18px;
}
pre {
  background-color: #eee;
  padding: 10px;
  font-size: 11px;
}
a { color: #000; }
a:visited { color: #666; }
a:hover { color: #fff; background-color:#000; }
#main {
	background-color: #fff;
	border: solid #000 1px;
	margin: 5em;
	height: 30em;
	padding: 1em;
}
#notice {
	background-color: #e1facf;
	border: solid #97C36d 1px;
	padding: 0.5em;
}
```

Change `app/views/layouts/application.html.erb` to be:
```html
<!DOCTYPE html>
<html>
<head>
  <title>RestApi</title>
  <%= stylesheet_link_tag 'rest_api' %>
  <%= javascript_include_tag "application" %>
  <%= csrf_meta_tag %>
</head>
<body>
<div id="main">
  <%= yield %>
</div>
</body>
</html>
```

Start rails.
```bash
$ rails s
```

Browse to `http://localhost:3000/employees/`.  Click Create New Employee and create some records.  There's no validations or anything fancy yet so just fill in both fields accurately.  Now you have some data to work with that should look something like this:

![rails_api_data](/uploads/2011/03/rails_api_data.png)

## CRUD with curl

Crud is Create, Read, Update, Delete.  I'll walk through each verb with curl first.

##### Create
This will create a new employee using curl.  Create a new file called `new.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<employee>
  <extension type="integer">3456</extension>
  <name>Randy Rhodes</name>
</employee>
```

```bash
curl -v -H "Content-Type: application/xml; charset=utf-8" \
--data-ascii @new.xml http://localhost:3000/employees.xml
```

Now you have a new entry in the database.  You can refresh the `/employees` URL listing to watch it change.

![rails_api_curl_add](/uploads/2011/03/rails_api_curl_add.png)

Now let's add xml rendering to our controller.  Edit the file:
`app/controllers/employees_controller.rb`
Add the two format.xml lines below.

```ruby
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
```

##### Read
Get all employees:
```bash
curl http://localhost:3000/employees.xml
```

Get one employee:
```bash
curl http://localhost:3000/employees/1.xml
```

These will just return XML to the screen.  We'll do something with this in a bit.

##### Update

Create `update.xml`:
```xml
<?xml version="1.0" encoding="UTF-8"?>
<employee>
  <extension type="integer">7890</extension>
  <id type="integer">1</id>
  <name>Fairy Faucet</name>
</employee>
```

```bash
curl -v -H "Content-Type: application/xml; charset=utf8" \
-T update.xml http://localhost:3000/employees/1.xml
```

Make sure that you have an ID of 1 in your database, otherwise you'll get a 404 or some rails rendered error message.

##### Delete

I assume that you have an ID of 3 in your database.  In that case, the user's URL for the controller action `show()` is `/employees/3` so we can send an HTTP delete to that URL like this.

```bash
curl --request DELETE http://localhost:3000/employees/3.xml
```

The record will be gone from the database now if you go to the `/employees` page in your browser or run the curl command against the `/employees` endpoint.

## Ruby API Client

Now let's make this less bound to curl.  Let's write a class called Api that represents a gem or ruby library that does some work.  In our case, it's going to make web calls (not DB calls) to update employees exactly how we were doing it with curl.

Create a new file in the `rest_api/lib` directory called `api.rb`:

```ruby
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
```

This program is just like curl except we're able to programmatically be more precise with what we're querying and deleting.  However, you'll notice that the XML document is hardcoded in the program.  So it's not infinitely flexible.  If you're nodes are not named employees then this isn't going to work so well.  But this is just an example.

Now we'll create a program to use api.rb.  You'll need nokogiri.  So add this to your `Gemfile` at the end.

```ruby
gem 'nokogiri'
```

And then run
```bash
$ bundle
```

This program will be a rest client that will use our api class.  This api could be something you've published and this could be how you'd document the use of your gem to the world in your README.

Create a file named `api_client.rb` in the root of the rest_api rails app.

```ruby
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

```

Now run with ruby api_client.rb and you should see:

```bash
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
```

Depending on what dummy data you put in to begin with, the output might look different.

## Rdoc

Optionally, you can create Rdoc for app.  Run this rake task in the rails root:

```bash
rake doc:app
```

If you open `doc/app/Api.html`, you'll see the Rdoc from the comments above.  This is especially useful when publishing an API to the world.  It'll suck in comments from your methods, in this case the api.rb file has comments over every method definition that gets turned into pretty HTML.

![rails_api_rdoc](/uploads/2011/03/rails_api_rdoc.png)

## Real World

This is just an tutorial about how Rails can be a fast way to make a web API.  Don't follow this exactly for a production app (obviously).  Here's a few pointers for something more real world:

* Use an api gem to document your api.  These gems change as to what is current but something like [apipie](https://github.com/Apipie/apipie-rails) might be a good fit.  Swagger + Grape would be a good alternative too (but Grape would be an option to Rails itself).
* The program we created in `/lib` is called an API wrapper or a wrapper.  I would suggest creating a gem for this and not putting it in the root of your project.  There are also gems that can generate wrappers (ruby code) from api descriptions/doc.
* If you are just creating an API and not a front-end, you could use the `rails-api` gem to get rid of the web interface.  You could also embed a small API in a rails app.  Small reusable services start talk about SOA and it usually pays off.  At this point though, you might choose something other than Rails for "just an API".  I've had pretty practical and rapid success with Scalatra (Scala) and Martini (golang).
* All these steps have mostly remained the same for Rails 2, 3 & 4.  I will be making an updated post about doing this with Rails 4 and/or with API related gems.

## Wrap up

So we have published an API over the web with Rails.  It's pretty easy because the scaffolding handles the xml requests in the respond_to blocks in the controllers.  But we also wrapped this API in a utility class that we were able to run from the command line.  This could easily be converted to a gem and published just as the rails app could easily be pushed to Heroku and published.

This example mimics a CRUD layer for a DB so closely that you'd never do this exactly.  But hopefully it illustrates how you'd make a wrapper to a web service that you don't have direct DB access to.  For me, it was interesting to see what API really means.  In terms of REST and the web, it's simply publishing methods and data over HTTP (in this case wrapped up in XML).  In terms of a library or gem, it means giving someone an object and methods to do something inside a black box you've designed.
