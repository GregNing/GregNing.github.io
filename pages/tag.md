---
layout: page
title: Tag
---

{% capture temptags %}
  {% for tag in site.tags %}
    {{ tag[1].size | plus: 1000 }}#{{ tag[0] }}#{{ tag[1].size }}
  {% endfor %}
{% endcapture %}

<ul class="tag-search">
{% assign sortedtemptags = temptags | split:' ' | sort | reverse %}
{% for temptag in sortedtemptags %}
  {% assign tagitems = temptag | split: '#' %}
  {% capture tagname %}{{ tagitems[1] }}{% endcapture %}
  <li>
      <a href="/tag/{{ tagname }}">
        {{ tagname }} ({{ tagitems[2] }})
      </a>
  </li>
{% endfor %}
</ul>
