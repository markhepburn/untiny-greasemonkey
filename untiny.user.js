// Untiny GreaseMonkey Script
// version 1.1
// 2009-07-22, Mark Hepburn
// version 1.0
// 2008-10-09
// Copyright (c) 2008, UnTiny (by Saleh Al-Zaid. http://www.alzaid.ws)
// Website: http://untiny.me/
//
// License:
// Released under the Creative Commons Attribution-No v3.0 license
// http://creativecommons.org/licenses/by-nd/3.0/
//
// Description:
// Untiny GreaseMonkey Script is a greasemonkey
// script of UnTiny Servive (http://untiny.me)
// to extract the original urls from tiny one
// like tinyurl.com, tiny.pl  and many others.
//
// The original script would change the tiny urls links directly to
// the original links.  This version simply displays an icon with the
// original link, so you can preview it and decide which/whether to
// click, without altering the author's text too much.  Additionally,
// if you are using firefox 3.5 or greater, it will use the native
// support for JSON parsing instead of calling eval() (avoiding a
// security risk).
//
// To make it work you need to install Greasemonkey 0.3
// or later from http://greasemonkey.mozdev.org/
// ------------------------------------------------------------------
// ==UserScript==
// @name           Untiny
// @namespace      http://untiny.me/
// @description    Extract the orignal urls from tiny urls. Untiny supports several tiny url services like tinyurl.com, tiny.pl and many more.
// @include        *
// @exclude        http://bit.ly/*
// ==/UserScript==


this.api_endpoint = 'http://untiny.alzaid.ws/api/1.0/';
this.script_version = '1.1';
this.services;
this.untinyIconStyle = 'margin: 1px; padding: 2px; border: 1px #ccc solid; background: white;';

main();

function getTinyServices() {
  (function() {
     GM_xmlhttpRequest({
       method: 'GET',
       url: this.api_endpoint + 'services?format=json',
       headers: {'User-Agent': 'UnTiny Greasemonkey Script version '+this.script_version},
       onload: function(response) {
         if (typeof(response.responseText) === 'undefined') {
           services = 'undefined';
         } else {
           // only firefox >= 3.5 supports native JSON:
           if (typeof(JSON) === 'undefined') {
             services = eval('(' + response.responseText + ')');
           } else {
             services = JSON.parse(response.responseText);
           }
           convertLinks();
         }
       }});
   }) ();
};

function convertLinks(){
  links = document.evaluate(
    '//a[@href]',
    document,
    null,
    XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE,
    null);

  for (var i = 0; i < links.snapshotLength; i++) {
    var link = links.snapshotItem(i);
    var domainRE = /(http:\/\/)?([^\/]+)/; // we are interested in the domain; group 2

    var match = domainRE.exec(link.href);
    var domain = match ? match[2] : null;

    // if we've managed to extract the domain (shouldn't really fail
    // all that often), and the domain is listed in the untiny-d
    // services, create an icon with the original target:
    if (domain && domain in services) {
      var icon_link = document.createElement('a');
      icon_link.setAttribute('href', link);
      icon_link.setAttribute('id', 'untiny_link_id_' + i);
      var icon = document.createElement('img');
      icon.setAttribute('src','http://untiny.alzaid.ws/extra/untiny.png');
      icon.setAttribute('style', this.untinyIconStyle);

      icon_link.appendChild(icon);
      link.parentNode.insertBefore(icon_link,link.nextSibling);

      (function (old_href, iconElmnt, iconLinkElmnt) {
         GM_xmlhttpRequest({
           method:'GET',
           url: this.api_endpoint + 'extract?url=' + old_href +'&format=text',
           onload: function(o) {
             var new_href = o.responseText;
             iconElmnt.setAttribute('title', new_href);
             iconLinkElmnt.href = new_href;
           }
         });
       }) (link.href, icon, icon_link);
    }
  }
}

function main(){
  getTinyServices();
}

