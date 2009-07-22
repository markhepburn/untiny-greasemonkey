Untiny.ws
=========

[Untiny.ws](http://untiny.ws) is a service that expands a huge number
(164, at time of writing!) of URLs as shortened by bit.ly, is.gd, etc.
It's a very clean, tidy, and performant site --- you should check it
out.

Greasemonkey
============

The site also offers an API, and there are a few add-ons that take
advantage of this such as firefox plugins and native apps, listed
[here](http://untiny.ws/extra/).  One of these, fairly naturally, is a
greasemonkey script.

Alterations
===========

This project is just a few custom alterations to this script.  The
original behaviour was to insert an icon after each shortened link it
found in the page, while it was processing, then when the link was
expanded it would be replaced with the original URL and the icon
removed.  There are two things I wanted to change about this:

* I wanted the text as the author had written it to remain, but to keep the icon in place as a link with hovertext, so you could additionally see the ultimate destination and decide whether or which to click.
* The original code retrieved the list of supported services as JSON and called eval() to parse it, which is a potential security risk. Firefox 3.5 supports JSON parsing natively, so I use that instead (you could also do something like add a script tag pulling in eg <http://www.json.org/json_parse.js>, wait for it to load, then use that --- but I don't care enough at this stage!)

I've also added bit.ly as an excluded site, because I do actually use
that, but you can do whatever you want of course.
