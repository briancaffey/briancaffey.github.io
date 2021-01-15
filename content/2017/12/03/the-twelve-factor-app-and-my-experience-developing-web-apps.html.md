---

layout: post
title: Reflecting on my web-app development process after reading The Twelve-Factor App
date: 2017-12-03
comments: true
image: /static/the-12-factor-app.png
tags:
  - development
  - docker

---

![png](/static/the-12-factor-app.png)

I recently had a conversation with a developer on the topic of bridging application development and production. From this conversation I was recommneded to have a look at *The Twelve-Factor App*, a high level guide for building modern, production-ready web applications. In this article I thought it would be interesting to go through each of the twelve sections and reflect on my current development process and how it follows and/or deviates from these factors. I also want to talk about the new technologies and techniques I have been learning from [testdriven.io](https://testdriven.io/) and how I hope they can benefit me on the next stage of my learning.

## I. Codebase

**One codebase tracked in revision control, many deploys**

I have been using git to track my projects since starting [Obey the Testing Goat!](https://www.obeythetestinggoat.com/) and have been gradually exploring many of the different features beyond a linear `add`-`commit`-`push` loop. Using Visual Studio Code makes resolving merge conflicts very easy. On this blog I have accepted at least one pull requests from a helpful readers to correct outdated information.

The pattern I have been following for Django uses `.gitignore` to keep local application settings out of the production codebase using the following logic:

```python
from .base import *

from .production import *

try:
	from .local import *
except:
	pass
```

## II. Dependencies

**Explicitly declare and isolate dependencies**

Using python makes this easy and I have had success running `pip install -r requirements.txt`, or:

```
ADD ./requirements.txt /usr/src/app/requirements.txt
RUN pip install -r requirements.txt
```

when running Docker.

I have ran into minor dependency issues in experimenting with my personal website. I shouldn't have been doing it this way, but I made a virtual environment with `conda create` and included all of the packages in the environment in my production `requirements.txt`. The Heroku build process gave me a tricky error that I was able to trace to a dependency that was failing to install on the Heroku instance.

With Python 3 there are a few different options for creating virtual environments: `virtualenv`, `venv` and `conda` are three that I have used, and `virtualenv` is a reliable tool for building webapps that I have seen used widely.

Another interesting tip from this section relates to common system tools:

> Twelve-factor apps also do not rely on the implicit existence of any system tools. Examples include shelling out to ImageMagick or curl.

This is something that I have been grappling with in Docker. Tools like `wget` aren't part of "base images" and need to be intalled in the `Dockerfile` or in scripts called from `docker-compose.yml`.

## III. Config

**Store config in the environment**

Heroku's command line utilities make setting production environments very easy. I think I can improve the way I organize environment variables locally since I often have many different projects it would be easy for projects to accidentally share the same variable name. One idea I have thought about would be to have an untracked bash script that sets environment variables that I run when starting the development environment, something like:

```terminal
export SECRET_KEY="my_secret_key"
export DB_URL="postgres://my_db_url"
```

Docker wins points again on this factor because environemnt variables can simple be defined in a development and production `docker-compose-*.yml` files:

```
    environment:
      - APP_SETTINGS=project.config.DevelopmentConfig
      - DATABASE_URL=postgres://postgres:postgres@users-db:5432/users_dev
      - DATABASE_TEST_URL=postgres://postgres:postgres@users-db:5432/users_test
```

## IV. Backing services

**Treat backing services as attached resources**

The key takeaway for backing services (databases, message/queuing systems, etc.) is:

> The code for a twelve-factor app makes no distinction between local and third party services.

This factor made me think of an interesting syntax that I saw for the first time when learning the microservices architecture with docker in [this Docker example](https://github.com/jakewright/tutorials/tree/master/docker/02-docker-compose) that uses two Flask apps to provide 1) front-end templates and 2) API backend. When the front end calls the API backend, it does so by referencing the service name in the URL. Here is an example with PHP, but it would work similarly in any other framework:

```php
<?php
    $json = file_get_contents('http://product-service/');
    $obj = json_decode($json);
    $products = $obj->products;
    foreach ($products as $product) {
        echo "<li>$product</li>";
    }
?>
```

This front-end code hits the backend API endpoint `http://product-service/`, where `product-service` is the name of a service included in `docker-compose.yml`:

```
version: '3'

services:
  product-service:
    build: ./product
    volumes:
      - ./product:/usr/src/app
    ports:
      - 5001:80

  website:
    image: php:apache
    volumes:
      - ./website:/var/www/html
    ports:
      - 5000:80
    depends_on:
      - product-service
```

This is docker-compose file creates a network that includes both `website` and `product-service` that can be accessed by simply creating a URL with the name of the service in the domain. Coming back to the fourth factor, **The code for a twelve-factor app makes no distinction between local and third party services**, multiple docker containers can be thought of as *separate services* even though they may be running on the same virtual environment in either development or production, and the unique domain cooresponding to the service name seems to reinforce this concept.

This URL could also be referenced with environment variables:

```javascript
getUsers() {
  axios.get(`${process.env.REACT_APP_USERS_SERVICE_URL}/users`)
  .then((res) => { console.log(res); })
  .catch((err) => { console.log(err); })
}
```

## V. Build, release, run

**Strictly separate build and run stages**

This is an important stage in getting from development to production. It is the handoff from a local repo to a live, running web application. Here's the process live in action:

```terminal
 $ git push heroku master
Counting objects: 3, done.
Delta compression using up to 4 threads.
Compressing objects: 100% (3/3), done.
Writing objects: 100% (3/3), 303 bytes | 303.00 KiB/s, done.
Total 3 (delta 2), reused 0 (delta 0)
remote: Compressing source files... done.
remote: Building source:
remote:
remote: -----> Python app detected
remote: -----> Installing requirements with pip
remote:
remote: -----> Discovering process types
remote:        Procfile declares types -> web
remote:
remote: -----> Compressing...
remote:        Done: 193.7M
remote: -----> Launching...
remote:        Released v410
remote:        https://briancaffey.herokuapp.com/ deployed to Heroku
remote:
remote: Verifying deploy... done.
To https://git.heroku.com/briancaffey.git
   cd6ce76..d8981a3  master -> master
(briancaffey) brian@archthinkpad ~/Documents/github/briancaffey/src
```

## VI. Processes

**Execute the app as one or more stateless processes**

This is handled in Heroku by the Procfile. For simple Django apps on Heroku this is usually always the same one line:

```
web: gunicorn projectname.wsgi --log-file -
```

Here's what the Django project says about using gunicorn:

> When Gunicorn is installed, a gunicorn command is available which starts the Gunicorn server process. At its simplest, gunicorn just needs to be called with the location of a module containing a WSGI application object named application.
>
> So for a typical Django project, invoking gunicorn would look like:
>
 > `gunicorn myproject.wsgi`

> This will start one process running one thread listening on 127.0.0.1:8000. It requires that your project be on the Python path; the simplest way to ensure that is to run this command from the same directory as your manage.py file.

In a Django project, the `wsgi.py` file in the main folder of the project root directory has the following contents:

```python
import os

from django.core.wsgi import get_wsgi_application

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "brianblog.settings")

application = get_wsgi_application()
```

## VI. Port binding

**Export services via port binding**

This is an area that I'm trying to learn more about. I feel like I have a pretty good grasp of what is going on regarding port binding in the microservice architecture with docker I have seen.

From the docker-compose docs, the "short syntax" for mapping ports between hosts and containers is `HOST:CONTAINER`:

> Either specify both ports (HOST:CONTAINER), or just the container port (a random host port will be chosen).

The following are examples of how this could work:

```
ports:
 - "3000"
 - "3000-3005"
 - "8000:8000"
 - "9090-9091:8080-8081"
 - "49100:22"
 - "127.0.0.1:8001:8001"
 - "127.0.0.1:5000-5010:5000-5010"
 - "6060:6060/udp"
```

## VIII. Concurrency

**Scale out via the process model**

This is an important area, but it is something I haven't had to be aware of since the apps I have developed don't require scaling processes. I belive that Heroku makes this fairly simple by allowing you to increase the number of web or worker processes through the CLI:

```terminal
heroku ps:scale web=1 worker=5
```

I haven't covered Part 5 of testdriven.io yet, but it has a section on Elastic Load Balancing with EC2 which should cover this area.

> Twelve-factor app processes should never daemonize or write PID files. Instead, rely on the operating system’s process manager to manage output streams, respond to crashed processes, and handle user-initiated restarts and shutdowns.

I have been learning more about `systemd` and customizing

## IX. Disposability

**Maximize robustness with fast startup and graceful shutdown**

> The twelve-factor app’s processes are disposable, meaning they can be started or stopped at a moment’s notice. This facilitates fast elastic scaling, rapid deployment of code or config changes, and robustness of production deploys.

I have used some Heroku tools to start and stop web workers, and docker commands make this factor fairly easy to do correctly. Here's an excerpt from [Century Link](https://www.ctl.io/developers/blog/post/gracefully-stopping-docker-containers/) about the `docker stop` command:

> The docker stop command attempts to stop a running container first by sending a SIGTERM signal to the root process (PID 1) in the container. If the process hasn't exited within the timeout period a SIGKILL signal will be sent.

## X. Dev/prod parity

> Keep development, staging, and production as similar as possible

This is exactly why I'm so interested in using Docker.

In one of my personal projects I did with Heroku I was relying on a feature of Postgres that is not available in sqlite3, the default database that comes with Django. This produced friction that I wouldn't have had to deal with if I was using Docker. I could have set up a local postgres server, but it would have been much easier to run a docker container that ran the server.

## XI. Logs

**Treat logs as event streams**

> A twelve-factor app never concerns itself with routing or storage of its output stream. It should not attempt to write to or manage logfiles. Instead, each running process writes its event stream, unbuffered, to stdout. During local development, the developer will view this stream in the foreground of their terminal to observe the app’s behavior.

Running `heroku log` has been helpful in debugging deployment issues.

Docker also produces helpful logs for all the containers currently running.

## XII. Admin processes

**Run admin/management tasks as one-off processes**

> One-off admin processes should be run in an identical environment as the regular long-running processes of the app. They run against a release, using the same codebase and config as any process run against that release. Admin code must ship with application code to avoid synchronization issues.

This seems to be true about the way I run admin processes on my Django apps.