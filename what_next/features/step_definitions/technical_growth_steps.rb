Given(/^there are a ton of tools out there$/) do
  me = Me.new
  me.interesting_subjects.length
end

Given(/^I know generic technologies$/) do
  similar_technologies = [ 'git', 'solaris zones', 'vagrant' ]
end

Given(/^I don't really grok how Docker works$/) do
  projects_done_with_docker = 0
end

Given(/^where Docker sits in the space$/) do
  # Can you create a module for shipyard?
  # Can you use it on the side realistically?
  # Linux only!  Aaahhh!
end

When(/^I have a job to do that might benefit from Docker$/) do
  "We need a shipyard module!"
end

Then(/^I'd like to have time and equipment and encouragement \(however slight\) to learn Docker$/) do
  "Here are a bunch of blank ESX hosts.  Knock yourself out."  #  :)
  Proc.new {
    grok_docker
    grok_interaction
    grok_trade_offs
    build_shipyard_module
    write_blog_post
  }
end

Given(/^I have seen failures in person$/) do
  traditional_organization_experience = true
end

When(/^I see how it's actually done right$/) do
  @me = Me.new
  @me.observe_experts
  @me.eat_dog_food
end

Then(/^I'll have a great appreciation for the solution$/) do
  assert_equal(@me.feeling, Subjectivity::Satisfied)
end

Given(/^the simplest rails application$/) do
  "rails new blog"
end

Given(/^I know how to do all the steps by hand$/) do
  "bundle"
  "rake assets:whyyyyy"
end

When(/^I want to not configure RVM and Passenger for the Nth time$/) do
  "rvm install whyyyy"
end

Then(/^I'd love to know how Puppet integrates and compares with Docker\/Chef\/Capistrano\/\.\.\.$/) do
  "Let's grok this!"
end

Given(/^that I love Ruby to death$/) do
  :obviously
end

Given(/^it's given me the opportunity to touch on many problem domains quickly$/) do
  # most of ruby-toolbox.com
end

When(/^I need parallelism$/) do
  Thread.new { "is terrible" }
end

Then(/^I've love to have Go as a secondary language I can speak$/) do
  Proc.new {
    study try fail try
    eventually have a secondary language for_work
  }
end

Given(/^that concurrency hates mutation$/) do
  Mutex.new
end

When(/^I modify objects in place$/) do
  a = [ "a", "b", "c" ]
  a.each(&:upcase!)  #   :(
end

When(/^hard bugs pop up$/) do
  # thread death
end

Then(/^I wish I knew a functional language$/) do
  # clojure?  scala?  something else?
end

Given(/^that I can't ssh into (\d+) boxes$/) do |number_of_machines|
  number_of_machines.to_i > 40
end

When(/^a large scale problem arises$/) do
  "We need 10PB for images and search."
end

When(/^I want to provision a million MongoDB nodes$/) do
  # eeep!
end

Then(/^I wish I had tools in my belt that work at scale$/) do
  # traditional methods don't work
end

Given(/^that experience stops somewhere$/) do
  "I don't know all of English."
  "I don't know all of Ruby."
  "I done a few things in Go."
  "I have done a few things with Chef."
  "I have done a few things with The Foreman."
  "But I never got to (advanced subject) ..."
end

When(/^I look at my personal boundary list at http:\/\/squarism\.com\/questions$/) do
  # It's a brain dump of sorts.
end

When(/^it's assumed that this isn't the entire list$/) do
  # I have other lists similar to this.
  # A spike list, things to hack on.
  # It grows faster than I can check things off.
end

Then(/^I see that I'm checking things off$/) do
  "Cool.  I know what Mesos is now."
end

