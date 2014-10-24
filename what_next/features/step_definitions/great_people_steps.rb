Given(/^that we have biases and psychology whether we talk about it or not$/) do
  human_memory_flawed = true
  hidden_bias         = true
end

When(/^I talk about books and talks like "(.*?)" or "(.*?)"$/) do |book, blog|
  me = Me.new
  me.share(book)
  me.share(blog)
end

Then(/^I'd love to have a two way conversation about meta and psych topics$/) do
  "Oh yeah, that's required reading around here ..."
  "Did you ever hear about confirmation bias?"
  "That's why we love code as configuration around here ..."
end

Then(/^just know that like\-minded people work with me$/) do
  me = Me.new
  assert me.is_actually_solving_human_problems?
end

Given(/^that I have some area of expertise or figure something out that's relevant$/) do
  see_opportunity = true
end

When(/^I realize, "(.*?)"$/) do |subject|
  "I should really do a talk on #{subject}.  I've explained it twice today.  Not that I mind."
end

Then(/^I can give a talk or write a blog post$/) do
  Proc.new { write_blog_post }
  Proc.new { make_slides }
end

Given(/^that someone wants to share$/) do
  @me = Me.new
  @me.notices_interesting_talk
end

When(/^I have time$/) do
  @me.check_calendar
end

Then(/^I'd like to stay after work and listen to a talk or presentation and lift people up$/) do
  @me.learn("thing")
  @me.encourage
end

Given(/^that I feel like a big fish in a small pond$/) do
  me = Me.new
  Proc.new {
    me.teaching_a_lot_but_not_getting_enough_back
    me.the_only_one_who_has_a_github_account
    me.watch_confs_and_training_videos_online_and_share
    me.but_it_is_one_way_only
  }
end

When(/^I pair with different people over some period of time$/) do
  me = Me.new
  me.pair
  me.pair
  me.pair
end

Then(/^I'd love to be learning workflows, shortcuts and tricks$/) do
  me = Me.new
  me.learn("vim trick")
  me.learn("zsh plugin")
  me.learn("nice devops stack")
  me.learn("that refactoring trick i've read about but never grok'd")
end

