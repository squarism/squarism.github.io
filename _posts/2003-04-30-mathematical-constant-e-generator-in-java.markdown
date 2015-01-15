---
layout: post
status: publish
published: true
title: Mathematical constant e generator in Java
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 24
wordpress_url: http://squarism.com/2003/04/30/mathematical-constant-e-generator-in-java/
date: !binary |-
  MjAwMy0wNC0zMCAyMzo1OTo1MyAtMDQwMA==
date_gmt: !binary |-
  MjAwMy0wNS0wMSAwNDo1OTo1MyAtMDQwMA==
categories:
- Blog
tags: []
comments:
- id: 5
  author: James
  author_email: ''
  author_url: ''
  date: !binary |-
    MjAwMy0wNS0wMSAxNTo1Nzo1MiAtMDQwMA==
  date_gmt: !binary |-
    MjAwMy0wNS0wMSAxOTo1Nzo1MiAtMDQwMA==
  content: ! "Try this optimization\n\n(Forgive the formatting)\n// -- Add
    a constant variable \npublic static final BigInteger BIG_INT_CONSTANT = BigInteger.valueOf(i);\n\n
    \n/* the useful stuff */\nprivate BigDecimal doCalculation() \n{\n    BigInteger
    factorialTotal = new BigInteger(\"1\");\n    BigDecimal bigE = new BigDecimal(\"1\");\n
    \n    for (int i = 0; i < numberOfDigits; i++) \n    {\n        /*\n         *
    The Following adheres to the formula:\n         * \n         * e = 1/0! +
    1/1! + 1/2! + 1/3! + 1/4! + ...\n         * \n         */\n
    \       \n        // increment factorial by multiplying itself by itself
    \ \n        factorialTotal = factorialTotal.add(\n            factorialTotal.multiply(BIG_INT_CONSTANT));\n
    \       // --                               ^^^^^^^^^^^^^     Use the
    constant variable     \n        // e grows and becomes more accurate\n
    \       bigE = bigE.add(\n            BIG_INT_CONSTANT.divide(new BigDecimal(factorialTotal),
    numberOfDigits, BigDecimal.ROUND_HALF_UP));\n        // --                                                                 ^^^^^^^^^
    \    Use the BigInteger parameter constructor     \n\n    }\n    \n    return
    bigE;\n}\n\n\n"
---
A small class to generate the mathematical constant "e".  Complete with timer and digits per second clock.  Unpolished.  Here's a quick benchmark and you can see that it doesn't scale.

![](/files/eBenchmark.png)

{% highlight java %}
import java.math.BigDecimal;
import java.math.BigInteger;
import java.util.Date;

/**
 * calculate mathmatical constant e
 */

public class ECalculator {
  private static final int numberOfDigits = 1000;
  public static void main(String[] args) {
    ECalculator myEClass = new ECalculator();
    System.out.println("Calculating e to " + numberOfDigits + " digits ...\n");
    Date start = new Date();
    BigDecimal e = myEClass.doCalculation();
    Date stop = new Date();
    long elapsedSeconds = (stop.getTime()-start.getTime()) / 1000;
    System.out.println("e is: \n" + e);
    if (elapsedSeconds

{% endhighlight %}