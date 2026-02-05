---
layout: default
title: writeups
permalink: /writeups/
---

<section>
    <h2><span class="cmd">></span> ./list_writeups.sh --all</h2>
    <p class="subtitle">Mostrando registros de incidentes arquivados...</p>
    <br>
    <div class="writeups-list" id="content-list">
        {% for writeup in site.posts %}
        <div class="writeup-entry" data-title="{{ writeup.title | lowercase }}" data-tags="{{ writeup.tags | join: ' ' | lowercase }}">
            <span class="date">[{{ writeup.date | date: "%Y-%m-%d" }}]</span>
            <a href="{{ writeup.url | relative_url }}" class="writeup-link">
                {{ writeup.title }}
            </a>
            <p class="summary">{{ writeup.summary | truncate: 120 }}</p>
            <p class="summary">Tags: {{ writeup.tags | lowercase }}</p>
        </div>
        {% endfor %}
    </div>
</section>