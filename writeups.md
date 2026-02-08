---
layout: default
title: writeups
permalink: /writeups/
---

<section>
    <h2><span class="cmd">></span> ./list_writeups.sh --all</h2>
    <p class="subtitle glitch">// Mostrando registros de incidentes arquivados...</p>
    <br>
    <div class="writeups-list" id="content-list">
        {% for writeup in site.writeups %}
        <div class="writeup-entry" data-title="{{ writeup.title | lowercase }}" data-tags="{{ writeup.tags | join: ' ' | lowercase }}">
            <span class="date">[{{ writeup.date | date: "%Y-%m-%d" }}]</span>
            <a href="{{ writeup.url | relative_url }}" class="writeup-link">
                {{ writeup.title }}
            </a>
            <p class="summary">{{ writeup.summary | truncate: 120 }}</p>
            {% if writeup.tags %}
            <div class="post-tags">
                {% for tag in writeup.tags %}
                    <p class="summary tag-badge">{{ tag }}</p>
                {% endfor %}
            </div>
            {% endif %}
            </div>
        {% endfor %}
    </div>
</section>