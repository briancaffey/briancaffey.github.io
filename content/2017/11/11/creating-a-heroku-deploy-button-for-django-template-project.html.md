---
layout: post
title: Automating Django deployment with a Deploy-to-Heroku button
date: 2017-11-11
comments: true
tags:
  - django
  - heroku
  - deployment
---

For recent project and hackathons I have been using the same Django project template outlined in an article I wrote last year about how to deploy a Django project on Heroku. In this article I want to update the process I have been using to deploy Django projects and get a "Deploy to Heroku" button working so I (or anyone else) can spin up a new project as fast as possible. This is what the button looks like:

[![Deploy](https://www.herokucdn.com/deploy/button.png)](#)

Here are some things that I will be adding to the project that I didn't include in my last article/tutorial:

- Django Rest Framework (DRF)
- Enabling CORS (useful if you are using Django as your backend only with a separate front-end)
- A sample app with a simple model to show how I organize API related info

There is pretty good [documentation](https://blog.heroku.com/heroku-button) from Heroku on how to set up a one-click deploy button with Heroku, but I had to troubleshoot a few issues that were giving me errors during the deploy process.

The process of making a one-click deploy button is very simple. For Django projects, we just need to add an `app.json` file to our base directory. Here is the `app.json` file for my Django template app:

```javascript
{
  "name": "Django One Click App",
  "description": "A Template for a Django Projec that uses Django Rest Framework",
  "repository": "https://github.com/briancaffey/oneclickapp",
  "keywords": ["django", "python", "heroku"],
  "success_url":"/success",
  "env":{
    "DISABLE_COLLECTSTATIC":"1",
    "SECRET_KEY": {
      "description": "A secret key for verifying the integrity of signed cookies.",
      "generator": "secret"
    },
  },
  "addons":[
    {
	    "plan":"heroku-postgresql"
    }
  ],
  "scripts":
    {
      "postdeploy":"./postdeploy.sh"
    }
}
```

It is very important that you include `"DISABLE_COLLECTSTATIC":"1",` in the `env` section of `app.json`. [Here](https://devcenter.heroku.com/articles/django-assets) is a Heroku article that explains this issue in more detail.

I found a [helpful answer](https://stackoverflow.com/questions/40985063/how-to-run-postdeploy-scripts-in-heroku-button-app-json) on StackOverflow regarding the `scripts` portion of `app.json`. If you want to call multiple commands once the app has been built successfully, you can simply execute a bash script. Make sure that this script has execute permissions by running the following command on the file locally before committing it to your repo:

```terminal
sudo chmod +x postdeploy.sh
```

Here is my `postdeploy.sh` script:

```terminal
python manage.py migrate
echo "from django.contrib.auth.models import User; User.objects.create_superuser('admin', 'admin@example.com', 'password')" | python manage.py shell
```

First, I make migrations and then I run the equivalent of `python manage.py createsuperuser` with a default username and password for a simple admin user.

## The Deploy Button

Here's an example of how to make this with markdown:

{% raw %}

```
[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/briancaffey/oneclickapp
```

{% endraw %}

To clarify, the link portion should be:

```
"https://heroku.com/deploy" + "?template=" + <github repo URL>
```

This needs to be a GitHub repo.

This should result in a button that looks like this:

[![Deploy](https://www.herokucdn.com/deploy/button.png)](https://heroku.com/deploy?template=https://github.com/briancaffey/oneclickapp)

Feel free to try it out! This button will bring you to a Heroku page that lets you choose a custom name (a Heroku subdomain) for your new app. Once you click "Deploy", you will see the build process and then you will be able to click "View". This takes you to the `success` page that I specified in the `success_url` field of `app.json`.

## How to edit a newly deployed project

Once you have deployed the app to Heroku you should clone the Heroku git repo to your local machine with the following command:

```terminal
heroku git:clone -a yourappname
```

Replace `yourappname` with the name of your app. For Django projects like this you should first create a virtual environment in your workspace and then create an `src` folder in which you clone this repo. Then you should run the following command from inside the `src` folder:

```terminal
cp yourappname/settings/base.py yourappname/settings/local.py
```

This will give you a settings file that you can use locally. Finally, run the app locally to make sure it is working properly:

```terminal
python manage.py runserver
```

There is more you can do with `app.json` to customize how the app behaves when deployed, such as specifying deployment environments, but I won't touch on those for now.

Hopefully this helps you if you are trying to create a "Deploy-to-Heroku" button for a Django project. Thanks for reading!
