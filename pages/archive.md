---
layout: default
title: archive
---

<div class="archives">
  <h1>Post</h1>
  {% for post in site.posts  %}
    {% capture this_year %}{{ post.date | date: "%Y" }}{% endcapture %}
    {% capture this_month %}{{ post.date | date: "%m" }}{% endcapture %}
    {% capture next_year %}{{ post.next.date | date: "%Y" }}{% endcapture %}
    {% capture next_month %}{{ post.next.date | date: "%m" }}{% endcapture %}
    {% capture previous_year %}{{ post.previous.date | date: "%Y" }}{% endcapture %}
    {% capture previous_month %}{{ post.previous.date | date: "%m" }}{% endcapture %}

    {% if forloop.first %}
      <div class="article">
        <h3 id="{{this_year}}-{{this_month}}">{{ post.date | date: "%B %Y" }}</h3>
      </div>
      <ul class="archive-list">
	    {% endif %}
	      <li class="archive">
	        <a class="pjaxlink"  href="{{ post.url }}">
            <span class="archive-date">
              <time datetime="{{ post.date | date:'%Y-%m-%d' }}" itemprop="datePublished">
                {{ post.date | date: "%Y-%m-%d" }}
              </time>
            </span>
            {{ post.title }}
            </a>
	      </li>

	  {% if forloop.last %}
      </ul>
	  {% else %}
	    {% if this_year != previous_year %}
        </ul>
          <h3 id="{{previous_year}}-{{previous_month}}">{{ post.previous.date | date: "%B %Y" }}</h3>
        <ul>
      {% else %}
          {% if this_month != previous_month %}
            </ul>
              <h3 id="{{previous_year}}-{{previous_month}}">{{ post.previous.date | date: "%B %Y" }}</h3>
            <ul>
	        {% endif %}
	    {% endif %}
	  {% endif %}
	{% endfor %}
</div>