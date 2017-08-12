---

layout: post
title: Arch Linux Installation Guide
date: 2017-08-03
comments: true

---

This post will be a comprehensive guide to installing Arch Linux. I will be installing Arch Linux on a refurbished [ThinkPad T430 Laptop](http://www3.lenovo.com/us/en/laptops/thinkpad/t-series/t430/), first as a guest OS on a Windows 10 Pro host, and then on a secondary SSD that will replace the optical drive. I will try to cover absolutely everything you need from creating a bootable USB drive to customizing the desktop interface and installing development environments and tools.

## Put Arch Linux on a USB drive

I recommend that you download a BitTorrent client such as [Deluge](http://dev.deluge-torrent.org/wiki/Download), and then grab the ISO magnet link from [https://www.archlinux.org/download/](https://www.archlinux.org/download/). It should take just a few minutes to complete the download via BitTorrent.

If you are using a Mac to build the bootable drive, I have read that you can use the `dd` command. This didn't work for me.

I found out that my 2011 MacBook Air is not capable of creating Windows 10 bootable media. Only the options for Windows 7 and 8 were available in Boot Camp Assistant (the Mac utility for installing Windows and creating bootable media). I also found that the latest MacBooks can't create bootable media. I was able to find another Mac that had the option for creating "Windows 7 or later", and this finally worked.

Another solution that is probably much faster is using Rufus, a Windows/Linux utility for burning ISO images to bootable media. The Arch Wiki has a highlighted note about using Rufus:

```
Note: Be sure to select DD mode or the image will be transferred incorrectly.
```

A problem I found is that you can't select the ISO with DD mode selected. I was able to select ISO (in ISO mode), choose the ISO file in my downloads folder, and then select DD mode.

# VirtualBox

The T430 came with a copy of Windows Pro, which I installed right away. I also picked up a SSD sleeve that can replace the optical drive for dual booting or additional storage. I have installed Arch Linux on my Windows desktop machine, as well as my MacBook Air. Land of Linux has a [great tutorial on installing Arch Linux in Virtual Box](http://landoflinux.com/linux_install_archlinux_process.html), but it is frustrating because there is no date and no comments. This part of the guide will closely follow this guide and provide some corrections where you might get stuck following the directions command for command.

First we want to set up a new virtual machine with the options Linx / ArchLinux / 64-bit. You are probably using a 64-bit machine (although some old netbooks are 32-bit). The first obstacle is you will probably face with VirtualBox is that there are no options for 64-bit. This is because Intel Virtualization is often disabled by default. You will need to go into the BIOS (by pressing `delete` of `F10`/`F12` at boot time) and then change this option, save the BIOS settings and restart. With this done, you will want to create a virtual machine with at at least 20GB of storage and around 4GB of memory.

#### Quick note about fonts

The default font when installing Arch Linux is quite small, so you may want to increase the font size.

```
ls /usr/share/kbd/consolefonts/
```

This command will list the available fonts. To set a font, run the following command:

```
setfont sun12x22
```

To revert back to the default font, just run:

```
setfont
```

You can also view the current font with

```
showconsolefont
```

### Using `fdisk` for partitioning

> fdisk is a dialogue-driven program for creation and manipulation of partition tables.

This part of the guide will be similar for installation on virtual machines and regular installions (on harddrives in desktops and laptops). If you are installing on a physical machine that has other disks of similar size to your target disk, I recommend that you first remove all other drives so you don't accidentaly format partitions (I did this by accident, but luckily it was just my Windows Boot Partition and I was able to recover my Windows installation).

We want to run fdisk and enter the device we want to work with as the first argument after the command:

```
fdisk /dev/sda
```

On your Virtual Machine it will most likely be **sda**, but on a physical machine it could vary slightly.

#### Note about fdisk

When installing Arch Linux on a disk that has Windows or Linux installed (and you want delete the existing Windows or Linux completely to make room for a fresh Arch Linux istallation), you can delete the partitions on the drive (which is usually labeled `/dev/sda` or `/dev/sdb` or `/dev/sdc`). Run `lsblk` to determine which drive you want to format, then run `fdisk /dev/sdX` where `X` corresponds to the drive we will be using. You should be inside the fdisk menu. Press `d` to start deleting partitions. You may get some warnings about a partition containing some type of trace (such as ext4). This is fine. You can delete all of the partitions.

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

Next we want to install our first package: `reflector`.

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

The base installation is installed using a special script called `pacstrap`.

We will be using the `base` group and also the `base-devel` group that we will need later.

Issue the following command:

```
pacstrap /mnt base base-devel
```

This will install lots of packages; it takes a few minutes. It took me `4:27.06` on my MacBook Air and about 2.5 minutes on my ThinkPad.

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

We could pass in additional arguments to specify a particular shell, but here we are using `bash`.

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

The following command won't work, we will do this in a later step, so skip the following command for now.

```
ln -s /usr/share/zoneinfo/US/Eastern /etc/localtime
```

This worked on my MacBook Air in VirtualBox, but in doing this on my Windows host in VirtualBox trying to link to the file `/etc/localtime` gave an error that the file already existed. Skipping this step on my ThinkPad was OK. Looking in the file, it seemed that UTC was already configured.


### Set the Hardware Clock

```
hwclock --systohc --utc
```

### Set the Host Name for the System

I'm using the hostname arch20815, you can pick whatever host name you want.

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
# %wheel ALL=(ALL) ALL
```

To do this, press the down arrow until we are on the line we need to uncomment, then press `i`, then remove the `#` and space. Next, press `esc` and then press `:` and then `x` and then press `ENTER`. That should save our changes. Arch Linux warns that this file ONLY be edited with `vim`.

### Installing a bootloader

At this point the directions will fork based on your motherboard firmware. By default grub-install uses target x86_64-efi. If you don't have a UEFI system you should use the following command:

```
pacman -S grub
grub-install --target=i386-pc --recheck /dev/sdb
```

If this works properly you should see the following:

```
Installing for i386-pc platform.
Installation finished. No error reported.
```

> --target=i386-pc instructs grub-install to install for BIOS systems only. It is recommended to always use this option to remove ambiguity in grub-install.

Here is [more information about GRUB]( https://wiki.archlinux.org/index.php/GRUB) from the Arch Wiki.

Finally run the following command:

```
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

Login with the `sudo` user we created.

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

The next step in the tutorial is to run:

```
sudo pacman -S xorg-server xorg-xinit xorg-utils xorg-server-utils mesa xorg-twm xterm xorg-xclock
```

But this will result in:

```
error: target not found: xorg-utils
error: target not found: xorg-server-utils
```

It seems that these packages have been deprecated. I think a solution to this is to run:

```
sudo pacman -S xorg-apps
```

and then install the remaining packages:

```
sudo pacman -S xorg-server xorg-xinit mesa xorg-twm xterm xorg-xclock
```

Select option `1` (don't select the options that include the word nvidia).

Next we need to install `linux-headers`:

```
sudo pacman -S linux-headers
```

Next we need to install some VirtualBox packages:

```
sudo pacman -S virtualbox-guest-utils virtualbox-guest-dkms
```

The tutorial didn't mention the `linux-headers` package, but the error message that comes up if you skip this step say that this package is needed.

`xorg-server-utils` seems to have been removed, but it was a meta-package that simply included the following:
```
xorg-iceauth xorg-sessreg xorg-xcmsdb xorg-xbacklight xorg-xgamma xorg-xhost xorg-xinput xorg-xmodmap xorg-xrandr xorg-xrdb xorg-xrefresh xorg-xset xorg-xsetroot
```
Installing these packages individually did not help.

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

### Installing codecs for audio and video

```
sudo pacman -S a52dec faac faad2 flac jasper lame libdca libdv libmad libmpeg2 libtheora libvorbis libxv wavpack x264 xvidcore
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

The last issue I had was getting GNOME Desktop to display in full-screen in VirtualBox. To do this, click on the Devices Tab and then Insert Guest Additions Image.

```
reboot
```

Login with the user account that you created. At this point, trying to open Terminal will probably not work. This is because of an issue mentioned earlier about a locale file. Let's look at `/etc/locale.conf`:

```
cat /etc/locale.conf
```

We just need to make sure that the language we want is uncommented in `/etc/locale.gen`. We did this previously. Now we need to run the following command:

```
sudo locale-gen
```

This should allow us to access the terminal.

### Enable Wi-Fi

To enable Wi-Fi, first check `lspci -k` if you have an onboard wifi card or `lsusb -v` if you have a USB wifi adapter.

Next run `ip link` and see if there is an entry that starts with `w`. This is wireless interface. If you don't have WiFi working it probably says `state DOWN` in the description.

We need to run the following command to bring it up:

```
sudo ip link set <the code that starts with w> up
```

If we go to "Settings" we will see an error that says "NetworkManager needs to be running."

To get NetworkManager running, issue the following commands:

```
sudo systemctl enable NetworkManager.service
sudo systemctl start NetworkManager.service
```

This will prompt you for authentication, then you can go back to `Settings > Network` and you should be able to find any available Wi-Fi networks.

### Customizing GNOME Desktop

Next let's work on customizing our GUI.

We will now start making use of the `yaourt` utility to build packages for programs we want to install.

Yaourt gives us a useful flag to search packages:

```
yaourt -Ss search_term1 search_term2
```

This returns a list of packages which match search terms either in their title or description. When you find the right package you can copy the exact name and then download it with:

```
yaourt -S package_name
```

Let's start with nice custom theme, numix.

Run the following:

```
yaourt -Ss numix
```

We will see many packages, and there are three that we should install:

- `numix-gtk-theme`
- `numix-circle-theme-git`
- `numix-cursor-theme-git`


The installations process for `numix-gtk-theme` is quite long. You need to confirm `Yes` and it will also ask you the following:

```
Edit PKGBUILD with:
```

Here you can type `nano` and press `ENTER`. It will then show you a file in `nano` or the editor you select. You can press `Ctrl-X` and the installation script will continue running.

You will also see the following message before being prompted to select an editor:

```
Please add $VISUAL to your environment variables.
```

Let's do that now so we are not prompted to do it later:

```
sudo nano ~/.bashrc
```

Add the following line to the end of the file:

```
export VISUAL="nano"
```

You could also set `VISUAL="vim"` or some other editor.

Now that we have installed the themes, let's activate them. Press `ALT F2` and type `gnome-tweak-tool`. Under the appearance tab you can select the newly installed GTK+ theme, icons and cursor.

### GNOME Shell Extensions

You can do a lot of neat customization with extensions. You will see an `Extensions` tab in the Tweak Tool. Click on "Get more extensions". This will take you to the [GNOME Shell Extensions](https://extensions.gnome.org) site. Before you start using extensions, you need to add a Firefox extensions and install a package. Click the link in the blue bar at the top of the page and install the plugin.

Next you need to install the following package:

```
yaourt -S chrome-gnome-shell-git
```

Now refresh the GNOME Shell Extensions page and the blue message should go away. Here are the extensions I use:

- Applications menu
- Removable Drive menu
- Dash to Dock
- Dynamic Top Bar
- User Themes
- Screen Saver and hibernate buttons (`gnome-screensaver` and a GNOME Shell Extension called [add name])

Dash to Dock lets you place the dock wherever you want, you can also change its appearance and behavior.

### Screenfetch

I like to use Screenfetch, a package that prints out ASCII art for your distro and some customizable system information.

```
yaourt -S screenfetch
```

Now edit `~/.bashrc` by adding the following line at the bottom of the file:

```
screenfetch
```

Screefetch can be further customized, check out `man screenfetch` for more options. For example, you can exlude certain lines about system information or add custom lines like the model of your PC, etc.


#### Quick Note on Terminal Colors

I don't like the default white background of the terminal, so you can change this by editing the default profile. Unselect "Use colors from system theme" and select "Solarized Dark" (my preferred color scheme).


#### Quick Note on yaourt

You can add a `--no-confirm` flag to yaourt that will prevent it from asking you if you want to proceed with each step of the installation process.

### Window options

By default, GNOME only shows the `X` in the top right corner of windows. You can add the maximize and minimize buttons in the `Windows` tab of the GNOME Tweak Tool.

### Icons on Desktop

Another default setting that may be strange for you is "Icons on Desktop" which is set to `OFF` by default. The is found under the Desktop tab in the GNOME Tweak Tool.

### My other setup notes

I install Chromium and set it to my default browser. My must have extension for Chrome (and any other browser) is Last Pass for account and password management.

## Default Applications

You can set default applications by opening `Settings > Details > Default Applications`. I use Image Viewer for photos instead of GIMP and VLC for Video.


`pacman` offers similar functionality, and so does `pacaur`. There are several options for how to download software with Arch Linux.

### Other packages

Here's a list of other helpful packages:

- htop (system monitoring)

- blender (video editing and 3d modeling)

- OBS (screen recording and streaming software)

OBS took a little bit of configuring to get right. Out of the box, doing a screen capture showed just a black screen. I think the solution is to install `obs-studio-git` and then reboot your computer.

- Dropbox

```
yaourt -S dropbox
```

Run the following command:

```
dropbox
```

And then follow the dialogue to sign into your Dropbox account. You will see a Dropbox folder in the File Manager.

- Google Drive

You can get access to Google Drive by going into:

```
Settings > Online Accounts > Google
```

If you have `Files` set to `ON`, you will find your Google Drive Folder in the side bar of the File Viewer. Clicking on the icon mounts your Google Drive and gives you access to the files.

- hexchat (IRC client)

Internet Relay Chat (IRC) is an easy way to start talking to people in real-time about any topic you can think of. Hexchat is a popular GUI client for IRC. Here is how to install hexchat:

```
sudo pacman -S hexchat
```

Once you have installed hexchat, you will want to register a nickname. [This article](https://freenode.net/kb/answer/registration) says that the steps for registering a nickname are to:

Send the following message to `freenode` (replace `some_password` with a secure password of your choice and `youremail@example.com` with your email address):

```
/msg NickServ REGISTER some_password youremail@example.com
```

After you send this message, check your email and you will see instructions to confirm your email that look like this:

```
/msg NickServ VERIFY REGISTER <your_name> <some_code_they_give_you>
```

This should confirm your nickname. Now you can start chatting on channels. Press `Alt + S`, and then `J`, and then type the name of the channel you want to join.

## Setting Up Development Tools

### Atom and other text editors

My preferred text editor is Atom:

```
sudo pacman -S atom
```

Spell checker didn't seem to be working for me, and this seems to be a [known issue](https://github.com/atom/spell-check/issues/129), so I recommend you install the `atom/spell-checker` package if you like to use atom and want spell checking.

The Arch Linux installation also came with an interesting editor called `Builder` which seems pretty interesting as well.

### VirtualBox

*Skip this step if you are installing Arch Linux as guest OS in a VirtualBox (you can't run a virtual machine in a virtual machine).*

```
sudo pacman -S virtualbox
```

You will see a message that says:

```
:: There are 2 providers available for VIRTUALBOX-HOST-MODULES
:: Repository community
   1) virtualbox-host-dkms 2) virtualbox-host-modules-arch
```

**Select option 2, continue the installation process and then reboot.**

### Quick note on deluge

You will probably want to use a BitTorrent client to download ISO images for virtual machines you want to run. Deluge works well for this, and we already downloaded it during setup. We can add one more package for a theme that Deluge uses:

```
yaourt -S gtk-engine-murrine
```

Now grab a torrent link or file for an OS you want to download and add it to Deluge.

When it is finished we can launch VirtualBox and create a virtual machine with our ISO.

### Languages and Input Sources

Here is how to add support for Chinese characters and also Chinese pinyin input:

```
yaourt -S adobe-source-han-sans-cn-fonts
```

This will make Chinese characters visible. In order to type Chinese using the pinyin input method, run the following commands:

```
sudo pacman -S ibus
sudo pacman -S ibus-libpinyin
```

Next you can go into:
```
Settings > Region & Language > Input Source > + > Other
```
Select Chinese (Intelligent Pin Yin) from the list and you should see a language menu in the top bar. At this point I was able to see both English and Chinese in Language menu in the top bar, but the Chinese pinyin only worked after rebooting.

### Spotify

Get some tunes going with the Spotfy app. It is not officially supported, but it seems to work alright. Facebook login did not work for me. You can create a new account with your existing email like this:

```
youremail+spotify@email.com
```

Using my main email to sign up for a new account didn't work because that email was linked to the Facebook login.

```
yaourt -S spotify
```

### Word Processing (Libre Office)

Libre Office is an open-source Office Suite similar in functionality to Microsoft Word.

```
sudo pacman -S libreoffice-fresh
```

You can also install any language packs you may need for Libre Office:

```
yaourt -S libreoffice-fresh-zh-CN
```

### Sign up for the Arch Wiki

The best way to ask for help is to ask the community. You should sign up for the Arch Wiki and post any questions you have after doing research and trying a few different solutions. The more detailed you are in your post, the better help you will get.

### npm and node.js

Here's [a helpful article](https://docs.npmjs.com/getting-started/fixing-npm-permissions) that is important to following when setting up npm and node.js. Be very careful here as some of the steps can completely mess up permissions on your entire system.

Here's a walkthrough of the steps to get `npm` setup correctly.

```
sudo pacman -S npm
```

Next run:

```
npm config get prefix
```

The output of this command is probably:

```
/usr
```

If this is the case, we MUST follow the following steps (option 2 from [this article](https://docs.npmjs.com/getting-started/fixing-npm-permissions):

```
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
```

If you don't already have a `~/.profile` file, make one, and then add the following line:

```
export PATH=~/.npm-global/bin:$PATH
```

Then run:

```
source ~/.profile
```

This will "refresh" `~/.profile` so that using the `npm` command will work without needing sudo.

Next we can test that `npm` works by trying to install a package:

```
npm install -g jshint
```

This should install the package with no errors.

## Ruby and Jekyll

I use Jekyll for my personal site and blog, which is a static site generator written in Ruby. To start using Jekyll we need to install a ruby gem, and to install the gem we will need to first install ruby. Here is the [ruby page from the Arch Wiki](https://wiki.archlinux.org/index.php/ruby).

```
sudo pacman -S ruby
```

Next we can install the Jekyll gem:

```
gem install jekyll bundler
```

It should say something like "20 gems installed" if everything was successful. You can read more about Jekyll [here](https://jekyllrb.com/).

For now I will not be installing RVM (Ruby Version Manager), but the Arch Wiki has good notes on how this can be installed.

Before we use the Jekyll gem, we need to add the following to our `~/.bashrc` file:

```
PATH="$(ruby -e 'print Gem.user_dir')/bin:$PATH"
```

This will allow you to run Jekyll commands.

## Python

In the installation pIssuesrocess, the latest versions of Python has been installed (3.6.2 at the time of writing this tutorial). We need to get `pip`:

```
yaourt -S python-pip
```

Here's [an article from the Python documentation](https://docs.python.org/3/library/venv.html) that covers creating virtual environments.

Here is [another article](https://packaging.python.org/tutorials/installing-packages/) about creating virtual environments in python.

>Currently, there are two viable tools for creating Python virtual environments:
venv is available by default in Python 3.3 and later, and installs pip and setuptools into created virtual environments in Python 3.4 and later.
virtualenv needs to be installed separately, but supports Python 2.6+ and Python 3.3+, and pip, setuptools and wheel are always installed into created virtual environments by default (regardless of Python version).
The basic usage is like so:
Using virtualenv:

```
virtualenv <DIR>
source <DIR>/bin/activate
```

>Using venv:

```
python3 -m venv <DIR>
source <DIR>/bin/activate
```
For more information, see the virtualenv docs or the venv docs.

### Miscelaneous Issues

I have experienced unexpected behavior with some programs. Here's a list of some major issues and workarounds I have found:

- **Google Hangouts**: I use Google Hangouts a lot for screen sharing and video conferencing. Trying to share my screen only showed a black screen with a cursor, although sharing invidual windows seemed to work fine (similar to what was happening with OBS). I found a [Superuser thread](https://superuser.com/questions/1166765/google-hangouts-screen-share-black-screen-error) describing the same issue. The solution is simply to select an Xorg session on login (instead of GNOME Classic or regular GNOME session). This is something I still don't know much about, but the solution worked for me and I have been able to share my entire screen in Google Hangouts.

You can check which session type you are using with the following command:

```
echo $XDG_SESSION_TYPE
```

and you should either see `x11` or `wayland`.

### Keyboard shortcuts

You can configure keyboard shortcuts by going into:

```
Settings > Keyboard
```

Search for or find the setting that says "Hide all normal windows". I set mine to `Shift + Alt + D`. You can configure other keyboard shortcuts here.

## Conclusion and Next Steps

Installing Arch Linux is like trying to build a house with just a spoon. You won't get very far with a spoon, but you have the benefit of being able to order unlimited copies of free parts and materials online (the AUR, or Arch User Repository), and a great community of people that are extremely knowledgable about "building houses". Pretty soon you are able to quickly put together a foundation, scaffolding, wiring, appliances and yes even wallpaper. Arch Linux stays with its rolling release cycle, so you don't have to rebuild your house every 9 months to stay current.

Arch Linux is a lot of work to set up compared to popular Linux distributions like Ubuntu. Just like everyone says, you learn a lot by going through the process, breaking things and starting the installations process from scratch. I totally messed up my permissions while installing and quickly found that the only solutions was to reinstall Arch. This guide is primarily for personal use, and I am sure there are things that can be improved and even done completely differently. Here's a list of things I can start with:

- **Fix OBS Studio**: ~~I got this to work in my earlier install and can't seem to remember how I fixed it. Currently OBS displays a black screen when set to `Screen Capture`~~. I finally got OBS studio to work and I think the issue was as simple as rebooting (or possibly an update with `sudo pacman -Syu`).

- **Encrypting the home folder**: this is good practice and will make my computer more secure, it shouldnt be too difficult either.

- **Adding a boot partition and fixing GRUB**: the guides I worked off of didn't include this, and I think it would be very important to figure out how this works if I want to include Windows 10 for doing Windows-specific tasks on my laptop as well without having to go into the bios each time I want to switch OSs.

- **Using HDDs**: On my desktop I would like to be able to figure out how to mount my HDD that I use for mass file storage on my Windows machine. For simplicity I have kept everything on one SSD, but it would be good to figure out how to easily add additional disks at boot time.

- **NVIDIA drivers**: this does not apply to my laptop, but I would like to figure out how I can get the best drivers in Arch Linux for my NVIDIA GPU on my desktop machine. This is one thing that running Linux in a Virtual Machine really doesn't allow you to do (pass a GPU through a VM), as far as I know.

- **All other drivers**: I still have lots of questions about how to make sure that I am running things properly on my desktop PC. I feel like drivers for the laptop install were pretty automatic, but this may not be the case with additional hardware components on my desktop, such a closed-loop water cooler.

- **Additional Customization, Themes, Window Managers, etc.**: There is so much that can be done with Arch Linux in terms of GUI. I love the setup I have but it would be interesting to explore some additional options like i3, for example.

- **Cusomt kernels**: I am also interested in learning how I could swap out kernels. I have seen people add LTS kernels to Arch Linux for various reasons, and I'm interested to learn how this works.

- **Maximzing battery life**: During the install process I saw the topic discussed but didn't look into it. It would be nice to see if I could make changes to get more out of the battery in my refurbished ThinkPad.

- **Other areas for improvement**: [add here]
