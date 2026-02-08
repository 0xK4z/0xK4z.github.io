---
layout: default
title: articles
permalink: /articles/
pagination: 
  enabled: true
  collection: articles
  per_page: 5
---

<section>
    <h2><span class="cmd">></span> ./list_research.sh --type=articles</h2>
    <p class="subtitle glitch">// Buscando projetos e artigos técnicos...</p>
    <br>
    {% include post-content.html %}

    {% include pagination.html %}
</section>
