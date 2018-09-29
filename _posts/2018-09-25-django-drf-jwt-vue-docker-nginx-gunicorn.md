---

layout: post
title: Build a Django/VueJS application with Docker
date: 2018-09-25
comments: true

---

This article will describe the process of settinging up, developing, deploying and maintaining a full-stack web application. I'll be using Django, Django Rest Framework, VueJS, docker, nginx and gunicorn. I'll try to share my tooling process. 

I'm developing on an X1 Carbon 6th Generation Lenovo ThinkPad with Ubuntu Desktop 16.04. 

## Docker

First, let's set up docker according to Docker's official [Django and Postgres](https://docs.docker.com/compose/django/#define-the-project-components) sample application. 

Let's start with a Dockerfile in an empty directory: 

```
FROM python:3.6 # <-- I changed this from 3 to 3.6 (more on this later)
ENV PYTHONUNBUFFERED 1
RUN mkdir /code
WORKDIR /code
ADD requirements.txt /code/
RUN pip install -r requirements.txt
ADD . /code/
```
Next, let's add our `requirements.txt` file that will define which Python packages we will install in our Docker container: 

```
Django
psycopg2
```
We will add more packages to this file later.

Next, we will create a new file called `docker-compose.yml`. Also, you need to [install docker-compose]().

```yml
version: '3'

services:
  db:
    image: postgres
  web:
    build: .
    command: python3 manage.py runserver 0.0.0.0:8000
    volumes:
      - .:/code
    ports:
      - "8000:8000"
    depends_on:
      - db
```

We will change this file later. Following along with the Docker sample application, they recommend to run this command:

```
sudo docker-compose run web django-admin.py startproject composeexample .
```

Instead, let's the following command: 

```bash
sudo docker-compose run web django-admin.py startproject backend
```

This will create the Django project in a new folder called `backend`. We don't want to include the `.` at the end of the command, because this will place several different files from our Django app in the top level folder. This will help keep things clean as we add more to our application later. 

Here's what we should see:

```shell
$ sudo docker-compose run web django-admin.py startproject backend
Creating network "sept25_default" with the default driver
Creating sept25_db_1 ... done
Building web
Step 1/7 : FROM python:3.6
 ---> 4f13b7f2138e
Step 2/7 : ENV PYTHONUNBUFFERED 1
 ---> Using cache
 ---> 100dd88c5005
Step 3/7 : RUN mkdir /code
 ---> Using cache
 ---> f47eeb84babf
Step 4/7 : WORKDIR /code
 ---> Using cache
 ---> d6173cfaffb9
Step 5/7 : ADD requirements.txt /code/
 ---> d926dad0292a
Step 6/7 : RUN pip install -r requirements.txt
 ---> Running in 32c2f8766d9a
Collecting Django (from -r requirements.txt (line 1))
  Downloading https://files.pythonhosted.org/packages/ca/7e/fc068d164b32552ae3a8f8d5d0280c083f2e8d553e71ecacc21927564561/Django-2.1.1-py3-none-any.whl (7.3MB)
Collecting psycopg2 (from -r requirements.txt (line 2))
  Downloading https://files.pythonhosted.org/packages/5e/d0/9e2b3ed43001ebed45caf56d5bb9d44ed3ebd68e12b87845bfa7bcd46250/psycopg2-2.7.5-cp36-cp36m-manylinux1_x86_64.whl (2.7MB)
Collecting pytz (from Django->-r requirements.txt (line 1))
  Downloading https://files.pythonhosted.org/packages/30/4e/27c34b62430286c6d59177a0842ed90dc789ce5d1ed740887653b898779a/pytz-2018.5-py2.py3-none-any.whl (510kB)
Installing collected packages: pytz, Django, psycopg2
Successfully installed Django-2.1.1 psycopg2-2.7.5 pytz-2018.5
Removing intermediate container 32c2f8766d9a
 ---> 43c00adba024
Step 7/7 : ADD . /code/
 ---> 5705e24339cc
Successfully built 5705e24339cc
Successfully tagged sept25_web:latest
WARNING: Image for service web was built because it did not already exist. To rebuild this image you must use `docker-compose build` or `docker-compose up --build`.
```

Next, we will need to change the ownership of some of the files that we just created: 

```bash
$ sudo chown -R $USER:$USER .
```

This command changes the permission of all files in the current directory (`.`), recursively to the current user (`$USER`, or yourself), and the group (also `$USER`, the group that you and only you belong to). And we user `sudo` on this command so that we can change the files that are owned by root.

Now, you should see something like this:

```s
$ l -l
total 16
drwxr-xr-x 3 brian brian 4096 Sep 25 19:47 backend/
-rw-rw-r-- 1 brian brian  210 Sep 25 19:46 docker-compose.yml
-rw-rw-r-- 1 brian brian  146 Sep 25 19:17 Dockerfile
-rw-rw-r-- 1 brian brian   15 Sep 25 19:16 requirements.txt
```

Next, we are going to start changing some of the settings in our Django file. 

In `backend/backend/settings.py`, remove the value of `DATABASES` and replace it with this: 

```python
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'postgres',
        'USER': 'postgres',
        'HOST': 'db',
        'PORT': 5432,
    }
}
```

These settings tell Django how to connect to the postgres database. Notice that `'HOST': 'db'` refers to the `db` listed under `services` in our `docker-compose.yml` file. Now we are ready to start our two docker containers. This is where docker-compose comes in. The following command will start a Django server and a postgres container where our database will be running and ready to accept connections from our Django application.

We will make one small change to our docker-compose file for this to work: 

```
command: python3 manage.py runserver 0.0.0.0:8000
```

This line should be:

```
command: python3 backend/manage.py runserver 0.0.0.0:8000
```

We will actually be changing this line *again* soon. Let's run the command and check out our docker containers in action.

Here's what I see in my terminal after running this command: 

```bash
$ docker-compose up
Starting sept25_db_1 ... done
Recreating sept25_web_1 ... done
Attaching to sept25_db_1, sept25_web_1
db_1   | 2018-09-26 00:15:05.206 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
db_1   | 2018-09-26 00:15:05.206 UTC [1] LOG:  listening on IPv6 address "::", port 5432
db_1   | 2018-09-26 00:15:05.216 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
db_1   | 2018-09-26 00:15:05.233 UTC [25] LOG:  database system was shut down at 2018-09-26 00:15:02 UTC
db_1   | 2018-09-26 00:15:05.238 UTC [1] LOG:  database system is ready to accept connections
web_1  | /usr/local/lib/python3.6/site-packages/psycopg2/__init__.py:144: UserWarning: The psycopg2 wheel package will be renamed from release 2.8; in order to keep installing from binary please use "pip install psycopg2-binary" instead. For details see: <http://initd.org/psycopg/docs/install.html#binary-install-from-pypi>.
web_1  |   """)
web_1  | /usr/local/lib/python3.6/site-packages/psycopg2/__init__.py:144: UserWarning: The psycopg2 wheel package will be renamed from release 2.8; in order to keep installing from binary please use "pip install psycopg2-binary" instead. For details see: <http://initd.org/psycopg/docs/install.html#binary-install-from-pypi>.
web_1  |   """)
web_1  | Performing system checks...
web_1  | 
web_1  | System check identified no issues (0 silenced).
web_1  | 
web_1  | You have 15 unapplied migration(s). Your project may not work properly until you apply the migrations for app(s): admin, auth, contenttypes, sessions.
web_1  | Run 'python manage.py migrate' to apply them.
web_1  | September 26, 2018 - 00:15:06
web_1  | Django version 2.1.1, using settings 'backend.settings'
web_1  | Starting development server at http://0.0.0.0:8000/
web_1  | Quit the server with CONTROL-C.

```

We get a few warning, let's address these now. 

First, notice that `web_1` says: 

```
UserWarning: The psycopg2 wheel package will be renamed from release 2.8; in order to keep installing from binary please use "pip install psycopg2-binary" instead. For details see: <http://initd.org/psycopg/docs/install.html#binary-install-from-pypi>.
```

Let's change `psycopg2` to `psycopg2-binary` in our `requirements.txt` file, and then run `docker-compose up --build`. The `--build` is important. If you want, you can try to run the command without build, and you will see the warning again. 

Next, let's fix the warning about migrations in the output of `web_1`: 

```
web_1  | You have 15 unapplied migration(s). Your project may not work properly until you apply the migrations for app(s): admin, auth, contenttypes, sessions.
web_1  | Run 'python manage.py migrate' to apply them.
```

To fix this error, let's change the `command` line for `web` to this: 

```yaml
    command: >
      bash -c '
      python3 backend/manage.py makemigrations &&
      python3 backend/manage.py migrate &&
      python3 backend/manage.py runserver 0.0.0.0:8000'
```

Here's what we get: 


```
$ docker-compose up --build
Building web
Step 1/7 : FROM python:3.6
 ---> 4f13b7f2138e
Step 2/7 : ENV PYTHONUNBUFFERED 1
 ---> Using cache
 ---> 100dd88c5005
Step 3/7 : RUN mkdir /code
 ---> Using cache
 ---> f47eeb84babf
Step 4/7 : WORKDIR /code
 ---> Using cache
 ---> d6173cfaffb9
Step 5/7 : ADD requirements.txt /code/
 ---> Using cache
 ---> 353c71cb52f8
Step 6/7 : RUN pip install -r requirements.txt
 ---> Using cache
 ---> 9759a5a3f613
Step 7/7 : ADD . /code/
 ---> 01f55f7fb286
Successfully built 01f55f7fb286
Successfully tagged sept25_web:latest
Starting sept25_db_1 ... done
Recreating sept25_web_1 ... done
Attaching to sept25_db_1, sept25_web_1
db_1   | 2018-09-26 00:26:01.928 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
db_1   | 2018-09-26 00:26:01.928 UTC [1] LOG:  listening on IPv6 address "::", port 5432
db_1   | 2018-09-26 00:26:01.937 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
db_1   | 2018-09-26 00:26:01.952 UTC [25] LOG:  database system was shut down at 2018-09-26 00:25:58 UTC
db_1   | 2018-09-26 00:26:01.957 UTC [1] LOG:  database system is ready to accept connections
web_1  | No changes detected
web_1  | Operations to perform:
web_1  |   Apply all migrations: admin, auth, contenttypes, sessions
web_1  | Running migrations:
web_1  |   Applying contenttypes.0001_initial... OK
web_1  |   Applying auth.0001_initial... OK
web_1  |   Applying admin.0001_initial... OK
web_1  |   Applying admin.0002_logentry_remove_auto_add... OK
web_1  |   Applying admin.0003_logentry_add_action_flag_choices... OK
web_1  |   Applying contenttypes.0002_remove_content_type_name... OK
web_1  |   Applying auth.0002_alter_permission_name_max_length... OK
web_1  |   Applying auth.0003_alter_user_email_max_length... OK
web_1  |   Applying auth.0004_alter_user_username_opts... OK
web_1  |   Applying auth.0005_alter_user_last_login_null... OK
web_1  |   Applying auth.0006_require_contenttypes_0002... OK
web_1  |   Applying auth.0007_alter_validators_add_error_messages... OK
web_1  |   Applying auth.0008_alter_user_username_max_length... OK
web_1  |   Applying auth.0009_alter_user_last_name_max_length... OK
web_1  |   Applying sessions.0001_initial... OK
web_1  | Performing system checks...
web_1  | 
web_1  | System check identified no issues (0 silenced).
web_1  | September 26, 2018 - 00:26:04
web_1  | Django version 2.1.1, using settings 'backend.settings'
web_1  | Starting development server at http://0.0.0.0:8000/
web_1  | Quit the server with CONTROL-C.
```

This is great. Now, when we run `docker-compose up`, we see the following: 

```
$ docker-compose up
Starting sept25_db_1 ... done
Starting sept25_web_1 ... done
Attaching to sept25_db_1, sept25_web_1
db_1   | 2018-09-26 00:37:37.059 UTC [1] LOG:  listening on IPv4 address "0.0.0.0", port 5432
db_1   | 2018-09-26 00:37:37.059 UTC [1] LOG:  listening on IPv6 address "::", port 5432
db_1   | 2018-09-26 00:37:37.067 UTC [1] LOG:  listening on Unix socket "/var/run/postgresql/.s.PGSQL.5432"
db_1   | 2018-09-26 00:37:37.101 UTC [25] LOG:  database system was interrupted; last known up at 2018-09-26 00:37:14 UTC
db_1   | 2018-09-26 00:37:37.190 UTC [25] LOG:  database system was not properly shut down; automatic recovery in progress
db_1   | 2018-09-26 00:37:37.194 UTC [25] LOG:  redo starts at 0/16B98C8
db_1   | 2018-09-26 00:37:37.194 UTC [25] LOG:  invalid record length at 0/16B9900: wanted 24, got 0
db_1   | 2018-09-26 00:37:37.194 UTC [25] LOG:  redo done at 0/16B98C8
db_1   | 2018-09-26 00:37:37.216 UTC [1] LOG:  database system is ready to accept connections
web_1  | No changes detected
web_1  | Operations to perform:
web_1  |   Apply all migrations: admin, auth, contenttypes, sessions
web_1  | Running migrations:
web_1  |   No migrations to apply.
web_1  | Performing system checks...
web_1  | 
web_1  | System check identified no issues (0 silenced).
web_1  | September 26, 2018 - 00:37:38
web_1  | Django version 2.1.1, using settings 'backend.settings'
web_1  | Starting development server at http://0.0.0.0:8000/
web_1  | Quit the server with CONTROL-C.
```

Great, now when we go to `http://0.0.0.0:8000/` in our browser, we see the Django rocket ship ready to take off. 

Next, let's see if we can access the django-admin. Django's has a built-in admin interface that can help you add and remove data from your database. 

If you go `http://localhost:8000/admin/login/`, we are presented with the login screen. There is no default admin user, so we will need to add a user. 

To do this, we have a few options. Let's shell into the container where Django is running and then issue a `createsuperuser` command. 

To shell into the container, let's first run `docker ps` to list the currently running containers: 

```
$ docker ps
CONTAINER ID        IMAGE               COMMAND                  CREATED             STATUS              PORTS                    NAMES
639149cc364d        sept25_web          "bash -c ' python3 b…"   21 minutes ago      Up 9 minutes        0.0.0.0:8000->8000/tcp   sept25_web_1
840c7efd211c        postgres            "docker-entrypoint.s…"   About an hour ago   Up 9 minutes        5432/tcp                 sept25_db_1
```
Let's copy the `CONTAINER ID` of the `web` container, `639149cc364d`, and use it in the following command. 

```
$ docker exec -it 639149cc364d /bin/bash
```

Now we see this: 

```
$ docker exec -it 639149cc364d /bin/bash
root@639149cc364d:/code# 
```

We have shelled into the docker container where our Django app lives and is currently running. From here, we can run `createsuperuser`:

```
root@639149cc364d:/code# backend/manage.py createsuperuser
Username (leave blank to use 'root'): brian
Email address: 
Password: 
Password (again): 
Superuser created successfully.
root@639149cc364d:/code# 
```

Now let's go back to the Django admin in the browser and try to log in with the new user we created. You can exit the docker container shell by running `exit`:

```
root@639149cc364d:/code# exit
exit
brian@brian-ThinkPad-X1-Carbon-6th:~/dock/sept25$ 
```

## Django Rest Framework

Now let's install the [Django Rest Framework](http://www.django-rest-framework.org/#installation). Let's follow the basic instructions for installing the Django Rest Framework: 

Add the following to our `requirements.txt` file:

```
Django
psycopg2-binary

djangorestframework
markdown
django-filter
```

Then, add ` 'rest_framework'` to `INSTALLED_APPS`. 

At this point we can add one more package that will provide JSON Web Token support for th Django Rest Framework. This will be useful soon when we add VueJS.

Add `djangorestframework-jwt` to the end of `requirements.txt`, and then add the following to `settings.py` right after the `DATABASES` value we added earlier:

```python
REST_FRAMEWORK = {
    'DEFAULT_PERMISSION_CLASSES': (
        'rest_framework.permissions.IsAuthenticated',
    ),
    'DEFAULT_AUTHENTICATION_CLASSES': (
        'rest_framework_jwt.authentication.JSONWebTokenAuthentication',
        'rest_framework.authentication.SessionAuthentication',
        'rest_framework.authentication.BasicAuthentication',
    ),
}
```

Next let's add an endpoint that will be used to "log in". Instead of "logging in", what we are actually doing is making a POST request with our username and password for the user I created earlier, and if the username and password are correct, we should receive a JSON web token (JWT) that will be stored in our browser's storage and in our app's state. This way, as long as we have a valid token, we will pass this token along with all other requests that might be used to make other requests for protected information. 

Let's create a new app in our Django project by running the following command: 

```
$ docker exec -it 4983514567bb /bin/bash
root@4983514567bb:/code# cd backend
root@4983514567bb:/code/backend# django-admin startproject accounts
```

We will need to run the `chown` command once again to change the permissions of the files created on our local machine. Exit the docker container and then run: 

```
$ sudo chown -R $USER:$USER .
```

Let's hook up our `accounts` app. Add `'accounts'` to `INSTALLED_APPS` and add the following to the `urls.py` file in `backend`:

```python
from django.contrib import admin
from django.urls import path, re_path, include

urlpatterns = [
    path('', include('accounts.urls')),
    path('admin/', admin.site.urls),
]
```

Now, to the `urls.py` file in the `accounts` app, add the following: 

```python
from django.urls import path, re_path
from rest_framework_jwt.views import obtain_jwt_token, refresh_jwt_token, verify_jwt_token

urlpatterns = [
    re_path(r'^auth/obtain_token/', obtain_jwt_token, name='api-jwt-auth'),
    re_path(r'^auth/refresh_token/', refresh_jwt_token, name='api-jwt-refresh'),
    re_path(r'^auth/verify_token/', verify_jwt_token, name='api-jwt-verify'),
]
```

Before we add these routes, let's write some tests to think about what it is we want to do, and what we expect to happen: 

```python
from django.test import TestCase

# Create your tests here.
from django.urls import reverse
from rest_framework.test import APITestCase
from rest_framework import status


from django.contrib.auth.models import User

class AccountsTests(APITestCase):

    def test_obtain_jwt(self):

        url = reverse('api-jwt-auth')
        u = User.objects.create_user(username='user', email='user@foo.com', password='pass')
        u.is_active = False
        u.save()

        resp = self.client.post(url, {'email':'user@foo.com', 'password':'pass'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_400_BAD_REQUEST)
        u.is_active = True
        u.save()
        resp = self.client.post(url, {'username':'user', 'password':'pass'}, format='json')
        self.assertEqual(resp.status_code, status.HTTP_200_OK)
        self.assertTrue('token' in resp.data)
        token = resp.data['token']
        print(token)
```

Now, shell into the running container and run the the test: 

```
brian@brian-ThinkPad-X1-Carbon-6th:~/dock/sept25$ docker exec -it a7b46628b7ae /bin/bash
root@a7b46628b7ae:/code# cd backend/
root@a7b46628b7ae:/code/backend# ./manage.py test
Creating test database for alias 'default'...
System check identified no issues (0 silenced).
eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJ1c2VybmFtZSI6InVzZXIiLCJleHAiOjE1Mzc5Mjg0NzMsImVtYWlsIjoidXNlckBmb28uY29tIn0.HIT4i7_ixaxw1wFpXcOXygyfLlATo2GDASjc2XnFlh0
.
----------------------------------------------------------------------
Ran 1 test in 0.161s

OK
Destroying test database for alias 'default'...
root@a7b46628b7ae:/code/backend# 
```

We see that the account was printed out and the test passed. 

Let's take this idea a little bit further with another model, blog posts. For simplicity, let's say we only want posts to be visible to authenticated users. 

First, let's create a blog post. I'm going to borrow code from [this Django Rest Framework tutorial](https://wsvincent.com/django-rest-framework-tutorial/). 

Create a `posts` app in our Django project through `docker exec` as we did before, add `posts` to `INSTALLED_APPS`, and link up the urls in `backend` with: 

```python
urlpatterns = [
  ...
  path('api/posts/', include('posts.urls')),
]
```

Now we can add the model: 

```python
from django.db import models

class Post(models.Model):
    title = models.CharField(max_length=50)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
```

Next let's register this app with the Django admin: 

```python
from django.contrib import admin
from . models import Post

admin.site.register(Post)
```

Then add a serializer for this model by creating `serializers.py` in the `posts` folder: 

```python
from rest_framework import serializers
from . import models


class PostSerializer(serializers.ModelSerializer):

    class Meta:
        fields = ('id', 'title', 'content', 'created_at', 'updated_at',)
        model = models.Post

```

We will need to add `urls.py` to `posts` with the following: 

```python
from django.urls import path

from . import views

urlpatterns = [
    path('', views.PostList.as_view()),
    path('<int:pk>/', views.PostDetail.as_view()),
]
```

Finally, we will add two views:

```python
from rest_framework import generics

from .models import Post
from .serializers import PostSerializer


class PostList(generics.ListAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer


class PostDetail(generics.RetrieveAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
```

Create some posts in the admin interface. Using the browsable API, check that you can see the posts in list view and detail view by navigating to `localhost:8000/api/posts/` and `localhost:8000/api/posts/1/`. 

Next let's look at how we can make Post objects visible to anyone with a JWT Token in the request header. 

Keep in mind that we have defined default permission and authentication classes in `settings.py`. 

We can remove these, and define `permission_classes` and `authentication_classes` for each 


## VueJS Frontend

Let's create a frontend for our application. The frontend will make calls to the backend.

- Install packages

We want to setup Django and Vue so they can both do hot reloading while we are developing

- We can also refernce https://vuejs.org/v2/cookbook/dockerize-vuejs-app.html

First, let's create a project in our top-level directory called `frontend` using `vue ui`. This is a great tool that offers a GUI for configuring and setting up a VueJS application with options for routing, state management, service workers, testing frameworks and more. 

Once we have created the Vue project, run the following commands: 

```
cd frontend
npm run serve
```

This will start a development server for our Vue app on `http://localhost:8080/`. It will hot reload, and it should be able to communicate with out Django app. Let's test that now. 

Let's replace the `About` page with a `Posts` page where we will display our posts. 

Let's right some logic that will display our posts: 

```
vue
```

Now, if we navigate the that page in our Vue app, we see the following error: 

> Failed to load http://localhost:8000/api/posts/: No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'http://localhost:8080' is therefore not allowed access. If an opaque response serves your needs, set the request's mode to 'no-cors' to fetch the resource with CORS disabled.

Let's enable CORS on our Django app. First, add `django-cors-headers` to `requirements.txt`. Then, add `'corsheaders'` to `INSTALLED_APPS`. Finally, add the middleware:

```python
MIDDLEWARE = [ 
    ...
    'corsheaders.middleware.CorsMiddleware',
    'django.middleware.common.CommonMiddleware',
    ...
]
```

Also, add this to settings.py:

CORS_ORIGIN_ALLOW_ALL = True

Cool, now we can see our posts that are coming from our Django app. But we still have an issue of the `fetch` command taking `'http://localhost:8000/api/posts/'`, a hardcoded URL. We want to be able to specify our Django web app for APIs. 

I think there are a few ways to do this. We can specify a base URL in Webpack (which we aren't using now, I don't think). Or we can use Vue.http and set a default base_url. 

I think the best way is to use nginx to direct API traffic. When we set up the Dockerfile and nginx configuruation file, we can serve the production-ready files directly from nginx, but all requests that start with `/api/` will be proxied to gunicorn which will be serving our Django application. 

## GUNICORN

Let's add gunicorn now. Here's a [link](https://docs.djangoproject.com/en/2.1/ref/django-admin/#django-admin-runserver) to the Django docs section on `manage.py` and the `runserver` command:

> DO NOT USE THIS SERVER IN A PRODUCTION SETTING. It has not gone through security audits or performance tests. (And that’s how it’s gonna stay. We’re in the business of making Web frameworks, not Web servers, so improving this server to be able to handle a production environment is outside the scope of Django.)

Add `gunicorn` to `requirements.txt`. Then add the following line to `docker-compose.yml`:

```yml
services:
  ...
  web:
    build: .
    command: >
      bash -c '
      cd backend &&
      python3 manage.py makemigrations &&
      python3 manage.py migrate --no-input &&
      gunicorn backend.wsgi -b 0.0.0.0:8000' 
    ...
  ...
```

## Adding a form to create a new blog post

Let's try to add a form that will create a new blog post and then update the list instantly. 

It would be good to add a form above the list of posts. 

### Front End Testing 

Let's use the testing frameworks for our view project. 

## NGINX

Let's add NGINX. Again, the plan is to...

## Authentication in VueJS

https://blog.sqreen.io/authentication-best-practices-vue/

Let's add a login page for our users.

## Problems 

- We have solved nginx, but we lost our hotreloading feature. 

- Should we make another `docker-compose-dev.yml` that we can use for fast iteration on our view app?

Now we have two `docker-compose` files. 

- `docker-compose-dev.yml` for hot reloading that uses `runserver` and requires us to run `npm run serve` outside on our local machine (not through docker), and this communicates with the django/postgres containers. 

- `docker-compose.yml` will run production builds of our VueJS on nginx, hot reloading will work for our Django app, but not for VueJS. 

## S3

Now let's think about how to setup AWS S3 in our project. There is a great walkthrough tutorial 


# Other Resources for further ideas

- Auth0 - Where to store your JWTs

https://auth0.com/docs/security/store-tokens#where-to-store-your-jwts

- SSL using Let's Encrypt

## File Upload

https://medium.com/@jxstanford/django-rest-framework-file-upload-e4bc8de669c0

## vue-analytics Google Analytics package for Vue

https://github.com/MatteoGabriele/vue-analytics

## Creating millions of posts and using ElasticSearch 

Django-Docker-Seed

https://github.com/mordaha/django-docker-seed/blob/master/run-in-production.sh