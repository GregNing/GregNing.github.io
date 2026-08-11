---
layout: page
title: Archive
description: 從 2017 開始，把每一次問題與解法留下時間軸。
---

<div class="archive-timeline">
  {% assign current_year = '' %}
  {% for post in site.posts %}
    {% assign post_year = post.date | date: '%Y' %}
    {% if post_year != current_year %}
      {% unless current_year == '' %}</div></section>{% endunless %}
      <section class="archive-year" aria-labelledby="archive-{{ post_year }}">
        <header class="archive-year__header">
          <h2 id="archive-{{ post_year }}">{{ post_year }}</h2>
          <span>YEAR / {{ forloop.index }}</span>
        </header>
        <div class="archive-year__list">
      {% assign current_year = post_year %}
    {% endif %}
          <a class="archive-entry pjaxlink" href="{{ post.url | relative_url }}">
            <time datetime="{{ post.date | date: '%Y-%m-%d' }}">{{ post.date | date: '%b %d' }}</time>
            <span>{{ post.title }}</span>
            <b aria-hidden="true">↗</b>
          </a>
    {% if forloop.last %}</div></section>{% endif %}
  {% endfor %}
</div>
