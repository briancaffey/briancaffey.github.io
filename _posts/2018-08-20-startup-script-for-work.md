---

layout: post
title: Scripting my daily development environment setup
date: 2018-08-20
comments: true

---

This article shows how I automated the setup of my daily development environment for work with a bash script. Here's the script:

```bash
#!/bin/sh
PROJDIR=/home/bcaffey/git/project-directory/src
NOTESDIR=/home/bcaffey/Documents/notes

gnome-terminal \
    --tab --working-directory=$PROJDIR -e "bash -c 'echo -ne \"\033]0;Django - Server\007\"; . ./setup-virtualenv.bash && ./runserver'" \
    --tab --working-directory=$PROJDIR -e "bash -c 'echo -ne \"\033]0;Celery - Queue 1\007\"; . ./setup-virtualenv.bash && ./runcelery_1'" \
    --tab --working-directory=$PROJDIR -e "bash -c 'echo -ne \"\033]0;Celery - Queue 2\007\"; . ./setup.-virtualenvbash && ./runcelery_2'" \
    --tab --working-directory=$PROJDIR -e "bash -c 'echo -ne \"\033]0;Flower\007\"; . ./setup-virtualenv.bash && ./runflower'" \
    --tab --working-directory=$PROJDIR -e "bash -c 'echo -ne \"\033]0;Django - Shell\007\"; . ./setup-virtualenv.bash && ./manage shell'" \

cd $PROJDIR && code .
cd $NOTESDIR && code .

google-chrome http://subdomain.domain.com:8222/admin/
```

This script opens a `gnome-terminal` window with 5 tabs, one for a Django app, another for a Django shell, 2 for celery workers and one to run flower. Additionally, we specify a name for the tabs with `\033]0;Django - Shell\007\"`. I then launch VS Code and open up my Django app and I'm all ready to go. This might only take minute or two to do manually each morning, but the script can be launched at startup so that my development environment is set as soon as I turn on my computer. An easy way to do this on Ubuntu is to use `Startup Applications`.