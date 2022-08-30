# Systems Encyclopedia

This Systems Encyclopedia is a project to curate the best foundational systems knowledge in a simple, sharable resource to help deepen the understanding of systems concepts.

## Systems Encyclopedia Articles

<ul>
{%- for post in collections.article | reverse -%}
  {%- if post.data.date -%}
  <li>
    {{ post.data.date.toLocaleString('en-US', {timeZone: "UTC", month: "long", day: "numeric", "year": "numeric"}) }}:
    <a href="{{post.url}}">{{ post.data.title }}</a>
  </li>
  {%- endif -%}
{%- endfor -%}
</ul>


