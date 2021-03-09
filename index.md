---
layout: home
---

<ul>
{% for post in site.posts %}
  <li>
    <a href="{{ post.url }}">{{ post.title }}</a>
  </li>
{% endfor %}
</ul>

<section>
{% for post in site.posts %}
  <div class="post_excerpt">
    <article>
      <h2 itemprop="headline">
        <a href="{{ post.url | relative_url }}" rel="permalink">{{ post.title }}</a>
      </h2>
      <p class="excerpt" itemprop="description"><em>{% if post.excerpt %}
        {{ post.excerpt | markdownify | strip_html }}
      {% else %}
        {{ post.content | markdownify | strip_html | truncate: 160 }}     
      {% endif %}</em></p>
    </article>
  </div>
{% endfor %}
</section>
