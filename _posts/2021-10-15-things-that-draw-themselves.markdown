---
layout: post
status: published
published: true
title: Things That Draw Themselves
date: 2021-10-15
---

<img alt="Photo by Sebastian Svenson (unsplash.com/@sebastiansvenson) on Unsplash" style="width: 100%; margin: auto;" src="/uploads/2021/discs.jpg" />  

In game development, you will probably have a player object that you need to draw to the screen. Whenever I was making generative art or a small game, having a thing drawing itself was really great.  In React or other JS frameworks, the same concept exists but we don't think of it this way.  Moving to functional components is hiding the `render` function a bit but this is what's happening.  There's an object/function that _knows_ how to draw itself.

```jsx
function Welcome(props) {
  return <h1>Hello, {props.name}</h1>
}
```

When I'm making CLIs, I try to do the same thing.  Instead of putting a mix of logic and presentation in a switch/case statement, I can make a sort of command object that knows how to draw itself.


## An Example Without Drawing

Let's make a really, really contrived todo list app.  Typically we'd probably use a cli library or something.  This might make separating the options from the logic slightly different but you can follow the same pattern here.

```ruby
def main
  todos = [
    { name: "Make lunch" },
    { name: "Whistle math metal" }
  ]

  if ARGV[0] == "print"
    puts todos
  end
end

main

# ruby drawless.rb print
# {:name=>"Make lunch"}
# {:name=>"Whistle math metal"}
```

Nothing exciting here.  I think a lot of people make CLIs like this.  But then it grows and they are left with procedural messes.  Instead we can make a thing that draws itself.


## Drawing Example

```ruby
class TodoList
  def initialize(items)
    @items = items
  end

  def render
    @items
  end

  def print
    puts render
  end
end


def main
  todos = [
    { name: "Make lunch" },
    { name: "Whistle math metal" }
  ]

  if ARGV[0] == "print"
    list = TodoList.new(todos)
    list.print
  end
end

main
```

Your first reaction might be _"that's the same thing with more steps".  It's true.  It is the same thing.  The invocation stayed the same and really the internal data stayed the same.  The big difference here is organization and testability.  The `print` method only does `puts` and the `render` method knows what to present to `print`.  So, when you write a test, it's super easy.  You just test `render` and you have extreme confidence that puts is going to work.  You don't need to test `puts` [because you don't own that code](http://squarism.com/2021/08/13/dont-test-code-you-dont-own/).

Let's write a test inline here just to show how this works.  You'll have to invoke the program with `rspec cli_drawing.rb` instead of running it like a script.  This is just to avoid making a whole project.

```ruby
class TodoList
  def initialize(items)
    @items = items
  end

  def render
    @items
  end

  def print
    puts render
  end
end

describe TodoList do
  subject { described_class.new(todos) }

  let(:todos) { [
    { name: "Make lunch" },
    { name: "Whistle math metal" }
  ]}

  it "prints a todo list" do
    expected = [{:name=>"Make lunch"}, {:name=>"Whistle math metal"}]
    expect(subject.render).to eq(expected)
  end

end
```

And then you can test or create your CLI runner in isolation.  The CLI runner's job isn't to print or render but to call commands.  This is easy to test and write.

Things that draw themselves end up being very clean objects. If you are in a functional language, you will still have modules. Modules can be organized in the same way. When you think about things drawing themselves, you are making clear lines of responsibility which will help you.
