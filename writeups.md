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
    <div class="writeups-list" id="content-list">
        {% for post in paginator.posts %}
        <div class="writeup-entry" data-title="{{ post.title | lowercase }}" data-tags="{{ post.tags | join: ' ' | lowercase }}">
            <span class="date">[{{ post.date | date: "%Y-%m-%d" }}]</span>
            <a href="{{ post.url | relative_url }}" class="writeup-link">
                {{ post.title }}
            </a>
            <p class="summary">{{ post.summary | truncate: 120 }}</p>
            {% if post.tags %}
            <div class="post-tags">
                {% for tag in post.tags %}
                    <p class="summary tag-badge">{{ tag }}</p>
                {% endfor %}
            </div>
            {% endif %}
        </div>
        {% endfor %}
    </div>

    {% if paginator.total_pages > 1 %}
    <div class="pagination-nav">
        {% if paginator.previous_page %}
        <a href="{{ paginator.previous_page_path | relative_url }}" class="tag-badge">< PREV</a>
        {% endif %}

        <span class="page-number">PAGE [{{ paginator.page }} / {{ paginator.total_pages }}]</span>

        {% if paginator.next_page %}
        <a href="{{ paginator.next_page_path | relative_url }}" class="tag-badge">NEXT ></a>
        {% endif %}
    </div>
    {% endif %}
</section>