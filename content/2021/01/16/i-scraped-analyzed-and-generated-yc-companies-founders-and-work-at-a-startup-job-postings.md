---
title: Scraping, analyzing and generating companies, founders and job postings from YC's Work at a Startup
date: '2021-01-16'
description: Scraping, analyzing and generating companies, founders and job postings from YC's Work at a Startup
image: /static/yc.png
tags:
  - python
  - data
  - scraping
  - startups
  - yc
external:
  - link: https://news.ycombinator.com/
    site: hn
  - link: https://reddit.com
    site: reddit
  - link: https://dev.to
    site: dev
  - link: https://medium.com
    site: medium
  - link: https://briancaffey.hashnode.com
    site: hashnode
  - link: https://briancaffey.substack.com
    site: substack
  - link: https://hackernoon.com/
    site: hackernoon
draft: true
---

I always enjoy reading about new batches of YC companies. I came across YC's [Work at a Startup](https://www.workatastartup.com/) (WaaS) recently while browsing HN and got pretty curious about all of the available data points on companies, jobs and founders.

This article will outline my process for collecting, cleaning, visualizing and analyzing the dataset.

After filling out my profile, WaaS recommended 750 matching YC startups which collectively list 1614 open positions. I think this is all of the available job openings and hiring companies, but I'm not sure.

## Scraping data

I've used a few different tools to scrape data and automate web browsers. For collecting this data, I ended up just writing some JavaScript directly in the browser console and `Ctrl+S`aved the page HTML and assets (company logos and founder photos).

```js
// expand each companies to see full details and all postings
const toggleDetails = document.getElementsByClassName("checkbox-inline")[0]
toggleDetails.click()

// automated scrolling, run this until it gets to the end
const scroll = setInterval(() => {window.scrollTo(0,document.body.scrollHeight);}, 3000)

// when it no longer scrolls, clear the interval
clearInterval(scroll)

// expand each job listing:
const jobs = document.getElementsByClassName("job-name")
for (let job of jobs) {
    job.click()
}

// now Ctrl+S to save the HTML and images
```

## Parsing the HTML

Next I'll parse the company data into a python list of dictionaries and then `dumps` it into a JSON file. This code is a little bit scrappy, here's the pseudo code:

```py
# pseudo code for parsing data
html = open("data.html")
parsed_html = parseHtml(html)

companies = []
for company in parsed_html.find_all("company")
    # company stats, founders and jobs
    company_details = extract_company_details(company)
    companies.append(company_details)

with open("output.json", "wb") as f:
    f.write(json.dumps(companies))
```

To scrape the data I used my go-to library for this type of task: BeautifulSoup. There were a few tricky parts:

- Job details (visa requirements, salary, equity) were all labelled with the same class and they were inconsistent (sometimes salary or equity or both were excluded, for example).

- Equity was mostly a range of percentages such as `1% - 2%` and sometimes a single percentage like `1.5%`. Some salary ranges had typos like `$90k - $10k`

- Years of experience required was also inconsistent with mixed types like `3+ Years`, `Any (recent grad ok)` and `Senior or Juniors`, for example.

These were all pretty easy to account for, it just required some additional logic to handle default values for `<div>`s that were not included as well as mixed data types and representations where there were inconsistencies.

The resulting JSON structure for the big array of companies looks like this:

```json
[
    {
        "company_name": "Startup A",
        "logo": "logo.png",
        "jobs": [
            {
                "title": "Software Engineer",
                "skills": ["python", "javascript"],
                "salary": {
                    "min": 90000,
                    "max": 110000,
                    "avg": 100000
                }
            }
        ],
        "founders": [
            {
                "name": "Founder Name",
                "linkedin": "https://linkedin.com/founder",
                "education": "University A",
                "image": "abc.png"
            }
        ]
    }
]
```

## Analysis

Here are some of the biggest questions I wanted to answer along with some simple python I used for extracting data from the main dictionary/JSON object containing all companies and jobs. For the following code, assume I have read the JSON file back into a python dictionary.

### What are the most in demand skills for YC Jobs?

I think skills are included mostly for engineering roles (not so much for sales, marketing, etc.). Here are the top skills:

```py
skills = []
for company in company_list:
    if company["jobs"] is not None:
        for job in company["jobs"]:
            if job["job_skills"] is not None:
                for skill in job["job_skills"]:
                    skills.append(skill)

top_skills = Counter(skills).most_common()
print(top_skills)
```

<client-only>
<skill-count />
</client-only>


I'll try to briefly describe what I know about each of these if I know what it means (without Googling!):

```py

[
 ('JAVASCRIPT', 330), # I have been using JS a lot recently with Vue
 ('REACT', 323), # As a prefer to use Vue, I haven't used React in a while
 ('PYTHON', 312), # I'm a big Python fan, it was the first language I touched, happy to see it near the top!
 ('AMAZON WEB SERVICES (AWS)', 200), # I like AWS a lot. I have really been enjoying using CDK to build infrastructure
 ('NODE.JS', 195), # I would to do more with node this year. I generally use Python for web apps
 ('POSTGRESQL', 132), # <3 postgres!
 ('TYPESCRIPT', 114), # this is another goal of mine for 2021, it seems like an inevitability
 ('JAVA', 79), # I have never used Java
 ('SQL', 74), # I usually don't write my own SQL queries; I view SQL through the lense of an ORM
 ('RUBY ON RAILS', 72), # I haven't used RoR
 ('CSS', 71), # I like CSS Frameworks. Recently I'm into Tailwind and Material UI. This site uses Tailwind
 ('HTML', 71),
 ('DOCKER', 66), # I am a big container fan! It is my preferred way to run software, locally and in the cloud
 ('KUBERNETES', 58), # I read the Manning book on k8s. I prefer ECS or Swarm, but I might try using it more
 ('GO', 58), # I haven't ever used Go, but it doesn't look too bad coming from Python
 ('REACT NATIVE', 58),
 ('C++', 55), # Also haven't used this, but I have a book on it
 ('GRAPHQL', 48), # I tried GraphQL and built a HN clone in Django. I prefer REST but I get the appeal (for frontend developers)
 ('GOOGLE CLOUD', 46), # I'm not a big GCP as I mostly use AWS and Digital Ocean but I would like to try Cloud Run
 ('RUBY', 44), # I haven't used it
 ('DJANGO', 44), # Django is my go-to tool for building web apps and APIs. I love the admin, ORM and DRF
 ('MACHINE LEARNING', 44), # I am familiar with some ML techniques but not very well practiced
 ('MONGODB', 43), # Have used it before, but I try to use the postgres JSONField for storing NoSQL data when possible
 ('IOS', 38), # I have an iPhone, but haven't used a Mac in a long time, mostly on Linux and Windows
 ('MYSQL', 36), # I tend to use Postgres, I don't think I've ever used this
 ('ANDROID', 35), # Not something I have worked with
 ('DATA ANALYTICS', 32), # I do a lot of this
 ('GIT', 30), # I'm very slowly trying to learn advanced git features. I have many abandoned "rebase-practice" repos
 ('ANGULAR', 29), # I tried it once for about an hour, I know that people love to hate it, I'm just not sure why
 ('SWIFT', 29), # This is apparently a very popular language and has use cases outside of mobile development, but I've never used it
 ('LINUX', 28), # I spend lot of time using Linux machines, mostly Ubuntu.
 ('SOFTWARE ARCHITECTURE', 24), # I like using diagrams.net to draw application infrastructure
 ('KOTLIN', 23), # I think this is a framework for Java/Android?
 ('TENSORFLOW', 22), # Google DL/ML library that I'll try to use later in this article
 ('DISTRIBUTED SYSTEMS', 22), # Using AWS, I guess I have technically designed distributed systems but I wouldn't call it one of my skills
 ('PHP', 22), # I almost learned it to support a WordPress site but opted to use JAMStack instead
 ('DATA WAREHOUSING', 22), # I have used Google BigQuery before which I think counts for this skill
 ('DEEP LEARNING', 20), # I'm going to try to use this later in this article
 ('DATA MODELING', 20), # To me this means writing Django models, or thinking about how to structure an API/json data, etc.
 ('C#', 19), # Micrsoft language used for different things including game dev with Unity
 ('FLASK', 19), # I'm familiar with it but mostly prefer Django's batteries included philosophy
 ('C', 19), # In learning about Linux I have read a bit of C, but never written any
 ('REDIS', 18), # Fast, in memory key-value store with multiple data types. I use it for a few different things
 ('MICROSERVICES', 18), #
 ('COMPUTER VISION', 17), # I once used OpenCV on my Raspberry Pi
 ('EXPRESS', 15), # I'd like to learn how to use this in 2021
 ('BASH/SHELL', 13), # I'm not very fluent in bash but
 ('OBJECTIVE-C', 13),
 ('FIREBASE', 12),
 ('SCALA', 11),
 ('SOFTWARE SECURITY', 11),
 ('UNITY', 11),
 ('R', 11),
 ('KAFKA', 10),
 ('SPARK', 10),
 ('ELASTICSEARCH', 10), #
 ('ETL', 10), # Extract, Transform and Load
 ('NATURAL LANGUAGE PROCESSING', 10),
 ('HEROKU', 10), # I used this when first learning about Django, haven't used it in a while
 ('NGINX', 9), # I use NGINX in most of my web apps as a reverse proxy
 ('JENKINS', 9), # I haven't used it, I am a big GitLab fan and will use that whenever possible
 ('RUST', 9), # I have read the Rust book and have played around with WASM
 ('IMAGE PROCESSING', 8),
 ('SERVERLESS', 8),
 ('BLOCKCHAIN', 8),
 ('OPENCV', 8),
 ('CAD DESIGN', 7),
 ('JQUERY', 7),
 ('HADOOP', 6),
 ('.NET CORE', 6),
 ('TCP/IP', 6),
 ('ELIXIR', 6),
 ('INTERNET OF THINGS (IOT)', 5),
 ('SASS', 5),
 ('OPENGL', 5),
 ('DYNAMODB', 5),
 ('GOOGLE APP ENGINE', 5),
 ('UNIX', 4), # GNU is Not Unix!
 ('SPRING FRAMEWORK', 4), # A Java web framework that I haven't used
 ('CUDA', 4), #
 ('DART', 4), # I don't know what this is
 ('ERLANG', 4), # A language that handles concurrency very well
 ('RABBITMQ', 4), # Message queue, I have used it before but tend to use Redis as a message broker
 ('KERAS', 4), # A helper/wrapper library for Tensorflow
 ('SCSS', 4), # I think this is a language that compiles to CSS. CSS frameworks that I use use this
 ('ML', 4), # I've read some books and experimented but I'm not a regular practitioner
 ('MATLAB', 4), # A tool her programming with higher math
 ('SPRING', 4), # A Java web framework. Not sure if different from Spring Boot. Never used it.
 ('CASSANDRA', 4), # FB scalable database (NoSQL I think?) that does sharding really well
 ('HIVE', 3), # Not sure what hive is. I think it related to Hadoop
 ('PUPPET', 3), # Configuration management tool that I haven't ever used
 ('REDSHIFT', 3), # AWS version of Google BigQuery
 ('SQL SERVER', 3), # Not sure what this refers to, specifically.
 ('GROOVY', 3), # I think this is a Java framework?
 ('VERILOG', 3), # I've never heard of this.
 ('TORCH/PYTORCH', 3), # FB python deep learning library.
 ('CLOJURE', 3), # A LISP derivate, functional language
 ('MICROSOFT AZURE', 3), # I've used Azure AD and thats it.
 ('HBASE', 2), # I don't know what this is
 ('RDS/AURORA', 2), # I use RDS and experimented with Aurora but don't know when/why to use it
 ('FIRMWARE', 2), # What's between hardware and software
 ('ABAP', 2), # I don't know
 ('ARDUINO', 2), # I have one, but don't use it
 ('MICROCONTROLLERS', 2), # Arduino might be an example of what this is
 ('SOLIDITY', 2), # Don't know what this is
 ('UNREAL ENGINE', 2), # Unity competitor, used for game development
 ('COFFEESCRIPT', 2), # I think it is a dialect of JS, but I'm not sure
 ('LUA', 2), # I think this is what redis is written in, but I'm not sure how to descbribe what it is
 ('MACOS', 2), # I haven't used MacOS in a long time. I'm tempted to try M1, but I also want to buid a new PC...
 ('NEO4J', 2), # A graph database, I'm not sure what a typical use case is for this
 ('INFORMATION SECURITY', 2), # Unknown unknowns
 ('REINFORCEMENT LEARNING (RL)', 2), # Not sure what this refers to specifically
 ('DEVICE DRIVERS', 2), # Probably involves writing kernel modules
 ('EMBEDDED LINUX', 2), # Not sure if Raspberry Pi is an example of this or not
 ('ELASTIC STACK (ELK)', 1), # Useful for viewing log data (Elastic, Logstash and Kibana), haven't used it
 ('IIS', 1), # I don't know
 ('ORACLE', 1), # A big software company and a proprietary database (I think Django supports it)
 ('F#', 1), # A programming language that I don't know anything about
 ('SQLITE', 1), # A light-weight SQL-compatible file-based database
 ('HASKELL', 1), # A functional programming language that I don't know
 ('SCHEME', 1), # I'm not sure, it may be something related to LISP
 ('MS SQL', 1), # Never used this
 ('MARIADB', 1), # An open source SQL database
 ('MAVEN', 1), # I think it is a Java Framework
 ('SEARCH', 1), # I don't know what this refers to
 ('OCAML', 1), # I think I once read that high-frequency traders like to use this language, but I'm not sure why
 ('JULIA', 1), # A programming language used for math and statistics
 ('GPU PROGRAMMING', 1), # I haven't done this before, probably uses C++
 ('HACK', 1), # FB's version of PHP
 ('XAMARIN', 1), # I dont't know what this is
 ('CORDOVA', 1), # I think it is a tool for generating native apps from JS
 ('SAS', 1), # I don't know what this is
 ('ASSEMBLY', 1), # Low level language that gives instructions to CPU
 ('XML', 1), # A data format, I use it for this site's sitemap and RSS feed
 ('MEMCACHED', 1), # Used for caching. I haven't used it; I typically use redis where this might be an option
 ('LESS', 1), # I think is is related to CSS?
 ('AMAZON ECHO', 1) # I once built an open source Echo on a raspberry pi
]
```

### What are these companies working on?

Here's a wordcloud made from the short company descriptions:

![png](/static/company_desc_wc.png)


```py
import json
import random

from collections import Counter
from os import path

import matplotlib.pyplot as plt
import numpy as np

from PIL import Image
from wordcloud import WordCloud, STOPWORDS

HTML_FILE = "waas_data.json"
with open(HTML_FILE, 'r') as j:
     company_list = json.loads(j.read())

company_names = [company.get("company_name", " ").lower() for company in company_list]
company_description_list = [company.get("company_desc", " ").lower().replace(".", "") for company in company_list]
company_descriptions = " ".join(company_description_list)

wc = WordCloud(background_color="white", width=1920, height=1080, max_words=500, stopwords=STOPWORDS, margin=10,
               random_state=1).generate(company_descriptions)

default_colors = wc.to_array()

plt.figure(figsize=(40, 40))
plt.imshow(wc, interpolation="bilinear")

plt.axis("off")
plt.savefig('company_description_wc.png')
plt.show()
```

### Salary, Equity and Years of Experience

Here's a scatterplot showing salary, equity and years of experience. Each data point links to a job posting on [workatastartup.com](https://workatastartup.com).


<client-only>
<salary-equity-scatter />
</client-only>

### Logos

Here's a look at about 600 of the 750 logos that were made available in the list of companies. The logos are sorted by their average hex color, which puts them on a gradient of dark to light:

![png](/static/yc.png)

```py
import os
import PIL
from PIL import Image
from IPython.display import display, Image as IPyImage
import matplotlib.pyplot as plt
import matplotlib.image as mpimg
%matplotlib inline

LOGO_DIR = 'data/waas_full_details_dump_files/'
yc_logos = [LOGO_DIR + x for x in os.listdir(LOGO_DIR) if x.endswith('.png')]

def average_img_hex(img):
    """
    https://www.hackzine.org/getting-average-image-color-from-python.html
    """
    img = Image.open(img)

    # leave out images not in RGB/RGBA mode
    if img.mode in ["LA", "P", "L"]:
        return

    # resize the image to 1 pixel and get the average hex value
    img2 = img.resize((1, 1))
    color = img2.getpixel((0, 0))
    average_hex = '#{:02x}{:02x}{:02x}'.format(*color)

    return average_hex

# sort images by average hex value
sorted_images = sorted(
    [(average_img_hex(img), img) for img in yc_logos if average_img_hex(img) is not None],
    key=lambda x: x[0]
)

images = sorted_images[:600]

fig, axes = plt.subplots(20, 30, figsize=(30, 15), sharex=False, sharey=False)

for img, ax in zip(images, axes.flat):
    ax.imshow(mpimg.imread(img[1]))
    ax.axis('off')

plt.savefig('yc.png')
plt.show()

```

There are a lot of logos that have a similar design to Stripe's logo. Rose/peach/pamplemousse colored logos also seem to be popular.


### Founders

Let's take a look at the founders. I came across the [deepface](https://pypi.org/project/deepface/) PyPI project an was impressed at how accurately it can classify face data.

Here's a sample of YC Founder headshots:

![png](/static/yc_founders_sample.png)

```
race_and_gender_count = defaultdict(lambda: 0)
for result in list(results):
    obj = results[result]
    gender = obj["gender"]
    race = obj["dominant_race"]
    # use (race, gender) tuple as defaultdict key and increment
    race_and_gender_count[(race, gender)] += 1

sorted(race_and_gender_count.items(), key=lambda x: x[1], reverse=True)
```

```py
[(('white', 'Man'), 771),
 (('asian', 'Man'), 217),
 (('latino hispanic', 'Man'), 134),
 (('indian', 'Man'), 117),
 (('middle eastern', 'Man'), 111),
 (('black', 'Man'), 84),
 (('white', 'Woman'), 52),
 (('asian', 'Woman'), 17),
 (('latino hispanic', 'Woman'), 13),
 (('indian', 'Woman'), 4),
 (('black', 'Woman'), 1)]
```

<client-only>
<race-gender-age-bar-chart />
</client-only>


### Founder background wordcloud

Here are two wordclouds showing founder background, education and experience for men and women founders.

![png](/static/founders_wc.png)

###

## Generating YC Startup Companies

Finally, I'll try to generate some plausible descriptions of YC companies based on the descriptions of companies scraped from WaaS. I've never done anything like this so I wasn't sure what to expect. I have read about big advancements made in text generation with GPT-3, but other than that I have no idea about where to begin.. LSTM? GAN? RL? DL?

My initial goal was to do this using a simple example that I could repeat locally using Tensorflow. Googling for `text generation with python tensorflow` led me to this tutorial: [https://www.thepythoncode.com/article/text-generation-keras-python](https://www.thepythoncode.com/article/text-generation-keras-python). I was able to run the example, but the results were not very good, at least not as good as the results used in the example of generating text from a model trained on the text of "Alice in Wonderland". This is probably because I ran 10 epochs instead of 30, but I didn't want to wait hours before getting results for each iteration.

Another Google search led me to [this article on Max Woolf's Blog](https://minimaxir.com/2019/09/howto-gpt2/) which I was able to get started with in just a few minutes. I combined the text from the 2 sections of the longer company descriptions: `description` and `technology`.

Here's my first attempt at using Google Colab. Here's the link to the Google Colab (anyone can view and comment):

[https://colab.research.google.com/drive/1u9b-FVGgUGcfifLy7bUXgoPe-pZ81rm3?usp=sharing](https://colab.research.google.com/drive/1u9b-FVGgUGcfifLy7bUXgoPe-pZ81rm3?usp=sharing)

```
WARNING:tensorflow:From /usr/local/lib/python3.6/dist-packages/gpt_2_simple/src/sample.py:17: where (from tensorflow.python.ops.array_ops) is deprecated and will be removed in a future version.
Instructions for updating:
Use tf.where in 2.0, which has the same broadcast rule as np.where
Loading checkpoint models/124M/model.ckpt
INFO:tensorflow:Restoring parameters from models/124M/model.ckpt
  0%|          | 0/1 [00:00<?, ?it/s]Loading dataset...
100%|██████████| 1/1 [00:00<00:00,  1.00it/s]
dataset has 128333 tokens
Training...
[10 | 28.79] loss=3.60 avg=3.60
[20 | 50.75] loss=3.30 avg=3.45
[30 | 73.39] loss=3.25 avg=3.38
[40 | 96.80] loss=3.18 avg=3.33
[50 | 121.40] loss=3.12 avg=3.29
[60 | 145.52] loss=3.10 avg=3.26
[70 | 169.15] loss=2.56 avg=3.16
[80 | 193.06] loss=2.46 avg=3.07
[90 | 217.28] loss=2.59 avg=3.01
[100 | 241.38] loss=2.49 avg=2.96
[110 | 265.33] loss=2.34 avg=2.90
[120 | 289.30] loss=2.52 avg=2.86
[130 | 313.46] loss=2.37 avg=2.82
[140 | 337.69] loss=2.38 avg=2.79
[150 | 361.84] loss=1.92 avg=2.73
[160 | 385.94] loss=2.25 avg=2.70
[170 | 410.01] loss=1.73 avg=2.63
[180 | 434.10] loss=1.66 avg=2.58
[190 | 458.18] loss=1.25 avg=2.50
[200 | 482.22] loss=1.47 avg=2.44
======== SAMPLE 1 ========

 to improve the usability of our Services and to provide better
 offline features through offline messaging. Our Platform
 connects users from across the country to collect data on
 non-US citizens abroad, and then gives US citizens a secure and
 authentic online presence while keeping their identities
 private. Our mission is to enable Americans to be more secure
 in online world.  We do this by putting a damper on online
 threats while preventing online attacks and slowing down the
 spread of cyberthreats. Backed by a world class Series A and B
 investments from leading technology firms, including Shas
 Ventures and Y Combinator, we\'re an organization that believes
 in doing what is right. We\'re built to last and provide an
 experience that\'s built to last.\xa0We\'ve partnered with some
 of the world\'s top law enforcement institutions including the
 Washington DC Metropolitan Detention Center, National Domestic
 Relations Task Force, Lambda Legal, Lambda Legal National Labs,
 NIMBYs Angels of San Francisco and Rally Labs provide legal
 technology & community education, as well as legal assistance/
 cure treatments. We\'re a tech firm that\'s built to last ‘lots
 of years 🙏. We\'ve solved some really really hard problems in
 the past, and haven\'t forgotten.We\'re a team of passionate
 engineers, machine learning researchers, and business
 executives from Y Combinator and Naval Institute. We\'ve just
 closed our Series B and C funding, and\'s back at it with two
 more large-scale brothels and a bona fide law firm dedicated to
 bringing brothels to the people. Join us on this next chapter
 in our journey, and help us build the next Clark County jail.
 We\'re looking for guys who can quickly learn leadership roles
 and fill in for leaders, not executives. We like to take what
 we learn and apply it to real problems. ReactJS, Node, Django,
 Postgres, and a sprinkle of AWS. ReactInfrastructure serves
 Express-like functions in the cloud. Our customers are law
 firms and other third-party service providers, largely
 comprised of tech startups. Our customers are generating
 billions of dollars in revenue through our platform every
 year.  Come join us and help us transform this dynamic into a
 platform-as-a-works. Rippling uses the following
 technologies:React Native JavaScriptFast, clean,
 nativeCSS3Deterministic executionReact NativeScriptWeb appLync,
 typescriptArchitecture-as-a-systemResponsible for maintaining
 and expanding the Ethereum and Bitcoin infrastructure. We\'re
 based in New York City, and are backed by the VC-leading
 venture firms in the space. Our flagship product, Rippling, is
 an intuitive phone-in-a-person phone banking solution that
 integrates an RFID reader and password manager, as well as
 password managers dedicated to managing assets and managing
 cards. Users can create portfolios and trade on the Rippling
 marketplace, or access the technology to create their own
 portfolios on the Bitcoin and Ethereum markets. Simply put,
 Rippling is 21+ year old inventors. We\'ve reinvented banking
 by making money available today through an open API. Banks now
 have an easy path to secure assets, including a digital wallet
 and code backed by an AllinAir’s digital asset portfolio. We
 are a small team of computer scientists building tools that
 improve customer experience, reduce wait times for businesses,
 and increase transparency in banking. Our platform runs on very
 little electricity, minimal mechanical power, and is 100x more
 robust 20 than traditional DPG/PGD systems. The system stores 1
 watt of energy and 8 watts of power per watt signal in a
 standard APS-C (Advanced Plasmon Super Capacitor Stacker).
 Cells in our cell-resistant cell-glide-based sprays secrete a
 protein that is targeted to trigger cell death, called a T
 cell. This triggered death is what causes breast cancer.
 Stacking together our diverse array of biological and chemical
 biology and chemical pathologies, and building in new energy
 efficiency technology to power our smart consumer products,
 we\'re taking our users on an exciting journey toward modern
 energy efficiency. We are a team of computer scientists located
 in Barcelona, Spain, and we are focusing on the extremely first
 and foremost research and development applications in renewable
 energy. Current RCP is the largest R&D and R&E net for the 21st
 century, automating substantial paperwork and providing
 essential modern services. With the exception of emergency
 services and work, we are unaffected by the most common types
 of CO2 emissions including man-made nitrous oxide, human-made
 CO2, and volatile organic compounds. Current RCP delivers the
 highest quality, highest efficiency possible, including
 equipment, software, waste management, and notification
 systems, all in a modern, integrated and convenient way. By
 using RCP, consumers, businesses, civil society, researchers
 and others around the world can save money on power bills,
 reduce emissions and waste, receive timely assistance from the
 energy sector and be

[210 | 517.61] loss=1.62 avg=2.40
[220 | 541.69] loss=1.45 avg=2.35
[230 | 565.82] loss=1.02 avg=2.29
[240 | 590.00] loss=1.03 avg=2.23
[250 | 614.18] loss=0.79 avg=2.16
[260 | 638.45] loss=0.93 avg=2.11
[270 | 662.46] loss=0.68 avg=2.05
[280 | 686.40] loss=0.84 avg=2.00
[290 | 710.45] loss=0.58 avg=1.94
[300 | 734.54] loss=0.25 avg=1.88
[310 | 758.60] loss=0.55 avg=1.83
[320 | 782.69] loss=0.40 avg=1.78
[330 | 806.83] loss=0.44 avg=1.73
[340 | 830.88] loss=0.20 avg=1.68
[350 | 854.86] loss=0.36 avg=1.63
[360 | 878.88] loss=0.43 avg=1.59
[370 | 902.89] loss=0.23 avg=1.55
[380 | 926.90] loss=0.21 avg=1.51
[390 | 950.92] loss=0.18 avg=1.47
[400 | 974.97] loss=0.13 avg=1.43
======== SAMPLE 1 ========

ongoing an industry-leading machine learning platform with
software, we deliver predictions over a 3D map of the scene to
predict where parts of a city will be most efficiently in the
future, that is, when driving is frictionless. Our platform
predicts where the most assets and materials will be most
needlessly stored, such as buildings, factories, cities, and
remote forested regions of space. Our prediction engines then
perform these predictions with our customers' predictions on top
of the data we collect from our customers and layer it back on
top of predicting what they actually see and do in real time on
their device(s). For example, if our predictions on where to
shop would lead to the opening of a shop within a city in both
ComfortSuite and ComfortFitSuites, and where shoppers should be
looking (i.e. Comfort, Lean, Safer, Grab) while wearing both
flip-flops on our phones. We are currently hiring bright,
self-driven professionals who are passionate about building
products that make people smile, live, and work in innovative
ways for the next 5 years. Tech Stack: Java - React - PostgreSQL
- AWSKeysize secures transactions in thousands of transactions
per day. It\'s a great tool for people who want to anonymize
their transactions and control how they spend their money.
Compared to other financial services, it\'s not. It\'s not.
It\'s not.There\'s a reason that 10% of all bank transactions
are Robin Hood-like - we know this because we've seen it called
the Santarcha error. Every time a transaction is added to a
banking transaction book, it adds a 9x shift to the book. And if
the above information is not protected by strong encryption, it
has the following consequences:- Receipts will be compromised-
Records from fraudulent activities will be compromised- Emails
from fraudulent contacts will be compromisedWe haven\'t yet been
able to get a developer to contribute their private code to our
platform, but they seem to be the most active and trusted
individuals in the world. We are actively seeking to build out a
stronger NFC-powered banking transaction experience.NFC Quest is
a payment app for next-day delivery that allows your order to be
delivered to anywhere in the world within 3 days of your
estimated time of delivery. Personalize it with your address,
phone number, cryptocurrency (e.g. Bitcoin, Ethereum, or
Canadian Gold). It can also be used for international payments,
so you get paid pretty quick if you show up late. It\'s set up
with an App (Google Drive, Outlook, Google Wallet), an iOS
wallet, and a QR code reader. Our current payment product
devices include a barcode reader that does the hard work of
retooling the data contained within, so that the physical
product is un-cracked and free of counterfeits. Furthermore, our
barcode readers can be firmly in place without breaking the
bank. We use machine learning to predict the shape and sizes of
items, and generate custom software libraries to run around the
world on the item without breaking the bank. The power of our
technology lies not in the technology itself, but in the way in
which the physical products are designed and sold. We are
currently one of the largest technology companies in the world,
with projects in France, Italy, Austria, Korea, and Switzerland.
Niantic is an American e-commerce, logistics and hospitality
company. Our mission is to democratize retailing and make it
easier to get what you need in a fast, convenient way. We make
furniture, appliances, components, and more, and are the fastest
growing U.S. company with almost no technology stack. Stable is
simplifying outdated and convoluted regulatory frameworks with
software. We solve forefficiencies by allowing retailers to
confidently answer any question they may have when shopping for
furniture, appliances, parts, and parts\'s. We do this by
leveraging software, digitizing paperwork to ensure they\'re
truly unique.The easiest way to become the actual one to whom
you\'ll give credit for products and brands you use. - Stable
founders, 4+ years experience solving for problems in different
IT verticals.Started by a simple betas of 3 college kids, we’ve
grown to own product, culture, and methodology. We believe in
the power of ideas to bring about change, and in using our
platform to empower stakeholders to be what they are rather than
who they seem. We use OCR technology to create a 3D
representation of a product or service. This allows us to
compare and significantly improve the accuracy of customer
surveys, comparing and then comparing various data sources, we
doing extensive micro-scaling of the systems we are building
against dozens of other companies out there. Currently we run
our founding team on AWS and our VCs along the way as well as
supporting Engineering, Finance, and Product lead. Funders is
built on the principles that diversity, inclusivity, economic
mobility, and non-discrimination should be built a united and
prosperous country. We

[410 | 1009.42] loss=0.15 avg=1.39
[420 | 1033.35] loss=0.19 avg=1.35
[430 | 1057.28] loss=0.10 avg=1.32
[440 | 1081.20] loss=0.10 avg=1.28
[450 | 1105.15] loss=0.12 avg=1.25
[460 | 1129.18] loss=0.11 avg=1.22
[470 | 1153.22] loss=0.13 avg=1.19
[480 | 1177.29] loss=0.10 avg=1.16
[490 | 1201.41] loss=0.11 avg=1.14
[500 | 1225.56] loss=0.13 avg=1.11
Saving checkpoint/run1/model-500
[510 | 1252.07] loss=0.10 avg=1.09
[520 | 1276.01] loss=0.11 avg=1.06
[530 | 1300.07] loss=0.10 avg=1.04
[540 | 1324.17] loss=0.10 avg=1.02
[550 | 1348.21] loss=0.08 avg=0.99
[560 | 1372.20] loss=0.12 avg=0.97
[570 | 1396.19] loss=0.13 avg=0.95
[580 | 1420.17] loss=0.07 avg=0.93
[590 | 1444.13] loss=0.07 avg=0.91
[600 | 1468.10] loss=0.12 avg=0.90
======== SAMPLE 1 ========

 and all other companies on the world stage. We\'ll continually
 improve our customer experience with new technologies and
 better understand the functions of existing ones. Magic is a
 data-driven financial services industry analytics company that
 doesn\'t discriminate, and isn\'t run by a top-down algorithm.
 We use heavy Ruby on Rails/React/React Native server-side
 programming and integrate with a robust sales team (sold-alone
 team). We are a happy, fun, fast-growing business with members
 who love fun and teamwork, and, generally, we are. Ruby on
 Rails is a modern, shared toolkit for building and selling
 teams. It spans all platforms and is covered by tools like
 Salesforce, Salesmen and Stripe. Companies like Slack,
 Slackbot, and Slackweb use Ruby on Rails every day.We believe
 that the right framework combines features many other
 frameworks have to offer. Primarily built in Rails, we also use
 React, GraphQL, PostgreSQL, and Node.js. Equipment we use●
 Workflow automation● High-performance programming● Data
 integration● Maintenance workflow● Delivery plan automation●
 Logical analysis automation● On-boarding automation● Scrum CI
 We\'re growing fast and are backed by some pretty legendary
 investors like YC, the Summit Technology leader and a veteran
 of multiple exits, including being Y Comissioned after the S19
 tech cycle (S19 batch) and having our first profitable
 full-year year out in 2020 (S20 batch).We\'re a team of driven
 people who love solving problems and building products for
 everyone. We care about great product and great culture and are
 looking for great talent in the right places at the right time.
 We\'re looking for people who love learning and using new
 technologies, pushing new paradigms and applying existing
 knowledge. BrightFuture is an early stage startup focused on
 unique technology (science, balloons, etc.) to bring a future
 where drones and other aerial vehicles no longer pose a threat
 to human life and are being replaced by low-tech flying robots
 that can see, hear, sense, and walk. We are developing a
 low-cost balloons-able airborne vehicle that can be operated
 autonomously on a portable rooftop ESC. We are taking the next
 steps in developing and testing low-cost, autonomous aerial
 vehicles for people and transportation. You will be a key part
 of this development effort. BlaBla is a blockchain powered
 travel reporting startup. BlaBla is the travel reporting
 platform that people, companies, and business applications need
 to deal with the ever-expanding collection of photos, travel
 preferences, and more. With BlaBla, more people can be
 connected and communicated with more money, and the world is
 less dependent on big business and more able to take their
 trips on demand. We are already a household name in the travel
 industry with over 12 million users and we are backed by great
 investors like Y Combinator, Dashboard Ventures, JLL and
 Headset Ventures. We just closed our Series A round and are now
 investing in the development of iOS, Android, and iOS apps.
 FounderWer is an engineer by trade and has previously built
 intelligent travel products for Nike, TripAdvisor, Virgin
 America, and many more of the largest travel agencies. Notably,
 he\'s the only engineer in the history of mankind to have built
 a highly accurate radar for an opponent such as a football
 leader. Speedrunner at heart, Wojciechiu builds innovative
 products that help athletes and teams win like no other. What
 does this actually mean? Simply put, he’s not tech savvy but
 rather, it\'s "just another term for flying a lot of fast cars
 slow". Think of this as Concorde without the bells and
 whistles. Our platform currently has three products that
 capture the interest of both the public and the companies. When
 users search for a product by using mobile devices, Wojciechiu
 takes all the options out of the equation. If this sounds like
 a lot of work to you, check out our Technical Stack, Designers
 & Pros (written in Spanish), we can help. OnePlus is a
 general-purpose chat assistant for texting and messaging. Built
 to last. Worthy of its authoring and research basis.
 LanguageExtensible is a collaborative platform for enterprise
 communication. We believe that the development of new and
 enhanced communication tools increases the productivity of
 teams, increases empathy, and increases economic efficiency.
 With one single software, we are creating the standard
 communication tool for the entire enterprise. Every
 communication tool has its place. But one of the most important
 communication tools is still incredibly rudimentary today.
 Worthy of its authoring and research basis, one of the world’s
 most innovative communication tools has been founded by PhDs
 from the University of Barcelona and Stanford. Built with
 Product experts in mind, one of the fastest-growing and diverse
 tech companies in the world, OnePlus is poised to expand its
 product line with conversational and phone tools.
 OTCErrorReporting() - Overwriting code with Redux Oomongo

[610 | 1502.22] loss=0.09 avg=0.88
[620 | 1526.13] loss=0.08 avg=0.86
[630 | 1550.07] loss=0.08 avg=0.85
[640 | 1574.05] loss=0.07 avg=0.83
[650 | 1598.05] loss=0.07 avg=0.81
[660 | 1622.05] loss=0.08 avg=0.80
[670 | 1646.08] loss=0.09 avg=0.78
[680 | 1670.10] loss=0.08 avg=0.77
[690 | 1694.11] loss=0.09 avg=0.76
[700 | 1718.11] loss=0.07 avg=0.74
[710 | 1742.12] loss=0.08 avg=0.73
[720 | 1766.13] loss=0.06 avg=0.72
[730 | 1790.16] loss=0.08 avg=0.70
[740 | 1814.24] loss=0.07 avg=0.69
[750 | 1838.31] loss=0.07 avg=0.68
[760 | 1862.39] loss=0.08 avg=0.67
[770 | 1886.42] loss=0.07 avg=0.66
[780 | 1910.44] loss=0.06 avg=0.65
[790 | 1934.46] loss=0.07 avg=0.64
[800 | 1958.46] loss=0.08 avg=0.63
======== SAMPLE 1 ========

. It is not uncommon for salespeople in large companies to be
asked to use the phone at all times to process payroll.
Salespeople spend 15-20% of their time using their cell phone to
communicate with their sales team. By using this space, they can
shed tenuous ties to their sales team and build closer personal
and professional ties that allow them to take ownership of their
own work, achieve better lengths of work, and achieve more
happiness.Salespeople spend most of their time designing,
building, and operating products for the sales channel. These
spaces create an environment where people can feel most
important what worked and what didn\'t work, and where they can
confidently and methodically move at a high velocity.The best
entrepreneurs focus on building products and processes that will
help them in their sales career, and the space for passionate
developers grows each day. The more code, the more effective the
product journey. - EricViviu aka Initialized by Docker - R&D the
future of continuous integration - R&D the future of continuous
integrationContinuous integration is more team fun! We\'re
building tools to automate work teams of all sizes and levels,
to help them land meaningful leads, and to accelerate the
journey back to profitability. We\'re focused on automating work
teams of all sizes and amounts, to help them land meaningful
leads, and to accelerate the journey back to profitability.
Tenderdome is a fast-growing startup changing the face of
hospitality. We are a team of passionate engineers and
entrepreneurs looking to grow and evolve as a business. We\'re
building Tenderdome into a great place to work. Come join us.
Rails / React / Typescript / Golang / Postgresql\nPostgres is a
fast-growing startup. We\'re having problems scaling -- we do --
and making good progress on everything.We\'re a fast-growing
company - we write software that gets adopted by the next
billion-user user world. And PagerDish is a team of engineers
and product engineers working on a different story. They share
ideas, experiments and info together. Pairfold means connecting
billions of users with every aspect of its e-commerce strategy.
The company is working on integrations with police departments
across the country and is working on tools to make buying a lot
of easier.This is a unique opportunity to join an early-stage
startup with significant space and opportunity. We are bringing
technology to the massive consumer electronics market. Twisted
Software is a fast-growing Y Combinator–backed startup that
helps companies such as Walmart, Carrier, Tesla, Moda, Sendman,
Bank of America, West Coast Fed, 4BI, and Carrier. We enable
sellers and bidders to prosper. We sell weed. We make weed
sense. We work with high-growth teams. We build products that
have been through the wringer multiple times before. Together,
we can usher in the entirely new use cases of cannabis we are
about to create.TWE is currently building a systems &
infrastructure that underpins our entire cannabis enterprise.
This includes a premier platform for ingesting and managing
high-traffic cannabis, a premier platform for ingesting and
managing cannabis-laced beverages, and a premier platform for
ingesting and managing cannabis-focused video. We\'re currently
building a systems & infrastructure that underpins our entire
cannabis enterprise. This includes a premier platform for
ingesting and managing cannabis, a premier platform for
ingesting and managing cannabis-laced content, a premier
platform for ingesting and managing cannabis-focused content and
a premier platform for ingesting and managing cannabis-fuelled
media content. We\'re currently building a solid relationships
with media partners which to include in our cannabis portfolio.
TOC is a great place to start if you love helping people build
their own cannabis products, and want to build a portfolio of
tools and services you can use to help other cannabis consumers
grow their own. Our mission is to help cannabis consumers from
driving millions of dollars in revenue to getting their next
product on the market. We push the boundaries of what is
possible for alcohol and tobacco companies, are not immune to
technological advances, and are constantly figuring out the best
ways to use our knowledge of their users and creations to best
benefit our burgeoning business. TOC is a great place to start
if you love helping people build their own cannabis products,
and want to build a portfolio of tools and services you can use
to help people grow their own. We’re a small team that’s looking
for like-minded individuals to join us on the mission to drive
the singular goal of cannabis prohibition to the forefront of
popular culture and commerce. Our founders are former executives
at viral video companies (and today’s most famous brands), and
they’re building a viral product that’s sure to get a lot of
fanfare. Our founders are technologists and engineers who spent
years building and developing complex computer vision algorithms
at the highest levels. Our product is a series of virtual masks
that are paired with a hairbrush to give

[810 | 1992.49] loss=0.06 avg=0.62
[820 | 2016.42] loss=0.07 avg=0.61
[830 | 2040.33] loss=0.06 avg=0.60
[840 | 2064.23] loss=0.08 avg=0.59
[850 | 2088.14] loss=0.08 avg=0.58
[860 | 2112.11] loss=0.07 avg=0.57
[870 | 2136.10] loss=0.08 avg=0.56
[880 | 2160.09] loss=0.07 avg=0.55
[890 | 2184.11] loss=0.06 avg=0.55
[900 | 2208.20] loss=0.07 avg=0.54
[910 | 2232.22] loss=0.07 avg=0.53
[920 | 2256.32] loss=0.07 avg=0.52
[930 | 2280.45] loss=0.06 avg=0.51
[940 | 2304.54] loss=0.06 avg=0.51
[950 | 2328.55] loss=0.05 avg=0.50
[960 | 2352.51] loss=0.06 avg=0.49
[970 | 2376.45] loss=0.07 avg=0.49
[980 | 2400.37] loss=0.06 avg=0.48
[990 | 2424.23] loss=0.07 avg=0.47
[1000 | 2448.17] loss=0.07 avg=0.47
Saving checkpoint/run1/model-1000
WARNING:tensorflow:From /tensorflow-1.15.2/python3.6/tensorflow_core/python/training/saver.py:963: remove_checkpoint (from tensorflow.python.training.checkpoint_management) is deprecated and will be removed in a future version.
Instructions for updating:
Use standard file APIs to delete files with this prefix.
```

Here's a sample generated using the trained model:

> We are a small team of MIT-trained researchers and entrepreneurs based in Palo Alto, California. We're creating a new form of transportation for people and gear. Based in the heart of downtown LA, our downtown L.A. location will be the last remaining obstacle preventing people from making, selling, and visiting the Smithsonian. We\'re building a disruptive technology that impacts the way people interact in the world in a positive way. Token Transit is digitizing much of the way we travel for real. We are building it to work for everyone, digitizing billions of things we buy and sell every day. Our platform connects real users and non-users in a global network. Our first product, UNITY, made it from scratch and is in mixed state. We are helping to develop the first truly international distributed logistics network powered by an AI and a IoT. Our mission is to revolutionize how companies move containers, trucks, and other loads across borders. Our technology is being architected and being implemented by experts across the globe. Our annual revenue:$150M/year. How we work We are a small, fast growing company with a core team based in San Francisco, CA.  Our software is being used by thousands of customers worldwide. We are building our technology platform in two key areas: (1) automated supply chain forecasting for companies and (2) internal analysis of company data to help leaders analyze and improve production. Our YearEnd blog is currently looking for Senior Electricians & Candidates. If you\'re excited about this exciting challenge, please apply. Burrow is a daily driver app for mobile that works on any device. With Burrow, your driver is on your phone to show your friends where you are going, which destinations you are on, and more. You can also add your phone to a list and get in-depth insights into the driving itself. We love to tie in-stream data, visualised by React Native, to the driving experience. We also take a data-driven approach to managing our customer list, managing our teams and our operations framework. Our API serves a large amount of native API functions, and using Cockroach to access these functions through microservices allowed us to interface with the relevant services (e.g. DynamoDB, Picnic and our own API). We also inserted a lot of debugging and monitoring functionality into the ecosystem. Our API serves a large amount of data - including relational and non-relational data - about where you are and what you\'ve wanted to do the longest, what you\'ve got, and where you are now. We also manage a lot of the operations of the platform and provide some of the data integrations with your existing relational and non-relational data. Technologies we use NodeJS, React, Apollo, Postgres, Heroku, Docker, and Tensorflow: Fluttertable, Datapoint, Pandas, Keras, Numpy, Scipy, Scikit, SciPy, scikit-learn AI-ron at MERN Automation is a Google-backed NARability company that is committed to being the leading platform for accurately measuring and diagnosing agricultural production. We have built proprietary software and software automation systems to make it easy for any government to track agricultural production and prices. Our primary technologies today are:Tables, Entry Points into Global Food Production, Pipeline and Grain Market, and GenomicData.utility.Upstream is revolutionizing how U.S. agriculture is produced and sold. We are serving the agronomists, farmers, market researchers, and data scientists in the USA. WWrendy is on a mission to enable breakthrough scientific research in agricultural technology. We are growing cassava in our bioreactors, improving crop health and producing more durables than we need to feed ourselves. We use machine learning to identify cancer-causing microbes in seeds and in consumer durables to make food more accessible and more sustainable. We are building an entirely new technical infrastructure for agricultural diagnostics: tractors, biores, and tractors-all with a singular goal of improving yields and feed the world. We have humble beginnings as a grocery delivery service and have since grown to serve millions of people every year. We are a tight-knit team of MIT-trained researchers, technologists, and businesspeople, who have built an industry-leading technology platform that uses sensors and software to analyze crop production data to create intelligent and efficient food products. Our mission is to help all farmers have a more sustainable crop, by using microbial discoveries to improve the health and prosperity of their communities. We're a well-funded, well-funded, yuletide startup. We're looking to grow and affordably upgrade our tech stack every year. We use less expensive tools and techniques to analyze and build comprehensive datasets on crop production and food safety to help farmers grow more food and avoid over-production. Rails / React / AWS We build, manage, and cybersecurity insurance through an on-premise platform. We


### Learning Resources

Here's a link to Max Woolf's blog which has a lot of helpful resources on using GPT-2. Max is the author of `gpt-2-simple` which is the Python package used in the Google Colab (Max is the author of that Google Colab as well):

[https://minimaxir.com/](https://minimaxir.com/)

Here are some resources for learning more about text generation. I came across Jay Alammar's blog which has a lot of great visualizations:

[https://jalammar.github.io/](https://jalammar.github.io/)

Jay also has a great YouTube channel:

<iframe width="100%" height="400" src="https://www.youtube.com/embed/MQnJZuBGmSQ" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>
