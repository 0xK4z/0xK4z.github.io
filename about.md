---
layout: default
title: about
permalink: /about/
---

<section>
        <h2><span class="cmd">></span> cat about.txt</h2>
        <div class="about-container">
            <img src="https://images.pexels.com/photos/20787/pexels-photo.jpg?cs=srgb&dl=animal-cat-adorable-20787.jpg&fm=jpg" alt="Profile Picture" class="about-image"/>
            <div class="about-text">
                <p><strong>[IDENTITY]:</strong> Your Name</p>
                <p><strong>[LOCATION]:</strong> Brazil</p>
                <br />
                <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
                    eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
                    ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                    aliquip ex ea commodo consequat.
                </p>
                <p>
                    Duis aute irure dolor in reprehenderit in voluptate velit esse
                    cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat
                    cupidatat non proident, sunt in culpa qui officia deserunt mollit
                    anim id est laborum.
                </p>
            </div>
        </div>
</section>

<section class="cv-download-section">
    <h2><span class="cmd ">></span> wget ./curriculum_vitae/</h2>
    <p class="subtitle glitch">// Select the resume version to download.</p>
    
<div class="cv-grid">
        <a href="{{ '/assets/pdf/cv_pt_br.pdf' | relative_url }}" download class="cv-button">
            <span class="cv-icon">⬇</span>
            <div class="cv-text">
                <span class="cv-filename">resume_ptbr_soc.pdf</span>
                <span class="cv-lang">[ PT-BR ]</span>
            </div>
        </a>

<a href="{{ '/assets/pdf/cv_en_us.pdf' | relative_url }}" download class="cv-button">
            <span class="cv-icon">⬇</span>
            <div class="cv-text">
                <span class="cv-filename">resume_enus_soc.pdf</span>
                <span class="cv-lang">[ EN-US ]</span>
            </div>
        </a>
    </div>
</section>
