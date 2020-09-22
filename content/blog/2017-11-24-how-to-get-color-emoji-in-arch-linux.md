---

layout: post
title: How to enable color emoji on Arch Linux with Emoji One Font
date: 2017-11-20
comments: true
image: /static/emoji_flags.png

---

This is a short article about how to enable color emoji on Arch Linux. I have searched for a working solution for this a few times but never found something that worked. I stumbled upon [this Gist](https://gist.github.com/himalay/5c404a5f6653cb35154ceb3a6c606211) that I used to hack together a solution that enables color emoji from Emoji One on Arch Linux. 

This setup doesn't show all emoji in `urxvt`, and I have heard that this is simply not possible, but most other programs and UIs display the emoji just fine. Here's what I did:

First, install `tff-emojione`, a package that seems to have been added to the AUR just a week ago. 

Next, run the script from the gist mentioned above: 

```
# create folders if does not exist
mkdir -p ~/.fonts
mkdir -p ~/.config/fontconfig/

# download noto color emoji font from https://www.google.com/get/noto/#emoji-zsye-color
# extract NotoColorEmoji.ttf file into ~/.fonts/

# create font config file
cat << 'EOF' > ~/.config/fontconfig/fonts.conf
<?xml version="1.0" encoding="UTF-8"?><!DOCTYPE fontconfig SYSTEM "fonts.dtd">
<match>
 <test name="family"><string>sans-serif</string></test>
 <edit name="family" mode="prepend" binding="strong">
 <string>Noto Color Emoji</string>
 </edit>
 </match>
<match>
 <test name="family"><string>serif</string></test>
 <edit name="family" mode="prepend" binding="strong">
 <string>Noto Color Emoji</string>
 </edit>
 </match>
<match>
 <test name="family"><string>Apple Color Emoji</string></test>
 <edit name="family" mode="prepend" binding="strong">
 <string>Noto Color Emoji</string>
 </edit>
 </match>
EOF
# build font information cache files
fc-cache -f -v 
```

As recommended in the comments of the gist, you will notice that numbers in most applications are represented with emoji numbers. 

To fix this, remove all three instances of `mode="prepend" binding="strong"` from `~/.config/fontconfig/fonts.conf` and then run `fc-cache -f -v `. This should fix some issues, but you may notice that spaces between words are not displayed in some applications and some of the instances of numbers displayed as emoji should be have fixed, but not all. Once I removed all of the text from `~/.config/fontconfig/fonts.conf` and ran `fc-cache -f -v ` one more time, I seemed to get the space and number issues to go away while the emoji still work! 

I'm really not sure how or why this works, but it has solved the issue I've been having of emojis not displaying. Hopefully this helps if you are trying to add color emoji to your Arch Linux installation. Apparently the next version of Ubuntu will include support for color emoji out of the box, but for now you will have to hack together your own solution for Arch Linux. 