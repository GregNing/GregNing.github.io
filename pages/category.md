---
layout: page
title: Topics
description: 以主題瀏覽筆記；標籤則保留更細的技術關聯。
---

<div class="category-directory">
  {% assign sorted_categories = site.categories | sort %}
  {% for category in sorted_categories %}
    <article class="category-card">
      <div class="category-card__top"><span>TOPIC / {{ forloop.index | prepend: '0' }}</span><strong>{{ category[1].size }} notes</strong></div>
      <h2>{{ category[0] }}</h2>
      <ul>
        {% for post in category[1] limit:3 %}
          <li><a class="pjaxlink" href="{{ post.url | relative_url }}">{{ post.title }} <span aria-hidden="true">↗</span></a></li>
        {% endfor %}
      </ul>
    </article>
  {% endfor %}
</div>
