---
layout: post
status: publish
published: true
title: Acronym Project - Ant and Eclipse
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
excerpt: ! 'Having some problems getting Ant running the way I want to.  It''s another
  question of whether the IDE (Eclipse) is being too inflexible or if I''m not doing
  something right.  Eclipse doesn''t ship with functionality that allows  ant build
  options.  Here''s a log of what I''ve been trying.

'
wordpress_id: 19
wordpress_url: http://squarism.com/2003/03/30/acronym-project-ant-and-eclipse/
date: !binary |-
  MjAwMy0wMy0zMCAxMjoyMTowMCAtMDUwMA==
date_gmt: !binary |-
  MjAwMy0wMy0zMCAxNzoyMTowMCAtMDUwMA==
categories:
- Blog
tags: []
comments: []
---
Having some problems getting Ant running the way I want to.  It's another question of whether the IDE (Eclipse) is being too inflexible or if I'm not doing something right.  Eclipse doesn't ship with functionality that allows  ant build options.  Here's a log of what I've been trying.

<!-- more -->

Trying to get Cactus / JUnit automated.  Added this to my build.xml:

<pre>
  <target name="junit.cactus">
    <junit printsummary="yes" haltonfailure="yes" haltonerror="yes" fork="yes" />
    <classpath refid="classpath.project" />
<formatter type="plain" usefile="false" />
    <batchtest fork="yes" todir="build">
      <fileset dir="src">
        <include name="**Test*.java" />
      </fileset>
    </batchtest>
  </target>
</pre>

But it seems that the Eclipse Ant pluging doesn't ship with the junit jar/functionality.  So I went to Preferences and tried to set my ANT_HOME to be my external install of ant (1.5.2).  When I looked at the build.xml file again in Eclipse, I got this horrible error:

<pre>
Buildfile: /home/chris/workspace/AcronymChallenge/acronym/WEB-INF/build.xml
BUILD FAILED: java.lang.VerifyError: (class: org/apache/xerces/parsers/IntegratedParserConfiguration, method: configurePipeline signature: ()V) Incompatible type for getting or setting field
Total time: 206 milliseconds
</pre>

After some research, I'm thinking that the cause of the problem is conflicting Xerces classes.  Eclipse must include Xerces somewhere as a part of it's core libraries (like under [Eclipse_Install_Dir]/plugins/org.apache.ant_1.5.2).  So I was at a dead end.  I signed up for an [Eclipse newsgroup account](http://www.eclipse.org/newsgroups/index.html) and hit the archives.  I found this.

<pre>
You are correct Christian.

The ant.jar and optional.jar provided with the Ant 1.5.* distributions
contain a manifest file that has classpath entries for the Xerces JARs.
If these JARs are in the same location as the ant.jar or optional.jar, these
Xerces JARs will be used to load the Xerces classes.

The classpath manifest entry has been removed in the Ant 1.6.* distribution.

HTH
Darins

"Christian van der Leeden"  wrote in message
news:b4kubc$tog$1@rogue.oti.com...
> Hi,
>
> I'm getting this behaviour even when
> following the advice from the build notes.
> You will have to remove the files from the file system
> (just removing them from the runtime panel in the preferences
> won't help, this is with ANT_HOME set).
>
> Christian
>
>
>
>
>
> Darin Swanson wrote:
> > From the build notes for 20030306:
> > Note: Adding the Xerces JARs to your runtime Ant classpath is no longer
> > required. In fact, adding these JARs can cause problems. The Xerces
classes
> > are loaded from the Xerces plugin provided with Eclipse.
> >
> >
> >
> > This change is a result of fixes for bugs:
> >
> > http://bugs.eclipse.org/bugs/show_bug.cgi?id=33117
> >
> > http://bugs.eclipse.org/bugs/show_bug.cgi?id=33664
> >
> > HTH
> > Darins
> >
> > "Christian van der Leeden"  wrote in message
> > news:b4kmk8$mq1$1@rogue.oti.com...
> >
> >>Hi,
> >>
> >>when setting the ANT_HOME directory to my normal
> >>ant 1.5.2 installation I get an error inside the "Run Ant..."
> >>panel (which appears context sensitive for the build.xml file)
> >>It says in the top panel:
> >>(class org.apache.xerces.parsers.IntegratedParserConfiguration, method:
> >>configurePipeline
> >>signature()V) Incompatible for getting or setting field).
> >>
> >>When deleting the xercesImpl.jar and xml-apis.jar this problem goes
> >>away. Is this related to:
> >>http://bugs.eclipse.org/bugs/show_bug.cgi?id=33117 ?
> >>
> >>Thanks
> >>
> >>Christian
> >>
> >
> >
> >
>
</pre>

So then I attemped to use Ant 1.6 (alpha).  I got the same error.  I tried to remove xercesImpl.jar from the filesystem but then got:

<pre>
Buildfile: /home/chris/workspace/AcronymChallenge/acronym/WEB-INF/build.xml
BUILD FAILED: Target `(class: org/apache/xerces/parsers/IntegratedParserConfiguration' does not exist in this project.
Total time: 243 milliseconds
</pre>

So I tried a series of adding jars, removing jars, editing plugins, adding a junit task under the Ant Perferences.  Nothing seemd to work.  I finally found this suggestion:

<pre>
<requires>
  <import plugin="org.apache.xerces"/>
</requires>

To:

<requires>
  <import plugin="org.apache.xerces"/>
  <import plugin="org.junit"/>
</requires>

This should make the junit ant task work ;-)
</pre>

The ant task is there, it just doesn't seem to do anything.  The build is displayed as **successful** but I know that most of my tests fail.  Now I'm questioning what I'm actually trying to accomplish.  Although I have junit as an Ant task, Eclipse doesn't have the tight integration I wanted.  I'm going to play with Ant outside of Eclipse and/or use Eclipse's integrated JUnit plugin for TestSuites.

