---

layout: page
title: "Blog"
permalink: /blog

---
  {% assign total = 0 %}
  {% for post in site.posts %}
    {% assign total = total | plus: 1 %}
  {% endfor %}
<h1 class="page-heading">Recent Posts ({{ total }})</h1>

  <ul class="post-list">
    {% for post in site.posts %}
      <li>
        <span class="post-meta">{{ post.date | date: "%b %-d, %Y" }}</span>

        <h2>
          <a class="post-link" href="{{ post.url | prepend: site.baseurl }}">{{ post.title }}</a>
        </h2>
        {% if post.image %}<a href="{{ post.url | prepend: site.baseurl }}" ><img src="{{ post.image }}" /></a>{% endif %}
      </li>
    {% endfor %}
  </ul>
