---
layout: post
status: publish
published: true
title: Misc Hackings
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
wordpress_id: 21
wordpress_url: http://squarism.com/2003/04/13/misc-hackings/
date: !binary |-
  MjAwMy0wNC0xMyAwMzozNTo1MiAtMDQwMA==
date_gmt: !binary |-
  MjAwMy0wNC0xMyAwODozNTo1MiAtMDQwMA==
categories:
- News
tags: []
comments: []
---
Played around with [Opera 7.1](http://www.opera.com/graphics/docs/screenshots/opera-7-linux.png).  Very nice rendering, but a little buggy.  Horrible mail client.  Uninstalled all older versions of Mozilla on my workstation and went with [Mozilla 1.4a](http://www.mozillazine.org/screenshots/).  Was an adventure.



Got rid of evolution.  Love it, but it's not GTK2 yet.  The GTK2 beta is too unstable.  It's a shame because [GTK2 rules](http://art.gnome.org/show_screenshot.php?screenshotID=17&amp;ARTSESSID=ae6076a06ca706a4a15795195843886e).



Got some more functionality working on my side project "backUplink" which is a utility for Introversion's hacking game "Uplink".  It backs up your character so you don't lose your entire character.  Very close to done.



Read on to see the Java source code to an Application Preferences storage class.

<!-- more -->

Here's ConfigWorker.java.  It reads and writes persistent storage which can be used to save app preferences/configurations.  Like: "user's last swear word = crapfully".  That way, the app knows what the user's last swear word was when the app is started again (this is the persistance).  :)



Package below needs to be changed if you want to use it (unless you like com.squarism ...), make an empty file what is listed, run the main unit class and see how it works.


<pre>
/*
 * Created on Apr 12, 2003
 *
 */
package com.squarism.backUplink;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.util.Properties;

/**
 * @author chris
 *
 */
public class ConfigWorker {

  private File configFile;

  /**
   * @param string
   */
  public ConfigWorker(String string) {
    configFile = new File(string);;
  }

  /**
   * @param string
   * @param string2
   */
  public void writeConfig(String string, String string2) {
    Properties props = new Properties();
    try {
      props.load(new FileInputStream(configFile));
      props.setProperty(string, string2);
      //props.list(new PrintStream(new FileOutputStream(configFile)));
      props.store(new FileOutputStream(configFile), "header");
    } catch (FileNotFoundException e) {
      e.printStackTrace();
    } catch (IOException e) {
      e.printStackTrace();
    }
  }

  /**
   * @return Properties object
   */
  public Properties readConfig() {
    Properties props = new Properties();
    try {
      props.load(new FileInputStream(configFile));
    } catch (FileNotFoundException e) {
      e.printStackTrace();
    } catch (IOException e) {
      e.printStackTrace();
    }

    if (! props.isEmpty()){
      return props;
    }

    return null;
  }

  /**
   * Dirty Unit Test
   * @param args
   */

  public static void main(String[] args) {
    ConfigWorker configWorker;
    configWorker = new ConfigWorker("BackUplink.properties");
    configWorker.writeConfig("fileToMonitor", "/tmp/aFileToMonitor");
  }
}
</pre>

Works fairly well.  Be sure to change file paths and the like.  Your mileage may vary.

