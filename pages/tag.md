---
layout: page
title: Tags
description: 用標籤快速切換技術主題，找到一組可以一起閱讀的筆記。
---

<div class="tag-directory">
  <div class="directory-toolbar">
    <span class="eyebrow">{{ site.tags | size }} TAGS</span>
    <span class="directory-toolbar__hint">依文章數量排序</span>
  </div>
  <div class="tag-cloud">
    {% assign sorted_tags = site.tags | sort %}
    {% for tag in sorted_tags %}
      <a href="{{ '/tag/' | append: tag[0] | append: '/' | relative_url }}">
        <span>{{ tag[0] }}</span><b>{{ tag[1].size }}</b><i aria-hidden="true">↗</i>
      </a>
    {% endfor %}
  </div>
</div>
