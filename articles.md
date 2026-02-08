---
layout: default
title: articles
permalink: /articles/
---

<section>
    <h2><span class="cmd">></span> ./list_research.sh --type=articles</h2>
    <p class="subtitle">// Buscando projetos e artigos técnicos...</p>
    <br>
    <div class="writeups-list" id="content-list">
        {% for article in site.articles %}
        <div class="writeup-entry" data-title="{{ article.title | lowercase }}" data-tags="{{ article.tags | join: ' ' | lowercase }}">
            <span class="date">[{{ article.date | date: "%Y-%m-%d" }}]</span>
            <a href="{{ article.url | relative_url }}" class="writeup-link">
                {{ article.title }}
            </a>
            <p class="summary">{{ article.summary | truncate: 120 }}</p>
            <p class="summary">Tags: {{ article.tags | lowercase }}</p>
        </div>
        {% endfor %}
    </div>
</section>
