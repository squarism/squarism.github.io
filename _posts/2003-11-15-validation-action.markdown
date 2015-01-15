---
layout: post
status: publish
published: true
title: Validation Action
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
excerpt: ! 'Finished coding a validation action that parses a word followed by an
  array of words.  For example, "ABC" would validate if "<b>A</b>nother <b>B</b>ad
  <b>C</b>reation" was passed with it.  This is going to be used in the ever complicated
  Acronym project that has been taking me forever to finish.


  It''s case insensitive, you can see the usage example in the ''main'' class.

'
wordpress_id: 29
wordpress_url: http://squarism.com/2003/11/15/validation-action/
date: !binary |-
  MjAwMy0xMS0xNSAxOTo0NjoxMSAtMDUwMA==
date_gmt: !binary |-
  MjAwMy0xMS0xNiAwMDo0NjoxMSAtMDUwMA==
categories:
- Blog
tags: []
comments: []
---
Finished coding a validation action that parses a word followed by an array of words.  For example, "ABC" would validate if "**A**nother **B**ad **C**reation" was passed with it.  This is going to be used in the ever complicated Acronym project that has been taking me forever to finish.

It's case insensitive, you can see the usage example in the 'main' class.

<!-- more -->

{% highlight java %}

/*
 * Created on Sep 20, 2003
 *
 */

/**
 * @author chris
 *
 */
public class ValidateThing {

  private String acronym;
  private String[] answer;

  /**
   * @param string
   * @param values
   * This object is used for validating the acronym
   * it parses 'string' and checks the first letter
   * of 'values'.  It should return 1 if the string
   * passes, 0 if it doesn't.
   */
  public ValidateThing(String string, String[] values) {
    acronym = string;
    answer = values;
  }

  public boolean isValid() {

    // keep a record of mistakes
    int errorCount = 0;

    // validate length
    if (acronym.length() != answer.length) {
      errorCount++; // wrong number of answers
    }

    // validate letter content
    try {

      // process string one character at a time
      for (int i = 0; i <acronym> 0) {
      return false;
    } else {
      return true;
    }
  }

  // cheap unit test
  public static void main(String[] args) {
    String acronym = new String("java");
    String[] values =
      new String[] { "JUst", "another", "vague", "acronym" };
    ValidateThing validateThing = new ValidateThing(acronym, values);

    if (validateThing.isValid()) {
      System.out.println("yay!");
    } else {
      System.out.println("boo!");
    }
  }

}
{% endhighlight %}