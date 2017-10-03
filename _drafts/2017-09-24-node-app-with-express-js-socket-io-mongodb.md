---

layout: post
title: NodeJS App
date: 2017-09-24
comments: true

---

After having spent several months with Django, I have been interested in learning NodeJS. This article will document my learning experience as I build a Node app with the following:

- express.js for the backend
- socket.io for real-time communications
- mongdodb for a data-store

I'll continue to use jQuery and Bootstrap as I have done in my other projects.

Here are a list of helpful blog posts I used to put this app togther:

- [http://www.programwitherik.com/getting-started-with-socket-io-node-js-and-express/](http://www.programwitherik.com/getting-started-with-socket-io-node-js-and-express/)
-

Along the way I will try to cover the main differences between Django project workflows and node project workflows.

Let's get going!

## Setup

Assuming that you have npm and node.js installed, create a project folder and initialize the project:

```
$ mkdir ~/Documents/node/nodeapp
$ cd ~/Documents/node/nodeapp
$ npm init
```

Next let's install the major things we will need through `npm`:

```
$ npm install socket.io express jquery bootstrap --save
```

Let's take a look in the project folder:

```
$ ls
node_modules  package.json  package-lock.json
```

We should now add version tracking and commit the changes to our project. Before we do this, let's add a `.gitignore` file wit just one line so we don't include the `node_modules` folder. This folder maintains a copy of all of the packages we install, so it is not necessary to put them into our version tracking.

```
$ echo "/node_modules" > .gitignore
$ git init
$ git add --all
$ git status
On branch master

No commits yet

Changes to be committed:
  (use "git rm --cached <file>..." to unstage)

	new file:   .gitignore
	new file:   package-lock.json
	new file:   package.json

$ git commit -m "initial commit"
```

Next we will create JavaScript file that will make up the core of the backend logic:

*app.js*

```
var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);

app.use(express.static(__dirname + '/node_modules'));

app.get('/', function(req, res, next){
  res.sendFile(__dirname + '/index.html');
});

server.listen(3000);
```
