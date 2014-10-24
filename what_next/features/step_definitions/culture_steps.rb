Given(/^that businesses have tons of money$/) do
  money = Subjectivity::Lots
end

Given(/^that office design is pretty arbitrary$/) do
  office_design = Subjectivity::Anything
end

Given(/^I've sometimes worked in concrete holes$/) do
  previous_environments = Subjectivity::NotGreat
end

When(/^I look at an office space$/) do
  me = Me.new
  @office_opinion = me.observe_scenery(PuppetOffice.new)
end

Then(/^I want to know that someone thought about employee happiness at least at little$/) do
  assert_equal(@office_opinion, Subjectivity::NotBad)
end

Given(/^that I don't have a garage with an electric plug$/) do
  gas_vehicle_shame = true
end

When(/^I go to work$/) do
  @me = Me.new
  @me.commute(Bike.new)
end

Then(/^I'd like to ride my bike$/) do
  assert_equal(@me.vehicle.mpg, Float::INFINITY)
end

Given(/^that people are nicer and different on the west coast$/) do
  best_coast = :west
end

Given(/^I sold my house and moved my family to Portland$/) do
  house_sold = true
end

When(/^I get my first local job here$/) do
  awesome_job_obtained_yesss = true
end

Then(/^I don't want to over\-expect but I want it to be crazy\-awesome \(it probably will be\)$/) do
  me = Me.new
  assert_equal(me.feeling_of(PuppetLabs.new), Subjectivity::Awesome)
end

Given(/^that work should be fun$/) do
  atmosphere = Subjectivity::Fun
end

When(/^I make bad jokes$/) do
  my_best_jokes = [
    "A Banker's Dozen is 11 because of atm fees.",
    "I should train a bayesian classifier to delete all my negative tweets. But I'm afraid of what it would tell me.",
    "Kermit can't do green screen.",
    "I was going to read this book called Catch-21 but it's a sequel."
  ]
end

Then(/^we can have a good time while getting stuff done$/) do
  win_win = :its_obvious
end

