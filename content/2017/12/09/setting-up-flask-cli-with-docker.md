---
layout: post
title: Setting up a Flask project with Flask CLI and Docker
date: 2017-12-09
comments: true
image: /static/flask-docker.png
tags:
  - flask
  - docker
---

![png](/static/flask-docker.png)

⚠️ This article is under contruction ⚠️

I've recently been working on an awesome tutorial from [testdriven.io](https://testdriven.io) that covers flask, react and docker. The beginning of the project covers how to setup a basic flask app using `flask-scripts`. `flask-scripts` is a deprecated tool and the tutorial recommends using `Flask CLI`. I have fumbled with this the first time I tried to set it up and while I was able to get it working, I couldn't get it working inside of docker. In this article I'll detail the setup of my flask project with `Flask CLI`.

> One of the nice new features in Flask 0.11 is the built-in integration of the click command line interface. This enables a wide range of new features for the Flask ecosystem and your own applications.

OK. Let's set up a basic flask app:

### Directories

```
 $ mkdir test-flask && cd test-flask
 $ mkdir users-service && cd users-service
 $ mkdir project

```

### Virtual Environment

```
 $ virtualenv -p python3 env
Running virtualenv with interpreter /home/brian/anaconda3/bin/python3
Using base prefix '/home/brian/anaconda3'
New python executable in /home/brian/Documents/flask/test-flask/users-service/env/bin/python3
Also creating executable in /home/brian/Documents/flask/test-flask/users-service/env/bin/python
Installing setuptools, pip, wheel...done.
```

### Activate Virtual Environment

```
 $ source env/bin/activate
(env) $
```

We will come back to the `activate` script and add some environment variables to the bottom if it so we have them accessible when we activate the virtual environment.

### Install flask in the virtual environment

```
 $ pip install flask==0.12.2
Collecting flask==0.12.2
  Using cached Flask-0.12.2-py2.py3-none-any.whl
Collecting itsdangerous>=0.21 (from flask==0.12.2)
Collecting Werkzeug>=0.7 (from flask==0.12.2)
  Using cached Werkzeug-0.13-py2.py3-none-any.whl
Collecting click>=2.0 (from flask==0.12.2)
  Using cached click-6.7-py2.py3-none-any.whl
Collecting Jinja2>=2.4 (from flask==0.12.2)
  Using cached Jinja2-2.10-py2.py3-none-any.whl
Collecting MarkupSafe>=0.23 (from Jinja2>=2.4->flask==0.12.2)
Installing collected packages: itsdangerous, Werkzeug, click, MarkupSafe, Jinja2, flask
Successfully installed Jinja2-2.10 MarkupSafe-1.0 Werkzeug-0.13 click-6.7 flask-0.12.2 itsdangerous-0.24
(env) $
```

At this point we are ready to create our flask app.

Here's a note about the CLI:

> For the **flask** script to work, an application needs to be discovered. This is achieved by exporting the `FLASK_APP` environment variable. It can be either set to an import path or to a filename of a Python module that contains a Flask application.

Let's add an `app.py` file inside the `project` folder:

_app.py_

```python
from flask import Flask, jsonify

app = Flask(__name__)

@app.route('/users/ping', methods=['GET'])
def ping_pong():
    return jsonify({
        'message':'pong!',
        'status':'success'
        })
```

And now let's add an environment variable to tell the Flask CLI where our app is located:

```
 $ export FLASK_APP=/home/brian/Documents/flask/test-flask/users-service/project/app.py
```

OK, now let's try to run `flask run` and navigate to `/users/ping` and see what happens:

```
 $ flask run
 * Serving Flask app "app"
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
127.0.0.1 - - [09/Dec/2017 19:20:14] "GET /users/ping HTTP/1.1" 200 -
```

Great! We see our `pong!` message returned in the browser. Next, let's configure our settings:

_project/config.py_

```python
class BaseConfig:
    """Base configuration"""
    DEBUG = False
    TESTING = False
class DevelopmentConfig(BaseConfig):
    """Development configuration"""
    DEBUG = True
class TestingConfig(BaseConfig):
    """Testing configuration"""
    DEBUG = True
    TESTING = True
class ProductionConfig(BaseConfig):
    """Production configuration"""
    DEBUG = False
```

And now we can add the following line right below where we define `app = Flask(__name__)`:

```python
app.config.from_object('project.config.DevelopmentConfig')
```

When we run `flask run`, we get a long error message including:

```
Debugged import:

- 'project' not found.

Original exception:

ImportStringError: import_string() failed for 'project.config'. Possible reasons are:

- missing __init__.py in a package;
- package or module path not included in sys.path;
- duplicated package or module name taking precedence in sys.path;
- missing module, class, function or variable;
```

Let's try to add `__init__.py` to our `project` folder.

Once we do this, we are able to run the app successfully, but we don't see any special message about Debug mode being on:

```
 $ flask run
 * Serving Flask app "project.app"
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
```

The documentation mentions that we can turn on Debug mode with:

```
export FLASK_DEBUG=1
```

We can check the debug mode by printing `app.config` in the `ping_pong()` function that is returned when we hit `/users/ping`:

```python
@app.route('/users/ping', methods=['GET'])
def ping_pong():
    print(app.config)
    return jsonify({
        'message':'pong!',
        'status':'success'
        })
```

Here's what we see in the terminal:

```
<Config {'DEBUG': True, 'TESTING': False, 'PROPAGATE_EXCEPTIONS': None, 'PRESERVE_CONTEXT_ON_EXCEPTION': None, 'SECRET_KEY': None, 'PERMANENT_SESSION_LIFETIME': datetime.timedelta(31), 'USE_X_SENDFILE': False, 'LOGGER_NAME': 'project.app', 'LOGGER_HANDLER_POLICY': 'always', 'SERVER_NAME': None, 'APPLICATION_ROOT': None, 'SESSION_COOKIE_NAME': 'session', 'SESSION_COOKIE_DOMAIN': None, 'SESSION_COOKIE_PATH': None, 'SESSION_COOKIE_HTTPONLY': True, 'SESSION_COOKIE_SECURE': False, 'SESSION_REFRESH_EACH_REQUEST': True, 'MAX_CONTENT_LENGTH': None, 'SEND_FILE_MAX_AGE_DEFAULT': datetime.timedelta(0, 43200), 'TRAP_BAD_REQUEST_ERRORS': False, 'TRAP_HTTP_EXCEPTIONS': False, 'EXPLAIN_TEMPLATE_LOADING': False, 'PREFERRED_URL_SCHEME': 'http', 'JSON_AS_ASCII': True, 'JSON_SORT_KEYS': True, 'JSONIFY_PRETTYPRINT_REGULAR': True, 'JSONIFY_MIMETYPE': 'application/json', 'TEMPLATES_AUTO_RELOAD': None}>
127.0.0.1 - - [09/Dec/2017 19:42:46] "GET /users/ping HTTP/1.1" 200 -
```

Just to be sure this is working correctly, let's try another config setting, `ProductionConfig`:

```
<Config {'DEBUG': False, 'TESTING': False, 'PROPAGATE_EXCEPTIONS': None, 'PRESERVE_CONTEXT_ON_EXCEPTION': None, 'SECRET_KEY': None, 'PERMANENT_SESSION_LIFETIME': datetime.timedelta(31), 'USE_X_SENDFILE': False, 'LOGGER_NAME': 'project.app', 'LOGGER_HANDLER_POLICY': 'always', 'SERVER_NAME': None, 'APPLICATION_ROOT': None, 'SESSION_COOKIE_NAME': 'session', 'SESSION_COOKIE_DOMAIN': None, 'SESSION_COOKIE_PATH': None, 'SESSION_COOKIE_HTTPONLY': True, 'SESSION_COOKIE_SECURE': False, 'SESSION_REFRESH_EACH_REQUEST': True, 'MAX_CONTENT_LENGTH': None, 'SEND_FILE_MAX_AGE_DEFAULT': datetime.timedelta(0, 43200), 'TRAP_BAD_REQUEST_ERRORS': False, 'TRAP_HTTP_EXCEPTIONS': False, 'EXPLAIN_TEMPLATE_LOADING': False, 'PREFERRED_URL_SCHEME': 'http', 'JSON_AS_ASCII': True, 'JSON_SORT_KEYS': True, 'JSONIFY_PRETTYPRINT_REGULAR': True, 'JSONIFY_MIMETYPE': 'application/json', 'TEMPLATES_AUTO_RELOAD': None}>
127.0.0.1 - - [09/Dec/2017 19:45:29] "GET /users/ping HTTP/1.1" 200 -
```

OK, so far so good! I think that `FLASK_DEBUG` may give us some additional information in the terminal.

Let's run:

```
export FLASK_DEBUG=1
```

and run our app in `ProductionConfig` mode:

```
 $ flask run
 * Serving Flask app "project.app"
 * Forcing debug mode on
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: 775-946-486
```

and when we hit `/users/ping` we get:

```
<Config {'DEBUG': True, 'TESTING': False, 'PROPAGATE_EXCEPTIONS': None, 'PRESERVE_CONTEXT_ON_EXCEPTION': None, 'SECRET_KEY': None, 'PERMANENT_SESSION_LIFETIME': datetime.timedelta(31), 'USE_X_SENDFILE': False, 'LOGGER_NAME': 'project.app', 'LOGGER_HANDLER_POLICY': 'always', 'SERVER_NAME': None, 'APPLICATION_ROOT': None, 'SESSION_COOKIE_NAME': 'session', 'SESSION_COOKIE_DOMAIN': None, 'SESSION_COOKIE_PATH': None, 'SESSION_COOKIE_HTTPONLY': True, 'SESSION_COOKIE_SECURE': False, 'SESSION_REFRESH_EACH_REQUEST': True, 'MAX_CONTENT_LENGTH': None, 'SEND_FILE_MAX_AGE_DEFAULT': datetime.timedelta(0, 43200), 'TRAP_BAD_REQUEST_ERRORS': False, 'TRAP_HTTP_EXCEPTIONS': False, 'EXPLAIN_TEMPLATE_LOADING': False, 'PREFERRED_URL_SCHEME': 'http', 'JSON_AS_ASCII': True, 'JSON_SORT_KEYS': True, 'JSONIFY_PRETTYPRINT_REGULAR': True, 'JSONIFY_MIMETYPE': 'application/json', 'TEMPLATES_AUTO_RELOAD': None}>
127.0.0.1 - - [09/Dec/2017 19:51:17] "GET /users/ping HTTP/1.1" 200 -
```

Here we can see that `DEBUG` is `True`, which was forced when we set `FLASK_DEBUG=1`.

For clarity, let's review the directory structure of our project:

```
 $ tree project/
project/
├── app.py
├── config.py
└── __init__.py
```

`__init__.py` is just an empty file at this point, but in the testdriven.io tutorial it is the file that contains our app.

OK, we have a very simple flask app that we can control with the flask cli. Let's get ready to dockerize this simple project.

We need a `requirements.txt` file. So far we just have flask. We want to place this file on the same level as our `project` folder:

_requirements.txt_

```
Flask==0.12.1
```

And we can add a `.gitignore` file as well at the same level:

_.gitignore_

```
__pycache__
env
```

## Docker

Here are the versions of docker applications I have installed:

```
 $ docker -v && docker-compose -v && docker-machine -v
Docker version 17.10.0-ce, build f4ffd2511c
docker-compose version 1.17.1, build unknown
docker-machine version 0.13.0, build HEAD
```

Currently I don't have any docker machines, images or containers. Here is the status of the docker service:

```
 $ systemctl status docker
● docker.service - Docker Application Container Engine
   Loaded: loaded (/usr/lib/systemd/system/docker.service; enabled; vendor preset: disabled)
   Active: active (running) since Fri 2017-12-08 19:13:09 EST; 24h ago
     Docs: https://docs.docker.com
 Main PID: 5486 (dockerd)
    Tasks: 26 (limit: 4915)
   CGroup: /system.slice/docker.service
           ├─5486 /usr/bin/dockerd -g /home/brian/docker -H fd://
           └─5492 docker-containerd -l unix:///var/run/docker/libcontainerd/docker-containerd.sock --metrics-interval=0 --start-timeout 2m --state-dir /var/run/docker/libcontainerd/containerd --shim docker-containerd-shim --runtime docker-runc

Dec 08 19:13:08 archthinkpad dockerd[5486]: time="2017-12-08T19:13:08.126834430-05:00" level=warning msg="Your kernel does not support cgroup rt period"
Dec 08 19:13:08 archthinkpad dockerd[5486]: time="2017-12-08T19:13:08.126850093-05:00" level=warning msg="Your kernel does not support cgroup rt runtime"
Dec 08 19:13:08 archthinkpad dockerd[5486]: time="2017-12-08T19:13:08.127216425-05:00" level=info msg="Loading containers: start."
Dec 08 19:13:08 archthinkpad dockerd[5486]: time="2017-12-08T19:13:08.776371797-05:00" level=info msg="Default bridge (docker0) is assigned with an IP address 172.17.0.0/16. Daemon option --bip can be used to set a preferred IP address"
Dec 08 19:13:09 archthinkpad dockerd[5486]: time="2017-12-08T19:13:09.013651222-05:00" level=info msg="Loading containers: done."
Dec 08 19:13:09 archthinkpad dockerd[5486]: time="2017-12-08T19:13:09.041318847-05:00" level=warning msg="Not using native diff for overlay2, this may cause degraded performance for building images: kernel has CONFIG_OVERLAY_FS_REDIRECT_DIR enabled"
Dec 08 19:13:09 archthinkpad dockerd[5486]: time="2017-12-08T19:13:09.075633462-05:00" level=info msg="Docker daemon" commit=f4ffd2511c graphdriver(s)=overlay2 version=17.10.0-ce
Dec 08 19:13:09 archthinkpad dockerd[5486]: time="2017-12-08T19:13:09.076162900-05:00" level=info msg="Daemon has completed initialization"
Dec 08 19:13:09 archthinkpad dockerd[5486]: time="2017-12-08T19:13:09.082056339-05:00" level=info msg="API listen on /var/run/docker.sock"
Dec 08 19:13:09 archthinkpad systemd[1]: Started Docker Application Container Engine.
```

OK, docker seems to be working fine. Now we need to create a Docker host and point the docker client at it. What does this mean? From what I understand, we will be running docker containers not on our local machine but in an instance of `virtualbox` on our local machine. To do this, we will use the `docker-machine` command:

```
 $ docker-machine create -d virtualbox testdriven-dev
Running pre-create checks...
Creating machine...
(testdriven-dev) Copying /home/brian/.docker/machine/cache/boot2docker.iso to /home/brian/.docker/machine/machines/testdriven-dev/boot2docker.iso...
(testdriven-dev) Creating VirtualBox VM...
(testdriven-dev) Creating SSH key...
(testdriven-dev) Starting the VM...
(testdriven-dev) Check network to re-create if needed...
(testdriven-dev) Waiting for an IP...
Waiting for machine to be running, this may take a few minutes...
Detecting operating system of created instance...
Waiting for SSH to be available...
Detecting the provisioner...
Provisioning with boot2docker...
Copying certs to the local machine directory...
Copying certs to the remote machine...
Setting Docker configuration on the remote daemon...

This machine has been allocated an IP address, but Docker Machine could not reach it successfully.

SSH for the machine should still work, but connecting to exposed ports, such as the Docker daemon port (usually <ip>:2376), may not work properly.

You may need to add the route manually, or use another related workaround.

This could be due to a VPN, proxy, or host file configuration issue.

You also might want to clear any VirtualBox host only interfaces you are not using.
Checking connection to Docker...
Docker is up and running!
To see how to connect your Docker Client to the Docker Engine running on this virtual machine, run: docker-machine env testdriven-dev
```

We see that `Docker is up and running!`, but notice this line:

```
This machine has been allocated an IP address, but Docker Machine could not reach it successfully.
```

This might be a problem. I think that the `docker-machine env <machine-name>` command fixes this:

When you run this command you get the following:

```
 $ docker-machine env testdriven-dev
export DOCKER_TLS_VERIFY="1"
export DOCKER_HOST="tcp://192.168.99.100:2376"
export DOCKER_CERT_PATH="/home/brian/.docker/machine/machines/testdriven-dev"
export DOCKER_MACHINE_NAME="testdriven-dev"
# Run this command to configure your shell:
# eval $(docker-machine env testdriven-dev)
```

The result of this command tells us to run `eval \$(docker-machine env testdriven-dev):

```
eval "$(docker-machine env testdriven-dev)"
```

To clarify, running the above commands puts adds some environment variables:

```
 $ env | grep DOCKER
DOCKER_MACHINE_NAME=testdriven-dev
DOCKER_CERT_PATH=/home/brian/.docker/machine/machines/testdriven-dev
DOCKER_TLS_VERIFY=1
DOCKER_HOST=tcp://192.168.99.100:2376
```

Next we need to add a Dockerfile. We will call it `Dockerfile-dev`. Let's look at `Dockerfile-dev` from the tutorial and see how we may need to modify it for the way we set up our project:

```
FROM python:3.6.3

# set working directory
RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

# add requirements
ADD ./requirements.txt /usr/src/app/requirements.txt

# install requirements
RUN pip install -r requirements.txt

# add app
ADD . /usr/src/app

# run server
CMD python manage.py runserver -h 0.0.0.0
```

We start by defining a base image with the `FROM` line which will give us the correct version of python. We then set folders and the current working directory in docker. Next we install flask add the `requirements.txt` file and install flask with the `RUN` line. We then add the directory (on our local machine) with `ADD . /usr/src/app`.

This should all be fine up until the last line where we see a `manage.py` file. We never created this file since we wish to use the Flask CLI. We could try replicating the process did locally inside our Dockerfile. We need to add the the `FLASK_APP` environment variable, and its value should be the script that has just been added to the docker image. Let's try:

```
[...]

ENV FLASK_APP /usr/src/app/project/app.py

CMD flask run
```

Next we need a script for `docker-compose`. `docker-compose` is a tool for defining and running multi-container Docker applications. Again, let's look at what was included in the tutorial and then see if we need to make any adjustments:

_docker-compose-dev.yml_ (this file goes in the root directory, one level up from where `Dockerfile-dev`)

```
version: '3.3'

services:

  users-service:
    container_name: users-service
      build:
        context: ./users-service
        dockerfile: Dockerfile-dev
      volumes:
        - './users-service:/usr/src/app'
      ports:
        - 5001:5000
```

OK, this looks good! Let's give it a try. We can run the following command:

```
 $ docker-compose -f docker-compose-dev.yml build
Building users-service
85b1f47fba49: Pull complete
ba6bd283713a: Pull complete
817c8cd48a09: Pull complete
47cc0ed96dc3: Pull complete
4a36819a59dc: Pull complete
db9a0221399f: Pull complete
7a511a7689b6: Pull complete
1223757f6914: Pull complete
Digest: sha256:db9d8546f3ff74e96702abe0a78a0e0454df6ea898de8f124feba81deea416d7
Status: Downloaded newer image for python:3.6.3
 ---> 79e1dc9af1c1
Step 2/8 : RUN mkdir -p /usr/src/app
 ---> Running in 808f6c0497d3
 ---> 8873e8e0d526
Removing intermediate container 808f6c0497d3
Step 3/8 : WORKDIR /usr/src/app
 ---> 76ef8912b4d5
Removing intermediate container a3ca419fe9c1
Step 4/8 : ADD ./requirements.txt /usr/src/app/requirements.txt
 ---> eb513314527a
Step 5/8 : RUN pip install -r requirements.txt
 ---> Running in 1a708ec3b565
Collecting Flask==0.12.1 (from -r requirements.txt (line 1))
  Downloading Flask-0.12.1-py2.py3-none-any.whl (82kB)
Collecting Jinja2>=2.4 (from Flask==0.12.1->-r requirements.txt (line 1))
  Downloading Jinja2-2.10-py2.py3-none-any.whl (126kB)
Collecting click>=2.0 (from Flask==0.12.1->-r requirements.txt (line 1))
  Downloading click-6.7-py2.py3-none-any.whl (71kB)
Collecting Werkzeug>=0.7 (from Flask==0.12.1->-r requirements.txt (line 1))
  Downloading Werkzeug-0.13-py2.py3-none-any.whl (311kB)
Collecting itsdangerous>=0.21 (from Flask==0.12.1->-r requirements.txt (line 1))
  Downloading itsdangerous-0.24.tar.gz (46kB)
Collecting MarkupSafe>=0.23 (from Jinja2>=2.4->Flask==0.12.1->-r requirements.txt (line 1))
  Downloading MarkupSafe-1.0.tar.gz
Building wheels for collected packages: itsdangerous, MarkupSafe
  Running setup.py bdist_wheel for itsdangerous: started
  Running setup.py bdist_wheel for itsdangerous: finished with status 'done'
  Stored in directory: /root/.cache/pip/wheels/fc/a8/66/24d655233c757e178d45dea2de22a04c6d92766abfb741129a
  Running setup.py bdist_wheel for MarkupSafe: started
  Running setup.py bdist_wheel for MarkupSafe: finished with status 'done'
  Stored in directory: /root/.cache/pip/wheels/88/a7/30/e39a54a87bcbe25308fa3ca64e8ddc75d9b3e5afa21ee32d57
Successfully built itsdangerous MarkupSafe
Installing collected packages: MarkupSafe, Jinja2, click, Werkzeug, itsdangerous, Flask
Successfully installed Flask-0.12.1 Jinja2-2.10 MarkupSafe-1.0 Werkzeug-0.13 click-6.7 itsdangerous-0.24
 ---> d828a0518114
Removing intermediate container 1a708ec3b565
Step 6/8 : ADD . /usr/src/app
 ---> 8e0efae73a47
Step 7/8 : ENV FLASK_APP /usr/src/app/project/app.py
 ---> Running in 959581952d05
 ---> 20aaec61b615
Removing intermediate container 959581952d05
Step 8/8 : CMD flask run
 ---> Running in 4f2fc701ba14
 ---> 1d5b59f3cef2
Removing intermediate container 4f2fc701ba14

Successfully built 1d5b59f3cef2
Successfully tagged testflask_users-service:latest

```

That seemed to work. Next the tutorial says to run `docker-compose -f docker-compose-dev.yml up -d`. I'll run this without the `-d` flag so we can see if there are any errors. Moment of truth!

```
 $ docker-compose -f docker-compose-dev.yml up
Creating network "testflask_default" with the default driver
Creating users-service ...
Creating users-service ... done
Attaching to users-service
users-service    | Usage: flask run [OPTIONS]
users-service    |
users-service    | Error: The file/path provided (/usr/src/app/project/app.py) does not appear to exist.  Please verify the path is correct.  If app is not on PYTHONPATH, ensure the extension is .py
users-service exited with code 2
```

OK, we have an error that seems to have come from our `flask run` command.

To bo continued...
