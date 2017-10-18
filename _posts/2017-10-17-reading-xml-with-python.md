---

layout: post
title: Reading XML with Python
date: 2017-10-17
comments: true

---

On my other personal website, [briancaffey.com](briancaffey.com), I have a blog. The content on that blog has mostly mirrored what I put on this github pages site, [briancaffey.github.io](briancaffey.github.io). I want to display my most recent blog posts from briancaffey.github.io on briancaffey.com, and to do this I will be using the RSS feed that comes with a Jekyll site. This should be pretty simple, we are going to use the `requests` librrary, as well as the `feedparser` library.

Here are some [docs](https://wiki.python.org/moin/RssLibraries) on how to use `feedparser`, it is very simple.

First, install it with:

```python
pip install feedparser
```

Here's the setup that I will be using in utility a function that will be imported to `views.py` and called in the `home()` function that renders the homepage for briancaffey.com:

```
import feedparser

def get_blog_posts(number_of_posts):
    url = "http://briancaffey.github.io/feed"
    feed = feedparser.parse(url)
    posts = feed['items'][:number_of_posts]
    return posts
    
```

Next, in `views.py`, we just need to import the function, call it with the number of articles we want to show, save the returned value to a variable and then pass that to `context`: 

```python 
from utils import get_blog_posts
def home(request):
    ...
    posts = get_blog_posts(4)

    context = {
        ...
        'recent_posts': posts,
        ...
    }
    
    return render(request, 'home.html', context)
```

In the context, we can access the following data for each item: 

| content | description |
|-----|------|
|item[ "date" ] | "2004-02-13T22:28:23+08:00" - ISO 8601 date |
|item[ "date_parsed" ] | (2004,02,13,14,28,23,4,44,0) |
|item[ "title" ] | title for item |
|item[ "summary" ] | change summary |
|item[ "link" ] | URL to the page |
|item[ "wiki_diff" ] | for wiki, a link to the diff for the page |
|item[ "wiki_history" ] | for wiki, a link to the page history |

That's it! 