---
layout: post
title: Removing root partition bloat caused by docker
date: 2017-11-28
comments: true
image: /static/baobab.png
tags:
  - docker
  - linux
---

Recently I've been having storage issues in the root partitions of both my desktop and laptop computers. These issues came up soon after I started playing around with docker. In this article I'll talk briefly about how I fixed this problem, the resources and tools I picked up along the way, and anything else I have learned along the way.

I first learned how bad this issue was when I went to install anaconda on my desktop PC. I quiclky ran `df -h` and saw that my 20G root partition had less than 1G of available space. To look further into this I ran `baobab`. In the baobab home screen the root partition had slightly more space, but it was still close to being full. The expanded view was only showing me informatoin for around 8G of storage, leaving almost 11G of space not accounted for.

I started reaching for different tools and packages to slim down disk usage. `pacgraph` is a pretty neat way to visualize the relative size of packages. Here's an example:

![png](/static/pacgraph.png)

This helps you quickly find packages that you can do without. After removing some large packages like Libre Office I realized that this was barely moving the needle on my storage problem. Running `df -h` and `baobab` again with root priviledges gave me slightly different results. At this point I turned to docker and deleted all of the images with `docker rmi <IMAGE ID> -f. This didn't help either. Here are the images that I removed from my desktop:

```
[brian@a1arch ~]$ docker images
REPOSITORY                              TAG                 IMAGE ID            CREATED             SIZE
flaskmicroservicesusers_users-service   latest              1e59fa4d2af5        5 days ago          739MB
<none>                                  <none>              18f9191b4d9a        5 days ago          739MB
flaskmicroservicesusers_users-db        latest              f1de1c3ef3f2        5 days ago          287MB
<none>                                  <none>              11188ac6f36a        5 days ago          712MB
postgres                                latest              599272bf538f        12 days ago         287MB
tensorflow/tensorflow                   latest-gpu          2f243a16ff63        3 weeks ago         3.36GB
python                                  3.6.2               26acbad26a2c        2 months ago        690MB
```

Here's the storage profile before I started remove docker-related files:

```
 $ df -h | grep /dev/sda1
/dev/sda1        20G   18G  737M  97% /
```

After I removed the docker images, here is the same command:

```
 $ df -h | grep /dev/sda1
/dev/sda1        20G   18G  737M  97% /
```

I found a helpful serverfault question from 6 years ago that address the issue I was having titled [Disk full, du tells different. How to further investigate?](https://serverfault.com/questions/275206/disk-full-du-tells-different-how-to-further-investigate).

I saw a helpful comment related to docker:

> Thanks - this showed that docker was filling up my hard drive with diffs in `/var/lib/docker/aufs/diff/`

Could this be my issue?

Here's the folder in question on my laptop:

```
 $ cd /var/lib/docker
 $ sudo du -s -h .
2.6G	.
```

On my desktop this was taking up about 10G!

Wow! I didn't even see this when I ran `sudo baobab`:

![png](/static/baobab.png)

I stopped the docker service and deleted the overlay2 file:

```
 $ sudo systemctl stop docker
 $ cd /var/lib/docker
 $ sudo rm -rf layover2
```

With `sudo baobab` I was also able to delete 3.6G of trash with this command:

```
 $ sudo -i
 # rm -rf /root/.local/share/Trash
```

I think this may be related to having previously emptied the Trash in nautilus file browser with files that I might not have owned.

I think it would be a good idea to change the docker image installation directory. [Here is a link](https://forums.docker.com/t/how-do-i-change-the-docker-image-installation-directory/1169) from a docker forum talking about how to do that. [Here is another docker forum post](https://forums.docker.com/t/some-way-to-clean-up-identify-contents-of-var-lib-docker-overlay/30604) that talks about the overlay and storage issues that docker has.

Here is a helpful snippet from the [Arch Wiki Docker article](https://wiki.archlinux.org/index.php/Docker):

> Images location
> By default, docker images are located at /var/lib/docker. They can be moved to other partitions. First, stop the docker.service.
>
> If you have run the docker images, you need to make sure the images are unmounted totally. Once that is completed, you may move the images from /var/lib/docker to the target destination.
>
> Then add a Drop-in snippet for the docker.service, adding the --data-root parameter to the ExecStart:
>
> ```
> /etc/systemd/system/docker.service.d/docker-storage.conf
> [Service]
> ExecStart=
> ExecStart=/usr/bin/dockerd --data-root=/path/to/new/location/docker -H fd://
> ```

```

Update: I did this on my desktop with a `--data-rogettingot` path in my home folder.

I followed the directions form [this article](https://linuxconfig.org/how-to-move-docker-s-default-var-lib-docker-to-another-directory-on-ubuntu-debian-linux) and was able to set up docker on my home partition.
```
