---
title: "YAML and Maps in Go"
description: "This wasn't exactly clear. When using the gopkg.in/yaml.v2 or gopkg.in/yaml.v1 packages, I was confused as to what to do with my data structure."
date: 2014-10-13T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

This wasn't exactly clear.  When using the gopkg.in/yaml.v2 (or gopkg.in/yaml.v1) packages, I was confused as to what to do with my data structure.

Let's say we start off with this file.yml:

```yaml
description: fruits are delicious
fruits:
  apple:
    - red
    - sweet
  lemon:
    - yellow
    - sour
```

Here's a complete example to read this file in and you get a parsed data structure out of it:

```go
package main

import (
  "fmt"
  "gopkg.in/yaml.v2"
  "io/ioutil"
  "path/filepath"
)

type Config struct {
  Description string
  Fruits map[string][]string
}

func main() {
  filename, _ := filepath.Abs("./file.yml")

  yamlFile, err := ioutil.ReadFile(filename)
  check(err)

  var config Config

  err = yaml.Unmarshal(yamlFile, &config)
  check(err)

  fmt.Printf("Description: %#v\n", config.Description)
  fmt.Printf("Fruits: %#+v\n", config.Fruits)
}

func check(e error) {
  if e != nil {
    panic(e)
  }
}
```

What is `Fruits map[string][]string` in the Config type?  It's `foo: ['a', 'b', 'c']`.

This is roughly equivalent to what I would do in Ruby.  Of course the Ruby code is much shorter because
in Ruby, typically we abuse hashes.  :)  The surprise I had is this: **when the YAML
changes, we have to update our `type Config`**.  I'm ok with this.  I was just surprised by a few things.

First, the keys are significant.  If we change the YAML to be:

```yaml
description: fruits are delicious
tambourines:
  apple:
    - red
    - sweet
  lemon:
    - yellow
    - sour
```

It won't work.  But HOW it won't work is confusing.

```text
Description: "fruits are delicious"
Fruits: map[string][]string(nil)
```

You'll get an empty map until you change your type to have Tambourines in it.  You can't just access
`.Tambourines` either.  The type/struct won't have a method on it.  So this is the trick and benefit the package
gives you.  You just model your YAML and it maps the keys for you.  But you have to "know" what your
YAML (dare I say schema?) is.  So would you then validate that it loaded correctly by checking lengths
etc?

Now what happens when you get it really wrong?

<!-- more -->

```text
"cannot unmarshal !!seq into map"
```

Here I've tried mapping yaml like this

```yaml
- one:
  blah
- two
  blah
- three
  blah
```

Into a data structure that really expects

```yaml
one:
  - blah
two:
  - blah
three:
  - blah
```

And this behavior is different between the v1 and v2 package.  I just ended up thinking that `seq` means `[]`.

Let's look at another example.  Going back to our original `file.yml`, let's compare what changes to the
fruits struct when the yaml changes.  Ignore the description data, that's easy.

```yaml
fruits:
  apple:
    - red
```

```go
Fruits map[string][]string
// Fruits have properties.  You have success.
```

We want this YAML now.  What needs to change in Go?

```yaml
fruits:
  - apple:
    - red
```

```go
Fruits []map[string][]string
// There are more fruits now.  Good job, fruit adventurer.
```

This is because apple has become an array value and not a key.  In other words, we can have many apples
in the second example but not the first.  What happens if we try this?

```yaml
fruits:
  apple:
    - red
  apple:
    - green
```

```go
Fruits map[string][]string
// Fruits cannot coexist.  You have unwittingly caused fruit murder.
```

The second green apple stomps on the red apple.  `Fruits: map[string][]string{"apple":[]string{"green"}}`  So it depends on what you want.

### Conclusion

I hope this helps to clarify the magic, or perhaps the relationship,
between Go structs and YAML structures.  For the beginner like me
understanding maps was key as well as the syntax around maps of arrays.
It also helps greatly to play with more sample data than just an array
of one.  The difference between a list and a set is only obvious when
there's collisions.

I will happily refer back to this post myself the next time I do
serialization in Go.
