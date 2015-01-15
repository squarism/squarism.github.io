---
layout: post
status: publish
published: true
title: Made useful build.xml file for use with Ant
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
excerpt: ! "The following build.xml file has a few targets that make compiling a project
  much simplier.  Read on for more details.\r\n\r\nI have the following directory
  structure:\r\n\r\n<pre>\r\n(chris@hobbes)-(BackupLink)$ ls -l\r\ntotal 20\r\ndrwxrwxr-x
  \   3 chris    chris        4096 Apr 21 00:07 bin\r\n-rw-rw-r--    1 chris    chris
  \       2776 Apr 21 00:15 Build.xml\r\ndrwxrwxr-x    2 chris    chris        4096
  Apr 13 19:07 CVS\r\ndrwxrwxr-x    2 chris    chris        4096 Apr 20 14:32 include\r\ndrwxrwxr-x
  \   4 chris    chris        4096 Apr 21 00:06 src\r\n</pre>\r\n\r\n<p>\r\nIn
  Eclipse, I set the project preference to make [project root]/src the only folder
  on the source path.  Lastly, I set bin to be the output folder.  The ant script
  grabs any jars out of include (mostly useless to me).\r\n\r\n<p>\r\nWhen
  I want to create a jar, I just run the jar target.  I removes the java source files
  before creating the jar archive.  You can also increment the version number to create
  'releases'.  This is the best I can come up with right now.\r\n\r\n\r\n"
wordpress_id: 23
wordpress_url: http://squarism.com/2003/04/21/made-useful-buildxml-file-for-use-with-ant/
date: !binary |-
  MjAwMy0wNC0yMSAwMDozMDo0NyAtMDQwMA==
date_gmt: !binary |-
  MjAwMy0wNC0yMSAwNTozMDo0NyAtMDQwMA==
categories:
- Blog
tags: []
comments: []
---
The following build.xml file has a few targets that make compiling a project much simplier.  Read on for more details.

I have the following directory structure:

<pre>
(chris@hobbes)-(BackupLink)$ ls -l
total 20
drwxrwxr-x    3 chris    chris        4096 Apr 21 00:07 bin
-rw-rw-r--    1 chris    chris        2776 Apr 21 00:15 Build.xml
drwxrwxr-x    2 chris    chris        4096 Apr 13 19:07 CVS
drwxrwxr-x    2 chris    chris        4096 Apr 20 14:32 include
drwxrwxr-x    4 chris    chris        4096 Apr 21 00:06 src
</pre>

In Eclipse, I set the project preference to make [project root]/src the only folder on the source path.  Lastly, I set bin to be the output folder.  The ant script grabs any jars out of include (mostly useless to me).



When I want to create a jar, I just run the jar target.  I removes the java source files before creating the jar archive.  You can also increment the version number to create 'releases'.  This is the best I can come up with right now.

<!-- more -->

{% highlight xml %}
<?xml version='1.0'?>

<project name="BackupLink" default="jar" basedir=".">
  <!-- set global properties for this build -->
<property name="version" value="0.1" />
<property name="src" value="src"/>
<property name="build" value="build"/>
<property name="jarname" value="backUplink.${version}.jar"/>
<property name="docs" value="docs"/>
<property name="include" value="include"/>
<property name="lib"  value="lib"/>
<property name="runclass" value="com.squarism.backUplink.BackUplink"/>
<property name="classpath"  value="classes"/>
  <target name="init">
      <!-- Create the build directory structure used by compile -->
      <mkdir dir="${build}" />
      <mkdir dir="${build}/classes" />
    <!-- Create the directory for the jar file -->
      <mkdir dir="${lib}" />
    <!-- Create the directory for the java docs -->
      <mkdir dir="${docs}" />
  </target>
  <target name="compile" depends="init">
    <!-- copy all .java files from ${src} to ${build}  -->
    <copy todir="${build}/">
      <fileset dir="${src}" />
      <!-- apply a substitution @version@ with the value of ${version} -->
      <filterset>
        <filter token="version" value="${version}"/>
      </filterset>
    </copy>
    <!-- run javac to compile the source files -->
    <javac srcdir="${build}" destdir="${build}">
      <classpath>
        <!-- use the value of the ${classpath} property in the classpath -->
<pathelement path="${classpath}"/>
        <!-- include all jar files  -->
        <fileset dir="${include}">
          <include name="**/*.jar"/>
        </fileset>
      </classpath>
    </javac>
  </target>
  <target name="jar" depends="compile">
    <delete>
      <fileset dir="${build}" includes="**/*.java"></fileset>
    </delete>
      <!-- make a jar file -->
      <jar jarfile="${lib}/${jarname}" basedir="${build}" manifest="${build}/manifest" />
  </target>
  <target name="run" depends="jar,docs">
    <!-- run the class -->
    <java classname="${runclass}">
      <!-- add a command line arg: <arg value="-h"/> -->
      <classpath>
        <!-- use the value of the ${classpath} property in the classpath -->
<pathelement path="${classpath}"/>
        <!-- include all jar files  -->
        <fileset dir="${include}">
          <include name="**/*.jar"/>
        </fileset>
        <fileset dir="${lib}">
          <include name="**/*.jar"/>
        </fileset>
      </classpath>
       </java>
  </target>
  <target name="docs" depends="compile">
    <!-- create javadocs -->
    <javadoc packagenames="com.squarism.backUplink.*"
    sourcepath="${build}"
    defaultexcludes="yes"
    destdir="${docs}"
    author="true"
    version="true"
    use="true"
    windowtitle="BackUplink API Documentation Version: ${version}">
    </javadoc>
  </target>
  <target name="clean">
    <delete dir="${build}"/>
    <delete dir="${docs}"/>
    <delete dir="${lib}"/>
  </target>
</project>

{% endhighlight %}