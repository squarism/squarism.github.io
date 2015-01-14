Given(/^a meeting where people have different cloud bubbles over their heads$/) do
  "Let's get a wiki up."
  @team = {
    john: "I'll install mediawiki",
    jane: "I'll install dokuwiki",
    bob:  "I'll link to wikipedia"
  }
end

Given(/^we need to collaborate$/) do
  @team.each {
    Proc.new {
      has_different_ideas_about approach
      even_team_members_do_things different day_to_day
    }
  }
end

When(/^we communicate and implement business rules and team decisions$/) do
  @team.each {
    Proc.new { implement_the_thing }
  }
end

Then(/^we should communicate through code as infrastructure$/) do
  Proc.new {
    create_a_file
    write_down_steps
    test_steps
    do_the_thing
    when_problems_arise
    fix_the_thing
    commit_the_thing
  }
  # happiness / productivity / specificity
end

Given(/^we've all reset since our last sprint$/) do
  monday = true
  or_long_weekend = true
end

When(/^we come in$/) do
  coffee = false   # oh noooo
end

Then(/^I've love a stand\-up to load our brains and get to work$/) do
  fast_status = Proc.new {
    what did I do_yesterday
    what am I going to_do today
    what am I waiting on
  }
end

Given(/^I'm trying to learn how things work at (.*)$/) do |new_place|
  newbie = true
  # Picture of I have no idea what I'm doing dog
end

When(/^I'm seeking help$/) do
  "Do we have an IRC server?"
  "Do we have a wiki for newbies?"
  "Do we have an internal gem server?"
end

Then(/^I've love IRC\/Wikis\/Bots and internal tools to help team dynamics \(github strategy\)$/) do
  Proc.new {
    ask_irc_bot_when_sarah_was_last_seen
    msg sarah "Thanks for the link!"
    tell irc_bot to_get Coffee.new(mocha: true, stumptown: of_course)
    # TODO: implement irc bot that can get coffee
  }
end

Given(/^everyone is comfortable with testing$/) do
  testing_skills = [ 'some', 'test-first', 'tdd', 'something-else' ]
end

When(/^we decide to do TDD or not$/) do
  "Let's not be dogmatic."
end

Then(/^we all should know what the trade\-offs and benefits are$/) do
  # for example ...
  "We can just write tests later, we think we know our vision already."
  "We can see it from the outside with integration tests."
  # or what-not
end

Given(/^we have too much to do and we are fallible creatures$/) do
  Proc.new {
    install_queue_service
    oops no_init_script
    i will just type it out real quick
  }
end

When(/^we see repeatable steps$/) do
  Proc.new {
    ugh_another_queue_service
  }
end

Then(/^we should know to automate it$/) do
  "Tools!"
end

Given(/^we keep typing sl instead of ls in a shell$/) do
  "$ sl"
  # zsh: command not found: sl
end

When(/^we run an analysis script of our history file$/) do
  # grep | sed | awk | magic
end

When(/^discover our top most typoed commands$/) do
  top_commands_mistyped = <<-EOF
    sl: 503
    update_rc.d: 17
    rubby: 2
  EOF
end

Then(/^we should write down an solution to work on later$/) do
  tools_to_sharpen = []
  tools_to_sharpen << "Autocomplete in vim really is annoying me."
  tools_to_sharpen << "I want to learn more vim navigation."
  tools_to_sharpen << "Alias sl to ls.  I'll never slow down enough to get it right."
end

