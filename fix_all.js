const fs = require('fs');
const path = require('path');

const files = [
    'index.html', 'index-de.html', 'index-it.html',
    'about.html', 'about-de.html', 'about-it.html',
    'blog.html', 'blog-de.html', 'blog-it.html',
    'air-analyzer.html', 'air-analyzer-de.html', 'air-analyzer-it.html'
];

for (const file of files) {
    const filePath = path.join(__dirname, file);
    if (!fs.existsSync(filePath)) continue;
    let content = fs.readFileSync(filePath, 'utf8');

    const isDe = file.includes('-de.html');
    const isIt = file.includes('-it.html');
    const isEn = !isDe && !isIt;

    // 1. ALL PAGES: Fix og:type if missing
    if (!content.includes('property="og:type"')) {
        content = content.replace(/<\/head>/i, '    <meta property="og:type" content="website">\n</head>');
    }

    // 2. ALL PAGES: Add aria-label to nav
    if (file.includes('index') || file.includes('about') || file.includes('blog') || file.includes('air-analyzer')) {
        content = content.replace(/<nav>/g, '<nav aria-label="Main navigation">');
        content = content.replace(/<nav aria-label="Hauptnavigation">/g, '<nav aria-label="Hauptnavigation">');
        content = content.replace(/<nav aria-label="Navigazione principale">/g, '<nav aria-label="Navigazione principale">');
        
        if (isDe) content = content.replace(/<nav aria-label="Main navigation">/g, '<nav aria-label="Hauptnavigation">');
        if (isIt) content = content.replace(/<nav aria-label="Main navigation">/g, '<nav aria-label="Navigazione principale">');
    }

    // 3. ALL PAGES: Remove inline JS on WhatsApp link
    content = content.replace(/onmouseover="this\.style\.color='#25D366'" onmouseout="this\.style\.color=''"/g, 'class="hover-target whatsapp-link"');

    // 4. Index specific fixes
    if (file.startsWith('index')) {
        if (isEn) {
            // EN specific: tab indentation on line 8 (or near og:title)
            content = content.replace(/\t<meta property="og:title"/g, '    <meta property="og:title"');
            
            // Move charset
            if (content.indexOf('<meta charset="UTF-8">') > content.indexOf('<meta property="og:title"')) {
                content = content.replace(/\s*<meta charset="UTF-8">/, '');
                content = content.replace(/<head>/, '<head>\n    <meta charset="UTF-8">');
            }
        } else {
            // DE/IT specific:
            // Add Corporate Technical Project Intern
            if (!content.includes('Corporate Technical Project Intern')) {
                const subroleDe = `
                        <div class="sub-role">
                            <h4>Corporate Technical Project Intern</h4>
                            <span class="date-muted">Jul 2021 - Jun 2022 (1 Jahr) | Postal, Italien</span>
                            <ul>
                                <li>Mitwirkung bei der Einführung und Datenkonsolidierung standortübergreifender Instandhaltungssoftware mit Schwerpunkt Ersatzteilmanagement.</li>
                            </ul>
                        </div>`;
                const subroleIt = `
                        <div class="sub-role">
                            <h4>Corporate Technical Project Intern</h4>
                            <span class="date-muted">Lug 2021 - Giu 2022 (1 anno) | Postal, Italia</span>
                            <ul>
                                <li>Partecipazione all'implementazione e al consolidamento dei dati del software di manutenzione cross-site, con focus sulla gestione dei ricambi.</li>
                            </ul>
                        </div>`;
                const toInsert = isDe ? subroleDe : subroleIt;
                const insertPoint = isDe ? '</div>\n\n                    <!-- Intern -->' : '</div>\n\n                    <!-- Intern -->';
                // Try to inject after the previous sub-role
                if (content.includes('Corporate Technical Project Manager')) {
                    // Find the end of the Manager sub-role's ul
                    const managerEnd = content.indexOf('</ul>\n                        </div>', content.indexOf('Corporate Technical Project Manager'));
                    if (managerEnd !== -1) {
                        content = content.slice(0, managerEnd + 35) + toInsert + content.slice(managerEnd + 35);
                    }
                }
            }

            // Fix IDAL BAU 3rd bullet
            if (content.includes('IDAL BAU')) {
                if (isDe && !content.includes('Pflege eines organisierten digitalen')) {
                    content = content.replace(/<li>Sicherstellung des Projektfortschritts.*<\/li>/, '$&\n                                <li>Pflege eines organisierten digitalen und physischen Ablagesystems.</li>');
                }
                if (isIt && !content.includes('Mantenimento di un sistema di archiviazione')) {
                    content = content.replace(/<li>Assicurazione del progresso.*<\/li>/, '$&\n                                <li>Mantenimento di un sistema di archiviazione digitale e fisico organizzato.</li>');
                }
            }
            
            // Trainee bullets
            if (content.includes('Zoeschg')) {
                if (isDe && !content.includes('Elektroinstallationen')) {
                    content = content.replace(/(<h4>Elektriker.*<\/span>)/, '$1\n                            <ul>\n                                <li>Unterstützung bei Elektroinstallationen, Verkabelungen und Fehlersuche in Wohn- und Gewerbeumgebungen.</li>\n                            </ul>');
                }
                if (isIt && !content.includes('installazione elettrica')) {
                    content = content.replace(/(<h4>Elettricista.*<\/span>)/, '$1\n                            <ul>\n                                <li>Assistenza nell\'installazione elettrica, cablaggio e risoluzione dei problemi in ambienti residenziali e commerciali.</li>\n                            </ul>');
                }
            }
            
            if (content.includes('Frigotherm')) {
                if (isDe && !content.includes('Kälte- und Klimaanlagen')) {
                    content = content.replace(/(<h4>Kältetechniker.*<\/span>)/, '$1\n                            <ul>\n                                <li>Mithilfe beim Zusammenbau und der Installation von Kälte- und Klimaanlagen.</li>\n                            </ul>');
                }
                if (isIt && !content.includes('impianti di refrigerazione')) {
                    content = content.replace(/(<h4>Tecnico Refrigerazione.*<\/span>)/, '$1\n                            <ul>\n                                <li>Assistenza nell\'assemblaggio e nell\'installazione di impianti di refrigerazione e climatizzazione.</li>\n                            </ul>');
                }
            }

            // Certifications
            if (!content.includes('Generative AI')) {
                const certDe = `
            <div style="margin-top: 60px; text-align: center;">
                <h3 style="margin-bottom: 30px; font-size: 1.8rem;">Lizenzen &amp; Zertifizierungen</h3>
                <div class="cert-container">
                    <span class="cert-tag hover-target">📄 Englisch C1 Zertifizierung</span>
                    <span class="cert-tag hover-target">🤖 Career Essentials in Generative AI</span>
                    <span class="cert-tag hover-target">🚗 Führerschein (Klasse B)</span>
                    <span class="cert-tag hover-target">🛡️ Spezifische Arbeitsschutzausbildung (ATEKO C, F, H, J)</span>
                    <span class="cert-tag hover-target">⛑️ Arbeitssicherheit (Grundkurs)</span>
                </div>
            </div>`;
                const certIt = `
            <div style="margin-top: 60px; text-align: center;">
                <h3 style="margin-bottom: 30px; font-size: 1.8rem;">Licenze &amp; Certificazioni</h3>
                <div class="cert-container">
                    <span class="cert-tag hover-target">📄 Certificazione Inglese C1</span>
                    <span class="cert-tag hover-target">🤖 Career Essentials in Generative AI</span>
                    <span class="cert-tag hover-target">🚗 Patente di Guida (Classe B)</span>
                    <span class="cert-tag hover-target">🛡️ Formazione Specifica Sicurezza (ATECO C, F, H, J)</span>
                    <span class="cert-tag hover-target">⛑️ Sicurezza sul Lavoro (Base)</span>
                </div>
            </div>`;
                const certHTML = isDe ? certDe : certIt;
                content = content.replace(/<\/div>\s*<\/section>\s*<!-- Skills Section -->/, `</div>${certHTML}\n        </section>\n\n    <!-- Skills Section -->`);
            }
            
            // Translate JSON-LD
            if (isDe) {
                content = content.replace(/"jobTitle":\s*"Industrial and Mechanical Engineer"/, '"jobTitle": "Industrie- und Maschinenbauingenieur"');
                content = content.replace(/"alumniOf":\s*"Free University of Bolzano"/, '"alumniOf": "Freie Universität Bozen"');
                content = content.replace(/"addressRegion":\s*"South Tyrol"/, '"addressRegion": "Südtirol"');
                content = content.replace(/<h3>Core Tools<\/h3>/, '<h3>Kernwerkzeuge</h3>');
                content = content.replace(/All rights reserved\./g, 'Alle Rechte vorbehalten.');
            }
            if (isIt) {
                content = content.replace(/"jobTitle":\s*"Industrial and Mechanical Engineer"/, '"jobTitle": "Ingegnere Industriale e Meccanico"');
                content = content.replace(/"alumniOf":\s*"Free University of Bolzano"/, '"alumniOf": "Libera Università di Bolzano"');
                content = content.replace(/"addressRegion":\s*"South Tyrol"/, '"addressRegion": "Alto Adige"');
                content = content.replace(/<h3>Core Tools<\/h3>/, '<h3>Strumenti Principali</h3>');
                content = content.replace(/All rights reserved\./g, 'Tutti i diritti riservati.');
                content = content.replace(/Postal, Italia/g, 'Burgstall, Italia');
            }
        }
    }

    // 5. About specific fixes
    if (file.startsWith('about')) {
        if (!content.includes('og:title')) {
            const ogEn = `<meta property="og:title" content="About Daniel Karasani | Industrial & Mechanical Engineer">
    <meta property="og:description" content="Learn about Daniel Karasani's journey in Industrial and Mechanical Engineering.">
    <meta property="og:image" content="https://danielkarasani.github.io/images/daniel-karasani-industrial-engineer.webp">
    <meta property="og:url" content="https://danielkarasani.github.io/about.html">
    <meta property="og:type" content="website">`;
            const ogDe = `<meta property="og:title" content="Über Daniel Karasani | Industrie- & Maschinenbauingenieur">
    <meta property="og:description" content="Erfahren Sie mehr über Daniel Karasanis Weg im Industrie- und Maschinenbau.">
    <meta property="og:image" content="https://danielkarasani.github.io/images/daniel-karasani-industrial-engineer.webp">
    <meta property="og:url" content="https://danielkarasani.github.io/about-de.html">
    <meta property="og:type" content="website">`;
            const ogIt = `<meta property="og:title" content="Chi è Daniel Karasani | Ingegnere Industriale e Meccanico">
    <meta property="og:description" content="Scopri il percorso di Daniel Karasani nell'Ingegneria Industriale e Meccanica.">
    <meta property="og:image" content="https://danielkarasani.github.io/images/daniel-karasani-industrial-engineer.webp">
    <meta property="og:url" content="https://danielkarasani.github.io/about-it.html">
    <meta property="og:type" content="website">`;
            
            const toAdd = isEn ? ogEn : (isDe ? ogDe : ogIt);
            content = content.replace(/<\/title>/, `</title>\n    ${toAdd}`);
        }
        if (!content.includes('hreflang="x-default"')) {
            content = content.replace(/<link rel="alternate" hreflang="it" href="[^"]+" \/>/, `$& \n    <link rel="alternate" hreflang="x-default" href="https://danielkarasani.github.io/about.html" />`);
        }
        if (!content.includes('DanielKarasani-favcon.svg')) {
            content = content.replace(/<\/head>/, '    <link rel="icon" type="image/svg+xml" href="DanielKarasani-favcon.svg">\n</head>');
        }
    }

    // 6. Blog specific fixes
    if (file.startsWith('blog')) {
        if (!content.includes('og:title')) {
            const ogEn = `<meta property="og:title" content="The Logic Log | Blog by Daniel Karasani">
    <meta property="og:description" content="Technical insights and engineering perspectives from Daniel Karasani.">
    <meta property="og:image" content="https://danielkarasani.github.io/images/daniel-karasani-industrial-engineer.webp">
    <meta property="og:url" content="https://danielkarasani.github.io/blog.html">
    <meta property="og:type" content="website">`;
            const ogDe = `<meta property="og:title" content="Das Logik-Logbuch | Blog von Daniel Karasani">
    <meta property="og:description" content="Technische Einblicke und Ingenieurperspektiven von Daniel Karasani.">
    <meta property="og:image" content="https://danielkarasani.github.io/images/daniel-karasani-industrial-engineer.webp">
    <meta property="og:url" content="https://danielkarasani.github.io/blog-de.html">
    <meta property="og:type" content="website">`;
            const ogIt = `<meta property="og:title" content="Il Diario della Logica | Blog di Daniel Karasani">
    <meta property="og:description" content="Approfondimenti tecnici e prospettive ingegneristiche di Daniel Karasani.">
    <meta property="og:image" content="https://danielkarasani.github.io/images/daniel-karasani-industrial-engineer.webp">
    <meta property="og:url" content="https://danielkarasani.github.io/blog-it.html">
    <meta property="og:type" content="website">`;
            
            const toAdd = isEn ? ogEn : (isDe ? ogDe : ogIt);
            content = content.replace(/<\/title>/, `</title>\n    ${toAdd}`);
        }
        if (!content.includes('hreflang="x-default"')) {
            content = content.replace(/<link rel="alternate" hreflang="it" href="[^"]+" \/>/, `$& \n    <link rel="alternate" hreflang="x-default" href="https://danielkarasani.github.io/blog.html" />`);
        }
        if (!content.includes('DanielKarasani-favcon.svg')) {
            content = content.replace(/<\/head>/, '    <link rel="icon" type="image/svg+xml" href="DanielKarasani-favcon.svg">\n</head>');
        }
        
        // Aria labels for search
        if (isEn && !content.includes('aria-label="Search blog posts"')) {
            content = content.replace(/id="blogSearchInput"/, 'id="blogSearchInput" aria-label="Search blog posts"');
        } else if (isDe && !content.includes('aria-label="Blogbeiträge durchsuchen"')) {
            content = content.replace(/id="blogSearchInput"/, 'id="blogSearchInput" aria-label="Blogbeiträge durchsuchen"');
        } else if (isIt && !content.includes('aria-label="Cerca articoli del blog"')) {
            content = content.replace(/id="blogSearchInput"/, 'id="blogSearchInput" aria-label="Cerca articoli del blog"');
        }

        // GA tag in EN blog
        if (isEn && !content.includes('G-MSX3GD41Z0')) {
            content = content.replace(/<\/head>/, `    <script async src="https://www.googletagmanager.com/gtag/js?id=G-MSX3GD41Z0"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'G-MSX3GD41Z0');
    </script>\n</head>`);
        }

        // DE/IT Sync noscript fallback posts
        if ((isDe || isIt) && !content.includes('Willkommen im Browser') && !content.includes('Benvenuto nel Browser')) {
            const deFallback = `
                <div class="blog-card">
                    <span class="blog-date">19. Mai 2026</span>
                    <h3>Willkommen im Browser-Markdown-Editor!</h3>
                    <p>Ein neuer und intuitiver Markdown-Editor für den Browser.</p>
                </div>
                <div class="blog-card">
                    <span class="blog-date">19. Mai 2026</span>
                    <h3>Direkter Veröffentlichungs-Integrationstest</h3>
                    <p>Dies ist ein Live-Test-Post, der die neu integrierte GitHub-Client-seitige direkte Veröffentlichungspipeline überprüft.</p>
                </div>`;
            const itFallback = `
                <div class="blog-card">
                    <span class="blog-date">19 Maggio 2026</span>
                    <h3>Benvenuto nel Browser Markdown Editor!</h3>
                    <p>Un editor markdown per browser intuitivo e veloce.</p>
                </div>
                <div class="blog-card">
                    <span class="blog-date">19 Maggio 2026</span>
                    <h3>Test di Pubblicazione Diretta</h3>
                    <p>Questo è un post di prova dal vivo che verifica la nuova pipeline di pubblicazione diretta lato client di GitHub.</p>
                </div>`;
            
            content = content.replace(/<\/div>\s*<\/noscript>/, (isDe ? deFallback : itFallback) + '\n            </div>\n        </noscript>');
        }
    }

    // 7. Air-analyzer specific fixes
    if (file.startsWith('air-analyzer')) {
        if (!content.includes('og:title')) {
            const ogEn = `<meta property="og:title" content="Air Analyzer Project | Daniel Karasani">
    <meta property="og:description" content="An end-to-end engineered indoor air quality monitoring station with custom PCBs and sensor arrays.">
    <meta property="og:image" content="https://danielkarasani.github.io/images/air-analyzer-device-diy.webp">
    <meta property="og:url" content="https://danielkarasani.github.io/air-analyzer.html">
    <meta property="og:type" content="website">`;
            const ogDe = `<meta property="og:title" content="Projekt Air Analyzer | Daniel Karasani">
    <meta property="og:description" content="Eine komplett selbst entwickelte Luftqualitätsmessstation mit eigenen Leiterplatten und Sensorarrays.">
    <meta property="og:image" content="https://danielkarasani.github.io/images/air-analyzer-device-diy.webp">
    <meta property="og:url" content="https://danielkarasani.github.io/air-analyzer-de.html">
    <meta property="og:type" content="website">`;
            const ogIt = `<meta property="og:title" content="Progetto Air Analyzer | Daniel Karasani">
    <meta property="og:description" content="Una stazione di monitoraggio della qualità dell'aria progettata end-to-end con PCB personalizzati e array di sensori.">
    <meta property="og:image" content="https://danielkarasani.github.io/images/air-analyzer-device-diy.webp">
    <meta property="og:url" content="https://danielkarasani.github.io/air-analyzer-it.html">
    <meta property="og:type" content="website">`;
            
            const toAdd = isEn ? ogEn : (isDe ? ogDe : ogIt);
            content = content.replace(/<\/title>/, `</title>\n    ${toAdd}`);
        }
        if (!content.includes('hreflang="x-default"')) {
            content = content.replace(/<link rel="alternate" hreflang="it" href="[^"]+" \/>/, `$& \n    <link rel="alternate" hreflang="x-default" href="https://danielkarasani.github.io/air-analyzer.html" />`);
        }
        if (!content.includes('DanielKarasani-favcon.svg')) {
            content = content.replace(/<\/head>/, '    <link rel="icon" type="image/svg+xml" href="DanielKarasani-favcon.svg">\n</head>');
        }
        
        // Fix bare & in headings
        content = content.replace(/System Architecture & Hardware Design/g, 'System Architecture &amp; Hardware Design');
        content = content.replace(/Systemarchitektur & Hardware-Design/g, 'Systemarchitektur &amp; Hardware-Design');
        content = content.replace(/Architettura di Sistema & Design Hardware/g, 'Architettura di Sistema &amp; Design Hardware');

        if (isDe) {
            content = content.replace(/Feinstaubsenor/g, 'Feinstaubsensor');
            content = content.replace(/All rights reserved\./g, 'Alle Rechte vorbehalten.');
        }
        if (isIt) {
            content = content.replace(/All rights reserved\./g, 'Tutti i diritti riservati.');
        }
    }

    fs.writeFileSync(filePath, content, 'utf8');
}
console.log('Applied fixes to all HTML files successfully.');
