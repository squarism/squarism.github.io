---
layout: post
status: published
published: true
title: Ruby Has Long Known About Poetry
date: 2023-10-24
---

Ruby has known about the Python package manager [Poetry](https://python-poetry.org/) for a long time as [Bundler](https://bundler.io/).  This is not a smug victory lap.  Bundler was not always _the thing to use_.  If the sands of time are going to bury Ruby so that the language is [deleted](https://sloboda-studio.com/blog/is-ruby-on-rails-dying/) from all multiverse timelines, then we might as well listen to its dying words:

&nbsp;&nbsp;  _"The Poetry transition is the Bundler transition, we already went through this.  Ack."_ 💀

Bundler is the de-facto standard on how to install a library in a Ruby project and has been for quite a while.  But there was a time before Bundler existed, when we had library needs but we did not have Bundler.  In that pre-Bundler time, some of us would use something like RVM (Ruby Version Manager) gemsets.  There were other tools but I am going to talk about RVM, I will explain it later in this post in case you don't know RVM.

Currently, as of writing, there is [much debate](https://blog.viraptor.info/post/python-dependency-management-difficulty-is-an-unhelpful-meme) about Python packaging.  We are in the throws of AI hype.  Python is being learned, in-use and popular.  But those that are learning it are learning `pip install`.  Or AI projects are [not yet feeling operation concerns](https://ml-ops.org/) like repeatable builds.

I'm aware of prior-art posts:

* [Why not tell people to "simply" use pyenv, poetry or anaconda](https://www.bitecode.dev/p/why-not-tell-people-to-simply-use)
* [Python dependency management difficulty is an unhelpful meme](https://blog.viraptor.info/post/python-dependency-management-difficulty-is-an-unhelpful-meme)

These are good posts.  I'm adding orthogonally to them.  I want to talk about other prior-art.  Bundler and RVM gemsets.


## Translation

First, let's translate a little bit.  Ruby gems are like Python packages.  Python has `.whl` and Ruby has `.gem`.  Ruby has only had gems but Python has had many package formats over the years, so I will just say python package.

You can install packages yourself, sort of "raw" using `pip install` in Python and `gem install` in Ruby.  Some people do this in Python but rarely do you do this in Ruby.  There are exceptions like global installs or generators but basically you rarely would do the equivalent of `gem install` in Ruby.

Both sites have a package website.  Python's is [pypi.org](https://pypi.org/) and Ruby's is [rubygems.org](https://rubygems.org/).

| ------------- | -------------- |
| Python Terminology | Ruby Terminology    |
| ------------- | -------------- |
| python package | ruby gem      |
| pip install   | gem install    |
| pypi.org      | rubygems.org   |


## How RVM Gemsets Worked

Before Bundler was even invented, I was using RVM gemsets to keep my Ruby projects separated.  RVM is a Ruby Version Manager (RVM) that would install and manage Ruby versions.  But it also had this extra feature on it called [gemsets](https://rvm.io/gemsets).  With gemsets, you could create a set of packages named after your project.  You could even have RVM switch to the gemset when you `cd`'d into your project directory.  So this would be like if you `venv` activated automatically.

| ------------- | -------------- |
| Python Terminology | Ruby Terminology    |
| ------------- | -------------- |
| python -m venv venv | rvm gemset create my-project |
| . venv/bin/activate | rvm gemset use my-project |

You would use RVM gemsets because if you didn't, your Ruby install would fill up with packages, even the same one many times with different versions.  Then your project would not know which to use, not to mention you wouldn't know which packages you were using.  So, if someone asked you this question:

> Hey, are we using any GPLv2 stuff?

You'd have no idea.  The same happens with raw `pip`.

When Bundler came out, I rejected it and kept using rvm gemsets.  But there was a major difference.  Bundler solved the dependency tree while doing isolation.  This was something I didn't understand.  When someone told me that my gemset was just going become polluted, I said this was no big deal.  I would just delete my gemset and then `gem install` all the libraries I needed.  Maybe I could make a list of gems I needed in a text file in the project root.


I never tried Bundler and I didn't know what problem it was solving.


## When I Changed My Mind

So, I had my own devised system, mostly out of habit.  The workflow was very similar to pip with `requirements.txt`.  Except back then, we used `README.md` as a list of dependencies.  It was pretty terrible for repeatability but also just developer experience in general.

This is how classic pip with `requirements.txt` would work too.  `pip install -r requirements.txt` is append-only to your environment.  There's no cleanup function.  `pip list` shows you all your downstream dependencies but `requirements.txt` only shows you what you want.  If you remove a top-level dependency, it's hard to cleanup the transitive dependencies.  So, people delete their virtualenvs just like I did with gemsets.

Bundler came on the scene and I rejected it.  "I have gemsets, why do I need Bundler?"  But Bundler was doing something more than just project separation.  Bundler was giving me higher level commands, semver and a lockfile I did not have to serialize to a README or a text file.

```
# usage of bundler
bundle init
bundle add some-library
git add Gemfile Gemfile.lock

# a user of my code
bundle install
```

This is compared to
```
rvm gemset create my-project
gem install some-library
# update README.md with some-library "hey, this project needs some-library"

# a user of my code
gem install some-library
```

The only caveat to bundler is that I need to prefix all commands with `bundle exec` because bundler did not use shell tricks to change ENVs or paths.  So if I wanted to see all the gems I have listed: `bundle exec gem list`.  I mitigate this by using an alias for `be=bundle exec`.


## The Equivalent with Poetry

The amount of commands with Bundler and Poetry is about the same.

```
poetry init -n
poetry add some-library
git add pyproject.toml poetry.lock

# a user of my code
poetry install
```

The only caveat with poetry is that I need to prefix all commands with `poetry run` so `poetry run pytest`.  I mitigate this by using an alias for `pr=poetry run`.


## Ruby Has Known About Poetry

So, Ruby already went through the poetry transition.  We learned a few things:

* Don't install libraies with gem install.
* Lock your dependencies.
* Prefixes on commands are annoying but sub-shell or shell tricks are worse.
* Lock files are good.
* Conventions are good.

After I started using Bundler, I never went back to even another style.  When I tried Go for 4 years, I used `gb` and other tools until `go.mod` was finalized.  It was similar with Python.  I searched for a Bundler-like tool and found Pipenv.  Pipenv's resolver failed me on a project and Poetry did not.  I switched to Poetry.  When I started with Rust, Cargo was very familiar because [the people](https://github.com/rust-lang/cargo/commits?author=wycats) that worked on Cargo [came from](https://github.com/rust-lang/cargo/commits?author=carllerche) the Ruby community.

Lately, pip has been changing over to a [pyproject.toml](https://pip.pypa.io/en/stable/reference/build-system/pyproject-toml/) format which has a higher level of abstraction.  I'm glad.  It seems like pip is becoming more like Poetry.  That's fine, let the ideas be shared.  I would use a Bundler-like tool, no matter the name.  You could even say I would use a Cargo-like tool.  The trickiest part of Poetry has been convincing people to try it and I went through the same thing with gemsets.
