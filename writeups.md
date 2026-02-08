---
layout: default
title: writeups
permalink: /writeups/
pagination: 
  enabled: true
  collection: writeups
  per_page: 5
---

<section>
    <h2><span class="cmd">></span> ./list_writeups.sh --all</h2>
    <p class="subtitle glitch">// Mostrando registros de incidentes arquivados...</p>
    <br>
    {% include post-content.html %}

    {% include pagination.html %}
</section>