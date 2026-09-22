---
title: "Changing the TextMate Comment Banner"
description: "I like to put a little date banner on files that are like a CHANGELOG. The Insert Comment Banner in Textmate is great for this. You just hit Ctrl+S..."
date: 2012-09-24T00:00:00.000Z
author: "SQUARISM"
draft: false
tags: ["blog"]
---

I like to put a little date banner on files that are like a CHANGELOG.  The Insert Comment Banner in Textmate is great for this.  You just hit Ctrl+Shift+B and this appears:

```text
=========
= Banner
=========
```

And the equal signs on top and bottom adjust as you type in "Banner".  It's pretty cool.  But what I wanted is a timestamp in the banner.  So I'd leave Banner highlighted and then right click in Textmate and select "Filter through command" and put the Unix command date in there.  That's great except it puts Fri Jan 20 21:46:13 EDT 2034 in there which is a bit long.
```text
===============================
= Fri Jan 1 21:46:13 EDT 2034
===============================
```

Too long.  So here's what you can do.  Go to Bundles->Bundle Editor->Show Bundle Editor.  Then go to the Source category.  You can filter at the top for Snippets if it's easier.  See this picture.

![snippet_banner](/uploads/2012/09/snippet_banner.png)

Then put this code in:

```perl
${TM_COMMENT_START/\s*$//}==${1/(.)|(?m:\n.*)/(?1:=)/g}==${TM_COMMENT_END/^\s*(.+)/ $1/}
${TM_COMMENT_START/\s*$//}= ${1:${TM_SELECTED_TEXT:`date +'%a %b %d %Y'`}} =${TM_COMMENT_END/\s*(.+)/ $1/}
${TM_COMMENT_START/\s*$//}==${1/(.)|(?m:\n.*)/(?1:=)/g}==${TM_COMMENT_END/\s*(.+)/ $1/}
```

This will give you a banner like this:
```text
===================
= Fri Jan 1 2034 =
===================
```

And it'll be the right length automatically.  Nice.
