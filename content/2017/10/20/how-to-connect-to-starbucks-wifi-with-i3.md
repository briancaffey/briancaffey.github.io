---
layout: post
title: How to connect to Google Starbucks wifi using i3 and Arch Linux
date: 2017-10-20
comments: true
image: /static/i3wifi.png
tags:
  - arch-linux
---

![png](/static/i3wifi.png)

If you are new to i3 and find yourself having trouble connecting to wifi networks in new places, you have come to the right article. One easy solution would simply be to switch to some desktop environment, configure wifi, and then log back into i3. However, there are better ways to do it.

I was recently at a Starbucks and couldn't connect to the open `Google Wifi` network using `sudo wifi-menu`. Coming from Gnome Desktop, I have been having to learn how to do things the i3 way. Simple things like connecting to new wifi networks require new approaches.

If you install the `dialog` package, you can use `wifi-menu` to view available networks and select which network you want to join. This didn't work when I recently tried to join a Google Startbucks wifi network. Luckily, there is a a simple CLI tool for `NetworkManager` called `nmcli` that you can use to join networks.

Here is how to scan networks with `nmcli`:

```
[brian@archthinkpad ~]$ nmcli d wifi list
*  SSID                  MODE   CHAN  RATE       SIGNAL  BARS  SECURITY
   --                    Infra  11    54 Mbit/s  94      ▂▄▆█  WPA2 802.1X
   Google Starbucks      Infra  11    54 Mbit/s  89      ▂▄▆█  --
   Google Starbucks      Infra  48    54 Mbit/s  87      ▂▄▆█  --
   --                    Infra  48    54 Mbit/s  87      ▂▄▆█  WPA2 802.1X
   --                    Infra  1     54 Mbit/s  75      ▂▄▆_  --
   Einstein Bros Bagels  Infra  1     54 Mbit/s  75      ▂▄▆_  --
   --                    Infra  1     54 Mbit/s  75      ▂▄▆_  WPA1 WPA2
   --                    Infra  1     54 Mbit/s  72      ▂▄▆_  WPA2
   Einstein Bros Bagels  Infra  161   54 Mbit/s  60      ▂▄▆_  --
   --                    Infra  161   54 Mbit/s  59      ▂▄▆_  WPA1 WPA2
   xfinitywifi           Infra  153   54 Mbit/s  40      ▂▄__  --
   XFINITY               Infra  153   54 Mbit/s  40      ▂▄__  WPA2 802.1X
   CoxWiFi               Infra  153   54 Mbit/s  39      ▂▄__  --
   CableWiFi             Infra  153   54 Mbit/s  39      ▂▄__  --
   XFINITY               Infra  11    54 Mbit/s  27      ▂___  WPA2 802.1X
   ZM7JQ                 Infra  6     54 Mbit/s  24      ▂___  WPA2
```

And here is how to connect to the `Google Starbucks` network.

```
[brian@archthinkpad ~]$ nmcli dev wifi connect Google\ Starbucks
Device 'wlp3s0' successfully activated with 'da3af242-4707-42f0-81c8-6f8b9dc1a0f7'.
```

If there is a **password** required to join the network, simply use the `-a` flag at the end of the command and you will be prompted to enter the password:

```
[brian@archthinkpad ~]$ nmcli dev wifi connect some_ssid -a
Password:
Device 'wlp3s0' successfully activated with 'da3af242-4707-42f0-81c8-6f8b9dc1a0f7'.
```

You can read more about `nmcli` on the [Arch Wiki Network Manager article](https://wiki.archlinux.org/index.php/NetworkManager).
