---

layout: post
title: Simple Jekyll tutorial with Github Pages
date: 2016-03-17
comments: true

---

I'm absolutely loving my new Jekyll blog, but getting it setup wasn't that easy. Finding useful and accessible information on how everything works was very difficult. In the end, faithfully following tutorials and crashing around on Github resulted in this functional blog. 

This post will provide a Jekyll blog setup tutorial assuming very little knowledge of the languages and technologies it is built on (Github, git, HTML, Markdown, Jekyll, Ruby, Liquid templates). Casually surveying friends and colleagues, it seems that many people have heard of Github Pages, but haven't explored it for a number of reasons. Here is what I hope to accomplish:

 - Help you get setup with everything you will need before you start building a Jekyll blog
 - Build a clean, professional site that let's you show off your resume, link to your social media accounts and build blog posts to catalog your ideas and share your opinions
 - Provide links to more in depth resources on the basics as well as links to more advanced topics  
 - (I've written this tutorial assuming you are using an Apple computer)

The first few steps are the easiest. So let's jump right in!

Step 1: [Github Pages](https://pages.github.com/)
---

Check out the instructions that Github offers on their [Github Pages](https://pages.github.com/) site. If you don't already have a Github account, [get one first](https://github.com/join). 

The username you choose on Github will be the first part of the URL that your site uses, but you can [change this later](https://help.github.com/articles/about-supported-custom-domains/). For example, if your name is Art Vandelay and you select *artvandelay* as your Github username, your site's URL will be *artvandelay.github.io*. 

As the Github pages guide instructs you to do, create a repository titled *username*.github.io (where *username* is your Github account name). You don't need to initialize the repository with the ReadMe.md file. This step is very important and any variation in the name of this repository will not result in a successful Github Pages site. 

Select "A terminal" when you see the question *"What git client are you using?"* (it should already be selected). You may be asking yourself, "what is git?" For now, just think of it as a version control manager. 

This next step is where I ran into a few difficulties, so I'm going to clarify a few things. Eventually, your newly created repository *username*.github.io will house all of the files that will run your blog, including the HTML, CSS files, etc. What you need to do next is create a folder on your computer where you will keep a copy of all of your site's files. You will use git to push files from this local folder on your computer to your repository that is 'hosting' your Jekyll site. We will talk about what "using git" means in just a bit. 

I keep mine in a folder at the location `~/Github/briancaffey.github.io` (where `~` references my 'Home' folder). If you are not familiar with Github, read the next few paragraphs carefully before doing anything. The command listed in step 2 of the [Github Pages](https://pages.github.com/) instructions tells you to run the following command in your terminal:

```terminal
$ git clone https://github.com/username/username.github.io
```

This will create a file named username.github.io *inside* whatever folder you are currently in. Open up terminal and type in the following command, then press enter. (Don't type the `$`, just type `pwd`; the `$` signifies that you are in the terminal). 

```terminal
$ pwd
User/yourmaclogin/
```
You should see a file path, something like `Users/yourmaclogin` on the following line. `pwd` means "Print Working Directory", and that's just what you did. Your "working directory" is the directory you are "at" (sorry about the poor English, but this is the easiest way to communicate this idea). 

So, you should choose the folder that you want to "clone" (copy) your empty *username*.github.io repository into. We will learn two more commands that will help us "navigate" our file system. 

Suppose you have a folder named `main` with the following files inside that folder: `sub1` and `sub2`. Inside `sub1` and `sub2`, suppose you have some text files: `sub1_example.txt` inside the folder `sub1` and `sub2_example.txt` inside `sub2`. If your current working directory is `main`, then we can list all of the file and folder that are directly inside of `main` with the following command:

```terminal
$ ls
sub1 sub2
```

`ls` is short for "list" and it simply lists files and folders that are directly inside a file. It won't list either of the text files, because those are not directly inside of `main`, even though they technically are located "within" it. 

In order to see these text files, you will need to change our working directory. You can do this with the "change directory" command that is conveniently called `cd`:

```terminal
$ cd sub1
$ ls 
sub1_example.txt
```

Great! Now what about sub2? The `cd <folder>` command takes us inside a folder that is in our working directory. It can also take us to the folder that *contains* out working directory. Check out this example:

```terminal
$ cd ..
$ pwd 
/main
```

`cd ..` takes us from `sub1` to `main`. If you are not sure where you are, just run the `ls` command and you can see the contents of your working directory.  

Ok, once you have a handle on this, run the following command in the terminal. Be sure to replace *username* with your actual Github username in both places, otherwise you will see an error. So go ahead and run: 

```terminal
$ git clone https://github.com/username/username.github.io
```

This concludes the first step, let's move on to Step 2: Jekyll.

Step 2: [Jekyll](https://jekyllrb.com/)
------

So what exactly is Jekyll? Here an explanation from Jekyll's [website](https://jekyllrb.com/docs/home/): 


>*Jekyll is a simple, blog-aware, static site generator. It takes a template directory containing raw text files in various formats, runs it through a converter (like Markdown) and our Liquid renderer, and spits out a complete, ready-to-publish static website suitable for serving with your favorite web server. Jekyll also happens to be the engine behind GitHub Pages, which means you can use Jekyll to host your project’s page, blog, or website from GitHub’s servers for free.*


This explanation didn't make much sense to me when I first attempted to make my Jekyll site, so let me try to explain it in another way. Jekyll is a system of folders and files that allow you to make simple web pages. When you put this system of folders and file system on Github, it generates a website that is absolutely free. Instead of writing HTML, you write content in template documents (Markdown files) that are automatically converted to beautiful HTML pages with mobile-friendly responsiveness. 

Let's go ahead with out website setup! Go back to Jekyll's website and look at the very simple instructions they provide for quick-start installation, but don't run them just yet!

```terminal
$ gem install jekyll
$ jekyll new my-awesome-site
$ cd my-awesome-site
$ jekyll serve
# => Now browse to http://localhost:4000
```

We will be modifying these commands slightly to get our website up and running. The first command installs Jekyll onto your computer. Go ahead and do this, then navigate to your *username*.github.io folder that you have cloned from Github in [Step 1](#). Run the `pwd` command to make sure you are in the correct working directory. The needs to be empty for this next step to work, so go ahead and run our `ls` command to make sure that there is nothing inside. 

At this point we are ready to install Jekyll! Run the following command:

```terminal
$ jekyll new
```

Then run the `ls` command and you should see the following:

```terminal
$ ls
_config.yml	_layouts	_sass		css		index.html
_includes	_posts		about.md	feed.xml
```

You have installed Jekyll! At this point we can give it a test run! We are going to view our new website in our browser, but we will be running the site locally (i.e. it will not be available at *username*.github.io). 

The next command will start running our website:

```terminal
$ jekyll serve
```

After you run this command, several lines will be printed out in the terminal. Look for one that looks like this: 

```terminal
Server address: http://127.0.0.1:4000/
```

This address may be different on your computer, so copy it exactly from your terminal and run it in your browser, or run `localhost:40001` in your browser if that doesn't work. You should see your website!

For now it is mostly filler content, but we will learn how to edit this content in the next few steps. 

Step 3: [Github](https://github.com/)
---

This next step will move your entire website onto the web and will make it available at *username*.github.io. 

Confirm you are still in you *username*.github.io folder (`pwd` command) and run the following commands: 

```terminal
$ git init
$ git add .
$ git commit -m "initial commit"
$ git push origin master
```

You will have to enter your Github username and password for the last step to work. Now, if you did not get any error messages in your terminal after running the above commands, open up *username*.github.io in your browser. You, and anyone with the link, should be able to see your website! 

As you make changes and additions to the *username*.github.io file system, you can repeat this step to refresh the content of your website.

Step 4: Making Pages in Jekyll
---

At this point, the first thing I wanted to do was to create both a simple "Contact" page and a "Resume" page. The process of creating pages is simple, but there are few tutorials that explain what the simple process is in its entirety. Here's how I understand it:

Create a "top level" Markdown file in our *username*.github.io folder. "Top level" means that it is directly inside our *username*.github.io file and not in any subfolders. To create this folder, you will need a text editor. The number one search result for text editor in Google is [Sublime Text](https://www.sublimetext.com/), which is the text editor that I prefer. You can open your entire *username*.github.io folder with Sublime Text to easily move between files. 

Let's create a contact page first. Create a new file called `contact.md`. The `.md` stands for Markdown and it is the type of file that you will be working with the most in Jekyll. Add the following content to this file:

```Markdown
---
layout: page
title: "Contact"
---
Hi, my name is Art Vandelay. Welcome to my website! 
Follow me on twitter at [@artvandelay](http://www.twitter.com)
Connect with me on [LinkedIn](http://www.linkedin.com)
```

Save this file, and head back over to `localhost:4000`, reload the page and check to see if your page was added to your site. 

Our `contact.md` file starts with something called Front Matter, enclosed between two `---` bars. In this space, you specify the type of page you are creating. In this example, wrote `layout: page` because this is a regular page. In the following examples, we will set the `layout` variable to `post` when we want to create a blog post. 

Links are pretty easy to make in Markdown. Simply wrap the clickable link text you want displayed in brackets, immediately followed by the URL in parentheses. For example, `[Google](http://www.google.com)` would result in [Google](http://www.google.com). Be sure to include `http://` at the beginning of your links. If you don't, it will create a link relative to the page. For example, `[Google](google.com)` would result in `username.github.io/google.com` which would not go anywhere. 

For the next example, create a top-level folder in your *username*.github.io folder called `docs` (or some other name) where you will store static files like PDFs for your site. Now put your resume in it. Next, copy the following code into a new top-level file in your *username*.github.io folder called `resume` (not in the `docs` folder you just created, we are making a page here just like we did with the "Contact" page). 

```Markdown
---
layout: page
title: Resume
---
Here's a link to a PDF of [my resume](/docs/my_resume.pdf).
```

At this point it would be good to introduce the simple and powerful formating that you can do with Markdown. Suppose you want to include the text of your resume in a neatly organized way below the download link for your resume as I have done for [my Resume page](/CV.html). Markdown makes this very easy. 

There are many ways to structure and organize content in Markdown, so I'll show you how I did it and point you in the direction of some useful resources and cheat sheets. [Here](https://raw.githubusercontent.com/briancaffey/briancaffey.github.io/master/CV.md) is the Markdown file I used for my resume page, feel free to copy my exact formatting as I copied it from someone else! Also check out [this Markdown cheat sheet](http://assemble.io/docs/Cheatsheet-Markdown.html).

Step 5: Making blog posts in Jekyll
---

Making blog posts in Jekyll is slightly different from making pages in Jekyll. There are a few things you need to do to create a blog post. 

1. Create a Markdown file with the following naming convention: YYYY-MM-DD-post-name.md
1. In this file's Front Matter, set the `layout` to `post` by writing `layout: post`
1. Set the `date` and `title` of the post in the Front Matter 
1. Place this file in the `_posts` folder

You should see the blog post listed on your home page and your "Blog" page that comes pre-loaded with a new Jekyll site. 

We will talk about how to change the layout of your sites homepage, pages and posts later on. The next step will show you how allow comments using Disqus on a per-post basis. 

Step 6: Adding comments to your posts
---

To enable comments on your blog, I recommend using a free and popular comment service called [Disqus](https://disqus.com/home/). 

To enable comments with Disqus, we need to explore a new folder in our file system. In the `_includes` folder you will find a number of files that are "snippets" of HTML code including `header.html` and `footer.html`. `_includes` is a folder where you will keep reusable snippets of code that will want to include in many different places in your site. 

Let's make a code snippet titled `comments.html`. In this file, add the following code: 


```{% raw %}
{% if page.comments %}



{% endif %}
{% endraw %}```

Any code in between these two lines will be included if `pages.comments` is set to `true`. You will set this variable value in the Front Matter as you create new posts. Next, add the following code between these two lines above: 

{% highlight javascript ruby %}

<!-- Add Disqus comments. -->
<div id="disqus_thread"></div>
<script type="text/javascript">
  /* * * CONFIGURATION VARIABLES: EDIT BEFORE PASTING INTO YOUR WEBPAGE * * */
  var disqus_shortname = 'YOUR_DISQUS_USERNAME'; // required: replace example with your forum shortname
  var disqus_identifier = "{% raw %}{{ site.disqusid }}{{ page.url | replace:'index.html','' }}{% endraw %}";

  /* * * DON'T EDIT BELOW THIS LINE * * */
  (function() {
    var dsq = document.createElement('script'); dsq.type = 'text/javascript'; dsq.async = true;
    dsq.src = '//' + disqus_shortname + '.disqus.com/embed.js';
    (document.getElementsByTagName('head')[0] || document.getElementsByTagName('body')[0]).appendChild(dsq);
  })();
</script>
<noscript>Please enable JavaScript to view the <a href="http://disqus.com/?ref_noscript">comments powered by Disqus.</a></noscript>
{% endhighlight %}

Pay attention to the line that reads:
{% highlight javascript ruby %}
var disqus_shortname = 'YOUR_DISQUS_USERNAME'; // required: replace example with your forum shortname
{% endhighlight %}

You will need to replace `YOUR_DISQUS_USERNAME` with the name you have selected for your Disqus account. Be sure to enclose it in single quotes. 

Next we have to learn how to include this code snippet into all posts. Look in the `_layouts` folder and open up the `post.html` file. 

This is a template document that will determine the format of each blog post. When we specified `layout: page` in the Front Matter of our Resume and Contact pages, this caused Jekyll to use the `page.html` layout. As I mentioned before, in our posts, we will specify `layout: post` in the Front Matter of our posts to use the `post.html` template. 

In this layout, we will add one line of code right before the last line of the `post.html` layout template directly above the closing <code></article></code> tag: 

```{% raw %}{% include comments.html %}{% endraw %}```

Now, let's make a new blog post. Title it something like `2016-03-18-my-first-post.md`. Let's add Front Matter so Jekyll knows what to do with our post. 

```
---
layout: post
title: My First Post
date: 2016-03-18
comments: true
---
This is the body of my first blog post on my Jekyll blog! I hope it gets some good comments!
```

Great, now you should have a new blog post with Disqus comments enabled on it. You may not be getting a lot of comments on your articles, but you still could have lots of readers. The next section will cover how to add Google Analytics to our site so we can easily track visitors and page views.

Step 7: Adding Google Analytics to your Jekyll blog
---

Now that we know how to include a short snippet of code in multiple pages on our blog, adding one more little snippet for Google to track page views will be very easy. If you don't know about Google Analytics, it probably the most powerful tool for tracking visitors to your website. Google makes it very easy, and only requires that we include a short snippet of JavaScript on each page we want to track. 

Let's create another HTML snippet in our `_includes` folder called `google-analytics.html`. You are only going to put a tracking code that will be unique to your site. Head over to [Google Analytics](http://analytics.google.com) to get your tracking code. After filling out a few simple forms, you should get your tracking code. It should look something like this: 

{% highlight javascript ruby %}

<script>
  (function(i,s,o,g,r,a,m){i['GoogleAnalyticsObject']=r;i[r]=i[r]||function(){
  (i[r].q=i[r].q||[]).push(arguments)},i[r].l=1*new Date();a=s.createElement(o),
  m=s.getElementsByTagName(o)[0];a.async=1;a.src=g;m.parentNode.insertBefore(a,m)
  })(window,document,'script','//www.google-analytics.com/analytics.js','ga');

  ga('create', '<YOUR_TRACKING_CODE>', 'auto');
  ga('send', 'pageview');

</script>

{% endhighlight %}

Next we will need to insert this `google_analytics.html` snippet each page of our site. Doing this is very easy, just add `{% raw %}{% include google_analytics.html %}{% endraw %}` in between the opening `<html>` and `<body>` tags of the `default.html` file in the `_layouts` folder. 

Conclusion
---

I hope you have found this tutorial helpful. At times I probably over-explained things, and there may be some areas that need clarification, so I'll add updates and create more posts in the future as I learn more about Jekyll myself. 

My Jekyll blog is big experiment. It's been both challenging and fun, but most of all I love the fact that it is totally free. I hope that anyone reading this post who wants to put together a Jekyll blog hosted with Github Pages has success in doing so. Please let me know in the comments if there are any areas that I should change, elaborate on or take out. Thanks!


