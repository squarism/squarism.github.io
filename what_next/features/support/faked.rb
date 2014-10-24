module Subjectivity
  Lots      = :lots
  Anything  = :anything
  NotGreat  = :not_great
  NotBad    = :not_bad
  Awesome   = :awesome
  Fun       = :fun
  Satisfied = :satisfied
end


class Bike
  def mpg
    Float::INFINITY
  end
end


class Me
  attr_reader :vehicle, :feeling

  def initialize
    @toolbelt = [ 'past experience' ]
  end

  def observe_scenery(place)
    if place.did_someone_try? == true
      Subjectivity::NotBad
    end
  end

  def commute(by)
    @vehicle = by
  end

  def feeling_of(work)
    return Subjectivity::Awesome if soul?
  end

  # add total sum of human experience and situations
  # TODO: figure out how this works
  def soul?
    true
  end

  def share(something)
    "Peers are open-minded and have contributions back."
    "Teachers learn by teaching."
    "People are interested in a variety of topics."
    "Everyone grows together."
    "It's respect in both directions."
  end

  # I tweeted the other day:
  # These #rubyrogues shows about chunking, fear, bias and brain hacks.
  # The norm should be:
  #   "Imma Psych major, I do computer stuff."
  def is_actually_solving_human_problems?
    true
  end

  def notices_interesting_talk
    interesting_subjects.sample
  end

  def interesting_subjects
    %w[
      Docker Shipyard Logstash Kibana Puppet TheForeman Statsd Graphana
      Consul BOSH Mesos Swift(blob) Jenkins Ceph Monit Dashing Packer Wall-E
      Tarsnap Concurrency Actors Testing Go Recursion FP Caching CORS
      APIs UX Postgresql Riak Queues Futures Craftsmanship Dart Ember Angular ...
    ]
  end

  def check_calendar
    "do i have to be home?"
  end

  def learn(thing)
    @toolbelt << thing
  end

  def encourage
    "*clap clap*"
    "That was great."
    "I enjoyed that."
  end

  def pair
    "Yay that was great."
  end

  def observe_experts
    @feeling = Subjectivity::Satisfied
  end

  def eat_dog_food
    @feeling = Subjectivity::Satisfied
  end
end


class PuppetOffice
  def did_someone_try?
    true
  end
end


class PuppetLabs
end

