require "./lib/qualifications"
require "active_support/core_ext"

describe Qualifications do

  let(:me) { Me.new }

  specify "You have knowledge and experience (3-5 years) of high-level programming languages like ruby, python, java, etc." do
    total_years = me.total_years [:ruby, :python, :java]
    years_required = 3
    expect( total_years >= years_required ).to be true
  end

	specify "You have developed and implemented solutions to challenging automation problems." do
    expect(me.automation_stories.length).to be >= 1
  end

	specify "You think web APIs to control hardware and infrastructure are brilliant." do
    expect(me.cat_faucet).to match(/Arduino|Rails|API/)
  end

  # I usually do one expectation per test.  But I want the requirements to line up for the RSpec
  # output.
	specify "You are a believer in thoroughly testing software, automate that testing and believe that better QA drives better quality.  You have experience with test automation frameworks and continuous integration." do
    # well obviously I believe in testing.  :)
    expect(RSpec).to_not be nil
    expect(me.testing_values).to match(/automation|CI|bugs/)
  end

	specify "Being an active member of open source communities is something you cherish, and you have experience helping community members advance their code." do
    expect(me.github_url).to_not be nil
    expect(me.blog_url).to_not be nil
    expect(me.wiki_url).to_not be nil
  end

	specify "You are not dogmatic about technology choices. You understand that what matters is using the right tool for the job at hand." do
    expect(me.python_story).to match(/compromise|choice/)
  end

	specify "You understand and use distributed version control systems such as git." do
    expect(me.git_experience?).to be true
  end

	specify "Minimum 3 years of full time experience in a software development role (5+ years preferred)." do
    expect(me.industry_years).to be >= 3
  end

	specify "BSCS or equivalent or relevant industry experience." do
    expect( (me.degree == "CS") || (me.industry_years > 5) ).to be true
  end

  # This requirement is considered optional but we will write a test anyway in case
  # experience is gained at a later date.  :)
	specify "Experience in writing high-quality, reusable Puppet modules is a plus." do
    expect( me.puppet_modules_written > 0 ).to be true
  end

	specify "Requires logic and reasoning to identify the strengths and weaknesses of alternative solutions, conclusions or approaches to problems." do
    expect( me.analysis_skill_story).to match /alternatives|realized|better/
  end

	specify "Requires contact with others (face-to-face, by telephone, virtual meetings, VOIP or otherwise) and the ability to work and interact in a group or team." do
    expect(me.location).to eq "Portland"
  end

end
