---
layout: post
status: publish
published: true
title: Monty Hall Problem in Ruby
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 810
wordpress_url: http://squarism.com/?p=810
date: !binary |-
  MjAxMC0xMi0xMyAxMjo0Mzo0OCAtMDUwMA==
date_gmt: !binary |-
  MjAxMC0xMi0xMyAxNzo0Mzo0OCAtMDUwMA==
categories:
- Ruby
tags: []
comments: []
---
I was reading a thread on stackoverflow about randomness and cryptography security and there was a comment that started me down a series of articles talking about [the Monty Hall problem](http://en.wikipedia.org/wiki/Monty_Hall_problem):

> Suppose you're on a game show, and you're given the choice of three doors: Behind one door is a car; behind the others, goats. You pick a door, say No. 1, and the host, who knows what's behind the doors, opens another door, say No. 3, which has a goat. He then says to you, "Do you want to pick door No. 2?" Is it to your advantage to switch your choice?

The take away from the probability puzzle is that you should switch.  It's completely unintuitive and I didn't really get it even after reading about it for some time until I watched [this youtube video](http://www.youtube.com/watch?v=mhlc7peGlGg).  It's a bit slow paced but it's the best explanation and visuals out there.

So even after grok'ing the concept, I wanted to prove it.  So I wrote a ruby program to simulate the game show.  Here's the results from one run:
`Monty Hall Games Played: 1000
Player 1 (switches): 675/1000 : 67.50%
Player 2 (stays)   : 325/1000 : 32.50%`

The code is pretty simple and quick.  Of note is that I sort of use the same game and player_2 just picks the same door of the same game using the same rand(3) number.  So this is like two people playing at the same time and one always switches.  I used the sleep statement near the bottom to keep the terminal from blinking.  Seems to not blink on Mac or Linux but I remember having some weird behavior somewhere.

{% highlight ruby %}
#!/usr/bin/ruby
# a simulation of the monty hall problem</p>

# monkey patch
class Array
  def shuffle!
    size.downto(1) { |n| push delete_at(rand(n)) }
    self
  end
end

class Player
  attr_accessor :name
  attr_accessor :choice
  attr_accessor :played
  attr_accessor :won
  attr_accessor :lost

  def initialize(name)
    self.name = name
    self.played = 0
    self.won = 0
    self.lost = 0
  end

  def pick_door(door_number)
    self.choice = door_number
    #puts "PLAYER PICKS: #{self.choice}"
  end

  def win
    self.won += 1
    self.played += 1
  end

  def lose
    self.lost += 1
    self.played += 1
  end

  def percentage
    num = (self.won.to_f/self.played.to_f) * 100
    sprintf('%.2f', num) + "%"
  end

end

class Game
  attr_accessor :doors
  attr_accessor :door_states

  def initialize
    # set up doors
    self.doors = Array.new
    self.doors = [ "goat", "goat", "car" ]
    self.doors.shuffle!

    # set up door states
    self.door_states = Array.new
    self.door_states = [ "closed", "closed", "closed" ]
  end

  # main loop
  def run(player_1, player_2)
    # Player 1 randomly picks a door
    # Player 2 uses this door for simplicity
    player_choice = rand(3)
    player_1.pick_door(player_choice)
    player_2.pick_door(player_choice)

    # Host picks a door with a goat and reveals door
    goats = []
    self.doors.each_index {|d| goats << d if doors[d] == "goat"}
    goats.delete player_choice

    # if player won already then there are two goat doors, host picks one
    if goats.length > 1
      goats.delete_at rand(2)
    end

    # first is redundant but safe
    door_states[goats.first] = "open"

    # Player 1 switches between two remaining doors
    # Player 2 does not switch so do nothing
    remaining = []
    self.door_states.each_index {|d| remaining << d if door_states[d] == "closed"}
    remaining.delete player_choice
    player_1.choice = remaining.first      # first is redundant but safe

    # Log result
    if win?(player_1)
      player_1.win
    else
      player_1.lose
    end

    if win?(player_2)
      player_2.win
    else
      player_2.lose
    end

  end

  # did player win?
  def win?(player)
    if self.doors[player.choice] == "car"
      true
    else
      false
    end
  end

  # print out the game statistics
  def stats(p1, p2)
    # terminal clear code
    print %x{clear}

    puts "Monty Hall Games Played: #{p1.played}"
    puts "#{p1.name} (switches): #{p1.won}/#{p1.played} : #{p1.percentage}"
    puts "#{p2.name} (stays)   : #{p2.won}/#{p2.played} : #{p2.percentage}"
  end

end

# Create players
player_1 = Player.new("Player 1")
player_2 = Player.new("Player 2")

# Create new game show
while player_1.played < 1000
  g = Game.new
  g.run(player_1, player_2)
  g.stats(player_1, player_2)

  # for terminal sanity if terminal blinks too much
  #sleep 0.02
end
{% endhighlight %}

It was a good exercise.  I was playing around with ruby-ncurses but it became too much of a hassle.  Maybe some other project will need a TUI, I do still want to play with ncurses or something similar.