---
title: Python, Vue, Chinese-LLaMA-2 and The Three-Body Problem
date: '2023-09-29'
description:
image: /img/three-body-problem/invokeai/confucius/1.png
tags:
  - three-body-problem
  - llama
  - llm
  - ai
  - chinese
  - python
  - nvidia
  - cuda
  - gpu
  - stable-diffusion
  - langchain
  - vue
  - three.js

draft: true

# external:
#   - link: https://news.ycombinator.com/item?id=34291336
#     site: hn
#   - link: https://www.reddit.com/r/aws/comments/105vo53/my_infrastructure_as_code_rosetta_stone_deploying/
#     site: reddit
#   - link: https://dev.to/briancaffey/my-infrastructure-as-code-rosetta-stone-deploying-the-same-web-application-on-aws-ecs-fargate-with-cdk-terraform-and-pulumi-oe4
#     site: dev
#   - link: https://medium.com/@briancaffey/my-infrastructure-as-code-rosetta-stone-with-cdk-terraform-and-pulumi-44fcb8233e6a
#     site: medium
#   - link: https://briancaffey.hashnode.dev/setting-up-ad-hoc-development-environments-for-django-applications-with-aws-ecs-terraform-and-github-actions
#     site: hashnode
#   - link: https://briancaffey.substack.com/p/my-infrastructure-as-code-rosetta
#     site: substack

comments: true
---

# tl;dr

This articles brings together several of my interest, both old and new:

- The Sci-Fi book series 'Three-Body Problem' by Liu Cixun
- Chinese language
- NLP techniques
- AI
- Large Language Models (LLMs)
- Stable Diffusion
- Data visualization and 3D graphics
- Mathematics
- NVIDIA / CUDA

This is an experimental linguistic and artistic adventure where I get my hands dirty with large language models and stable diffusion. I use the best performing open-source LLMs from China’s tech sector to translate and summarize the text of Chinese author Liu Cixin’s award-winning Science Fiction novel: The Three-Body Problem. The novel’s core story line is based on a classical physics problem: how do you predict the movement of celestial objects in a solar system with three stars? With the same LLM tools, I generate code for running simulations and visualizations of this physics problem to present my own solution to the three-body problem based on parallel computation. Finally, I use stable diffusion to portray the imaginitive solutions to three-body physics problem from one of the book’s main settings: an immersive virtual reality game that spans centuries of world history.

I also share some of my experiences in China as an exchange student and research manager in the energy technology sector. I wrote this article in English and  translated it into Chinese using the same large language models I used to translate the Chinese text of the sci-fi novel into English. There will be some major spoilers in the article, which I will mark with emoji for the Chinese character for secret: ㊙️

> The "㊙" emote, also known as the "Chinese Character" emote, is a symbol used in Japanese culture to indicate secrecy or confidentiality. It is derived from the Chinese character "秘" (mì), which means "secret." In online communication, it is often used to suggest that something should be kept private or not discussed openly.

## Back story

A few months ago my company announced that another round of layoffs was coming the following week. I'm on an engineering team that had already been impacted by two rounds of layoffs in the past year, and I was fully expecting to be let go this time. In an impulse-buy I ordered a book at the top of my reading list from Amazon: "The Three-Body Problem". It is a Sci-Fi trilogy written by Liu Cixin, a Chinese computer engineer who started writing the book as a series of essays that were published in China's "World of Sci-Fi" publication.

![Images of Three Body Problem Book Series](/img/three-body-problem/books.png)

I started learning Chinese in college, adding a major in Chinese Language to the mathematics major I decided on in my freshman year. I did an exchange program through my college with Fudan University at the . In 2007, living and studying Chinese in Shanghai as a 19 year old American was a really fun time. I was placed in an advanced-level course with a diverse group of students where English was not the lowest common linguistic denominator. We had a demanding cirriculum that emphasized reading, listening and speaking Chinese. Alcohol, food and partying was an effective catalyst for absorbing the Chinese language. I also took a course on Differential Equations with my college's mathematics department chair who was on sebatical at Fudan during the same time.

![3-6-9 drinking game rules](/img/three-body-problem/3-6-9.jpeg)

My favorite memory of that semester at Fudan was travelling on an epic over-night sleeper train from Shanghai to Guangxi province with a school-sponsored class trip to see Guilin. Multiple games of sam-yuk-gu (3-6-9) ran in parallel across the matrix of 3-by-2 sleeper car bunk beds like workloads distributed across multiple GPU cores. The rules of 3-6-9 are simple: sit in a circle counting up from 1. If your number contains a 3, 6 or 9, you clap once for each occurance of the number your hands instead of saying your number. The first person to break the rules takes a drink. Our volume level swelled to a fever pitch as the drinking games created a feedback loop that rapidly diminished our alcohol supply. Everyone passed out later in the evening as the train pushed forward through the night. The next morning we all boarded a river cruise in a daze to see Guilin's stunning limestone peaks:

![20 yuan note with Guilin rock formations](/img/three-body-problem/20_yuan_note.jpeg)

After college, my second job took me back to China where I specialized in the technologies, policies and applications of large scale battery storage systems for use in renewable energy projects. I worked for a man in Beijing who founded China's energy storage industry association after pioneering the commercialization of vinadium redox flow batteries for renewable energy projects. The job exposed me to exciting battery projects all over China, and also sharpened my technical Chinese skills as I was frequently reading, translating and intepreting in a bi-linguagl, hi-tech environment. At one of the annual industry conferences our organization hosted, I had the opportunity to be an interpreter for a conversation between American battery entrepreurs and representatives from China's State Grid. State Grid is China's state-owned power utility and was the world's 3rd largest company by revenue in 2022 behind Walmart and Amazon.

![State Grid HQ in Xi Cheng](/img/three-body-problem/invokeai/castles.png)

My first introduction to the 'Three-Body' book came from one of my very best friends from college. He lived at the inner-most leaf-node of one of Beijing's more labrythnian hutongs next to a family that raised and trained pigeons. Visiting my friend where he lived often involved exchanges with his pigeon master neighbor in the narrow alleys of their corner of the hutong. In one such exchange the neighbor quipped to me with a croaking voice: 他怕你琴！, or "he's afraid of your guitar!". The pigeons cooing at my were apparently fearful of the backpack case for my classical guitar which extended over my head by about a foot, an unwelcomed advance into their roost! This simple pleasentry became a refrain that echoed every time we joked about life in the hutong. My friend and I bonded over Chinese language, classical guitar among many other things. I strongly considered his recommendation to check out 三体 (Three Body), the Chinese Sci-Fi novel about alien life in a solar system with three stars as he described it, but with already lots going on in Beijing I never had the chance to check out the book.

<iframe width="100%" height="315" src="https://www.youtube.com/embed/5lj99Uz1d50?si=TwrypbY4vTfeWGRf" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

Almost 10 years later I came across across a preview for the Netflix production of "3 Body Problem" scheduled to come out in early 2024. With the possibility of loosing my job weighing heavily on me, I picked up the books on Amazon on an impulse buy hoping to have something to do if I was layed off this time. I read the first book in about 2 weeks, mostly using my Kindle. Looking up words and translating entire selections with the kindle is quick and easy, but it is a little bit distracting.

Even though these look ups are simple, it can still be a distraction to have to do lots of look ups for certain chapters or passages that were hard to follow without doing so. I got the idea to build a simple online reader with built-in translation of each word. I scraped the Chinese text of the book from an online 山寨版 (a term from Shen Zhen--the heart of China's electronics industry--which referes to an unofficial version of something, a copy-cat or knock-off). This online version of the book contains some simple watermarks that I was able to remove, and I noticed that some words are rarely replaced with incorrect synonym characters, for examlpe:

> 危险 would be written 危脸, this jumped out at me as an obvious intentional typo. The first character of the word "dangerous" 危 is the same, but in the second character, the phonetic component on the right side of the character is the same (佥), but the left side is replaced with another radical 月 （🈷️） which means moon or flesh, making the meaning of the character 脸 "face", not danger or 险.

For the most part the text from the website seemed to be a faithful reproduction of the book. I found two open source projects that could be use to parse text and translate words:

## Chinese by the numbers

Here's a primer on the Chinese language from a mathematical perspective. This will be helpful before jumping into using NLP and LLMs with Chinese text later in this article.

How many Chinese characters are there? This question isn't specific enough to have a single answer. A common rule of thumb that I have heard before says that there are over 50,000 characters in total with roughly 10,000 characters in use and about 3,000 characters frequently used in Chinese media and newspapers ([source](https://en.wikipedia.org/wiki/Chinese_language#Vocabulary)). [This answer](https://stackoverflow.com/a/1366113/6084948) from StackOverflow's legendary #1 ranked user VonC gives a good answer based on the number of Unicode characters in the CJK Unified Ideographs block: 20,992.

Here are some numbers and statistics to be better understand the text of the Three-Body Problem Chinese text:

- 188,380 total charactes in the book
- 2,859 unique characters in the book (this comes in close to the )
- 36 chapters in the book
- average of 69.78 paragraphs per chapter
- total of 2,512 paragraphs in the book
- average of 74.99 characters per paragraph

### Character Frequency

Let's look at how frequently each character in the book is used. We can also combine this with some data on the overall frequency of Chinese characters. The best measurement I found for overall character frequency is from [Middle Tennessee State University](https://lingua.mtsu.edu/chinese-computing/statistics/char/list.php?Which=MO). Here's a visualization that shows of all of unique characters in the book. The height of a column represents how frequently a character occurs, and the color represents the relatively frequency of the character in Chinese language overall.

![Character Frequency](/img/three-body-problem/char_freq.png)

<div class='wrap'>
<iframe class="p-4" src="https://briancaffey.github.io/three-body-problem/freq/" width=100% height=550></iframe>
</div>

[TODO: add character viz](#add-char-viz)

This is an example [Zipf's law](https://en.wikipedia.org/wiki/Zipf%27s_law): the frequency of something is inversely proportional to its rank:

[TODO: Add Zipf formula](#add-zipf-formula)

### Building a Chinese reader with Vue

Chinese words are typically composed of 2 or 3 characters. There are commas for separating parts of a sentence, but there are no spaces between words like there are in English. This makes parsing words or tokens a little bit harder in Chinese (we can't just split a sentence on space characters to get the individual words). To parse individual words from Chinese text we can use a python NLP package spaCy with a Chinese language pipeline. A spaCy pipeline takes a raw text string and does token splitting, part-of-speech tagging, parsing (which defines dependency labels), and name-entity-recognition.

Once we have a spaCy `Doc` object we can look up the meanings of individual characters and words using the `CC-CEDICT`, [an open-source Chinese->English dictionary](https://www.mdbg.net/chinese/dictionary?page=cedict).

I built a simple UI to parse and display the text and related "metadata" using Vue, a popular open-source javascript library. I'm a big fan of Vue and its creator and BDFL, Evan You. His chinese name is 尤雨溪 （You YuXi）. The word "You" in Chinese is pronounced "yo" as in "yo-yo", but Evan seems to have adopted the pronciation "you" as in "you and me" which in Chinese pinyin would actually be "yu". Names translated to and from Chinese and English can easily be confused, misspelled or mispronounced. For example my name is "Brian" but it is more than not misspelled as "Brain" but native Chinese speakers. I typically adopt the phonetic translation of Brian: 布莱恩 (Bu Lai En) or 小布 (Little Bu).

## LLMs, Meta's LLaMA 2 and Chinese-LLaMA-2

In recent months I have been following the development of some interesting open source AI projects. Two projects in particular are InvokeAI, an image generation tool based on stable diffusion, and [LLaMA 2](https://ai.meta.com/llama/), the next generation of Meta's open source large language model (LLM). The casing of the word `LLaMA` indicates that LLaMa 2 takes its name from the acronym LLM (Large Language Model), which is a general term for the technology that underpins the massively popular ChatGPT from OpenAI. LLMs are so hot right now. Before going deeper into LLMs we need a quick Chinese lesson.

> 草泥马 is a non-technical word that referes to animals like Llama or Alpaca. It can be directly translated as "Grass Mud Horse" it is phonetically similar to the most common Chinese profanity: 操你妈, which literally means "fuck your mother". The characters in the two words are nearly synonymous: the sounds of both words are "cao ni ma", but the tones are different, which in Chinese changes the meaning completely. In English this would be like two words spelled the same way that have emphsis placed on different syllables. The llama is basically a legendary Chinese internet meme subversive in the face of Chinese censorship. 🦙 was approved as part of Unicode 11.0 in 2018.

There's a lot more to say about the significance of the Llama in Chinese internet culture, have a look at [the Wikipedia article on **Grass Mud Horse**](https://en.wikipedia.org/wiki/Grass_Mud_Horse) if you want to go deeper. I think it is safe to assume that the naming of LLaMa has something to do with Facebook/Meta's hacker mentality and the large number of Chinese people working on AI at Meta. This mostly likely is OK with Mark Z now since [his attitude toward China has changed](https://www.voanews.com/a/silicon-valley-technology_how-facebooks-zuckerberg-went-courting-criticizing-beijing/6195455.html) in the last few years from one of courtship to one of criticism.

I requested access to Meta's LLaMa 2 models as soon as they came out and was able to get the models to run on my computer. I have an I9-13900K CPU and an NVIDIA 4090 graphics card which I was able to get a hold of in Febrauary after resellers had made these cards almost impossible to buy from major retailers. I also started lurking in a subreddit called [`r/LocalLLaMa`](https://www.reddit.com/r/LocalLLaMA/) with over fifty thousand members. The forum has a lot of helpful information about running Large Language Models on computer hardware like mine which is most commonly used play computer games. Another annoucement that caught my attention in July was the release of [Chinese LLaMa 2](https://github.com/ymcui/Chinese-LLaMA-Alpaca-2), a Large Language Model trained on Chinese and English which does very well against Chinese Language Benchmarks.

![image of Chinese LLaMa 2](/img/three-body-problem/chinese_llama_2.png)

https://github.com/haonan-li/CMMLU

One of the popular benchmarks for measuring LLM proficiency in Chinese language is the CMMCU: Chinese Massive Multitask Language Understanding.

![image of CMMLU](/img/three-body-problem/cmmlu.jpeg)

## Translation

There are two important plot developments related to language translation in the Three-Body Problem novel, both of which involve book’s main female protagonist Ye Wenjie. First, her transcribing the Chinese translation of Rachel Carson’s Silent Spring ultimately results in being sent to the Red Coast. Ye Wenjie communicates with extraterrestrial life through a universal translation technology developed by the top-secret project.

Ken Liu’s translation of the Three-Body Problem book from Chinese to English places the events during the Cultural Revolution at the beginning of the book rather than in the middle of the book. This was done in order to avoid attention of government censors.

I tried translating the Chinese text of the Three-Body Problem book using Large Language Models (LLMs). I tried a few different models: Chinese-Llama-2, Qwen-7B-Chat and Baichuan-13B-Chat. Using OpenAI's ChatGPT-4 model I was able to translate selected chapter from the book as well.

How do you get an LLM to translate text? Ultimately the quality of the translation returned by the LLM depends on the quality of the prompt used. I experimented with both chat and completion approaches and tried lots of different kinds of prompts. The models I worked with have a 4K context window (the number of tokens the model can take as input when generating responses), so for translation tasks I had the LLM work on one paragraph at a time.

It was interesting to see the failure modes of translation tasks for the different models. Most of the time the LLM was able to provided accurate translations. Some of the failure modes I observed were:

- a few Chinese characters would show up in the English translations
- a complete Chinese sentence would show up in an otherwise complete translation of a paragraph
- The LLM refused to translate certain paragraphs that included violent imagery, such as the open scenes from the Cultural Revolution

The text of this article was also translated paragraph by paragraph using LLMs. I used the following:

The books idea of universal translation made me think a lot about LLMs that are so popular today. In essence they are calculators for words. When you feed a prompt to an LLM, it first puts the prompt through a process called tokenization. Tokenization takes a string of text and breaks it down into tokens (defined by the Large Language Model you are using). The process of tokenization is similar to the tokenization done by spaCy mentioned earlier. These tokens produced by LLM tokenizations are numbers. Here's an example of tokenization in action using the Chinese-Llama-2 model:

```python
import json
import os
from llama_cpp import Llama, LlamaTokenizer

llm = Llama(
    model_path="/path/to/models/ggml-model-q4_0.bin",
    n_ctx=4096,
    n_gpu_layers=30
)

tokenizer = LlamaTokenizer(llama=llm)

TEXT="在那个已被忘却的日子里，它的世界颠覆了。泥土飞走，出现了一条又深又宽的峡谷，然后泥土又轰隆隆地飞回来，峡谷消失了，在原来峡谷的尽头出现了一座黑色的孤峰。其实，在这片广阔的疆域上，这种事常常发生，泥土飞走又飞回，峡谷出现又消失，然后是孤峰降临，好像是给每次灾变打上一个醒目的标记。褐蚁和几百个同族带着幸存的蚁后向太阳落下的方向走了一段路，建立了新的帝国。"
tokens = tokenizer.encode(TEXT)
```

```
print(str(tokens[:4]) + " ...")
```

> [1, 30505, 32380, 36812] ...

```
for token in tokens:
    text = tokenizer.decode([token])
    print(text, end=" ")
```

>  在 那个 已被 忘 却 的日子 里 ， 它的 世界 颠覆 了 。 泥 土 飞 走 ， 出现了 一条 又 深 又 宽 的 峡谷 ， 然后 泥 土 又 轰 隆 隆 地 飞 回来 ， 峡谷 消失 了 ， 在 原来 峡谷 的 尽头 出现了 一座 黑色 的 孤 峰 。 其实 ， 在这 片 广阔 的 疆 域 上 ， 这种事 常常 发生 ， 泥 土 飞 走 又 飞 回 ， 峡谷 出现 又 消失 ， 然后 是 孤 峰 降临 ， 好像是 给 每次 灾 变 打 上 一个 醒目 的 标记 。 褐 蚁 和 几百 个 同 族 带着 幸 存 的 蚁 后 向 太阳 落 下的 方向 走了 一段 路 ， 建立了 新的 帝国 。

```python
english_text = "This is an example of tokenization using a large language model."
english_tokens = tokenizer.encode(english_text)
print(str(english_tokens[:4]) + " ...")

for token in english_tokens:
    text = tokenizer.decode([token])
    print(f"'{text}'", end=" ")
```

> [1, 4013, 338, 385] ...

> '' 'This' ' is' ' an' ' example' ' of' ' token' 'ization' ' using' ' a' ' large' ' language' ' model' '.'

This is a good time to talk about some of the obvious differences between Chinese and English.

- The Chinese does not use spaces between words like English does
- Chinese words are typically formed from 2 or more characters
- Chinese does not conjugate verbs
- Words don't have singular and plural variants
- Chinese grammar is very simple and is similar to English
- Chinese characters do not have capitization like ASCII characters

After using basic NLP techniques to translate individual words, I did some basic prompt engineering to get the LLM to translate the books in the Three-Body problem paragraph by paragraph. My computer was able to translate the first book overnight in under 500 minutes. Here's the prompt I used:

```
completion_prompt = f"### Chinese:\n你好\n\n### English:\nHello\n\n### Chinese:\n${text}\n\n### English:\n"
```


My initial impression of the Chinese LLaMa 2's accuracy at translation tasks is that it is almost unbelievably good, with the occasional occurance of task failure include some of these failure modes:

- responding to a request with the same Chinese text that I asked it to translate
- translating the only the first sentence of a multi-sentence paragraph
- not translating the text at all
- Translating most of the text to English while some words are left not translated in the response: For example: 这位是红岸基地的雷志成政委 -> This is Red Bank Base's Li Zhi-cheng政委. 政委 is an abreviation of Political commissar (政治委员) In the military, a political commissar or political officer is a supervisory officer responsible for the political education and organization of the unit to which they are assigned, with the intention of ensuring political control of the military.
- responding only with "```" (this may have something to do with the prompt I used)
- Butchering names with different translations offered between paragraphs, particularly 白沐霖 which it translated as White Moxin, White Mullin, White Mow Lin. None of the varieties used the pinyin translation of the characters: Bai Mu Lin. This isn't necessarily a failure of the translation, just interesting to see this type of variation across translated paragraphs.
- Some of the dialog started with the Chinese word for subtitles (字幕：), which was not included as part of the translation, also understandable

It was nice to have the English book as a reference for qualitative analysis of the translation tasks I gave to the Chinese LLaMa 2 model. I look forward to reading the second and third books with all characters, words and paragraphs fully translated (for the most part).

Here are the results of my translation of Three-Body Problem with Chinese-Alpaca-2 7 Billion parameter model from Hugging Face with 4 bit quantization:

<iframe class="p-4" src="https://briancaffey.github.io/three-body-problem/reader/?book=three_body&chapterNumber=3" width=100% height=550></iframe>


I used `nvtop` to monitor GPU usage:

![image of nvtop](/img/three-body-problem/nvtop.png)

Here are some of the statistics from individual paragraph translations:

```
# model initialization
llama.cpp: loading model from /home/brian/github/llama.cpp/models/7B/Chinese-Alpaca-2/ggml-model-q4_0.bin
llama_model_load_internal: format     = ggjt v3 (latest)
llama_model_load_internal: n_vocab    = 55296
llama_model_load_internal: n_ctx      = 4096
llama_model_load_internal: n_embd     = 4096
llama_model_load_internal: n_mult     = 5504
llama_model_load_internal: n_head     = 32
llama_model_load_internal: n_head_kv  = 32
llama_model_load_internal: n_layer    = 32
llama_model_load_internal: n_rot      = 128
llama_model_load_internal: n_gqa      = 1
llama_model_load_internal: rnorm_eps  = 1.0e-06
llama_model_load_internal: n_ff       = 11008
llama_model_load_internal: freq_base  = 10000.0
llama_model_load_internal: freq_scale = 1
llama_model_load_internal: ftype      = 2 (mostly Q4_0)
llama_model_load_internal: model size = 7B
llama_model_load_internal: ggml ctx size =    0.08 MB
llama_model_load_internal: using CUDA for GPU acceleration
llama_model_load_internal: mem required  = 4299.79 MB (+ 2048.00 MB per state)
llama_model_load_internal: offloading 0 repeating layers to GPU
llama_model_load_internal: offloaded 0/35 layers to GPU
llama_model_load_internal: total VRAM used: 512 MB
llama_new_context_with_model: kv self size  = 2048.00 MB
AVX = 1 | AVX2 = 1 | AVX512 = 0 | AVX512_VBMI = 0 | AVX512_VNNI = 0 | FMA = 1 | NEON = 0 | ARM_FMA = 0 | F16C = 1 | FP16_VA = 0 | WASM_SIMD = 0 | BLAS = 1 | SSE3 = 1 | VSX = 0 |
```

`BLAS = 1` means that it is able to use the GPU, we also see `using CUDA for GPU acceleration`.

```
# translation task logs
llama_print_timings:        load time =   640.04 ms
llama_print_timings:      sample time =    20.00 ms /    45 runs   (    0.44 ms per token,  2249.66 tokens per second)
llama_print_timings: prompt eval time =   640.00 ms /    77 tokens (    8.31 ms per token,   120.31 tokens per second)
llama_print_timings:        eval time =  3898.99 ms /    44 runs   (   88.61 ms per token,    11.28 tokens per second)
llama_print_timings:       total time =  4631.62 ms
```

## 🤗 Hugging Face

Going over the [Hugging Face learning resources](https://huggingface.co/learn) were very useful for building foundational knowledge in LLMs and understanding the terminologly and alphabet soup.

I also learned that Hugging Face python library offers language-to-language translation via it's `pipeline` interface. This could be interesting to try, but I wasn't able to make it work with the Chinese-LLaMa-2 model.

## Retrieval Augmented Generation (RAG): Reading Comprehension for Computers

Currently there is a lot of interest in the LLM community "chatting with your documents", and it certainly something I am interested in. After taking a first-pass at translation and getting decent results, I started looking into what I later learned is refered to in the community as RAG. RAG stands for retrieval augmented generation. Here's my understanding of RAG:

- Your body of documents (the Three-Body Problem books, in my case) is first grouped into digestable chunks (called documents)
- These chunks are processed into embeddings which are stored in a vector database
    - Word embedding is an AI technique representing words and sentences in a very large vector space
    - Check out this article from Microsoft for more info: https://learn.microsoft.com/en-us/semantic-kernel/memories/embeddings#what-are-embeddings-to-a-programmer
- Your request to the LLM is first passed into a vector database and it pulls out certain documents ("chunks") that it determines are relavant to your query.
- With addional (supposedly relevant) data from your documents, the LLM responses should be better

I found out that you can do RAG using `llama-cpp-python` along with a really popular open-source python library started by Harrison Chase called LangChain.

Here's how I approached building a RAG program using Langchain:

[Link to LangChain Notebook]

With my vector database full of embeddings created from the complete text of the first book, I was ready to to starting RAGing.

I wanted to use RAG to test the LLM's reading comprehnsion with the following questions:

- ㊙️ Which methods of predicting the momevement of the sun were used in the three body game?
- What is Wang Miao's daughter's name?
- What is the Frontiers of Science?
- Who is Shi Qiang?

There book invites a lot of deep questions about our place in the universe, but I wanted to start with some factual questions to get a sense of how well RAG works. The results from my first attempts at RAG were terrible, so I'm interested in doing more tests with different parameters, different types of prompt structures and learning more from the LangChain community about how to improve RAG results. This is all still pretty new to me! But it is great to know that there is a big community of people working on enhancing LLMs with tools and frameworks like LangChain.

㊙️ While I was unable to get good results with my first pass in LangChain, here are some fun images I generated with InvokeAI. The prompt I used aims to describe one such attempt at predicting the movement of the sun in the three body game, which is a system of etiquette that can be used to understand patterns in celstial movement developed by Confucius, a player who appears in Wang Miao's experience in the Three-Body VR game.

> Prompt: Ceremonies and etiquette system related to the sun and multiple celestial++ bodies Confucius artistic style

<client-only>
<carousel :count="8" dir="confucius" />
</client-only>

> Prompt metadata:

```json
{
  "app_version": "3.0.2post1",
  "generation_mode": "txt2img",
  "positive_prompt": "Ceremonies and etiquette system related to the sun and multiple celestial++ bodies Confucius artistic style",
  "negative_prompt": "",
  "width": 768,
  "height": 768,
  "seed": 1748220044,
  "rand_device": "cpu",
  "cfg_scale": 10.5,
  "steps": 35,
  "scheduler": "euler_k",
  "clip_skip": 0,
  "model": {
    "model_name": "stable-diffusion-2-1",
    "base_model": "sd-2",
    "model_type": "main"
  },
  "controlnets": [],
  "loras": []
}
```

> array of chinese++ warriors++ on a electronics+ circuit+ board qing+ dynasty style art logic puzzle

<client-only>
<carousel :count="4" dir="computer" />
</client-only>

```
{
  "app_version": "3.0.2post1",
  "generation_mode": "txt2img",
  "positive_prompt": "array of chinese++ warriors++ on a electronics+ circuit+ board qing+ dynasty style art logic puzzle",
  "negative_prompt": "",
  "width": 768,
  "height": 768,
  "seed": 740286719,
  "rand_device": "cpu",
  "cfg_scale": 7.5,
  "steps": 50,
  "scheduler": "euler",
  "clip_skip": 0,
  "model": {
    "model_name": "stable-diffusion-2-1",
    "base_model": "sd-2",
    "model_type": "main"
  },
  "controlnets": [],
  "loras": []
}
```

Congrats to the InvokeAI team on the 3.0 release. It has been awesome to use and the current docker compose setup is a huge improvement on the 2.x version.

## n-body simulations, CUDA and CuPy

> "Other than Stable Eras, all times are Chaotic Eras"

This is one of my favorite lines from the book. It said twice by King Wen of Zhou during Wang Miao's first experience in the Three-Body game where we start to learn about the peculiarities of irregular gravity in a solar system with three suns.

NVIDIA released CUDA in 2006 back when the company's stock price was around $5, compared to its recent peak of around $450 in July 2023. If the Three-Body Problem book was written any later, it would perhaps make references to a juggernaut private enterprise that develops specialized hardware for physics simulations like the n-body problem.

The nbody problem is supposed to be unsolvable, but it can be silumated pretty easily using graphics cards. NVIDIA provides some sample code for running nbody simulations, but I wasn't able to get these samples working due to appears to be driver issues. I could write a long article about my misadventures in installing and uninstalling CUDA and NVIDIA drivers to get things working for all things related that use the GPU: stable diffusion, LLMs and CUDA programs. I have a decent understanding now of how things should be installed but I'm still slightly nervous of unintentionally breaking things in my development environment. As a DevOps engineer, Murphy's law elementary. Everything I love about containers for simplifying developer environments seems to not really apply to graphics cards and their drivers, even when you are using the `nvidia-container-toolkit`.

When my drivers were working correctly, I was in a "Stable Era" of development and both my programs and my working knowledge of GPUs evolved. Sometimes when I tried changing versions or reinstalling things or tuning parameters the wrong way, I found myself sent into a "Chaotic Era" where either my scripts and notebooks were left in cold, unrunable states due to driver issues, or I would get lost in the steps needed to prepare the model to run on with llama.cpp on the GPU: quantization and building with support for [BLAS (Basic Linear Algebra Subprograms)](https://www.netlib.org/blas/).

㊙️ Yang Dong is driven to suicide by her conclusion that physics no longer exist when her particle physics experiment yeilded inconsistent results due to intentional interference by an alien civilization. During "Chaotic Eras" of my development, the conclusion I reach that nearly drove me insane was simply that CUDA didn't exist anymore. In the end, I just needed to restart my computer. I also felt a little like Ding Yi with moving his pool table around his apartment for the expirment he demonstrates to Wang Miao.

Currently I have most things working correctly with the following configurations:

```
brian@a2:~$ nvidia-smi
+---------------------------------------------------------------------------------------+
| NVIDIA-SMI 535.86.10              Driver Version: 535.86.10    CUDA Version: 12.2     |
|-----------------------------------------+----------------------+----------------------+
| GPU  Name                 Persistence-M | Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp   Perf          Pwr:Usage/Cap |         Memory-Usage | GPU-Util  Compute M. |
|                                         |                      |               MIG M. |
|=========================================+======================+======================|
|   0  NVIDIA GeForce RTX 4090        On  | 00000000:01:00.0  On |                  Off |
|  0%   40C    P0              62W / 450W |     83MiB / 24564MiB |      0%      Default |
|                                         |                      |                  N/A |
+-----------------------------------------+----------------------+----------------------+
```

```
$ nvcc --version
nvcc: NVIDIA (R) Cuda compiler driver
Copyright (c) 2005-2021 NVIDIA Corporation
Built on Thu_Nov_18_09:45:30_PST_2021
Cuda compilation tools, release 11.5, V11.5.119
Build cuda_11.5.r11.5/compiler.30672275_0
```

I'm still not sure why `nvcc` (NVIDIA CUDA compiler) reads one version of CUDA (11.5) and `nvidia-smi` reports a higher version (12.2).

I wrote a simple program with the help of ChatGPT for running nbody problem simulations. The program uses CuPy, a Python library that exposes APIs for doing matrix multiplication to predict the position of three bodies using Euclidian Integration. Here's the script:

```py
import numpy as np
import cupy as cp
import time
import json

# Simulation parameters
NUM_PARTICLES = 3
DIMENSIONS = 3 # 3D space
NUM_STEPS = 30
DT = 0.1

# Generate initial positions and velocities
np_positions = np.random.randn(NUM_PARTICLES, DIMENSIONS)
np_velocities = np.random.randn(NUM_PARTICLES, DIMENSIONS)

cp_positions = cp.array(np_positions)
cp_velocities = cp.array(np_velocities)

np_ticks = np.expand_dims(np_positions, axis=0)
cp_ticks = cp.array(np_ticks)

# nbody simulation loop
start_time = time.time()
for step in range(NUM_STEPS):

    # this gets pairwise differences
    diff = cp_positions[:, None, :] - cp_positions[None, :, :]
    distances = cp.sqrt(cp.sum(diff**2, axis=2))

    # avoid division by zero
    epsilon = 1e-5
    inv_distances = 1.0 / cp.maximum(distances, epsilon)

    # calculate forces
    cp_forces = cp.sum((diff.T * inv_distances**3).T, axis=1)

    # update velocities and positions
    cp_velocities += DT * cp_forces
    cp_positions += DT * cp_velocities
    cp_ticks = cp.append(cp_ticks, cp.expand_dims(cp_positions, 0), 0)

sim_time = time.time() - start_time
print("Simulation time:", sim_time)


class NumpyArrayEncoder(json.JSONEncoder):
    def default(self, obj):
        if isinstance(obj, np.ndarray):
            return obj.tolist()
        return json.JSONEncoder.default(self, obj)


np_ticks = cp_ticks.get()


# this is data we can work with in python and write to a file
with open("ticks.json", "w") as f:
    f.write(json.dumps(np_ticks, cls=NumpyArrayEncoder))
```

To better understand the matrix math here I walked through a simple example of what each step does:

```py
# particle coordinates (x,y,z) in 3D space
positions = cp.array([[1,2.5,3], [4,5,6], [7,8,9]])
```

The first operation creates an array for pairwise distances for each dimension:

```python
diff = positions[None, :, :] - positions[:, None, :]
print(diff)

array([[[ 0. ,  0. ,  0. ],
        [ 3. ,  2.5,  3. ],
        [ 6. ,  5.5,  6. ]],

       [[-3. , -2.5, -3. ],
        [ 0. ,  0. ,  0. ],
        [ 3. ,  3. ,  3. ]],

       [[-6. , -5.5, -6. ],
        [-3. , -3. , -3. ],
        [ 0. ,  0. ,  0. ]]])
```

The rows of zeros correspond to a particle's `x`, `y` and `z` distances to itself, which are all zero by axioms of Euclidian vector spaces.

The next operation calculates the distance between each particle:

```
distances = cp.sqrt(cp.sum(diff**2, axis=2))
print(distances)

array([[ 0.        ,  4.9244289 , 10.11187421],
       [ 4.9244289 ,  0.        ,  5.19615242],
       [10.11187421,  5.19615242,  0.        ]])
```

The diagonal or zeros represents that fact that a particle `n` has a distance of zero to iself.

The next step calculates inverse distances:

```python
epsilon = 1e-5
inv_distances = 1.0 / cp.maximum(distances, epsilon)
```

```
array([[1.00000000e+05, 2.03069233e-01, 9.88936353e-02],
       [2.03069233e-01, 1.00000000e+05, 1.92450090e-01],
       [9.88936353e-02, 1.92450090e-01, 1.00000000e+05]])
```

The next step is the most elegant part of the simulation in my opinion:

```
cp_forces = cp.sum((diff.T * inv_distances**3).T, axis=1)
```

The `.T` operation transposes a matrix, multiplies by the cube of inverse distances, then transposes the matrix again before summing along the first axis. Transposing a matrix basically swaps rows and columns.

The next two steps are also pretty elegant:

```python
# update velocities and positions
cp_velocities += DT * cp_forces
cp_positions += DT * cp_velocities
```

In the last step I append the updated positions to an array that holds every "tick" (the positions of each particle between each time interval, `DT` - "delta time")

## Three.js

Here's another 3-Body Problem simulation that I made with Three.js:

<iframe src="https://briancaffey.github.io/three-body-problem/three/" width=100% height=350></iframe>

A simpler way to view particle physics can be acheived with Three.js:

<iframe src="https://briancaffey.github.io/three-body-problem/three/" width=100% height=350></iframe>

Three.js and WebGL and still feels like alien technologies to me. It doesn't feel like these simulations should be run so fluidly on my computer in the browser. Wang Miao's comments about hidden data in the Three-Body game resonated with me when I came across this Three.js example:

㊙️
> 《三体》正是这样，它的海量信息是隐藏在深处的，汪淼能感觉到，但说不清。他突然悟出，《三体》的不寻常在于，与其他的游戏相比，它的设计者是反其道而行之——一般游戏的设计者都是尽可能地增加显示的信息量，以产生真实感；但《三体》的设计者却是在极力压缩信息量，以隐藏某种巨大的真实，就像那张看似空旷的天空照片。

## Screen Adaptations

Dream of the Red Chamber is one of China's Four Great Classical Novels. It was written in the mid 18th century and first pulblished in 1791. It is a long saga that totals 960 thousand characters.
