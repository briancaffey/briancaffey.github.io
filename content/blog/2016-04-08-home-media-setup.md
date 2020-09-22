---

layout: post
date: 2016-04-07
title: Home media center meta-tutorial with miniDLNA, Raspberry Pi, Deluge and Apple TV
comments: true 
image: /static/media-setup.png

---

![png](/static/media-setup.png)

For a few months now I have been enjoying a new home media system that I threw together with my Raspberry Pi. My setup allows me sit in my living room and stream content from my Raspberry Pi to my 4th Generation Apple TV in full 1080p resolution. The Raspberry Pi is a small, inexpensive stand-alone computer, but it can serve as a powerful media server, and I've been blown away by its consistent performance. Rather than write everything from scratch, I've gathered the tutorials I used when setting up my devices and software and sprinkled it with a few bits of knowledge that I wish I knew when I started. 

Here is an overview of my current setup:

- Raspberry Pi Model 2 B with miniDLNA (media server), Deluge (for torrenting media), TorGuard (anonymous VPN service) and omxplayer (built-in Raspberry Pi media player for playing media right on the Raspberry Pi)
- Apple TV with VLC app (for streaming content from my network-connected Raspberry Pi via miniDLNA)
- iPhone/iPad with Creation 5 + Creation 2 Video Player (for streaming content from my Raspberry Pi to my mobile devices)

Here's what you'll need:

- Raspberry Pi (Model 2 or 3)
- Wifi-connection
- Laptop (you will be SSHing into the Raspberry Pi and managing your torrent downloads through a web-browser interface on your laptop)
- Sufficiently large microSD card (mine is 64GB), large USB drive (I recommend 256GB) or external hard drive (1TB)
- [TorGuard account](https://torguard.net/aff.php?aff=1933) (optional)
- Apple TV (optional)
- iPhone or iPad with Creation 5 and Creation 2 Video player app installed (optional)

Virtual Private Network (VPN)
---

If you are planning on downloading Copyrighted content from a public tracker, you should be using a virtual private network (VNP). I have been using [TorGuard](https://torguard.net/aff.php?aff=1933) for about 6 months and have had excellent service, great download speeds and setup was fairly painless. 

Follow along with [this tutorial](https://torguard.net/knowledgebase.php?action=displayarticle&id=174) on how to get TorGuard running on your Raspberry Pi. 

miniDLNA
---

Next, we will install miniDLNA on your Raspberry Pi. miniDLNA stands for (mini) Digital Network Living Alliance and is a protocol that is used in many devices, including consoles, SmartTVs, and mobile devices. To install it, follow along with [this Instructables tutorial](http://www.instructables.com/id/Raspberry-Pi-Media-Server-MiniDLNA/). Step 4 (Mounting the drive on startup) is not absolutely necessary, but it is a good idea if you will be using a dedicated external USB drive or external hard drive to store your content. I don't have a dedicated USB stick that I use with miniDLNA, but it works just fine playing content from my 64GB microSD card. 

Download [Creation 5](http://www.creation.com.es/creation-5-app/) and Creation 2 Video Player on your iPhone. These are free apps with very minimal advertising. Through the Creation 5 app, you should be able to select your miniDLNA server as a media source. You should then see your Music, Image and Video folders that you just configured, but they will all be empty. 

BitTorrent Client (Deluge)
---

Now that you have your VPN and miniDLNA set up, you will want to try it out with some new content. I use Deluge, a BitTorrent client written in Python, but there are plenty of other great options out there. Deluge is fairly light-weight, so it works well with the Raspberry Pi. There are a number of ways that you can access Deluge, I prefer to use the Deluge WebUI. Here's [one more tutorial](http://www.howtogeek.com/142044/how-to-turn-a-raspberry-pi-into-an-always-on-bittorrent-box/) from How-to Geek that talks about a few different ways to install and configure Deluge. I recommend jumping to the `Setting up Deluge for WebUI Access` section and running the three commands you will need to get started: 

```terminal
$ sudo apt-get install deluged
$ sudo apt-get install python-mako
$ sudo apt-get install deluge-web
```
This gets everything installed. To use Deluge, you will need to run two more commands: 

```terminal 
$ deluged
$ deluge-web&
```
`deluged` runs the Deluge daemon (a background process; the `d` at the end of `deluge` signifies that it is a daemon) that will start Deluge. `deluge-web&` starts that web interface that should be available at http://<your raspberry pi ip address>:8112. The `&` simply keeps the command line available for running other commands. 

You can set Deluge to save downloaded files directly into your various miniDLNA folders, but you will need to restart miniDLNA with the following commands before they are visible on your network. SSH into your Raspberry Pi by running the following command: 

```terminal
$ ssh pi@<your raspberry pi ip address>
```

If you don't know your Raspberry Pi's IP address, run following command: 

```terminal
$ ifconfig
```

Look at the output under `wlan0` and it will be the address following `inet addr`, something like `192.168.1.5` or `10.0.1.132`. To clarify, this is your Raspberry Pi's internal IP address; it is assigned to your Raspberry Pi by your home network and it has nothing to do with the external IP address that you set up with TorGuard. 

Enter your Raspberry Pi's login and password and then enter the following commands once you have established an SSH connection: 

```terminal
$ sudo service minidlna restart
$ sudo service minidlna force-reload
```
Now you should be able to see your content in media players that support miniDLNA. 

Here are some additional resources for [help with miniDLNA on Ubuntu.com](https://help.ubuntu.com/community/MiniDLNA).

Before you start downloading content, I would use use TorGuard's [Check My Torrent IP Address](https://torguard.net/checkmytorrentipaddress.php) tool. This is a blank `.torrent` file that you add to Deluge. In the torrent's tracker information you can see the Public IP address that is listed on the public tracker. This would be the address that [Digital Millennium Copyright Act (DMCA)](https://en.wikipedia.org/wiki/Digital_Millennium_Copyright_Act) would report to your ISP if it was your public IP address, so make sure it is not [your public IP address](http://www.whatsmyip.org/) that you use in your home. You can select proxy IP address from a number of different countries in the TorGuard setup. 

VLC for tvOS
---

VLC is a great media player, and you probably have it downloaded on your computer. You might not have know that VLC has an app for the Apple TV. This app supports the playback of media from miniDLNA servers like the one you just set up, so you can stream content directly from your Raspberry Pi onto your Apple TV through the VLC app. One thing to note, however, is that VLC for tvOS [does not support AC3 audio encodings](https://forum.videolan.org/viewtopic.php?t=125032), but you should be good to go for almost any other audio/video format on the planet.

Conclusion
---

Using the Raspberry Pi certainly isn't necessary for simply downloading torrents, but having it set as a dedicated machine for downloading content and playing back files is a lot of fun and works better than I would have guessed.I don't like running torrents on my MacBook Air, and sometimes I like to use my laptop when I'm watching TV. I would usually have to plug in my laptop to my TV directly and mirror the laptop display onto my TV, but the solution I have eliminates this headache altogether. My setup is by no means perfect, but it gets the job done with a very tolerable amount of effort on my part. Let me know in the comments if you have any critiques or ideas for how to enhance the setup I have described here. Thanks, and good luck with setting up your own home media system.


