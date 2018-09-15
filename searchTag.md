---
layout: page
title: Search Tag
---

<ul class="tag-search">
{% assign sorted_tags = (site.tags | sort: 0) %}
{% for tag in sorted_tags %}
  <li>
    <a href="/tags/{{ tag[0] }}">
      {{ tag | first }} ({{ tag | last | size }})
    </a>
  </li>
{% endfor %}
</ul>