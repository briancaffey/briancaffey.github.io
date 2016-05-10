---

layout: post
date: 2016-05-09
title: Scraping hidden web data with PhantomJS
comments: true 

---

This is a short description of how I've used PhantomJS to scrape "hidden data" from a website. PhantomJS is a browser sans browser. There's no GUI, but you can simulate interactivity (such as clicking buttons, submitting forms, etc.) with JavaScript that you "inject" into the page as you access it. 

The Problem
---

I was interested in getting links that were displayed in lists on a many pages with URLs like `www.website.com/#page=1` with about 1,200 pages total. I started out using Python's [Requests](http://docs.python-requests.org/en/master/) library (HTTP for Humans), but I quickly found that the HTML I wanted wasn't showing up. I expected to see the following:

```html
<ul class="target-class">
	<li><a href="/link1">Link1</a></li>
	<li><a href="/link2">Link2</a></li>
	<li><a href="/link3">Link3</a></li>
</ul>

```
But the HTML returned by requests returned this: 

```html
<ul class="target-class"></ul>
```

The view-source HTML was also missing the inner `<li>`'s I was hoping to scrape. But I was able see the HTML I wanted with the 'Inspect' function in Chrome Dev Tools. I later learned that there JS changing the DOM, but I was already on the search for how to scrape hidden web data and came across [PhantomJS](http://phantomjs.org/) on Stack Overflow. 

PhantomJS
---

While it seems there is a lot that PhantomJS can do, I was having trouble piecing together the simple task that I needed done: feed PhantomJS a URL and have it return the HTML inside a `<div>` element with a certain class and output the content to a text file. 

Here's the bash script that I came up with outlining the process: 

```bash
#!/use/bin/env bash

for i in `seq 1 1200`;
do 
	phantomjs scrape.js "http://website.com/#page="$i > pages/pages_$i.txt
	delay=$(python -c "import random;print(random.uniform(61.0, 65.0))")
	sleep $delay
done
```

It's a simple loop that feeds the page number into PhantomJS argument and saves that standard output to a text file containing the name of the page number, then pauses for a variable amount of time between 61 and 65 seconds (in accordance with the `robots.txt` of my target site). 

The the `scrape.js` argument is a JavaScript file with the instructions for accessing and returning the data I need. Here's that file: 

```javascript
"use strict";
var system = require('system');
var args = system.args;
var page = require('webpage').create();
page.onConsoleMessage = function(msg) {
    console.log(msg);
};
var url = args[1];
page.open(url, function(status) {
    if (status === "success") {
            page.evaluate(function() {
                console.log(document.getElementsByClassName('target-class')[0].innerHTML);     
        });
    } else {
      console.log("not success");  
    }
phantom.exit(0);
});
```  
Let's take a closer look at what's going in inside `scrape.js`. I'm very much a beginner with JavaScript, and I don't fully understand how PhantomJS works, but I was able to get this working by using 'boiler plate' examples: [one](https://github.com/ariya/phantomjs/blob/master/examples/phantomwebintro.js) that demonstrates how to read elements from a webpage, [another](https://nicolas.perriault.net/code/2011/scrape-and-test-any-webpage-using-phantomjs/) that shows how to pass additional arguments into PhantomJS, and some [reference material](http://www.w3schools.com/js/js_htmldom_elements.asp) from W3Schools. 

The key part of the script is the `page.evaluate()` function which logs the innerHTML of the element I want by its class name. This function is run inside the `page.open()` function that takes the argument (the URL) we passed in with our bash script above. 

Python & BeatifulSoup
---

Lastly, here's the Python script with BeautifulSoup that returns a list of the relative URLs I wanted in the beginning:  

```python
import os
from bs4 import BeautifulSoup

os.chdir('/Users/me/Documents/path/to/pages')
all_links = []
for i in os.listdir(os.getcwd()):
    text = open(i, "r")
    html = text.read()
    b = BeautifulSoup(html)
    links = b.findAll('a', attrs={"class":"target-class"})
    for a in links: 
        link = a['href']
        all_links.append(link)
print all_links
```

This part is pretty straightforward: I navigate to the folder with the `pages_#.txt` files that were generated in the bash script, loop through each file and search for the `<a>` links (that share the same class as the target class). With better JavaScript skills I could probably return exactly what I want with `scrape.js`, but PhantomJS kept throwing errors so I just pulled out what I could and processed it with BeautifulSoup, a program with which I am much more familiar. 

I hope this gives you some ideas about how you might go about scraping data from a web page that is shown in the browser but not present in the source HTML. Automated web browsing and scraping seems like it can be used for much more harm than good. I'm simply trying to put together a dataset that I'll be using in a future post, and have only scratched the surface of [what's possible with PhantomJS](phantomjs.org/examples/). 

I also find it interesting that [the guy](https://twitter.com/ariyahidayat) who maintains PhantomJS works for [a company](https://twitter.com/ariyahidayat) that offers "[Botwall Services](https://www.shapesecurity.com/documents/shape-about.pdf)" for web and mobile applications to help clients answer the question: "How much of your traffic isn't human?" 
