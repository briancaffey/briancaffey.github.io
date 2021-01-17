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

I'll try to briefly describe what I know about each of these if I know what it means (without Googling!):

```py

[
# I used to be afraid of Javascript, now I'm less afraid of it.
# Using Vue and Nuxt has helped me to get better with JS.
 ('JAVASCRIPT', 330),
# I made an effor to learn React early on, but I have stayed away from it recently
# I'm familiar with some of the recent developments, hooks, context, and a I can list
# lots of buzzwords in the react world that are meaningless to me
 ('REACT', 323),
# I'm a big Python fan, it was the first language I touched, happy to see it near the top!
 ('PYTHON', 312),
# I like AWS a lot. I have really been enjoying using CDK. Infrastructure _is_ code
 ('AMAZON WEB SERVICES (AWS)', 200),
# I would to do more with node this year. I generally use Python for web apps
 ('NODE.JS', 195),
# <3 postgres!
 ('POSTGRESQL', 132),
# this is another goal of mine for 2021, it seems like an inevitability
 ('TYPESCRIPT', 114),
# I have never used Java
 ('JAVA', 79),
# I don't write my own SQL queries; I view SQL through the lense of an ORM
 ('SQL', 74),
# I haven't used RoR
 ('RUBY ON RAILS', 72),
# I like CSS Frameworks. Recently I'm into Tailwind and Material UI. This site uses Tailwind
 ('CSS', 71),
# Yes
 ('HTML', 71),
# I am a big container fan! It is my preferred way to run software, locally or in the cloud
 ('DOCKER', 66),
# I read the Manning book on Kubernetes and have used Minikbue a lot and GKE here and there
# I prefer ECS or Swarm, but that will probably change soon
 ('KUBERNETES', 58),
# I haven't ever used Go, but it doesn't look too bad coming from Python
 ('GO', 58),
# No
 ('REACT NATIVE', 58),
# Also no, but I have a book on it
 ('C++', 55),
# I tried GraphQL and built a HN clone in Django. I still prefer DRF, but I can appreciate how
# nice it must be to use GQL as a frontend developer
 ('GRAPHQL', 48),
# I tend to use AWS more
 ('GOOGLE CLOUD', 46),
# No
 ('RUBY', 44),
# Django is my first choice for building web apps. I love the admin, ORM and DRF
 ('DJANGO', 44),
# I dabble
 ('MACHINE LEARNING', 44),
# I try to use the postgres JSONField for storing NoSQL data
 ('MONGODB', 43),
# I tend to develop on Linux or Windows using Linux on WSL 2. I have an iPhone, but haven't used a Mac in a long time
 ('IOS', 38),
# I tend to use Postgres, I don't think I've ever used this
 ('MYSQL', 36),
# Not something I haven worked with
 ('ANDROID', 35),
# I do this
 ('DATA ANALYTICS', 32),
# I'm very slowly trying to learn advanced git features. I have many abandoned rebase-practice repos
 ('GIT', 30),
# I tried it once for about an hour, I know that people love to hate it, I'm just not sure why
 ('ANGULAR', 29),
# This is apparently a very popular language and has use cases outside of mobile development, but I've never used it
 ('SWIFT', 29),
# I spend lot of time using Linux machines, mostly Ubuntu.
 ('LINUX', 28),
# I like using diagrams.net to draw application infrastructure
 ('SOFTWARE ARCHITECTURE', 24),
# I think this is a framework for Java/Android?
 ('KOTLIN', 23),
# Google's ML Library. I have played around with some of their sample notebooks
# I may use it later in this article
 ('TENSORFLOW', 22),
# Using AWS, I guess I have technically designed distributed systems but I wouldn't call it one of my Skills
 ('DISTRIBUTED SYSTEMS', 22),
# I almost learned it to support a WordPress site but opted to use JAMStack instead
 ('PHP', 22),
# I have used Google BigQuery before which I think counts for this skill
 ('DATA WAREHOUSING', 22),
# I have never built anything using DL
 ('DEEP LEARNING', 20),
# To me this means writing Django models, or thinking about how to structure an API/json data, etc.
 ('DATA MODELING', 20),
# I used it once briefly with Unity
 ('C#', 19),
# I'm familiar with it but mostyl prefer Django's batteries included philosophy
 ('FLASK', 19),
# In learning about Linux I have read a bit of C, but never written any
 ('C', 19),
# Redis is cool, I use it for caching, as an task queue broker and I
 ('REDIS', 18),
 ('MICROSERVICES', 18),
 ('COMPUTER VISION', 17),
 ('EXPRESS', 15),
 ('BASH/SHELL', 13),
 ('OBJECTIVE-C', 13),
 ('FIREBASE', 12),
 ('SCALA', 11),
 ('SOFTWARE SECURITY', 11),
 ('UNITY', 11),
 ('R', 11),
 ('KAFKA', 10),
 ('SPARK', 10),
 ('ELASTICSEARCH', 10),
 ('ETL', 10),
 ('NATURAL LANGUAGE PROCESSING', 10),
 ('HEROKU', 10),
 ('NGINX', 9),
 ('JENKINS', 9),
 ('RUST', 9),
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
 ('UNIX', 4),
 ('SPRING FRAMEWORK', 4),
 ('CUDA', 4),
 ('DART', 4),
 ('ERLANG', 4),
 ('RABBITMQ', 4),
 ('KERAS', 4),
 ('SCSS', 4),
 ('ML', 4),
 ('MATLAB', 4),
 ('SPRING', 4),
 ('CASSANDRA', 4),
 ('HIVE', 3),
 ('PUPPET', 3),
 ('REDSHIFT', 3),
 ('SQL SERVER', 3),
 ('GROOVY', 3),
 ('VERILOG', 3),
 ('TORCH/PYTORCH', 3),
 ('CLOJURE', 3),
 ('MICROSOFT AZURE', 3),
 ('HBASE', 2),
 ('RDS/AURORA', 2),
 ('FIRMWARE', 2),
 ('ABAP', 2),
 ('ARDUINO', 2),
 ('MICROCONTROLLERS', 2),
 ('SOLIDITY', 2),
 ('UNREAL ENGINE', 2),
 ('COFFEESCRIPT', 2),
 ('LUA', 2),
 ('MACOS', 2),
 ('NEO4J', 2),
 ('INFORMATION SECURITY', 2),
 ('REINFORCEMENT LEARNING (RL)', 2),
 ('DEVICE DRIVERS', 2),
 ('EMBEDDED LINUX', 2),
 ('ELASTIC STACK (ELK)', 1),
 ('IIS', 1),
 ('ORACLE', 1),
 ('F#', 1),
 ('SQLITE', 1),
 ('HASKELL', 1),
 ('SCHEME', 1),
 ('MS SQL', 1),
 ('MARIADB', 1),
 ('MAVEN', 1),
 ('SEARCH', 1),
 ('OCAML', 1),
 ('JULIA', 1),
 ('GPU PROGRAMMING', 1),
 ('HACK', 1),
 ('XAMARIN', 1),
 ('CORDOVA', 1),
 ('SAS', 1),
 ('ASSEMBLY', 1),
 ('XML', 1),
 ('MEMCACHED', 1),
 ('LESS', 1),
 ('AMAZON ECHO', 1)]
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

wc.to_file("company_desc_wc.png")
plt.axis("off")
plt.savefig('company_description_wc.png')
plt.show()
```

### Salary, Equity and Years of Experience

Here's a scatterplot chart showing salary, equity and years of experience. Each data point links to a job posting on workforastartup.com.


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

Let's take a look at the founders. I came across the deepface PyPI project an was impressed at how accurately it can classify face data.

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

Here's another wordcloud showing founder background, education and experience.


###