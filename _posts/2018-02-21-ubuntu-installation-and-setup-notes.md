---

layout: post
title: Ubuntu 16.04.4 Installation and Setup Notes
date: 2018-03-09
comments: true

---

# Ubuntu Setup

I have recently been working between MacOS, Windows 10 and Linux machines, but I haven't spent much time on Ubuntu. This is a collection of notes on setting up Ubunutu with a few different development environments:

- nodejs
- ruby
- python
- postgresql
- various development tools

### Installation

To install Ubuntu you need the ISO image. The fastest way to download this is BitTorrent, using a client like Deluge. Grad the torrent file from [Ubuntu Alternative Downloads](https://www.ubuntu.com/download/alternative-downloads) and make sure you get the correct version. I will be using **Ubuntu 16.04.4 Desktop (64-bit)**. Next, use a utility like Rufus to put the ISO image on a USB drive. Then you will need to boot into the USB that contains the ISO image. At this point, you need to make some decisions about where to install Ubuntu. I select the *Do something else* option that allows me to create partition tables. 

Here is how I partitioned my drive using a 240GB SSD:

- `200MB` - `efi boot`
- `1MB` - `swap area`
- `40GB` - `/` 
- `185GB` - `/home`

```
brian@brian-ThinkPad-T430:~$ df -h | grep sdb
/dev/sdb1             188M  3.4M  184M   2% /boot/efi
/dev/sdb3              37G  5.3G   30G  16% /
/dev/sdb4             183G  2.3G  171G   2% /home
```

### Ubunutu Software

- Chrome
- VSCode
- Gimp
- Blender

### git

Install and configure git with the following commands:

```
$ sudo apt-get install git 
$ git config --global user.name "John Doe"
$ git config --global user.email johndoe@example.com
```

### curl

```
$ sudo apt install curl
```

### npm 

```
$ curl -sL https://deb.nodesource.com/setup_6.x | sudo -E bash -
$ sudo apt-get install -y nodejs
```

### vim

```
$ sudo apt install vim
```

### SSH Keys for github

```
brian@brian-ThinkPad-T430:~$ ssh-keygen -t rsa -C "briancaffey2010@gmail.com"
[sudo] password for brian: 
Generating public/private rsa key pair.
Enter file in which to save the key (/home/brian/.ssh/id_rsa): 
Created directory '/home/brian/.ssh'.
Enter passphrase (empty for no passphrase): 
Enter same passphrase again: 
Your identification has been saved in /home/brian/.ssh/id_rsa.
Your public key has been saved in /home/brian/.ssh/id_rsa.pub.
The key fingerprint is:
SHA256:DSFNVSFDLKUVSIVUHTR98948W498FH54W54H/g briancaffey2010@gmail.com
The key's randomart image is:
+---[RSA 2048]----+
| o=v++o.         |
|..D-*. o         |
|+. .O.+ o .      |
|o+ * x = * .     |
|- o X . S .      |
| B = +   o       |
|  o =            |
|   + .           |
|                 |
+----[SHA256]-----+
```

To get the public key, run:

```terminal
brian@brian-ThinkPad-T430:~$ cat ~/.ssh/id_rsa.pub
```

[Why you should have both GPG and SSH](https://security.stackexchange.com/questions/120706/why-would-i-sign-my-git-commits-with-a-gpg-key-when-i-already-use-an-ssh-key-to)

### GPG Key for github

```
$ gpg --gen-key
```

```terminal
$ gpg --list-secret-keys --keyid-format LONG
brian@brian-ThinkPad-T430:~/Documents$ gpg --list-secret-keys --keyid-format LONG
/home/brian/.gnupg/secring.gpg
------------------------------
sec   2048R/A4E10BFF341S64V3 2018-03-06
uid                          Brian Caffey (t430 key) <briancaffey2010@gmail.com>
ssb   2048R/49B26066D2G5E456 2018-03-06
```

Finally, print out the key and add it to github.

```terminal
$ gpg --armor --export A4E10BFF341S64V3
-----BEGIN PGP PUBLIC KEY BLOCK-----
Version: GnuPG v1

UREFLIUWFWOI8F98F98U459FU43982U4F98UP9432UFP98U4
[...]
FWERO8FEFPHHSLIREUFHWEIRHUFWREHWRLFUWH5LIFU4H5F=
=6H/K
-----END PGP PUBLIC KEY BLOCK-----
```

### Jekyll (Ruby-based static blog generator)

```
$ sudo apt-get install ruby ruby-dev make gcc
```

We need to reinstall Ruby to fix permission issues:

```
$ sudo apt-get remove ruby
$ git clone https://github.com/rbenv/rbenv.git ~/.rbenv
```

Follow instructions on [this SO post](https://stackoverflow.com/questions/37720892/you-dont-have-write-permissions-for-the-var-lib-gems-2-3-0-directory) to install a newer version of Ruby with rbenv.

```
cd $HOME
sudo apt-get update 
sudo apt-get install git-core curl zlib1g-dev build-essential libssl-dev libreadline-dev libyaml-dev libsqlite3-dev sqlite3 libxml2-dev libxslt1-dev libcurl4-openssl-dev python-software-properties libffi-dev

git clone https://github.com/rbenv/rbenv.git ~/.rbenv
echo 'export PATH="$HOME/.rbenv/bin:$PATH"' >> ~/.bashrc
echo 'eval "$(rbenv init -)"' >> ~/.bashrc
exec $SHELL

git clone https://github.com/rbenv/ruby-build.git ~/.rbenv/plugins/ruby-build
echo 'export PATH="$HOME/.rbenv/plugins/ruby-build/bin:$PATH"' >> ~/.bashrc
exec $SHELL

rbenv install 2.3.1
rbenv global 2.3.1
ruby -v
```

Note: This failed: 

```
$ rbenv install 2.3.1
Downloading ruby-2.3.1.tar.bz2...
-> https://cache.ruby-lang.org/pub/ruby/2.3/ruby-2.3.1.tar.bz2
Installing ruby-2.3.1...

BUILD FAILED (Ubuntu 16.04 using ruby-build 20180224)

Inspect or clean up the working tree at /tmp/ruby-build.20180306153138.18887
Results logged to /tmp/ruby-build.20180306153138.18887.log

Last 10 log lines:
The Ruby openssl extension was not compiled.
The Ruby readline extension was not compiled.
The Ruby zlib extension was not compiled.
ERROR: Ruby install aborted due to missing extensions
Try running `apt-get install -y libssl-dev libreadline-dev zlib1g-dev` to fetch missing dependencies.

Configure options used:
  --prefix=/home/brian/.rbenv/versions/2.3.1
  LDFLAGS=-L/home/brian/.rbenv/versions/2.3.1/lib 
  CPPFLAGS=-I/home/brian/.rbenv/versions/2.3.1/include 
```

As the message recommends, we should install some missing dependencies:

```
$ sudo apt-get install -y libssl-dev libreadline-dev zlib1g-dev
```

And now it should work: 

```
$ rbenv install 2.3.1
Downloading ruby-2.3.1.tar.bz2...
-> https://cache.ruby-lang.org/pub/ruby/2.3/ruby-2.3.1.tar.bz2
Installing ruby-2.3.1...
Installed ruby-2.3.1 to /home/brian/.rbenv/versions/2.3.1

$ 
```

Finally, run:

```
$ rbenv global 2.3.1
```

### Install Jekyll

```
$ gem install jekyll bundler
```

### Node permission issues

(Following steps from [this article](http://nodesource.com/blog/installing-node-js-tutorial-using-nvm-on-mac-os-x-and-ubuntu/))

I need root permission to run `npm install -g ...`. 

First, remove `nodejs` and `npm`:

```
$ sudo apt-get remove nodejs
$ sudo apt-get remove npm
```

Then, update: 

```
$ sudo apt-get update
```

Now we can install `nvm` (Node Version Manager):

```
$ curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.33.0/install.sh | bash
```

Next, reload `~/.bashrc`:

```
$ source ~/.bashrc
```

Now we can run `nvm`:

```
$ nvm --version
0.33.0
```

Now we can install `nodejs`:

```
$ nvm install node
Downloading and installing node v9.7.1...
Downloading https://nodejs.org/dist/v9.7.1/node-v9.7.1-linux-x64.tar.xz...
######################################################################## 100.0%
Computing checksum with sha256sum
Checksums matched!
Now using node v9.7.1 (npm v5.6.0)
Creating default alias: default -> node (-> v9.7.1)
brian@brian-ThinkPad-T430:~$ 
```

Now we can try to install something with node, like `create-react-app`:

```
brian@brian-ThinkPad-T430:~$ npm install -g create-react-app
/home/brian/.nvm/versions/node/v9.7.1/bin/create-react-app -> /home/brian/.nvm/versions/node/v9.7.1/lib/node_modules/create-react-app/index.js
+ create-react-app@1.5.2
added 114 packages in 6.634s
```

### Utilities

```
$ sudo apt-get install htop
```

### CompizConfig

For:

- changing UI

### Settings 

- keyboard speed
- mouse speed
- workspaces shortcuts

### Python 3, Python 3.6

```
$ sudo apt install virtualenv
$ virtualenv -p python3 venv
Already using interpreter /usr/bin/python3
Using base prefix '/usr'
New python executable in /home/brian/Documents/python/venv/bin/python3
Also creating executable in /home/brian/Documents/python/venv/bin/python
Installing setuptools, pkg_resources, pip, wheel...done.
$ source venv/bin/activate
(venv) $ python -V
Python 3.5.2
(venv) $ deactivate 
$ python -V
Python 2.7.12
$ source venv/bin/activate
(venv) $ 
```

Install `python3-pip`: 

```
$ sudo apt-get install python3-pip
```

If we run `pip freeze`, we will see `pkg-resources==0.0.0`. See this note about [what `pkg-resources==0.0.0`](https://stackoverflow.com/questions/39577984/what-is-pkg-resources-0-0-0-in-output-of-pip-freeze-command) is. 

### Python 3.6

We can install a newer version of Python (3.6) to use with Anaconda. Instructions are [in this Ask Ubuntu post](https://askubuntu.com/questions/865554/how-do-i-install-python-3-6-using-apt-get):

```
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt-get update
sudo apt-get install python3.6
```

After running these commands, we can now use Python3.6:

```
brian@brian-ThinkPad-T430:~/Documents/python/demo$ python3.6
Python 3.6.4 (default, Jan 28 2018, 17:52:01) 
[GCC 5.4.0 20160609] on linux
Type "help", "copyright", "credits" or "license" for more information.
>>> import sys; print(sys.version)
3.6.4 (default, Jan 28 2018, 17:52:01) 
[GCC 5.4.0 20160609]
>>> 
```

### Anaconda 

Now let's install the Anaconda distribution of Python. First, download the Linux Installer from [https://www.anaconda.com/download/#linux](https://www.anaconda.com/download/#linux).

Then, run: 

```
$ bash ~/Downloads/Anaconda3-5.1.0-Linux-x86_64.sh
```

### Postgresql

```
$ sudo apt-get install postgresql postgresql-contrib
```

Here's how to access Postgres:

```
brian@brian-ThinkPad-T430:~$ sudo -i -u postgres
postgres@brian-ThinkPad-T430:~$ psql
psql (9.5.12)
Type "help" for help.

postgres=# \q
postgres@brian-ThinkPad-T430:~$ exit
logout
```

or 

```
$ sudo -u postgres psql
```

More information on postgresql [in this DigitalOcean article](https://www.digitalocean.com/community/tutorials/how-to-install-and-use-postgresql-on-ubuntu-16-04).

### Brightness Controller

This is a must-have program that is similar to flux:

```
$ sudo add-apt-repository ppa:apandada1/brightness-controller
$ sudo apt-get update
$ sudo apt-get install brightness-controller
```

### OBS

```
$ sudo apt-add-repository ppa:obsproject/obs-studio
$ sudo apt-get update
$ sudo apt-get install ffmpeg obs-studio
```

### neofetch

```
$ sudo add-apt-repository ppa:dawidd0811/neofetch
$ sudo apt update
$ sudo apt install neofetch
```

### Disabling whoopsie

Here's an [Ask Ubuntu post about how to disable `whoopsie`](https://askubuntu.com/questions/135540/what-is-the-whoopsie-process-and-how-can-i-remove-it), an error reporting daemon that ships with Ubuntu. 