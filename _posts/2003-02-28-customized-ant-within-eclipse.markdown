---
layout: post
status: publish
published: true
title: Customized Ant Within Eclipse
author:
  display_name: squarism
  login: chris
  email: squarism@gmail.com
  url: ''
author_login: chris
author_email: squarism@gmail.com
excerpt: ! '<p>

  Restarting Tomcat everytime I deployed with the <a href="">Lomboz Eclipse plugin</a>
  was proving to be too lengthy, so I set out trying to customize Ant a bit.

  </p>

'
wordpress_id: 13
wordpress_url: http://squarism.com/2003/02/28/customized-ant-within-eclipse/
date: !binary |-
  MjAwMy0wMi0yOCAwMDoxMzo1NiAtMDUwMA==
date_gmt: !binary |-
  MjAwMy0wMi0yOCAwNToxMzo1NiAtMDUwMA==
categories:
- Blog
tags: []
comments: []
---
<p>
Restarting Tomcat everytime I deployed with the <a href="">Lomboz Eclipse plugin</a> was proving to be too lengthy, so I set out trying to customize Ant a bit.
</p>
<a id="more"></a><a id="more-13"></a></p>
<p>
The following files were edited from the Lomboz generated <i>webapp</i> defaults.  ie: create a project and edit the files found under WEB-INF.
</p></p>
<p>
The generated Ant config files copy all the compiled classes (redundant), the plain JSPs and all directories under WEB-INF to a temporary space  jars it all up and copies that JAR to the webapp folder in tomcat.  I didn't want that.  I just want the directory structure to be copied so that I can make changes faster and shorten my testing lifecycle (ooo buzzword).
</p></p>
<p>
Here's my build.properties:</p>
<pre>
domain = /home/chris/jakarta-tomcat-4.1.12-LE-jdk14/webapps
serverhome = /home/chris/jakarta-tomcat-4.1.12-LE-jdk14/
build = ../../acronym/WEB-INF/classes
webapp = acronym
</pre>
</p></p>
<p>
And here's my build.xml:</p>
<pre>
&#60;project name="AcronymChallenge"  default="deploy"  basedir="."&#62;</p>
<p>  &#60;!-- set global properties for this build --&#62;
  &#60;property file="build.properties"/&#62;
  &#60;property name="dist" value="${domain}/${webapp}" /&#62;
  &#60;property name="web" value="../" /&#62;</p>
<p>  &#60;target name="init"&#62;
    &#60;!-- Create the dist directory structure used by compile
         and copy the deployment descriptors into it--&#62;
    &#60;mkdir dir="${dist}"/&#62;
    &#60;mkdir dir="${dist}/WEB-INF"/&#62;
    &#60;mkdir dir="${dist}/WEB-INF/classes"/&#62;
    &#60;mkdir dir="${dist}/WEB-INF/lib"/&#62;
    &#60;copy todir="${dist}"&#62;
      &#60;fileset dir="${web}"&#62;
        &#60;include name="**/*.*"/&#62;
        &#60;exclude name="**/jsp_servlet/*.class"/&#62;
        &#60;exclude name="**/build.xml"/&#62;
        &#60;exclude name="**/build.properties"/&#62;
        &#60;exclude name="**/servers.xml"/&#62;
        &#60;exclude name="**/container.xml"/&#62;
        &#60;exclude name="**/*.war"/&#62;
      &#60;/fileset&#62;
    &#60;/copy&#62;
    &#60;copy todir="${dist}/WEB-INF/classes"&#62;
      &#60;fileset dir="${build}"&#62;
        &#60;include name="**/*.*"/&#62;
        &#60;exclude name="**/jsp_servlet/*.class"/&#62;
      &#60;/fileset&#62;
    &#60;/copy&#62;</p>
<p>  &#60;/target&#62;</p>
<p>  &#60;target name="deploy" depends="undeploy,init" &#62;
	&#60;copy todir="${dist}"&#62;
		&#60;fileset dir="${web}"&#62;
        &#60;include name="**/*.*"/&#62;
        &#60;exclude name="**/jsp_servlet/*.class"/&#62;
        &#60;exclude name="**/build.xml"/&#62;
        &#60;exclude name="**/build.properties"/&#62;
        &#60;exclude name="**/servers.xml"/&#62;
        &#60;exclude name="**/container.xml"/&#62;
        &#60;exclude name="**/*.war"/&#62;
      &#60;/fileset&#62;
    &#60;/copy&#62;
    &#60;copy todir="${dist}/WEB-INF/classes"&#62;
      &#60;fileset dir="${build}"&#62;
        &#60;include name="**/*.*"/&#62;
        &#60;exclude name="**/jsp_servlet/*.class"/&#62;
      &#60;/fileset&#62;
    &#60;/copy&#62;
  &#60;/target&#62;</p>
<p>  &#60;target name="undeploy"&#62;
  &#60;!-- Tomcat --&#62;
  &#60;delete dir="${domain}/${webapp}"/&#62;
  &#60;!-- Tomcat 4.0.x--&#62;
  &#60;delete dir="${serverhome}/work/localhost/${webapp}"/&#62;
  &#60;!-- Tomcat 4.1.x--&#62;
  &#60;delete dir="${serverhome}/work/Standalone/localhost/${webapp}"/&#62;</p>
<p>  &#60;/target&#62;</p>
<p>&#60;/project&#62;
</pre></p>
