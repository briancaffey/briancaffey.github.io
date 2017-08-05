---

layout: post
title: Setting up a Django app on Heroku
date: 2017-03-04
comments: true

---

This is a simple guide to setting up a Django project on Heroku.

{% raw %}

The first step is to create a virutal environment in a new directory:

```terminal
$ mkdir proj && cd proj
$ virtualenv -p python3 .
$ source bin/activate
(proj) $ mkdir src
(proj) $ cd src
(proj) $ pip install django==1.10.5
(proj) $ django-admin.py startproject myproj .
(proj) $ ls
myproj        manage.py
```

This sets up a virtual environment and creates an empty Django project. The next step is to create a settings module.


```terminal
(proj) $ cd myproj
(proj) $ mkdir settings && cd settings
```

Next we want to add `__init__.py` to settings to make it a python module.

*src/myproj/settings/__init__.py*

```python
from .base import *

from .production import *

try:
	from .local import *
except:
	pass
```

Next we want to change the `BASE_DIR` (base directory) in `settings.py`:

*settings.py*

```python
[...]
# Build paths inside the project like this: os.path.join(BASE_DIR, ...)
BASE_DIR = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
[...]
```

Next we need to move `settings.py` into the `settings` folder and rename it `base.py` and then copy `base.py` twice as `local.py` and `production.py` these three files will live in `settings`.

```terminal
(proj) $ mv settings.py settings
(proj) $ cd settings
(proj) $ mv settings.py base.py
(proj) $ cp base.py local.py
(proj) $ cp base.py production.py
```

Next we need to install PostgreSQL:

```terminal
(proj) $ pip install psycopg2
(proj) $ pip install gunicorn dj-database-url
(proj) $ pip install django-crispy-forms
(proj) $ pip install pillow
```

At this point we can check to see if everything installed correctly:

```terminal
(proj) $ pip freeze
appdirs==1.4.3
dj-database-url==0.4.2
Django==1.10.5
django-crispy-forms==1.6.1
gunicorn==19.7.1
olefile==0.44
packaging==16.8
Pillow==4.0.0
psycopg2==2.7.1
pyparsing==2.2.0
six==1.10.0
```
And then we can add these to a file in our base directory called `requirements.txt`:

```terminal
(proj) $ pip freeze > requirements.txt
```

Next we can run migrations and create a superuser:

```terminal
(proj) $ python manage.py migrate
(proj) $ python manage.py createsuperuser
```

Next we need to initialize our git repository and create `.gitignore`:

```terminal
(proj) $ git init
```

We can put `.gitignore` in our base directory and add the following:

```text
myproj/settings/local.py
```

We also want to ignore several other python-related files in our directory. An easy way to do this is to add python gitignore. This can be found [here](https://raw.githubusercontent.com/github/gitignore/master/Python.gitignore).

Next we can make our first commit:

```terminal
(proj) $ git add --all
(proj) $ git commit -m "initial commit"
```

The next step involves setting up Heroku. First we need to create a `Procfile` in our base directory:

*Procfile*

```text
web: gunicorn myproj.wsgi --log-file -
```

Next we can try to run Heroku locally, but first we need to add `0.0.0.0` to `ALLOWED_HOSTS` in `production.py`, `base.py` and `local.py`.

We should now see "It worked!" at `0.0.0.0:5000`, which tells us that everything is working properly.

Next we need to create the project on Heroku:

```terminal
(proj) $ heroku login
(proj) $ heroku create my-unique-project-name-123
```

Now we can see our project at `my-unique-project-name-123.herokuapp.com`, and it should say `Heroku | Welcome to your new app!`

Next we will want to add `my-unique-project-name-123.herokuapp.com` to `ALLOWED_HOSTS` in `settings.py`.

The very last step is to add the specific version of Python to a file called `runtime.txt` in our base directory:

```terminal
(proj) $ python -V
Python 3.4.3
(proj) $ echo "python-3.4.3" > runtime.txt
```

Before we push to Heroku we need to change a setting on Heroku related to static files:

```terminal
(proj) $ heroku config:set DISABLE_COLLECTSTATIC=1
```

Now we can finally push the git repository to Heroku:

```terminal
(proj) $ git push heroku master
```

Now if we go to our site on heroku we should see:

```
Not Found  

The requested URL / was not found on this server.
```

There is a helpful guide on deploying Python and Django apps on Heroku's website [here](https://devcenter.heroku.com/articles/deploying-python).

Here's an important excerpt regarding databases:

> For Django applications, a Heroku Postgres hobby-dev database is automatically provisioned. This populates the DATABASE_URL environment variable.
No add-ons are automatically provisioned if a pure Python application is detected. If you need a SQL database for your app, add one explicitly:

```terminal
$ heroku addons:create heroku-postgresql:hobby-dev
```

So we need to run this command:

```terminal

(proj) $ heroku addons:create heroku-postgresql:hobby-dev

```


Next we need to access the terminal on our Heroku server:

```terminal
(proj) $ heroku run bash
```

Next we need to add database-related information to `production.py` under the `DATABASES` section:

```python
[...]
import dj_database_url

db_from_env = dj_database_url.config()
DATABASES['default'].update(db_from_env)
[...]
```

Now we can push to Heroku:

```terminal
(proj) $ git push heroku master
```

Next we can run our migrations:

```terminal
(proj) $ heroku run python manage.py makemigrations
```

Next we can run `migrate` and `createsuperuser` on our Heroku server:

```terminal
(proj) $ heroku run python manage.py migrate && heroku run python manage.py createsuperuser
```

Now we should be able to login to the admin page with the account we just created, but CSS is still not working at this point. Here's how we configure static files to get CSS to work:

```terminal
(proj) $ pip install whitenoise
```

`whitenoise` is needed so Heroku can run our static files.

Next we want to make sure to include `whitenoise` in `requirements.txt`:

```terminal
(proj) $ pip freeze > requirements.txt
```

Next we need to add the following item to the list of `MIDDLEWARE` components. This needs to be added to BOTH `production.py` AND `base.py` in order for the local files to show on both our heroku site and the locally served site with `heroku local web`:

```text
MIDDLEWARE = [
[...]
'whitenoise.middleware.WhiteNoiseMiddleware',
[...]
]
```

Next we have a few more items to add to our settings files:

*production.py*

```python

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "static"),
)

STATIC_ROOT = os.path.join(BASE_DIR, "live-static", "static-root")

STATICFILES_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage'

#STATIC_ROOT = "/home/cfedeploy/webapps/cfehome_static_root/"

MEDIA_URL = "/media/"

MEDIA_ROOT = os.path.join(BASE_DIR, "live-static", "media-root")

```

And we also need to add some files to our base directory that will hold our static files:

```terminal
(proj) $ mkdir static
(proj) $ echo "body {color:#000;}" > static/main.css
(proj) $ mkdir live-static
(proj) $ mkdir live-static/static-root
(proj) $ mkdir live-static/media-root
(proj) $
(proj) $

```

And we also need to add the following to the end of `production.py`:

```python
[...]
STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "static"),
)

STATIC_ROOT = os.path.join(BASE_DIR, "live-static", "static-root")

STATICFILES_STORAGE = 'whitenoise.django.GzipManifestStaticFilesStorage'

#STATIC_ROOT = "/home/cfedeploy/webapps/cfehome_static_root/"

MEDIA_URL = "/media/"

MEDIA_ROOT = os.path.join(BASE_DIR, "live-static", "media-root")
```

`base.py` and `local.py` should have the following:

```python
STATIC_URL = '/static/'

STATICFILES_DIRS = (
    os.path.join(BASE_DIR, "static"),
)

STATIC_ROOT = os.path.join(BASE_DIR, "live-static", "static-root")

MEDIA_URL = "/media/"

MEDIA_ROOT = os.path.join(BASE_DIR, "live-static", "media-root")
```

Next we want to run `collectstatic` locally:

```terminal
(proj) $ python manage.py collectstatic
```

We also want to add a blank file to `live-static/media-root` so that it becomes tracked in git:

```terminal
(proj) $ echo "some text" > live-static/media-root/blank.txt
```

Next we can commit these changes and push to Heroku, and check to see if the static files are working in the admin panel. We also want to set `DISABLE_COLLECTSTATIC` to `0`:

```terminal
(proj) $ git add --all
(proj) $ git commit -m "added static files"
(proj) $ git push heroku master
(proj) $ heroku config:set DISABLE_COLLECTSTATIC=0
```
Now we should be able to see the admin panel with working CSS on both the live and local heroku sites.

# Adding an app and configuring Bootstrap

Now that everything seems to be working we can start building our app.

Let's start by creating a new app:

```terminal
(proj) $ python manage.py startapp pages
```

`pages` will be the name of an app that we create here.

In `pages/views.py` we can add a class-based view that will serve as the homepage:

```python
from django.shortcuts import render
from django.views.generic import View
# Create your views here.

class HomeView(View):
	def get(self, request, *args, **kwargs):
		return render(request, 'pages/home.html', {})

```

We then update `urls.py` to include our new view:

```python
from django.conf.urls import url
from django.contrib import admin
from services.views import HomeView

urlpatterns = [
    url(r'^admin/', admin.site.urls),
    url(r'^$', HomeView.as_view(), name='home'),
]

```
Next we have to add `pages` to `INSTALLED_APPS` in both `production.py` and `local.py`.

Next we need to make some folders within our new `pages` app:

```terminal
(proj) $ mkdir page/templates && cd pages/templates
(proj) $ mkdir pages
(proj) $ touch home.html
```

Then we need to add the following to `home.html`:

```html
{% extends "base.html" %}

{% block content %}

{% endblock content%}
```

Next we need to update `DIR` in `TEMPLATES` in `base.py`, `local.py` and `production.py`:

```python
[...]
'DIRS': [os.path.join(BASE_DIR, 'templates')],
[...]
```
Next we need to add a `templates` folder to the root of our project:

```terminal
(proj) $ mkdir templates
(proj) $ touch tempates/base.html
```

Next we can add a basic Bootstrap template to `base.html`:

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <!-- The above 3 meta tags *must* come first in the head; any other head content must come *after* these tags -->
    <title>Bootstrap 101 Template</title>

	<!-- Latest compiled and minified CSS -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

		<!-- Optional theme -->
	<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">


    <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
    <!-- WARNING: Respond.js doesn't work if you view the page via file:// -->
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/html5shiv/3.7.3/html5shiv.min.js"></script>
      <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
    <![endif]-->
  </head>
  <body>
    <h1>Hello, world!</h1>

    <!-- jQuery (necessary for Bootstrap's JavaScript plugins) -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.12.4/jquery.min.js"></script>
    <!-- Include all compiled plugins (below), or include individual files as needed -->
    <!-- Latest compiled and minified JavaScript -->
	<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js" integrity="sha384-Tc5IQib027qvyjSMfHjOMaLkfuWVxZxUPnCJA7l2mCWNIpG9mGCD8wGNIcPD7Txa" crossorigin="anonymous"></script>
  </body>
</html>
```

This html was taken from [Bootstrap's 'Get Started' page](http://getbootstrap.com/getting-started/).

Now we can run `heroku local web` and confirm that we see "Hello, world!" from the Bootstrap template.

{% endraw %}
