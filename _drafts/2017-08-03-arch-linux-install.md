---

layout: post
title: Arch Linux Installation Guide
date: 2017-08-03
comments: true

---

This post will be a comprehensive guide to installing Arch Linux. I will be installing Arch Linux on a refurbished [ThinkPad T430 Laptop](http://www3.lenovo.com/us/en/laptops/thinkpad/t-series/t430/), and as a guest OS on a MacBook Air host computer. I will try to cover absolutely everything you need from creating a bootable USB drive to customizing the desktop interface.

## Put arch on a USB drive

I recommend that you download a BitTorrent client such as [Deluge](http://dev.deluge-torrent.org/wiki/Download), and then grab the ISO magnet link from [https://www.archlinux.org/download/](https://www.archlinux.org/download/). It should take just a few minutes to complete the download via BitTorrent.

If you are using a Mac to build the bootable drive, you can use the `dd` command.

Now we need to burn the ISO onto a USB drive (the drive should be at least 4GB, 8GB to be safe). I am using a Mac for this step. Enter the following `dd` command in the terminal:

```
>>sudo dd if=~/Downloads/archlinux-2017.08.01-x86_64.iso of=/dev/rdisk2s2 bs=1m
516+0 records in
516+0 records out
541065216 bytes transferred in 81.311780 secs (6654205 bytes/sec)
>>
```

If you haven't used `dd` before, here is an excerpt from the manual:

```
>>man dd
[...]
The dd utility copies the standard input to the standard output.
[...]
```

This didn't work for me. I referred to the Installation manual for Arch and found instructions for using Rufus. It has a highlighted note:

```
Note: Be sure to select DD mode or the image will be transferred incorrectly.
```

A problem I found is that you can't select the ISO with DD mode selected. I was able to select ISO (in ISO mode), choose the ISO file in my downloads folder, and then select DD mode.

# VirtualBox

Commands for installation

### Using `fdisk` for partitioning

```
fdisk is a dialogue-driven program for creation and manipulation of partition tables.
```

We want to run fdisk and enter the device we want to work with as the first argument after the command:

```
fdisk /dev/sda
```

### Create a root partition

Press `n` and then `p`. When prompted for `first sector` press `ENTER`, and for `last sector` enter `+10G` for a 10GB partition.

### Create a SWAP partition

Press `n` for a new partition, press `p` for primary partition. Select partition number `2`. Press `ENTER` to select the default start sector, and then type `+1G` to create a 1GB swap partition. Press `t` to indicate the type of partition this will be. Specify that we are still working with partition `2`, and then enter `82`, the code for SWAP partition.

### Create home partition

Enter the following `fdisk` commands:

`n`, `p`, `3`, `ENTER`, `ENTER`, `t`, `3`, `83`.

Before exiting the `fdisk` interface, enter the `w` command to write the proposed changes.

We should see the following:

```
The partition table has been altered.
Calling ioctl() to re-read partition table.
Syncing disks.
```

### Create Filesystems and Format Partitions

Make filesystems for partitions 1 and 3:

```
mkfs.ext4 /dev/sda1
mkfs.ext4 /dev/sda3
```

```
mkswap /dev/sda2
swapon /dev/sda2
```

### Verify our layout with `lsblk`

```
lsblk
```

### Mount Filesystems

```
mount /dev/sda1 /mnt
```

```
mkdir /mnt/home
```

```
mount /dev/sda3 /mnt/home
```

(The swap partition has already been initialized.)

### Backup mirrorlist

```
cp -vf /etc/pacman.d/mirrorlist /etc/pacman.d/mirrorlist.backup
```

We can edit the mirrorlist to select the closest mirror, but this is not necessary.

### Install reflector

This synchronizes package databases:

```
pacman -Syy
```

```
pacman -S reflector
```

The following command will sort the five best mirrors based on your location:

```
reflector --verbose -l 5 --sort rate --save /etc/pacman.d/mirrorlist
```

Re-issue the sync command:

```
pacman -Syy
```

### Installing the base

The base installation is installed using a special script called "pacstrap".

We will be using the `base` group and also the `base-devel` group that we will need later.

Issue the following command:


```
pacstrap /mnt base base-devel
```

This will install lots of packages; it takes a few minutes. It took me `4:27.06`.


### Create /etc/fstab

The next step is to create a mount table that will be responsible for automatically mounting filesystems at boot time.

Issue the following command:

```
genfstab -U -p /mnt >> /mnt/etc/fstab
```

We can verify the entries with `cat /mnt/etc/fstab`, or `blkid /dev/sd#` where `#` is the partition number.

### Chroot - Configuring the base system

To configure our new installation, we need to issue the `arch-chroot` command. This command is used as follows: `arch-chroot` followed by the new root directory as the first argument.

```
root@archiso ~ # arch-chroot /mnt /bin/bash
[root@archiso /]#
```

We can pass in additional arguments to specify a particular shell.

### Configuring locale settings

```
nano /etc/locale.gen
```

Uncomment `en_US.UTF-8 UTF-8` for US English.

Once the desired locales have been uncommented, run `local-gen`.

Next we will create `/etc/locale.conf`:

```
echo LANG=en_US.UTF-8 > /etc/locale.conf
export LANG=en_US.UTF-8
```

Create the following file: `/etc/vconsole.conf` and add the following line:

```
KEYMAP=us
```

To configure the time zone, we need to create a link to a file called `/etc/localtime`.

```
ln -s /usr/share/zoneinfo/US/Eastern /etc/localtime
```

### Set the Hardware Clock

```
hwclock --systohc --utc
```

### Set the Host Name for the System

```
echo arch20815 > /etc/hostname
```

### Enable Multilib Repository

Add the following to `/etc/pacman.conf`:

```
[multilib]
Include = /etc/pacman.d/mirrorlist
```

And then run

```
pacman -Syy
```

### Add support for Yaourt Package Tool

Add the following to the end of `/etc/pacman.conf`:

```
[archlinuxfr]
SigLevel = Never
Server = http://repo.archlinux.fr/$arch
```

Then run `pacman -Syy`.

### Synchronize and Update Database Packages

Run the "update system" command:

```
pacman -Syu
```

### Create a password for the root account

```
passwd
```
and enter a password for the root user.

### Add a new user with sudo privileges

To add a new user we issue `useradd` along with primary and secondary groups. `wheel` group members will be able to issue commands prefixed with `sudo`.

```
useradd -mg users -G wheel,storage,power -s /bin/bash brian
```

Then set a password for this user:

```
passwd brian
```

### Install sudo Package

```
pacman -S sudo
```

### Configuring a sudo - adding user to wheel group

We now need to configure the sudo configuration file. In order to edit this file we must use a special command called `visudo`.

This is an editor like `vi` or `vim` and it edits the sudo config file.

When we run `visudo`, we might see the follwoing error:

```
visudo: specified editor (vim) doesn't exist.
```

Let's install vim:

```
pacman -S vim
```

Now we should be able to run `visudo`.

We need to uncomment the following line:

```
%wheel ALL=(ALL) ALL
```

To do this, press the down arrow until we are on the line we need to uncomment, then press `i`, then remove the `#` and space. Next, press `esc` and then press `:` and then `x` and then press `ENTER`. That should save our changes.

We need to save changes once this line has been uncommented.

### Installing a bootloader

We need to install a bootloader on the first system hard disk (/dev/sda):

```
pacman -S grub
grub-install /dev/sda
grub-mkconfig -o /boot/grub/grub.cfg
```

[Note: If you had a multi OS environment, you could install the "os-prober" package with "pacman -S os-prober" before running the "grub-mkconfig" command. Os-prober will detect other operating systems when generating the grub.cfg file.]

### Arch Linux is now installed

Issue the following commands to exit:

```
exit
umount /mnt/home
umount /mnt
reboot
```

### Boot from existing OS

At the startup screen, select "Boot existing OS".

I got a strange error message at login:

```
arch20815 login: [9.921142] piix4_smbus 0000:00:07.0: SMBus base address uninitialized - upgrade BIOS or use force_addr=0xaddr
```

Press `ENTER` to return to the login prompt.

Login with `sudo` user we created.

We can check to see if this user was setup properly by running:

```
[brian@arch20815 ~]$ sudo whoami

We trust you have received the usual lecture from the local System Administrator. It usually boils down to these three things:

    #1) Respect the privacy of others.
    #2) Think before you type.
    #3) With great power comes great responsibility.

[sudo] password for brian:
root
[brian@arch20815 ~]$
```

### Configuring the Network

After the reboot we will have lost network connectivity. We need to create a new definition to our interface. We can isssue the command `ip link`.

Run `sudo vi /etc/systemd/network/enp0s3.netork` and add the following to this file:

```
[Match]
Name=en*

[Network]
DHCP=yes
```

Then we need to run the following commands:

```
sudo systemctl restart systemd-networkd
sudo systemctl enable systemd-networkd
```

Next issue the following command:

```
sudo vi /etc/resolv.conf
```

And add the following to this file:

```
nameserver 8.8.8.8
nameserver 8.8.4.4
```

Next we can check connectivity:

```
ip a s
ping -c 3 www.google.com
```

We should see that we have been assigned an IP address and that we can ping google.com.

### Run a full System update

```
sudo pacman -Syu
```

### Installing the X Environment

I have had problems with this step in the past.

The next step is to run:

```
sudo pacman -S xorg-server xorg-xinit xorg-utils xorg-server-utils mesa xorg-twm xterm xorg-xclock
```

This will result in:

```
error: target not found: xorg-utils
error: target not found: xorg-server-utils
```

I think a solution to this is to run:

```
pacman -S xorg-apps
```

Select option `1`.

I also installed the following:

```
sudo pacman -S xorg-server xorg-xinit mesa xorg-twm xterm xorg-xclock
```

Next we need to install some VirtualBox packages:

```
sudo pacman -S virtualbox-guest-utils virtualbox-guest-dkms
```

xorg-server-utils seems to have been removed, but it was a meta-package that simply included the following:
```
xorg-iceauth xorg-sessreg xorg-xcmsdb xorg-xbacklight xorg-xgamma xorg-xhost xorg-xinput xorg-xmodmap xorg-xrandr xorg-xrdb xorg-xrefresh xorg-xset xorg-xsetroot
```

Installing these packages individually did not help.


Here's what worked:

```
pacman -S xorg virtualbox-guest-utils
```

This does a full install of xorg (reinstalling many packages I just installed). After running this command, running `startx` gives no errors and lets me enter the X environment.

### Installing GNOME Desktop

Next, let's install `GNOME` desktop. Issue the following command:

```
sudo pacman -S gnome gnome-extra gdm
```

Accept all of the defaults and then confirm by pressing `Y`.

### Installing Networking Tools

```
sudo pacman -S net-tools
```

### Installing popular packages

```
sudo pacman -S pulseaudio pulseaudio-alsa pavucontrol gnome-terminal firefox flashplugin vlc deluge smplayer audacious qmmp gimp xfburn gedit gnome-system-monitor
```

Additionally:

```
sudo pacman -S LibreOffice
sudo pacman -S thunderbird
```

### Installing codecs for audio and video

```
sudo pacman -S a52dec faac faad2 flac jasper lame libdca libdv libmad libmpeg2 libtheora libvorbis libxv wavpack x264 xvidcore gstreamer0.10-plugins
```

### Install Yaourt

```
sudo pacman -S yaourt
```

**NEVER run yaourt with sudo or as root**

Finally, enable GNOME to start automatically at boot:

```
sudo systemctl enable gdm
```

The last issue I had was getting GNOME Desktop to display in full-screen. To do this, click on the Devices Tab and then Insert Guest Additions Image.

The following command may also be helpful:

```
pacman -S linux-headers

```

Next it is recommended that you remove the installation from your VirtualBox storage. From the VirtualBox Manager, highlight your Arch Linux system and click on storage. Now highlight the installation media icon (CD/DVD) and click on the attributes box. Now select "remove disk from virtual drive". Next step is to "reboot" the system. To reboot, issue the following command:

```
reboot
```

### Customizing GNOME Desktop

Next let's work on customizing our GUI.







`fstab`

The file `fstab` contains descriptive information about the filesystems the system can mount. `fstab` is only read by programs, and not written; it is the duty of the system admin to properly create and maintain this file.

`lsblk` lists information about all available or the specified block devices.

```
fdisk is a dialogue-driven program for creation and manipulation of partition tables.
```
