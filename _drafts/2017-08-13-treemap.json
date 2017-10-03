---

layout: post
title: Linux Notes
date: 2017-08-13
comments: true

---

This post is a collection of questions and notes about Linux.

## Questions about GRUB, Boot Partitions and Booting Multiple OS (on different drives)

So far I have been able to install Arch Linux on my Lenovo T430.

Here is some information about my partitions:

```
[brian@archthinkpad ~]$ lsblk
NAME   MAJ:MIN RM   SIZE RO TYPE MOUNTPOINT
sda      8:0    0 232.9G  0 disk
├─sda1   8:1    0    20G  0 part /
├─sda2   8:2    0     8G  0 part [SWAP]
└─sda3   8:3    0 204.9G  0 part /home
```

Here is the result of running `fdisk /dev/sda` and then pressing `p` (to show partitions):

```
Command (m for help): p
Disk /dev/sda: 232.9 GiB, 250059350016 bytes, 488397168 sectors
Units: sectors of 1 * 512 = 512 bytes
Sector size (logical/physical): 512 bytes / 512 bytes
I/O size (minimum/optimal): 512 bytes / 512 bytes
Disklabel type: dos
Disk identifier: 0x8e46657a

Device     Boot    Start       End   Sectors   Size Id Type
/dev/sda1           2048  41945087  41943040    20G 83 Linux
/dev/sda2       41945088  58722303  16777216     8G 82 Linux swap / Solaris
/dev/sda3       58722304 488397167 429674864 204.9G 83 Linux
```

I don't have a boot partition, but I think I need one for what I want to do.

I would like to install Windows 10 on a second SSD that replaces the optical drive (I don't think I will be using CDs/DVDs anymore).

One option that might work: add
