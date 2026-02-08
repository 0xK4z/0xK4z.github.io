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
