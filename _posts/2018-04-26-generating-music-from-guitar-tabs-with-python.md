---

layout: post
title: Generating MIDI files from guitar tablatures with Python and regular expressions
date: 2018-04-26
comments: true
image: /img/guitar.jpg

---

Recently I have been playing lots of classical guitar. I use [classtab.org](classtab.org), a website with hundreds of classical guitar pieces in tab form. Here's an example of a guitar tab: 

```
|---------------0---|---3-2-3-----------|-----0-------------|
|-------0-3-1-1---3-|-3-------3-0-----0-|-1-3---3-1-0---0---|
|---0-2-0-----------|-------------0-2---|-------------2---0-|
|-------------2-----|-------2-----------|-------------------|
|-------------------|-2-----------------|-0-----2-----3-----|
|-3-----------------|-------------0-----|-------------------|
```

It is a representation of where and when strings are played. The six lines here represent the six strings of the guitar e, A, D, G, B and E and the numbers indicate where on the fretboard to press for each note. The vertical bars represent one bar of music. 

My goal is to write an application that can read in guitar tabs and then produce a corresponding MIDI file for the song. 

To start, I will use regular expressions to parse the bars of music in a guitar tab text file. 

Next, I will use a Python package called MIDIUtil to generate `.mid` files from the guitar tabs. 

Finally, I'll put this into a simple web app that lets users copy paste guitar tab text or enter a URL from a site like classtab.org that will similarly generate a MIDI file. 

## Regex

First, let's look at a few different examples of guitar tabs to get a better sense of what our goal should be in using regular expressions to parse notes.

### Tab examples

[http://www.classtab.org/barrios_la_catedral_3_allegro.txt](http://www.classtab.org/barrios_la_catedral_3_allegro.txt)

```
La Catedral
Author: Agustin Barrios
Tablature by: Gianpiero Ciammaricone
              giancian@yahoo.com
              http://www.geocities.com/vienna/6619

Tablature Explanation at the end.

[key corrected from "D Major" Jan 99]

This is Revision 3 (5/2/98), I have added a modification made by
Barrios in line 5 of the TAB, both ways of playing it are included,
so you can choose the best one for you.
Revision 2: Made a few corrections.
Revision 1: The first release of the tab.

3rd Movement (Allegro):
Key: B Minor
Time signature: 6/8

E-|-------------------------|-----------------------------|
B-|-----------------3-------|-----------------3-----------|
G-|---------0---4-------4---|---------0---4-------4-------|
D-|---4-3h4---4---4---4---4-|---4-3h4---4---4---4---4-----|
A-|-2-----------------------|-2---------------------------|
E-|-------------------------|-----------------------------|
    p m i   m i m i a i m i

E-|-------------------------|-----------------------------|
B-|-----------------3-------|-----------------3-----------|
G-|---------2---4-------4---|---------2---4-------4-------|
D-|---5-4h5---5---5---5---5-|---5-4h5---5---5---5---5-----|
A-|-2-----------------------|-2---------------------------|
E-|-------------------------|-----------------------------|
    p m i   m i m i a i m i

E-|-------------------------|-----------------------------|
B-|-----------------5-------|-----------------5-----------|
G-|---------4---6-------6---|---------4---6-------6-------|
D-|---7-6h7---7---7---7---7-|---7-6h7---7---7---7---7-----|
A-|-4-----------------------|-4---------------------------|
E-|-------------------------|-----------------------------|
    p m i   m i m i a i m i  
```

[http://www.classtab.org/moreno_torroba_siete_piezas_de_album_6_chisperada.txt](http://www.classtab.org/moreno_torroba_siete_piezas_de_album_6_chisperada.txt)

```
SIETE PIEZAS DE ALBUM: VI. CHISPERADA
As recorded by Federico Moreno Torroba

Music by Federico Moreno Torroba

|-----0-----0-|-----------0-|-----0-----0-|
|---1-----0---|-----3-----0-|---1-----0---|
|---2-----0---|---2-------1-|---2-----0---|
|---2---------|---3---------|---2---------|
|-0-----------|---------2---|-0-----------|
|-------3-----|-1-----0-----|-------3-----|

|-----------0-|-----0-----0-|-----------0-|-----------0--|
|-----3-----0-|---1-----0---|-----3-----0-|-----3-----0--|
|---2-------1-|---2-----0---|---2-------1-|---2-------1--|
|---3---------|---2---------|---3---------|---3----------|
|---------2---|-0-----------|-0-------2---|-0-------2----|
|-1-----0-----|-------3-----|-------0-----|-------0------|

|---------------0--|-0-----0-----|-1-----1-3p1-0---|
|---1-0---------0--|-1-----------|---------------3-|
|-2-----2-0-----1--|-2-----1-----|-2-----2---------|
|-----------3------|-------------|-------0---------|
|-3----------------|---0-0---2-2-|---3-3-----------|
|-------------0----|-------------|-----------------|
```

[http://www.classtab.org/moreno_torroba_sonatina_in_a_2_andante.txt](http://www.classtab.org/moreno_torroba_sonatina_in_a_2_andante.txt)

```
Sonatina in A - II - Andante

F. Moreno Torroba (1891-1982)

tuning DADGBE

E|-----2--3---5----------10--8--7-------|-----8----7^8^7-----------------------|
B|-----3--5---7----------7--------------|-----8-----------10---------8---------|
G|-----2---------------------9--7-------|-----9--------------------------11----|
D|-----0--------------4-----------------|--------------------------10----------|
A|-----0----------0---------------------|----------------------7---------------|
D|-----0--------------------------------|-----0--------------------------------|

E|--------------------------------------|--------------------------------------|
B|------------------7--8^10-8---7^5-----|---5---------7-8-7-5-----5------------|
G|--9^11^9----7--9------------------7---|---6-----------------7---6------------|
D|-------8------------------------------|---5---------------------5--7----19°--|
A|-------10-----------------------------|------0--12°--------------------------|
D|-------0------------------------------|---0---------------------0------------|
```

Here are a few things that we need to consider: 

- The start of each line sometimes starts with a the note of the string (`E` or `e`, `A`, `D`, etc.) followed by `|` or just simply start with `|`. Some lines may start with `E-|`. 

- There is generally a `-` character between each note. When this is not the case, we may have a `p`, `h` or `^` which indicates "pull off" or "hammer on". This means that you are playing the string with the hand on the fretboard, not the hand over the sound hole. We should replace these with `-`. 

- A tab may have an inconsistant number of characters in each bar. I'm not too concerned about this. I'm not going for perfection just yet, but it could make this task very difficult if you want to get the timing of your sounds just right. 

- Notes played on the 10th fret and higher must be read together. For example, `---12---` should be played on the 12 fret; it does not mean play `1` and then play `2`.

- There are some other special characters such as `°` or `<`/`>`. I think these both denote harmonics. This is when you place your finger on the string at a position along the fretboard, but do not press down. We probably want to replace these characters with `-` as well. 

### Tab text file processing 

Here are some things that may be helpful to do as soon as we read a text file: 

- convert everything to upper or lower case

- replace non-numeric characters with `-`

When I work with regex, I usually go straight to [regex101.com](regex101.com). 

## MIDIUtil

At this point, I think it will be helpful to examine MIDIUtil and create and play a basic MIDI file. 

Before you do that, you might want to read over the [MIDI Arch Wiki article](https://wiki.archlinux.org/index.php/MIDI). 

> MIDIUtil is a pure Python library that allows one to write multi-track Musical Instrument Digital Interface (MIDI) files from within Python programs (both format 1 and format 2 files are now supported). It is object-oriented and allows one to create and write these files with a minimum of fuss.

Here's a basic example of MIDIUtil. This script generates a MIDI file that contains a major scale. 

```python
#!/usr/bin/env python

from midiutil import MIDIFile

degrees  = [60, 62, 64, 65, 67, 69, 71, 72]  # MIDI note number
track    = 0
channel  = 0
time     = 0    # In beats
duration = 1    # In beats
tempo    = 60   # In BPM
volume   = 100  # 0-127, as per the MIDI standard

MyMIDI = MIDIFile(1)  # One track, defaults to format 1 (tempo track is created
                      # automatically)
MyMIDI.addTempo(track, time, tempo)

for i, pitch in enumerate(degrees):
    MyMIDI.addNote(track, channel, pitch, time + i, duration, volume)

with open("major-scale.mid", "wb") as output_file:
    MyMIDI.writeFile(output_file)
```

Now let's try to play this file. Well, if you read the MIDI article, you would know that this isn't really what we are doing. We want to see what our major scale sounds like. In order to do that, we need to install and configure both a MIDI synthesizer as well as a soundfont. 

We can use timidity++ for our MIDI synth. There are very simple instructions on how to do this [here](https://wiki.archlinux.org/index.php/timidity). 

Here are the steps I followed:

From the AUR, install `timidity++` and `timidity-freepats`. 

Add yourself to the audio group: 

```
# gpasswd -a brian audio
```

Add the following line to `/etc/timidity++/timidity.cfg`:

```
soundfont /usr/share/soundfonts/timidity-freepats.sf2
```

```
sudo systemctl start timidity.service
sudo systemctl enable timidity.service
```

Run `aplaymidi -l`:

```
 $ aplaymidi -l
 Port    Client name                      Port name
 14:0    Midi Through                     Midi Through Port-0
130:0    TiMidity                         TiMidity port 0
130:1    TiMidity                         TiMidity port 1
130:2    TiMidity                         TiMidity port 2
130:3    TiMidity                         TiMidity port 3
```

Finally, we can play our MIDI file that we generated by running the python script above: 

```
 $ aplaymidi major-scale.mid --port 130:0
<music plays...>
```

For this project, playing files using a synthesizer is useful to verify that the MIDI was successfully created. If/when we get to the point of making a web app to convert midi files to music files, we will generate the midifile in-memory, convert it to a WAV file and then return that to the user. 

Let's try to process a very simple tab file with just one string and a few notes, and then generate a simple MIDI file based on the tab. 

Our sample tab can be: 

*simple-tab.txt*
```
--0--2--4--
```

```python
#!/usr/bin/env python

from midiutil import MIDIFile

degrees  = [60, 62, 64, 65, 67, 69, 71, 72]  # MIDI note number
track    = 0
channel  = 0
time     = 0    # In beats
duration = 1    # In beats
tempo    = 60   # In BPM
volume   = 100  # 0-127, as per the MIDI standard

MyMIDI = MIDIFile(1)  # One track, defaults to format 1 (tempo track is created
                      # automatically)
MyMIDI.addTempo(track, time, tempo)

for i, pitch in enumerate(degrees):
    MyMIDI.addNote(track, channel, pitch, time + i, duration, volume)

with open("major-scale.mid", "wb") as output_file:
    MyMIDI.writeFile(output_file)
```

```
 $ echo "--0--2--4--" > simple-tab.txt
```

Here's the script I used to generate some fairly accurate MIDI files. There are still some bugs in the script that generates the MIDI file, but this meets the goal I had last weekend of writing a simple script to generate music from guitar tabs. 

```python
#!/usr/bin/env python

from midiutil import MIDIFile
import sys
import re

string_notes = ["high_e", "B", "G", "D", "A", "E"]

guitar_strings = {
    'E':{'note_val':52, 'track_num':0},
    'A':{'note_val':57, 'track_num':1},
    'D':{'note_val':62, 'track_num':2},
    'G':{'note_val':67, 'track_num':3},
    'B':{'note_val':71, 'track_num':4},
    'high_e':{'note_val':76, 'track_num':5},
}

# read the tab file
file_name = sys.argv[1]
if file_name.split(".")[-1] != 'txt':
    print("Please select a text file")

with open(file_name) as f: 
    contents = f.read()

contents = contents.replace("h", "-")
contents = contents.replace("p", "-")
contents = contents.replace("/", "-")
contents = contents.replace("*", "-")
contents = contents.upper()
bar_group = re.findall(r"(?:[E,B,G,D,A,-]+\|[0-9-h|]+\n){6}",contents)

#bar_group = re.findall(r"(?:\|[0-9-\*h\|]+\n){6}",contents)


track    = 0
channel  = 0
time     = 0    # In beats
duration = 1    # In beats
tempo    = 1000   # In BPM
volume   = 100  # 0-127, as per the MIDI standard

MyMIDI = MIDIFile(6)  # One track, defaults to format 1 (tempo track is created
                      # automatically)
MyMIDI.addTempo(track, time, tempo)

interval = len(bar_group[0].split("\n")) - 1

for b in bar_group:

    strings = b.split("\n")
    strings = [x for x in strings if x != '']
    e_count = 0
    for i,s in enumerate(strings):
        
        current_string = strings[i][0]
        if current_string not in guitar_strings.keys():
            current_string = string_notes[i]
        if current_string == "E":
            e_count += 1
        if e_count == 2:
            current_string == "high_e"

        track = guitar_strings[current_string]['track_num']

        s = s[1:]
        s = s.replace('|', '')
        s = list(s)

        for i, pitch in enumerate(s):
            volume = 100
            
            if pitch == "\n":
                break
            if pitch == "-":
                volume = 0
                pitch = 50
            print("adding note")
            pitch = int(pitch) + guitar_strings[current_string]['note_val']
            MyMIDI.addNote(track, channel, pitch, time + i, duration, volume)
        
    time += interval*8

with open("major-scale.mid", "wb") as output_file:
    MyMIDI.writeFile(output_file)
```

Here's me playing one of my favorite songs, you might recognize it!

<blockquote class="instagram-media" data-instgrm-captioned data-instgrm-permalink="https://www.instagram.com/p/rg2gmyyFdC/" data-instgrm-version="8" style=" background:#FFF; border:0; border-radius:3px; box-shadow:0 0 1px 0 rgba(0,0,0,0.5),0 1px 10px 0 rgba(0,0,0,0.15); margin: 1px; max-width:658px; padding:0; width:99.375%; width:-webkit-calc(100% - 2px); width:calc(100% - 2px);"><div style="padding:8px;"> <div style=" background:#F8F8F8; line-height:0; margin-top:40px; padding:50% 0; text-align:center; width:100%;"> <div style=" background:url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACwAAAAsCAMAAAApWqozAAAABGdBTUEAALGPC/xhBQAAAAFzUkdCAK7OHOkAAAAMUExURczMzPf399fX1+bm5mzY9AMAAADiSURBVDjLvZXbEsMgCES5/P8/t9FuRVCRmU73JWlzosgSIIZURCjo/ad+EQJJB4Hv8BFt+IDpQoCx1wjOSBFhh2XssxEIYn3ulI/6MNReE07UIWJEv8UEOWDS88LY97kqyTliJKKtuYBbruAyVh5wOHiXmpi5we58Ek028czwyuQdLKPG1Bkb4NnM+VeAnfHqn1k4+GPT6uGQcvu2h2OVuIf/gWUFyy8OWEpdyZSa3aVCqpVoVvzZZ2VTnn2wU8qzVjDDetO90GSy9mVLqtgYSy231MxrY6I2gGqjrTY0L8fxCxfCBbhWrsYYAAAAAElFTkSuQmCC); display:block; height:44px; margin:0 auto -44px; position:relative; top:-22px; width:44px;"></div></div> <p style=" margin:8px 0 0 0; padding:0 4px;"> <a href="https://www.instagram.com/p/rg2gmyyFdC/" style=" color:#000; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px; text-decoration:none; word-wrap:break-word;" target="_blank">Written in 1902, this catchy tune from Fransico Tárrega&#39;s &#39;Gran Vals&#39; is now heard by an estimated 22,000 per second worldwide.. it is also a registered sound trademark of a billion dollar Finnish company 🎵 #franciscotárrega #tarrega #tárrega #classicalguitar #spanishguitarist #spain #instamusic #granvals #grandevalse #grandwaltz #crownmolding</a></p> <p style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; line-height:17px; margin-bottom:0; margin-top:8px; overflow:hidden; padding:8px 0 7px; text-align:center; text-overflow:ellipsis; white-space:nowrap;">A post shared by <a href="https://www.instagram.com/briancaffey/" style=" color:#c9c8cd; font-family:Arial,sans-serif; font-size:14px; font-style:normal; font-weight:normal; line-height:17px;" target="_blank"> Brian</a> (@briancaffey) on <time style=" font-family:Arial,sans-serif; font-size:14px; line-height:17px;" datetime="2014-08-10T09:48:59+00:00">Aug 10, 2014 at 2:48am PDT</time></p></div></blockquote> <script async defer src="//www.instagram.com/embed.js"></script>