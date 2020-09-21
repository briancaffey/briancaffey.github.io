---

layout: post
title: Moving from Gnome Desktop to i3 window manager on Arch Linux
date: 2017-10-17
comments: true
image: /static/gnome-i3.png

---

![png](/static/gnome.png)


I recently tried out [i3](http://i3wm.org) on my laptop and I'm really liking it so far. I am going to try to recreate the same i3 configuration on my desktop installation of Arch Linux. I'll try to faithfully cover each step of the process in this article. 

i3 sounded like a nice idea at first, but there were a lot of aspects of my Gnome desktop that I didn't think I could do without. I'm still new to i3, but I have found it very interesting to see how everything can be configured. If you are thinking about switching to i3, hopefully this can help you out.

Here's a list of everything I want to go through:

- Installing i3
- Basic commands
- Workflow
- Setting a background with `feh`
- The i3 config file
- Setting uxrvt as a default terminal
- Customizing uxrvt
- Customizing workspaces
- Setting up blocks with i3blocks
- Custom lock screen with animation
- i3-gaps

Start out by installing `i3` with pacman as follows

```terminal
[brian@archthinkpad ~]$ sudo pacman -S i3
[sudo] password for brian: 
:: There are 4 members in group i3:
:: Repository community
   1) i3-wm  2) i3blocks  3) i3lock  4) i3status

Enter a selection (default=all): 
```

You won't find `i3` with a regular search in the AUR because it is a package group, containing a number of packages that will help us do things with i3. 

Once you have installed `i3`, logout of your current Gnome session, and then go back to login and select `i3` from the login menu. 

You will be greated with a black screen and a dialogue box that says `i3: first confuguration`. I recommend that you press `Enter` and have i3 generate a config file for you as it says in the prompt. 

Next, choose either `Win` or `Alt` as the key that will help you launch most commands in i3. I use `Alt`, but it won't make a difference in this tutorial since we will be refering to whichever key you select as `Mod1` from here on out. 

Once you make this selection, the prompt will go away and you are met with a black screen and and a status bar on the bottom, as well as workspace indicator on the bottom left. Welcome to i3!

At this point, you should have a read through the very well-written i3 User Guide linked [here](https://i3wm.org/docs/userguide.html). Learn how to move windows around, close windows and stack windows. 

Here's the one command you really need to get going: 

`Mod1+Enter`: open a new terminal

You probably want to change this terminal right away. There's a handy little program launcher that we can use for now called `dmenu`: 

```terminal 
[brian@archthinkpad ~]$ sudo pacman -Ss dmenu
[sudo] password for brian: 
community/dmenu 4.7-1 [installed]
    A generic menu for X
community/pdmenu 1.3.2-2
    simple full screen menu program
[brian@archthinkpad ~]$ 
```

Once you install `dmenu`, you can easily launch programs with `Mod1+d`. 

In a minute we will customize dmenu to look better, but for now we need to get into the meat of i3: customization.

## Customization

Most of the work you do in customizing i3 involves editing `i3`'s config file. To change the configuration of i3, copy `/etc/i3/config` to `~/.i3/config` with: 

```terminal
cp /etc/i3/config ~/.i3/config
```

At this point I will reference my "Dotfiles" on github. Dotfiles is used to refer to hidden configuration folders and files prepended with a ".", such as `~/.i3/config` or `~/.Xresources`. 

A public repo with my dotfiles is available [here](https://github.com/briancaffey/.i3). 

Let's start by adding a background image. Find an image you like and add it to `~/Pictures`. Then install `feh` from the AUR if you don't alread have it. 

`feh` will let us set a background image from the command line, and we can do so each time we launch `i3` by adding the following line to `~/.i3/config`:

```terminal
exec_always feh --bg-scale ~/Pictures/image.jpg
```

Now we can run the following command to restart i3 in place (without having to logout): 

`Mod1`+`shift`+`r`

You will see this shortcut in `~/.i3/config` in the following line: 

```terminal
bindsym Mod1+Shift+r restart
```

This binds `Mod1`+`shift`+`r` to instructions that restart i3. 

If you write `bindsym Some+key+combo exec reboot`, your system will reboot when you press `Some+key+combo`. You can call any command this way, allowing for a high level of customization. It is helpful to see what others have done by browsing `.dotfiles` online. You can mix and match commands to your liking. If you make an error, i3 will warn you when you start or restart i3. 

## Customizing the Terminal (urxvt)

Next let's take care of our terminal. You will notice that the command to launch a new terminal actually launches another program called `i3-sensible-terminal`. Run `man i3-sensible-terminal` to see how this works in detail. It basically picks a terminal program for you based on what you have installed on your system. 

For my terminal, I use a program called `urxvt`. This is a popular terminal program in the i3 community because of the fact that it is highly customizable. There are a lot of options for terminals, so feel free to use whatever you like. I will go into depth here about how I customize `urxvt`. 

First, install it with: 

```terminal
sudo pacman -S rxvt-unicode
```
And then launch it with `urxvt`

It probably looks equally bad to whatever default you were using, but we are about to fix it up so it looks and works great. 

First, have a look at the [Arch Wikie article on rxvt-unicode](https://wiki.archlinux.org/index.php/rxvt-unicode). 

### ~/.Xresources

Just like how the behavior of i3 is read from `~/.i3/config`, the behavior of `urxvt` is read from a file in your home directory called `~/.Xresources`. This file won't be here, so we need to create it. 

For simplicity, I recommend that you copy the contents of [this link](https://raw.githubusercontent.com/briancaffey/.i3/master/.Xresources) into you newly created `~/.Xresources` file and then run the following command to refresh the settings for `urxvt`: 

```terminal
xrdb ~/.Xresources
```

Now restart `urxvt` and you should see that it looks very different. 

Look over the arch wiki article mentioned above for more information on how to customize urxvt. 

## pywal

Next lets work on terminal colors. There is a great program called `pywal` which reads one or several image file and then applies a color scheme to your system based on the colors found. 

Install it from the AUR: 

```terminal
sudo pacman -S python-pywal
```

Now we just need to add the following line to `~/.bashrc`: 

```terminal
# pywal
setsid wal -i ~/Pictures/image.jpg
```

Run `source ~/.bashrc` and reopen `urxvt` and it should have new color scheme that goes well with you background image. You can install another program called `neofetch` to print out the current colorscheme along with system information: 

```terminal
yaourt -S neofetch
```

You can add the following line to the bottom of your `~/.bashrc` file and have neofetch run whenever you open a new terminal:

```terminal
setsid wal -r
```

```terminal
neofetch
```

Here are a few other customizations I have in my `~/.i3/config` file: 

Remove window boarders: 

```terminal
for_window [class="^.*"] border pixel 0
```

Enable smooth transitions with compton: 

`compton` is a package that enables for nice transitions when navigating i3. First, install the compton package: 

```terminal
yaourt -S compton
```

Next we need to add the following line to `~/.i3/config`: 

```terminal
exec compton -f
```

You might need to reboot to see how the effect that compton has. 

## i3-gaps

We can now add a neat feature to our i3 setup by installing a popular fork of i3 callde `i3-gaps`. It adds some additional functionality to i3, including the ability to add gaps in between our windows. 

Install `i3-gaps` from the AUR: 

```terminal
yaourt -S i3-gaps
```

Remove the packages in conflict and then add the following lines to `~/.i3/config`: 

```terminal
# i3-gaps
gaps inner 10
gaps outer 0
```

Refresh i3 and you should now see gaps in between your windows. 

## The Bar

Things should be looking pretty good, but we still need to do some work on the bar at the bottom of the screen. 

Let's install FontAwesome so we can use some nice icons in our bar: 

Find the most recent release of FontAwesome [here](https://github.com/FortAwesome/Font-Awesome/releases), click on the zip download link and then run: 

```terminal
unzip ~/Downloads/Font-Awesome-4.7.0
```

The release number may be different for you. Once you have unzipped the file, we want to move all of the files ending with `.ttf` to a folder that may or may not exist on your machine. 

First, run: 

```terminal
mkdir ~/.fonts
```

and then run: 

```terminal
cp ~/Downloads/Font-Awesome-4.7.0/fonts/*.ttf ~/.fonts
```

Now that you have these fonts installed, go over to [http://fontawesome.io/cheatsheet/](http://fontawesome.io/cheatsheet/) and you should see lots of icons that you might not have been able to see before. 

We will come back to the fonts in just a minute. First let's change the bar by replacing `bar {...}` with the following: 

```terminal
bar {
  	position top
        status_command i3blocks -c /home/brian/.i3/i3blocks.conf
	colors {
		background $bg-color
	    	separator #757575
		#                  border             background         text
		focused_workspace  $bg-color          $bg-color          $text-color
		inactive_workspace $inactive-bg-color $inactive-bg-color $inactive-text-color
		urgent_workspace   $urgent-bg-color   $urgent-bg-color   $text-color
	}
}
```

Don't refresh i3 just yet. Let's go through this block first. 

We tell i3 that our bar will appear at the top of the screen, and that the contents of the bar come from the command: `status_command i3blocks -c /home/brian/.i3/i3blocks.conf`. Finally, we define some background colors. 

First, pull in the colors from my dotfiles before the bar block: 

```terminal
set $bg-color 	         #2f343f
set $inactive-bg-color   #2f343f
set $text-color          #f3f4f5
set $inactive-text-color #676E7D
set $urgent-bg-color     #E53935

# window colors
#                       border              background         text                 indicator
client.focused          $bg-color           $bg-color          $text-color          #00ff00
client.unfocused        $inactive-bg-color $inactive-bg-color $inactive-text-color #00ff00
client.focused_inactive $inactive-bg-color $inactive-bg-color $inactive-text-color #00ff00
client.urgent           $urgent-bg-color    $urgent-bg-color   $text-color          #00ff00
```

Next let's take care of the i3blocks command. The `i3blocks` package was installed when we instaled i3, so we just need to provide an absolute path to a file as the argument for this command, as well as the `-c` flag. In this file we simply define what shows up in the bar. Here's a simple version that shows date, time, CPU temperature and wifi: 

```terminal
[wifi]
label=
command=iwgetid -r
separator=true
interval=3

#[volume]
#label=
#interval=1
#separator=true
#command=amixer get Master | egrep -o "[0-9]+%" | sed -n '2 p'

#[cpu]
#label=
#interval=10
#separator=true

[temperature]
command=T=$(cat /sys/class/thermal/thermal_zone0/temp); echo $(( $T / 1000 ))°C
label=
interval=10
separator=true

[time]
command= date '+%H:%M:%S'
interval=2
label=
separator=true

[day]
command= date '+%a %b %e, %Y'
interval=2
label=
separator=true
```

This is why it is called i3*blocks*, because each part of the bar is defined in a block that has a command, an interval in seconds that determines how often the command is run, and a label. You can choose any text or icon for the labels. 

Next we can add some labels to the workspaces on the left side of the bar. I like to divide my workspaces into groups to keep things organized. 

Add the following to your `~/.i3/config` file: 

```terminal
set $workspace10 "H0me "
set $workspace1 "F1rst "
set $workspace4 "Edi4or "
set $workspace3 "Brows3r "
set $workspace2 "2erminal "
set $workspace5 "Mu5ic "
set $workspace8 "O8S "

# switch to workspace
bindsym Mod1+1 workspace $workspace1
bindsym Mod1+2 workspace $workspace2
bindsym Mod1+3 workspace $workspace3
bindsym Mod1+4 workspace $workspace4
bindsym Mod1+5 workspace $workspace5
bindsym Mod1+6 workspace 6
bindsym Mod1+7 workspace 7
bindsym Mod1+8 workspace $workspace8
bindsym Mod1+9 workspace 9
bindsym Mod1+0 workspace $workspace10

# move focused container to workspace
bindsym Mod1+Shift+1 move container to workspace $workspace1
bindsym Mod1+Shift+2 move container to workspace $workspace2
bindsym Mod1+Shift+3 move container to workspace $workspace3
bindsym Mod1+Shift+4 move container to workspace $workspace4
bindsym Mod1+Shift+5 move container to workspace $workspace5
bindsym Mod1+Shift+6 move container to workspace 6
bindsym Mod1+Shift+7 move container to workspace 7
bindsym Mod1+Shift+8 move container to workspace $workspace8
bindsym Mod1+Shift+9 move container to workspace 9
bindsym Mod1+Shift+0 move container to workspace $workspace10
```

Things are looking pretty good at this point. Here are some other things that I have found to be very helpful: 

### Brightness Controller

```
yaourt -S brightness-controller
```

Next we can add a shortcut for this package: 

```terminal
bindsym Mod1+Ctrl+b exec brightness-controller 
```

### Ranger

`ranger` is a terminal-based file browser that is nice to use. 

```terminal
yaourt -S ranger
```

There is a lot we can do to customize ranger, here are some important things that I do. First, run the following command: 

```terminal
ranger --copy-config=all
```

This will create a file located here: `~/.config/ranger/rc.conf`. 

We need to make the following adjustments: 

- change `set preview_images false` to `set preview_images true`

- change `set draw_borders false` to `set draw_borders true`

- install a package called `w3m`

- add (overwrite) this line: `set preview_images_method w3m`

- run `source ~/.config/ranger/rc.conf` and then launch ranger in a new terminal

These changes will allow you to preview images right inside of the ranger file browser. There may be another combination of settings that get this to work, but these worked for me. Be careful that things you want to change in `~/.config/ranger/rc.conf` are not overwritten by other lines. 


## Rofi

`rofi` is a launcher similar to `dmenu` that we used in the beginnings, but it is better. Here's how to install it: 

```terminal
sudo pacman -S rofi
```

Next we can add a key binding so we can quickly launch any program with rofi: 

```terminal
bindsym Mod1+space exec rofi -show run
```

Be careful when you add new bindings! i3 will give you an error if you assign one binding to more than one command. I had to shuffle some of the default bindings around to use `Mod1+space`. 

This is a good place to stop for now. There is a lot you can do with i3, so it is good to take things one step at a time and also try to do things in different ways to see what you like. 

## Extras

### Chinese Input Support

Install `ibus-pinyin` from AUR

Run the ibus daemon: 

```terminal
ibus-daemon -xim&
```

Install another Chinese font and set in `~/.Xresources`

[https://askubuntu.com/questions/826577/switch-keyboard-layouts-with-i3/826578](https://askubuntu.com/questions/826577/switch-keyboard-layouts-with-i3/826578)

## Dotfiles

Here are the configuration files I use for i3: 

- `~/.i3/config`: general configurations for i3
- `~/.i3/i3blocks.conf`: configuration for status bar in i3
- `~/.i3/blocks/scripts/`: scripts that run for `i3blocks`
- `~/.Xresources`: configuration for `rxvt-unicode`
- `~/.config/ranger/rc.conf`: configuration files for `ranger`
- `~/.vimrc`: configuration for `vim`
- `~/.bashrc`: environment variables, functions and aliases

I'm constantly changing things around in these files but I try to keep them up to date in a repo on my Github account which you can find [here](https://github.com/briancaffey/.i3).