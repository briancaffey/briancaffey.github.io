---

layout: post
title: Simple twitter-bot with Python, Tweepy and Heroku
date: 2016-04-05
comments: true
tags: "twitter, python, heroku"

---

This post provides a walk-through tutorial on how to setup a simple twitter-bot that can do just about anything. I recently set up a simple [twitter-bot](https://twitter.com/tw_tt_r_b_t) that generates random cellular automata at a regular intervals, and I plan on doing a lot more with the Twitter API and text data analysis. 

[Tweepy](http://www.tweepy.org/)
---

Tweepy is an easy-to-use Python library for accessing the Twitter API. There are several popular Python packages like Tweepy that serve as Twitter API wrappers, but I was only able to get my Twitterbot up and running with Tweepy. 

Get started by installing Tweepy by running `pip install tweepy` in your command line. Next, let's jump right into to a super-simple example of how to tweet with Tweepy. 

While you test out your twitter-bot, you might want to use a throw-away Twitter account. To do this, you can make a new account associated with a new email address, or you can create an account that is linked to the same email address as your main Twitter account. When you enter your email information at the Sign Up page, add `+alias` to the first part of your email address, right before the `@`. Here's an example:

If your email is `john_doe@gmail.com`, you could enter `john_doe+twitter@gmail.com`, and the sign up confirmation for this unique account will go to `john_doe@gmail.com`. 

Twitter requires that accounts accessing its API have a phone number associated with the account, so don't skip this step in the sign up process. 

While signed in to your new account, go to [https://apps.twitter.com/](https://apps.twitter.com/) and enter information for your new twitter-bot app. 

On the following page, go over to the "Keys and Access Tokens" tab and copy the `Consumer Key (API Key)` and `Consumer Secret (API Secret)`. Also, click the "Create my access token" button at the bottom of the page and copy the resulting `Access Token` and `Access Token Secret`. We will use these codes to make API requests on your own account's behalf. Do not share your access token secret with anyone.

Open up your favorite text editor and create a new Python script called something like `tweetbot.py`. Copy in the following code: 

```python 
import tweepy

CONSUMER_KEY = 'replace with your key'
CONSUMER_SECRET = 'replace with your secret'
ACCESS_KEY = 'replace with your access key'
ACCESS_SECRET = 'replace with your access secret'
auth = tweepy.OAuthHandler(CONSUMER_KEY, CONSUMER_SECRET)
auth.set_access_token(ACCESS_KEY, ACCESS_SECRET)
api = tweepy.API(auth)

api.update_status("Sending my first tweet via Tweepy!")

```

Navigate to the location of this script in your command line and run it with `$ python tweetbot.py`. 

Now go over to your new Twitter account and check to see if your first tweet was sent successfully. 

At this point there are already lots of interesting things you can do by simply passing strings into `api.update_status()`. BeautifulSoup is a great tool for scraping information from the web that you can feed your twitter-bot.

With the simple script we can schedule regular tweets by adding a simple `while` loop with a timer:

```python
import time
while True:
    tweet = scrape_some_data()
    api.update_status(tweet)
    time.sleep(300)
```

In this example, the `scrape_some_data()` function would scrape some information and save it to the variable `tweet`. Next, `time.sleep(300)` waits 5 minutes before the loop starts again. This makes sure that your twitter-bot doesn't exceed the [Twitter API rate limit](https://dev.twitter.com/rest/public/rate-limiting).

[Heroku](https://www.heroku.com/)
---

At this point we have a functioning twitter-bot, but we have to keep a machine running our script around the clock for twitter-bot to operate continuously. One solution would to run this script on a Raspberry Pi. Another great solution that I will explore here is to deploy the twitter-bot on Heroku. 

Heroku is a cloud platform based on a managed container system. Instead of on a Raspberry Pi, we will put your `tweetbot.py` script (along with a few other simple files) on a dyno.  Dynos are isolated, virtualized Unix containers, that provide the environment required to run your application. 

If this doesn't make much sense, think of Heroku as dedicated virtual Linux machine in the cloud that you can use (for free) to run your twitter-bot. The following steps will show you how to get setup with Heroku on your computer. 

Select "Python" from [https://devcenter.heroku.com/start](https://devcenter.heroku.com/start). This tutorial shows you how to launch a basic Django app, but we will tweak it slightly in order to get our twitter-bot running. 

First, download the Heroku Toolbelt (command line tools) and run `$ heroku login`, then enter your Heroku account information. Download the sample web application and check out what files come with it. 

```terminal 
$ git clone https://github.com/heroku/python-getting-started.git
$ cd python-getting-started
$ ls
Procfile		app.json		manage.py
Procfile.windows	gettingstarted		requirements.txt
README.md		hello			runtime.txt
```

The `Procfile` file will give instructions to your dyno regarding what it should do. Take a look inside this file, and you will see `web: gunicorn gettingstarted.wsgi --log-file -`. This indicates that the dyno will be making a website using the file `gettingstarted.wsgi`. 

Delete the contents of this file and copy in the following line: 
`worker: python tweetbot.py`. 

This will tell our dyno that we want it to do a simple task: run `tweetbot.py`. Next, check out `requirements.txt`. The contents of this file indicate the packages our Python script needs to run. For our twitter-bot, we only need the Tweepy package. To check which version of Tweepy you have on your computer, run `pip freeze | grep tweepy` in the terminal. Mine reads `tweepy==3.5.0`. Copy `tweepy==3.5.0` into `requirements.txt` and delete the other lines. 

Next, we will create a place on Heroku where your twitter-bot will live. Run the following command:

```terminal
$ heroku create
Creating app... done, stack is cedar-14
https://random-word-28487.herokuapp.com/ | https://git.heroku.com/random-word-28487.git
```
Like Github, Heroku uses `git` to move files from your local machine to Heroku's containers. Clear out the `python-getting-started` file so that the only files inside are `tweetbot.py`, `requirements.txt` and `Procfile`. 

```terminal 
$ git add .
$ git commit -m "initial commit"
$ git push heroku master
```
Pushing the files to Heroku with `$ git push heroku master` should create your twitter-bot program on Heroku and launch it into the Twitter-verse! To make sure everything is running smoothly, you can check out the log files on your Heroku Dashboard. There is lots you can do with Twitter and Tweepy, hopefully this tutorial has helped you understand the basics of how the Twitter API works and how to write your own twitter-bot. Thanks for reading, and feel free to leave a comment!
