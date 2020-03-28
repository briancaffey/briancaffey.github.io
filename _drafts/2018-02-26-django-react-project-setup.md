---

layout: post
title: Project setup with Django backend and React frontend
date: 2018-02-26
comments: true

---

This project will go over how to setup a Django project with a ReactJS frontend. 

```
 $ mkdir react-django-project && cd react-django-project
```

```terminal
 $ virtualenv -p python3 .
```

```terminal
 $ source bin/activate
 $ ls
bin  include  lib  pip-selfcheck.json
```

```
 $ pip install django
```

```
 $ django-admin.py startproject backend
```

To keep things organized, let's keep files and folders created with `virtualenv` in a folder called `venv`:

```
 $ mkdir venv
 $ mv bin/ include/ lib/ pip-selfcheck.json venv
 $ ls
backend  venv
```

Let's create an app in our project called `api`:

```
 $ python manage.py startapp api
```

Don't forget to add `api` to `INSTALLED_APPS` in project settings.

Let's install `djangorestframework` as well:

```
 $ pip install djangorestframework
```

Add `'rest_framework'` and `'rest_framework.authtoken'` to `INSTALLED_APPS` in settings. 

Now we can test our authentication backend: 

```
 $ curl -X POST -d "username=brian&password=qwer1234" http://localhost:8000/auth
{"token":"305ee6c15c479df7d5a43271058ad7ad2840563f"}
```

