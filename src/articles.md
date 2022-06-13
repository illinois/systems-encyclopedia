---
---

<ul>
{%- for post in collections.article -%}

<li><a href="{{post.url}}">{{ post.data.title }}</a></li>
{%- endfor -%}
</ul>
