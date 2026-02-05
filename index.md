---
layout: default
title: home
permalink: /
---

<header id="home" style="margin-top: 50px">
        <h1 class="typing-effect" id="typewriter-text"></h1>
        <p class="subtitle">SOC Analyst | CTF Player | Security Researcher</p>
        <br />
        <p>
          Welcome to my terminal. Navigate through the commands above to access the files.
        </p>
</header>

<br>

<div class="log-sample">
    <p class="subtitle glitch">// Real-time Incident Feed</p>
    <code class="terminal-code">
        <span class="log-line">
            <span class="log-timestamp"></span> 
            <span class="log-warn">[WARN]</span> Brute-force detected on port 22 from IP 192.168.1.105
        </span><br>
        <span class="log-line">
            <span class="log-timestamp"></span> 
            <span class="log-info">[INFO]</span> Intrusion Prevention System (IPS) blocked the source.
        </span>
    </code>
</div>
<br>
<div class="system-health-widget">
    <p class="subtitle">// INFRASTRUCTURE_METRICS</p>
    
<div class="health-item">
        <span class="health-label">CPU_LOAD:</span>
        <div class="progress-bar">
            <span class="bar-fill critical" style="width: 82%;">||||||||||||||||----</span>
            <span class="bar-value">82%</span>
        </div>
    </div>

<div class="health-item">
        <span class="health-label">MEM_USAGE:</span>
        <div class="progress-bar">
            <span class="bar-fill medium" style="width: 45%;">||||||||----------</span>
            <span class="bar-value">45%</span>
        </div>
    </div>

<div class="health-item">
        <span class="health-label">LATENCY:</span>
        <span class="latency-value low">12ms</span>
</div>
</div>

<section class="triage-section">
    <h2><span class="cmd">></span> Triage - Current Tickets</h2>
    
<div class="triage-card medium">
        <div class="triage-status">
            <span class="severity-box">MEDIUM</span>
            <span class="ticket-id">#001</span>
        </div>
        <div class="triage-content">
            <span class="task-title">Learning: Cloud Security with Google</span>
            <p class="task-desc">Learning how to perform security audits in cloud.</p>
        </div>
    </div>

<div class="triage-card low">
        <div class="triage-status">
            <span class="severity-box">LOW</span>
            <span class="ticket-id">#002</span>
        </div>
        <div class="triage-content">
            <span class="task-title">Project: SIEM Integration with Microsoft Active Directory</span>
            <p class="task-desc">Implementing a Splunk SIEM for visualize logs in AD.</p>
        </div>
    </div>
</section>

<script src="{{ '/assets/js/typewriter.js' }}"></script>
<script src="{{ '/assets/js/updateLogDate.js' }}"></script>