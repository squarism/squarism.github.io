require 'active_support/core_ext'

# All of human experience in a convenient module!  Wow!  ;)
module Subjectivity
  Lots       = :lots
  Some       = :some
  None       = :none
  Anything   = :anything
  Nothing    = :nothing
  NotGreat   = :not_great
  NotBad     = :not_bad
  Awesome    = :awesome
  Bad        = :bad
  Fun        = :fun
  Boring     = :boring
  Satisfied  = :satisfied
  Frustrated = :frustrated
end

class Me

  def experience
    {
      ruby:       { years: 7   },
      java:       { years: 4   },
      python:     { years: 1   },
      go:         { years: 1   },
      javascript: { years: 2   },
      scala:      { years: 0.5 }
    }
  end

  def total_years(languages=[])
    exp = experience.slice(*languages)
    exp.map {|language| language[1][:years] }.reduce(0) {|sum, years| sum += years }
  end

  def automation_stories
    [
      "Implemented a metrics reporting script that saved a day of work regularly.",
      "Created silent install scripts for integrating complex vendor installs using only baseline tools.",
      "Created capistrano deployment scripts for rails apps.",
      "I've created backup scripts for prod servers, apps, network devices, SANs and minecraft servers."
    ]
  end

  def cat_faucet
    "I once created a Rails API to instrument an Arduino powered sink that my cat used."
  end

  def testing_values
    "I believe that testing can catch bugs before deployment but also give you something concrete to fix and talk about when bugs do happen.  CI, TDD and feedback loops can sometimes mitigate human fallibilities."
  end

  def github_url
    "https://github.com/squarism"
  end

  def blog_url
    "http://squarism.com"
  end

  def wiki_url
    "https://squarism.hackpad.com/"
  end

  def python_story
    "We had a situation where we had to write a job queue in python, using zookeeper as pubsub.  It was less than ideal and I had to make
    a compromise because I was more fluent in Ruby.  In the end, we rewrote it for other reasons.  My python code was not idiomatic
    but we got it working and we learned a bunch about zookeeper."
  end

  def git_experience?
    true
  end

  def industry_years
    Date.today.year - 2000
  end

  def degree
    "business administration"  # Marketing Major turned CS person after college.  :)
  end

  def puppet_modules_written
    0
  end

  def analysis_skill_story
    "We had a database-based job queue that was killing performance.  We took a before picture of load, integrated a simple job
    queue and looked at the load again.  Performance was much better.  We later found that the job queue was too simple
    so we've started another integration of a more powerful job queue.  We can see the advantages of certain features but we
    don't know of any black swan drawbacks (by definition) right now."
  end

  def location
    "Portland"
  end

end

class Qualifications

end
