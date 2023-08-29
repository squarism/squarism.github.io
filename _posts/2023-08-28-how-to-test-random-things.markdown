---
layout: post
status: published
published: true
title: How To Test Random Things
date: 2023-08-28
---

Let's say we had a program that interacts with something that is random.  This could be a random number function we can sort of control or it could be something out of our control.  Let's step through three examples, where the last one is random but wildly different.

Our program depends on this function.  How do we know our program works?

## Mock the Randomness

Our program is just consuming the random function.  If we print out the random number, we just need a number.  We don't care if the number is random or not.  So the answer is simple: just avoid the randomness of the function.

It's [the XKCD comic 221](https://xkcd.com/221/).

```java
int getRandomNumber()
{
  return 4;  // chosen by fair dice roll.
             // guaranteed to be random.
}
```

So, we could basically do the same by mocking out the random function to return `4`.  Problem avoided.


## Leverage the Seed

If we need to functionally test what happens in different cases, maybe mocking the random function isn't good enough.  What if the number `9` crashes our program for some reason.  We want `9` to be returned by the random number generator but also in a more complicated program (say a map generator), we might want to reproduce the state exactly for when `9` happens.

This is pretty easy to deal with, we just pass [a seed](https://en.wikipedia.org/wiki/Random_seed) in.  Many things use this technique:

- A test suite's order in [pytest-random-order](https://pypi.org/project/pytest-random-order/) and [rspec](https://rubydoc.info/gems/rspec-core/RSpec%2FCore%2FConfiguration:seed).
- The minecraft `/seed` command so your friends can play the map you have.
- An avatar generator might have a seed as well as other inputs.

Using the seed, you can replay or inspect the randomness as a way to make the behavior deterministic.

Not everything can be made deterministic in a sort of clean room setting.


## AI Models

Let's take a sharp turn and assume that the context you are in is AI, Machine Learning (ML) or LLMs.  Suddenly we are encountering a very different kind of randomness.  These models are not deterministic and they don't have a seed.  We can test our program around the randomness with mocking, perhaps.  But what about the model itself?  What if we need to know that *it* works?

So, what are we talking about here?  How do we know our model works?  How do you test a model?  How do you compare two models?  How do you figure out if you have improved your model when you release a new version?  How do we know if ChatGPT 4 is better than 3.5 beyond anecdotes?  How does OpenAI determine that ChatGPT 4 is so good that it should be a paid upgrade over 3.5?

The answer is evaluation but I want to break down what an evaluation is a bit.  I have to caveat that my experience with ML evaluations is mostly surface level from proximity to research, PHDs, etc.  I have never designed an evaluation, so my numbers here might be very rough.  I'll also caveat that my specific examples (like Llama 2) are locked in time to the publish date of this post.

Let's say that we wanted to see if [Llama 2](https://ai.meta.com/llama/) is worse at generating Rust code than [Llama 2 Code](https://about.fb.com/news/2023/08/code-llama-ai-for-coding/) is.  Seems reasonsable, right?  Llama Code was made for coding and Llama was not.  So, how do we really know?  The models are not deterministic.  We can ask it the same question and we will get different answers.  We can't mock anything because we don't want to test the code _around_ the model, we want to test the model.  There is no seed or anything to make it deterministic.  And, we can't inspect the model because [these models are not](https://medium.com/gsi-technology/making-large-language-models-more-explainable-b8215696a659) really [explainable](https://en.wikipedia.org/wiki/Explainable_artificial_intelligence) (or at least easily).

So, our previous approaches don't work.  We need a new approach.  The new approach will be to throw experiments at it and measure our results using some methodology.  There are many methodologies but for the sake of brevity, we'll use the classic [F1 score](https://en.wikipedia.org/wiki/Precision_and_recall).  I'm not going to go into how that works but how the evaluation would roughly be run.

The rough steps are going to be:

1. Generate or obtain ground truth questions and answers and call it the "Test Data".
2. Keep the answers secret from the model.
3. Give the Llama 2 model each question from the Test Data and note its answer.
4. Do the same for the Llama 2 Code model.
5. Score the results.

These steps are easier said than done.  Let's try to break this down even more.  What is involved in step 1?

### Step 1 - Generate Rust Questions

One question will be this:

```
Generate hello world in Rust.
```

And the answer we expect is this:
```rust
fn main() {
    println!("Hello, World!");
}
```

We (as humans) all agree that this is the result that we expect given the question/prompt.  No more context is allowed.  This is one question and answer pair in our "Test Data" set.  We might aim for 200 or 1,000 such questions.  We might aim for a diverse set of questions, things way beyond hello world.  As we select what we care about, we add bias to our evaluation.  But bias is a different topic.

Step 2 is simply file organization, really.  This is more important if we were fine-tuning Llama or making a model ourselves.  But since Llama 2 models are already done, we can just move on.

As a side note, sometimes generating ground truth and test data can take a team of many people, many months to create.

### Step 3 and 4 - Runs

For each question, run the model with the question.  If we have Llama running somewhere, hit the API and record the result.  We'll get to the hard problem in Step 5.  Repeat the calls for the other model.  Organize the results.  Maybe you have something like this:

```
results/llama_2/0001.json
results/llama_2/0002.json
...
results/llama_2_code/0001.json
results/llama_2_code/0002.json
...
```

### Step 5 - Scoring

Now the tricky part, scoring.  What we need is a very exact number for our F1 calculation.  But we have a text answer coming back.  Consider this answer for our _hello world_ question:

```rust
fn main() {
    println!("Hello, World!");
}
```

It's an exact match.  So, let's talk about how this is scored.  F1 score is calculated from 3 metrics around Precision and Recall:

    True Positives (TP): 1 (since the generated code is correct)
    False Positives (FP): 0 (since there are no incorrect results generated)
    False Negatives (FN): 0 (since there are no correct results missed)
    
    Precision = TP / (TP + FP)
    Recall = TP / (TP + FN)
    
Precision is sort of like a function of quality and Recall is a function of quantity.  They both have to be considered at the same time.  In this case (one question, one answer) our F1 score is `1.0`.  It doesn't get any better than that.  But our scorer is way too simple.  Consider this answer:

```rust
// this program prints hello world
fn main() {
    println!("Hello, World!");
}
```

We said that the generated code must match the answer.  It doesn't match the answer, even if we (as humans) know that code comments are ok.  A tool like `grep` would fail on the complete string match of our Test Data answers

    True Positives (TP): 0 (since the generated code is incorrect)
    False Positives (FP): 1 (since there are no incorrect results generated)
    False Negatives (FN): 0 (since there are no correct results missed)

What is our score now?  It's `0.0`.  But we (as humans) know that comments are ok, even encouraged in some cases.  So, how could we get around this?  We could pre-process our results to trim code comments to handle this specific case.  What else could we do?  Well, things get trickier after this point.  Our scorer would have to improve or we'd have to use random sampling (as human domain experts) or other techniques to score our results.  If we can make our scorer smarter then there is less and less manual work to do.  Maybe we could use [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) to fuzzy match bits of the program.  Maybe we could break it apart with a parser.  Maybe we could just run it and capture the results.  Otherwise, lots of manual work.

In the end, we might be able to score an answer like this:

```rust
fn main() {
    let message = format!("Hello, World!");
    println!("{}", message);
}
```
Eh, that's not really what we wanted but it's ok.  I give this a code quality score of 4/10 while marking it a True Positive.  Then we assign weights and review feedback as a group.  This process is very subjective and tricky.  This is also why F1 scores cannot be used in a vacuum.  Developers [are used to](https://en.wikipedia.org/wiki/The_Computer_Language_Benchmarks_Game) something like this.

The scoring process might take even more months to do and many iterations.  In the end, you would hopefully end up with a metric that you trust.  This would also be something you would revisit like other performance benchmarks.


### Wrap Up

Note how we had to have many questions and answer pairs.  Notice how we exploited certain truths about the data that we knew as humans:

1. We know Hello World should be an exact match because it's a simple program with [a long history](https://en.wikipedia.org/wiki/%22Hello,_World!%22_program).  In this case we are exploiting some string matching on `Hello, World!"` as the message to print.
2. We know that code comments are not important for our pre-processor.  We can exploit the beginning of lines `//` are filtered out or something.
3. We can possibly exploit string nearness with [Levenshtein distance](https://en.wikipedia.org/wiki/Levenshtein_distance) although this is most likely a bad path to go down.
4. We know programs are executable so we could just run the thing and see what happens.  This might involve changing our approach from string matching to having our ground-truth Test Data be actual Rust tests.


## Conclusion

The main point I'm trying to make is that in some cases, AI/ML have had a different approach to solving problems than general software and I think machine learning evaluations need to be more understood especially by those who are integrating.

Testing randomness is solvable and recognizable in general software.  I think I at least showed two basic approaches in about a paragraph while explaining evaluations even at a high level took a couple of pages.  I have read a lot of people telling one-off stories about ChatGPT making mistakes.  I think these are fine conversations to have as almost UX feedback but not as formal evaluations.  Formal is just the term people use for using a methodology.

This gets even more complicated when people who are integrating LLMs for the first-time and wondering if their idea "works".  In general software, we usually avoid this problem with other tricks like mocking or seeding.  I'm always curious how they are going to find out if they have not generated 100s of test data questions or know what an F1 score is.  I barely understand evaluations and certainly have not designed one.  I just have been around it a bit.

At the same time, I saw a determinism theme in PRNGs and the AI/ML domain and wanted to write a bit about it.
