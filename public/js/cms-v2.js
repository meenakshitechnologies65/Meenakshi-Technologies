/**
 * CMS MANAGEMENT v2.0 - ENTERPRISE CLIENT APPLICATION ENGINE
 * Controls all 20 modules, interactive charts, forms, APIs, and real-time state.
 */

document.addEventListener('DOMContentLoaded', () => {
  initTheme();
  initNavigation();
  initDashboardTelemetry();
  initArticlePublisher();
  initAiAssistant();
  initKeywordResearch();
  initCompetitorAnalysis();
  initMediaUploader();
  initPdfUploader();
  initSchemaBuilder();
  initInternalLinksTool();
  initSiteAuditTool();
  initLeadsManager();
});

/* ==========================================================================
   THEME TOGGLE
   ========================================================================== */
function initTheme() {
  const toggleBtn = document.getElementById('themeToggleBtn');
  const savedTheme = localStorage.getItem('cms_theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  if (toggleBtn) {
    toggleBtn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('cms_theme', next);
      updateThemeIcon(next);
      if (window.cmsCharts) window.cmsCharts.updateTheme(next);
    });
  }
}

function updateThemeIcon(theme) {
  const toggleBtn = document.getElementById('themeToggleBtn');
  if (toggleBtn) {
    toggleBtn.innerHTML = theme === 'dark' ? '☀️ Light' : '🌙 Dark';
  }
}

/* ==========================================================================
   SIDEBAR NAVIGATION (20 MODULES)
   ========================================================================== */
function initNavigation() {
  const navBtns = document.querySelectorAll('.cms-nav-btn[data-target]');
  const panes = document.querySelectorAll('.cms-view-pane');
  const topbarTitle = document.getElementById('cmsCurrentViewTitle');

  navBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const targetId = btn.getAttribute('data-target');
      const title = btn.getAttribute('data-title') || 'Dashboard';

      navBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      panes.forEach(p => p.classList.remove('active'));
      const targetPane = document.getElementById(targetId);
      if (targetPane) {
        targetPane.classList.add('active');
        if (topbarTitle) topbarTitle.textContent = title;
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Lazy loads
        if (targetId === 'view-articles') loadArticlesList();
        if (targetId === 'view-products') loadProductsList();
        if (targetId === 'view-media') loadMediaLibrary();
        if (targetId === 'view-pdfs') loadPdfLibrary();
        if (targetId === 'view-gsc') loadGscTelemetry();
      }
    });
  });
}

/* ==========================================================================
   MODULE 1: DASHBOARD TELEMETRY & CHART.JS
   ========================================================================== */
async function initDashboardTelemetry() {
  try {
    const res = await fetch('/api/v2/dashboard/kpis');
    const data = await res.json();
    if (data.success) {
      renderKpis(data.kpis);
      renderAlertsAndRecent(data);
    }

    const chartRes = await fetch('/api/v2/dashboard/charts');
    const chartData = await chartRes.json();
    if (chartData.success) {
      renderCharts(chartData);
    }
  } catch (err) {
    console.warn('[Dashboard Telemetry]', err);
  }
}

function renderKpis(kpis) {
  const map = {
    'kpi-articles': kpis.totalPublishedArticles,
    'kpi-drafts': kpis.totalDraftArticles,
    'kpi-products': kpis.totalProducts,
    'kpi-pdfs': kpis.totalUploadedPdfs,
    'kpi-keywords': kpis.totalKeywords,
    'kpi-avg-seo': `${kpis.averageSeoScore}/100`,
    'kpi-impressions': kpis.searchImpressions.toLocaleString(),
    'kpi-clicks': kpis.searchClicks.toLocaleString(),
    'kpi-position': `#${kpis.averagePosition}`,
    'kpi-leads': kpis.totalLeads
  };

  for (const [id, val] of Object.entries(map)) {
    const el = document.getElementById(id);
    if (el) el.textContent = val;
  }
}

function renderAlertsAndRecent(data) {
  // Low SEO articles table
  const lowSeoTbody = document.getElementById('lowSeoTableBody');
  if (lowSeoTbody && data.lowSeoArticles) {
    if (data.lowSeoArticles.length === 0) {
      lowSeoTbody.innerHTML = '<tr><td colspan="4" style="color:var(--cms-success); text-align:center;">All published articles score 75+! No critical SEO issues.</td></tr>';
    } else {
      lowSeoTbody.innerHTML = data.lowSeoArticles.map(a => `
        <tr>
          <td><strong>${a.title}</strong></td>
          <td><code>${a.focus_keyword || 'none'}</code></td>
          <td><span class="score-pill ${a.seo_score >= 80 ? 'pass' : a.seo_score >= 60 ? 'warning' : 'critical'}">${a.seo_score}/100</span></td>
          <td><button class="cms-btn cms-btn-outline cms-btn-sm" onclick="editArticle('${a.id}')">Optimize &rarr;</button></td>
        </tr>
      `).join('');
    }
  }
}

function renderCharts(chartData) {
  const ctxTraffic = document.getElementById('trafficChartCanvas')?.getContext('2d');
  const ctxPositions = document.getElementById('positionChartCanvas')?.getContext('2d');

  if (ctxTraffic && typeof Chart !== 'undefined') {
    new Chart(ctxTraffic, {
      type: 'line',
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: 'Search Impressions',
            data: chartData.datasets.impressions,
            borderColor: '#0284c7',
            backgroundColor: 'rgba(2, 132, 199, 0.08)',
            fill: true,
            tension: 0.35
          },
          {
            label: 'Search Clicks',
            data: chartData.datasets.clicks,
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.08)',
            fill: true,
            tension: 0.35
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { position: 'top' } }
      }
    });
  }

  if (ctxPositions && typeof Chart !== 'undefined') {
    new Chart(ctxPositions, {
      type: 'line',
      data: {
        labels: chartData.labels,
        datasets: [
          {
            label: 'Avg Ranking Position (Lower is Better)',
            data: chartData.datasets.positions,
            borderColor: '#f59e0b',
            backgroundColor: 'rgba(245, 158, 11, 0.08)',
            fill: true,
            tension: 0.35
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: { y: { reverse: true, min: 1, max: 10 } }
      }
    });
  }
}

/* ==========================================================================
   MODULE 2: ARTICLE PUBLISHER & CRUD
   ========================================================================== */
function initArticlePublisher() {
  const form = document.getElementById('articleEditorForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const articleId = document.getElementById('editingArticleId')?.value;
      const payload = {
        title: document.getElementById('articleTitle').value.trim(),
        seoTitle: document.getElementById('articleSeoTitle').value.trim() || document.getElementById('articleTitle').value.trim(),
        slug: document.getElementById('articleSlug').value.trim(),
        categoryName: document.getElementById('articleCategory').value,
        focusKeyword: document.getElementById('articleKeyword').value.trim(),
        metaDescription: document.getElementById('articleMetaDesc').value.trim(),
        excerpt: document.getElementById('articleExcerpt').value.trim(),
        contentHtml: document.getElementById('articleContent').value.trim(),
        canonicalUrl: document.getElementById('articleCanonical').value.trim(),
        schemaType: document.getElementById('articleSchema').value,
        status: document.getElementById('articleStatus').value
      };

      if (!payload.title || !payload.contentHtml) {
        alert('Please provide an article title and content.');
        return;
      }

      const url = articleId ? `/api/v2/articles/${articleId}` : '/api/v2/articles';
      const method = articleId ? 'PUT' : 'POST';

      try {
        const res = await fetch(url, {
          method,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          alert(`Success! Article saved with Rank Math SEO Score: ${data.seoScore}/100.`);
          document.querySelector('[data-target="view-articles"]')?.click();
          loadArticlesList();
        } else {
          alert('Error saving article: ' + data.message);
        }
      } catch (err) {
        alert('Server communication error.');
      }
    });
  }

  // New Article button reset
  document.getElementById('btnAddNewArticle')?.addEventListener('click', () => {
    resetArticleEditor();
    document.querySelector('[data-target="view-editor"]')?.click();
  });
}

function resetArticleEditor() {
  const form = document.getElementById('articleEditorForm');
  if (form) form.reset();
  const idEl = document.getElementById('editingArticleId');
  if (idEl) idEl.value = '';
  if (window.seoAnalyzer) window.seoAnalyzer.triggerAnalysis();
}

async function loadArticlesList() {
  const tbody = document.getElementById('articlesTableBody');
  if (!tbody) return;
  tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">Loading articles...</td></tr>';

  try {
    const res = await fetch('/api/v2/articles');
    const data = await res.json();
    if (data.success && data.articles) {
      if (data.articles.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center;">No articles found. Click "Add New Article" to start.</td></tr>';
        return;
      }
      tbody.innerHTML = data.articles.map(a => `
        <tr>
          <td><strong>${a.title}</strong></td>
          <td>${a.category_name || 'General'}</td>
          <td><code>${a.focus_keyword || '—'}</code></td>
          <td>
            <span class="score-pill ${a.seo_score >= 80 ? 'pass' : a.seo_score >= 60 ? 'warning' : 'critical'}">
              ${a.seo_score}/100
            </span>
          </td>
          <td><span style="text-transform:capitalize; font-weight:600;">${a.status}</span></td>
          <td style="display:flex; gap:0.5rem;">
            <button class="cms-btn cms-btn-outline cms-btn-sm" onclick="editArticle('${a.id}')">Edit</button>
            <a href="/blog/${a.slug}" target="_blank" class="cms-btn cms-btn-outline cms-btn-sm" style="color:var(--cms-primary);">View ↗</a>
          </td>
        </tr>
      `).join('');
    }
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="6" style="color:var(--cms-danger); text-align:center;">Failed to load articles.</td></tr>';
  }
}

window.editArticle = async function(id) {
  try {
    const res = await fetch(`/api/v2/articles/${id}`);
    const data = await res.json();
    if (data.success && data.article) {
      const a = data.article;
      document.getElementById('editingArticleId').value = a.id;
      document.getElementById('articleTitle').value = a.title;
      document.getElementById('articleSeoTitle').value = a.seo_title || '';
      document.getElementById('articleSlug').value = a.slug;
      document.getElementById('articleCategory').value = a.category_name || 'Biometric Attendance';
      document.getElementById('articleKeyword').value = a.focus_keyword || '';
      document.getElementById('articleMetaDesc').value = a.meta_description || '';
      document.getElementById('articleExcerpt').value = a.excerpt || '';
      document.getElementById('articleContent').value = a.content_html || '';
      document.getElementById('articleCanonical').value = a.canonical_url || '';
      document.getElementById('articleSchema').value = a.schema_type || 'Article';
      document.getElementById('articleStatus').value = a.status || 'draft';

      document.querySelector('[data-target="view-editor"]')?.click();
      if (window.seoAnalyzer) window.seoAnalyzer.triggerAnalysis();
    }
  } catch (err) {
    alert('Failed to load article details.');
  }
};

/* ==========================================================================
   MODULE 5: AI ARTICLE WRITER & REWRITER
   ========================================================================== */
function initAiAssistant() {
  const form = document.getElementById('aiGenerateForm');
  const btnGenerate = document.getElementById('btnRunAiGenerate');
  const resultBox = document.getElementById('aiGenerateResult');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      btnGenerate.disabled = true;
      btnGenerate.innerHTML = '<span>⚡ Synthesizing SEO Article with AI...</span>';
      resultBox.style.display = 'block';
      resultBox.innerHTML = '<div style="padding:1.5rem; text-align:center; color:var(--cms-muted);">Analyzing search intent, competitor topics, and formulating comprehensive content blocks...</div>';

      const payload = {
        keyword: document.getElementById('aiTargetKeyword').value.trim(),
        topic: document.getElementById('aiTopic').value.trim(),
        targetAudience: document.getElementById('aiAudience').value.trim(),
        wordCount: parseInt(document.getElementById('aiWordCount').value) || 1000,
        tone: document.getElementById('aiTone').value
      };

      try {
        const res = await fetch('/api/v2/ai/generate-article', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (data.success) {
          window.lastGeneratedArticle = data;
          resultBox.innerHTML = `
            <div style="background:var(--cms-surface); border:1px solid var(--cms-border); border-radius:8px; padding:1.25rem;">
              <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem;">
                <h4 style="margin:0; color:var(--cms-text);">${data.title}</h4>
                <button class="cms-btn cms-btn-primary cms-btn-sm" onclick="applyAiArticleToEditor()">Insert into Editor &rarr;</button>
              </div>
              <p style="font-size:0.85rem; color:var(--cms-muted); margin-bottom:0.75rem;"><strong>Focus Keyword:</strong> <code>${data.focusKeyword}</code> | <strong>Word Count:</strong> ${data.wordCount} words | <strong>Read Time:</strong> ${data.readTimeMinutes} min</p>
              <p style="font-size:0.85rem; color:var(--cms-text); margin-bottom:1rem;"><strong>Meta Description:</strong> ${data.metaDescription}</p>
              <div style="max-height:280px; overflow-y:auto; border:1px solid var(--cms-border); border-radius:6px; padding:1rem; font-size:0.85rem; background:var(--cms-bg);">
                ${data.contentHtml}
              </div>
            </div>
          `;
        } else {
          resultBox.innerHTML = `<div style="color:var(--cms-danger);">${data.message}</div>`;
        }
      } catch (err) {
        resultBox.innerHTML = '<div style="color:var(--cms-danger);">Failed to communicate with AI synthesis service.</div>';
      } finally {
        btnGenerate.disabled = false;
        btnGenerate.innerHTML = '<span>Generate Complete SEO Article</span>';
      }
    });
  }
}

window.applyAiArticleToEditor = function() {
  if (!window.lastGeneratedArticle) return;
  const d = window.lastGeneratedArticle;
  document.getElementById('articleTitle').value = d.title;
  document.getElementById('articleSeoTitle').value = d.seoTitle;
  document.getElementById('articleSlug').value = d.slug;
  document.getElementById('articleKeyword').value = d.focusKeyword;
  document.getElementById('articleMetaDesc').value = d.metaDescription;
  document.getElementById('articleExcerpt').value = d.metaDescription;
  document.getElementById('articleContent').value = d.contentHtml;
  document.getElementById('articleCanonical').value = `/blog/${d.slug}`;

  document.querySelector('[data-target="view-editor"]')?.click();
  if (window.seoAnalyzer) window.seoAnalyzer.triggerAnalysis();
};

/* ==========================================================================
   MODULE 4: KEYWORD RESEARCH
   ========================================================================== */
function initKeywordResearch() {
  const form = document.getElementById('keywordResearchForm');
  const tbody = document.getElementById('keywordResultsTbody');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const q = document.getElementById('kwSearchInput').value.trim();
      const comp = document.getElementById('kwCompFilter').value;
      const intent = document.getElementById('kwIntentFilter').value;

      tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">Querying Google Keyword Planner & telemetry...</td></tr>';

      try {
        const res = await fetch('/api/v2/keywords/research', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ query: q, competition: comp, intent: intent })
        });
        const data = await res.json();
        if (data.success && data.keywords) {
          if (data.keywords.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No keywords found matching query.</td></tr>';
            return;
          }

          tbody.innerHTML = data.keywords.map(k => `
            <tr>
              <td><strong>${k.query}</strong></td>
              <td>${k.search_volume ? k.search_volume.toLocaleString() : 'Data unavailable'}</td>
              <td><span class="score-pill ${k.competition_level === 'LOW' ? 'pass' : k.competition_level === 'MEDIUM' ? 'warning' : 'critical'}">${k.competition_level}</span></td>
              <td>₹${k.cpc ? k.cpc.toFixed(2) : '15.00'}</td>
              <td style="text-transform:capitalize;">${k.search_intent}</td>
              <td><span class="score-pill pass">${k.opportunity_score}/100</span></td>
              <td><button class="cms-btn cms-btn-outline cms-btn-sm" onclick="targetKeywordInEditor('${k.query}')">Target in Article</button></td>
            </tr>
          `).join('');
        }
      } catch (err) {
        tbody.innerHTML = '<tr><td colspan="7" style="color:var(--cms-danger); text-align:center;">Failed to query keyword database.</td></tr>';
      }
    });
  }
}

window.targetKeywordInEditor = function(kw) {
  document.getElementById('btnAddNewArticle')?.click();
  document.getElementById('articleKeyword').value = kw;
  document.getElementById('articleTitle').value = `Best ${kw.charAt(0).toUpperCase() + kw.slice(1)} (2026 Guide)`;
  document.querySelector('[data-target="view-editor"]')?.click();
  if (window.seoAnalyzer) window.seoAnalyzer.triggerAnalysis();
};

/* ==========================================================================
   MODULE 6: COMPETITOR SERP ANALYSIS
   ========================================================================== */
function initCompetitorAnalysis() {
  const form = document.getElementById('competitorSearchForm');
  const resultBox = document.getElementById('competitorResultsBox');

  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const kw = document.getElementById('competitorTargetKw').value.trim();
      resultBox.innerHTML = '<div style="padding:1.5rem; text-align:center;">Analyzing Google SERP competitors and extracting structural content gaps...</div>';

      try {
        const res = await fetch('/api/v2/competitors/analyze', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ targetKeyword: kw })
        });
        const data = await res.json();
        if (data.success) {
          resultBox.innerHTML = `
            <div style="margin-bottom:1.5rem;">
              <h4 style="margin-bottom:0.5rem; color:var(--cms-text);">Top Google Ranking Competitor Pages for "${data.targetKeyword}"</h4>
              <p style="font-size:0.85rem; color:var(--cms-muted);">Avg competitor word count: <strong>${data.summary.avgCompetitorWordCount} words</strong>. Recommended target: <strong>${data.summary.recommendedMinWordCount}+ words</strong>.</p>
            </div>

            <div style="display:grid; gap:1rem; margin-bottom:1.5rem;">
              ${data.competitors.map(c => `
                <div style="border:1px solid var(--cms-border); border-radius:8px; padding:1.25rem; background:var(--cms-surface);">
                  <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                    <strong>#${c.avgPosition} ${c.title}</strong>
                    <span class="score-pill warning">${c.domain}</span>
                  </div>
                  <div style="font-size:0.8rem; color:var(--cms-primary); margin-bottom:0.6rem;">${c.url}</div>
                  <div style="font-size:0.84rem; margin-bottom:0.5rem;"><strong>Identified Content Gaps (Opportunities to Win):</strong></div>
                  <ul style="font-size:0.82rem; color:var(--cms-muted); padding-left:1.25rem;">
                    ${c.contentGapsIdentified.map(g => `<li style="margin-bottom:0.25rem;">${g}</li>`).join('')}
                  </ul>
                </div>
              `).join('')}
            </div>

            <div style="border-left:4px solid var(--cms-success); background:var(--cms-success-bg); padding:1rem; border-radius:6px;">
              <h4 style="color:#065f46; margin-bottom:0.3rem;">Strategic Action Plan to Outrank Competitors:</h4>
              <p style="font-size:0.85rem; color:#065f46; margin:0;">Incorporate technical hardware comparison tables, official downloadable PDF datasheets, and direct verified local address E-E-A-T signals.</p>
            </div>
          `;
        }
      } catch (err) {
        resultBox.innerHTML = '<div style="color:var(--cms-danger);">Failed to execute competitor analysis.</div>';
      }
    });
  }
}

/* ==========================================================================
   MODULE 7: GSC TELEMETRY
   ========================================================================== */
async function loadGscTelemetry() {
  const tbody = document.getElementById('gscTableBody');
  if (!tbody) return;

  try {
    const res = await fetch('/api/v2/gsc/performance');
    const data = await res.json();
    if (data.success && data.topQueries) {
      tbody.innerHTML = data.topQueries.map(q => `
        <tr>
          <td><strong>${q.query}</strong></td>
          <td><code>${q.page_url}</code></td>
          <td>${q.total_impressions.toLocaleString()}</td>
          <td>${q.total_clicks.toLocaleString()}</td>
          <td>${q.avg_ctr}%</td>
          <td><span class="score-pill pass">#${q.avg_position}</span></td>
        </tr>
      `).join('');

      // Render alerts
      const alertsBox = document.getElementById('gscAlertsBox');
      if (alertsBox && data.alerts) {
        alertsBox.innerHTML = data.alerts.map(a => `
          <div style="border:1px solid var(--cms-border); border-left:4px solid ${a.severity === 'HIGH' ? 'var(--cms-danger)' : 'var(--cms-warning)'}; border-radius:6px; padding:1rem; margin-bottom:0.75rem; background:var(--cms-surface);">
            <div style="display:flex; justify-content:space-between; font-weight:700; margin-bottom:0.3rem;">
              <span>${a.title}</span>
              <span class="score-pill ${a.severity === 'HIGH' ? 'critical' : 'warning'}">${a.severity}</span>
            </div>
            <p style="font-size:0.85rem; margin-bottom:0.4rem;">${a.message}</p>
            <div style="font-size:0.78rem; color:var(--cms-primary); font-weight:600;">Action: ${a.recommendation}</div>
          </div>
        `).join('');
      }
    }
  } catch (err) {
    console.warn('[GSC Telemetry]', err);
  }
}

/* ==========================================================================
   MODULE 8: PRODUCTS MANAGEMENT
   ========================================================================== */
async function loadProductsList() {
  const tbody = document.getElementById('productsTableBody');
  if (!tbody) return;

  try {
    const res = await fetch('/api/v2/products');
    const data = await res.json();
    if (data.success && data.products) {
      tbody.innerHTML = data.products.map(p => `
        <tr>
          <td>
            <div style="display:flex; align-items:center; gap:0.75rem;">
              <img src="${p.featured_image_url || '/images/products/essl-k90-pro.png'}" style="width:40px; height:40px; object-fit:contain; border-radius:4px; background:#fff; border:1px solid #e2e8f0;">
              <div>
                <strong>${p.name}</strong>
                <div style="font-size:0.75rem; color:var(--cms-muted);">${p.model || p.slug}</div>
              </div>
            </div>
          </td>
          <td>${p.brand}</td>
          <td>${p.category}</td>
          <td>₹${p.price ? p.price.toLocaleString() : 'Enquire'}</td>
          <td><span class="score-pill ${p.availability === 'in_stock' ? 'pass' : 'critical'}">${p.availability.replace('_', ' ').toUpperCase()}</span></td>
          <td>
            <a href="/products/${p.slug}" target="_blank" class="cms-btn cms-btn-outline cms-btn-sm">Inspect ↗</a>
          </td>
        </tr>
      `).join('');
    }
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="6" style="color:var(--cms-danger); text-align:center;">Failed to load products.</td></tr>';
  }
}

/* ==========================================================================
   MODULE 12: MEDIA UPLOADER
   ========================================================================== */
function initMediaUploader() {
  const form = document.getElementById('mediaUploadForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fileInput = document.getElementById('mediaFileInput');
      if (!fileInput.files[0]) {
        alert('Please choose an image file.');
        return;
      }

      const formData = new FormData();
      formData.append('file', fileInput.files[0]);
      formData.append('altText', document.getElementById('mediaAltTextInput')?.value || '');

      try {
        const res = await fetch('/api/v2/media/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.success) {
          alert('Image uploaded and optimized successfully!');
          fileInput.value = '';
          loadMediaLibrary();
        } else {
          alert('Upload failed: ' + data.message);
        }
      } catch (err) {
        alert('Communication error during upload.');
      }
    });
  }
}

async function loadMediaLibrary() {
  const grid = document.getElementById('mediaLibraryGrid');
  if (!grid) return;

  try {
    const res = await fetch('/api/v2/media');
    const data = await res.json();
    if (data.success && data.media) {
      if (data.media.length === 0) {
        grid.innerHTML = '<div style="color:var(--cms-muted); padding:2rem; text-align:center; grid-column:1/-1;">No uploaded images yet. Use the upload box above.</div>';
        return;
      }
      grid.innerHTML = data.media.map(m => `
        <div style="border:1px solid var(--cms-border); border-radius:8px; overflow:hidden; background:var(--cms-surface);">
          <img src="${m.url_original}" style="width:100%; height:140px; object-fit:contain; background:#f8fafc; padding:0.5rem;">
          <div style="padding:0.75rem;">
            <div style="font-size:0.8rem; font-weight:700; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${m.original_name}</div>
            <div style="font-size:0.72rem; color:var(--cms-muted); margin-bottom:0.4rem;">${(m.file_size_bytes / 1024).toFixed(1)} KB</div>
            <input type="text" value="${m.url_original}" readonly onclick="this.select(); navigator.clipboard.writeText(this.value); alert('Image URL copied!');" class="cms-input" style="font-size:0.75rem; padding:0.25rem 0.4rem;">
          </div>
        </div>
      `).join('');
    }
  } catch (err) {
    grid.innerHTML = '<div style="color:var(--cms-danger); padding:1rem;">Failed to load media items.</div>';
  }
}

/* ==========================================================================
   MODULE 13: PDF UPLOADER
   ========================================================================== */
function initPdfUploader() {
  const form = document.getElementById('pdfUploadForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fileInput = document.getElementById('pdfFileInput');
      if (!fileInput.files[0]) {
        alert('Please choose a PDF file.');
        return;
      }

      const formData = new FormData();
      formData.append('file', fileInput.files[0]);
      formData.append('title', document.getElementById('pdfTitleInput')?.value || '');
      formData.append('category', document.getElementById('pdfCategorySelect')?.value || 'brochures');
      formData.append('description', document.getElementById('pdfDescInput')?.value || '');

      try {
        const res = await fetch('/api/v2/pdf/upload', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.success) {
          alert('PDF document published successfully!');
          fileInput.value = '';
          loadPdfLibrary();
        } else {
          alert('Upload failed: ' + data.message);
        }
      } catch (err) {
        alert('Communication error during PDF upload.');
      }
    });
  }
}

async function loadPdfLibrary() {
  const tbody = document.getElementById('pdfTableBody');
  if (!tbody) return;

  try {
    const res = await fetch('/api/v2/pdf');
    const data = await res.json();
    if (data.success && data.pdfs) {
      tbody.innerHTML = data.pdfs.map(p => `
        <tr>
          <td><strong>${p.title}</strong></td>
          <td style="text-transform:capitalize;">${p.category}</td>
          <td>${(p.file_size_bytes / (1024 * 1024)).toFixed(2)} MB</td>
          <td><span class="score-pill pass">${p.download_count} DLs</span></td>
          <td>
            <a href="${p.public_url}" target="_blank" download class="cms-btn cms-btn-outline cms-btn-sm">Download ↗</a>
            <button class="cms-btn cms-btn-outline cms-btn-sm" onclick="navigator.clipboard.writeText('${p.public_url}'); alert('Download link copied!');">Copy Link</button>
          </td>
        </tr>
      `).join('');
    }
  } catch (err) {
    tbody.innerHTML = '<tr><td colspan="5" style="color:var(--cms-danger); text-align:center;">Failed to load PDF library.</td></tr>';
  }
}

/* ==========================================================================
   MODULE 9: SCHEMA BUILDER
   ========================================================================== */
function initSchemaBuilder() {
  const btn = document.getElementById('btnBuildSchema');
  const typeSelect = document.getElementById('schemaTypeSelect');
  const codeBox = document.getElementById('schemaOutputCode');

  if (btn && typeSelect && codeBox) {
    btn.addEventListener('click', async () => {
      const type = typeSelect.value;
      try {
        const res = await fetch('/api/v2/schema/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, data: { title: 'Biometric Attendance Systems Guide', name: 'eSSL K90 Pro' } })
        });
        const data = await res.json();
        if (data.success) {
          codeBox.textContent = JSON.stringify(data.schema, null, 2);
        }
      } catch (err) {
        codeBox.textContent = '// Failed to generate schema';
      }
    });
  }
}

/* ==========================================================================
   MODULE 10: INTERNAL LINKS RECOMMENDATION
   ========================================================================== */
function initInternalLinksTool() {
  const btn = document.getElementById('btnScanLinks');
  const resultBox = document.getElementById('internalLinksResults');

  if (btn && resultBox) {
    btn.addEventListener('click', async () => {
      const content = document.getElementById('articleContent')?.value || '';
      resultBox.innerHTML = '<div style="padding:1rem;">Scanning corpus for link opportunities and orphan pages...</div>';

      try {
        const res = await fetch('/api/v2/links/recommend', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ contentHtml: content })
        });
        const data = await res.json();
        if (data.success) {
          resultBox.innerHTML = `
            <div style="margin-bottom:1rem;">
              <h4 style="margin-bottom:0.4rem;">Contextual Anchor Recommendations (${data.recommendationsCount})</h4>
              ${data.recommendations.map(r => `
                <div style="border:1px solid var(--cms-border); border-radius:6px; padding:0.75rem; margin-bottom:0.5rem; background:var(--cms-surface);">
                  <div style="font-weight:700; color:var(--cms-text);">${r.targetTitle}</div>
                  <div style="font-size:0.8rem; color:var(--cms-primary);">URL: <code>${r.targetUrl}</code> | Anchor: <strong>"${r.anchorTextSuggestion}"</strong></div>
                  <div style="font-size:0.78rem; color:var(--cms-muted);">${r.context}</div>
                </div>
              `).join('')}
            </div>

            <div style="margin-top:1.5rem;">
              <h4 style="margin-bottom:0.4rem; color:var(--cms-danger);">Detected Orphan Pages (${data.orphanPagesDetected.length})</h4>
              ${data.orphanPagesDetected.map(o => `
                <div style="border:1px solid var(--cms-border); border-left:3px solid var(--cms-danger); padding:0.6rem; margin-bottom:0.4rem; font-size:0.82rem;">
                  <strong>${o.title}</strong> (<code>${o.url}</code>): ${o.issue}
                </div>
              `).join('')}
            </div>
          `;
        }
      } catch (err) {
        resultBox.innerHTML = '<div style="color:var(--cms-danger);">Failed to analyze internal links.</div>';
      }
    });
  }
}

/* ==========================================================================
   MODULE 14 & 15: WEBSITE SEO AUDIT
   ========================================================================== */
function initSiteAuditTool() {
  const btn = document.getElementById('btnRunSiteAudit');
  const resultBox = document.getElementById('siteAuditResults');

  if (btn && resultBox) {
    btn.addEventListener('click', async () => {
      btn.disabled = true;
      btn.innerHTML = '<span>Scanning all website routes...</span>';
      resultBox.innerHTML = '<div style="padding:1.5rem; text-align:center;">Crawling articles, products, sitemaps, and checking Core Web Vitals...</div>';

      try {
        const res = await fetch('/api/v2/audit/run', { method: 'POST' });
        const data = await res.json();
        if (data.success && data.report) {
          const r = data.report;
          resultBox.innerHTML = `
            <div style="display:flex; align-items:center; gap:1.5rem; padding:1.25rem; background:var(--cms-surface); border:1px solid var(--cms-border); border-radius:8px; margin-bottom:1.5rem;">
              <div class="seo-score-circle" style="background:${r.healthScore >= 80 ? 'var(--cms-success)' : 'var(--cms-warning)'};">
                <span class="num">${r.healthScore}</span>
                <span class="total">/100 Health</span>
              </div>
              <div>
                <h3 style="margin:0 0 0.3rem 0;">SEO Site Audit Completed</h3>
                <p style="margin:0; font-size:0.85rem; color:var(--cms-muted);">Crawled <strong>${r.pagesAudited} pages</strong>. Found <strong>${r.summary.critical} critical issues</strong>, <strong>${r.summary.warnings} warnings</strong>, and <strong>${r.summary.notices} notices</strong>.</p>
              </div>
            </div>

            <h4 style="margin-bottom:0.75rem;">Prioritized Action Plan:</h4>
            ${r.actionPlan.highPriority.map(i => `
              <div style="border:1px solid var(--cms-border); border-left:4px solid var(--cms-danger); padding:1rem; border-radius:6px; margin-bottom:0.6rem; background:var(--cms-surface);">
                <div style="display:flex; justify-content:space-between; font-weight:700; margin-bottom:0.25rem;">
                  <span>${i.issue}</span>
                  <span class="score-pill critical">HIGH PRIORITY</span>
                </div>
                <div style="font-size:0.8rem; color:var(--cms-primary); margin-bottom:0.3rem;">Target URL: <code>${i.url}</code></div>
                <div style="font-size:0.78rem; color:var(--cms-muted); margin-bottom:0.4rem;">${i.reasoning}</div>
                <div style="font-size:0.78rem; font-weight:600; color:var(--cms-success);">Fix: ${i.recommendedFix}</div>
              </div>
            `).join('')}
            ${r.actionPlan.mediumPriority.map(i => `
              <div style="border:1px solid var(--cms-border); border-left:4px solid var(--cms-warning); padding:1rem; border-radius:6px; margin-bottom:0.6rem; background:var(--cms-surface);">
                <div style="display:flex; justify-content:space-between; font-weight:700; margin-bottom:0.25rem;">
                  <span>${i.issue}</span>
                  <span class="score-pill warning">MEDIUM PRIORITY</span>
                </div>
                <div style="font-size:0.8rem; color:var(--cms-primary); margin-bottom:0.3rem;">Target URL: <code>${i.url}</code></div>
                <div style="font-size:0.78rem; color:var(--cms-muted); margin-bottom:0.4rem;">${i.reasoning}</div>
                <div style="font-size:0.78rem; font-weight:600; color:var(--cms-primary);">Fix: ${i.recommendedFix}</div>
              </div>
            `).join('')}
          `;
        }
      } catch (err) {
        resultBox.innerHTML = '<div style="color:var(--cms-danger);">Failed to execute site audit.</div>';
      } finally {
        btn.disabled = false;
        btn.innerHTML = '<span>Run Full Technical SEO Audit</span>';
      }
    });
  }
}

/* ==========================================================================
   MODULE: LEADS MANAGER (100% PRESERVED & ENHANCED)
   ========================================================================== */
function initLeadsManager() {
  document.querySelectorAll('.cms-status-select').forEach(select => {
    select.addEventListener('change', async (e) => {
      const leadId = select.getAttribute('data-lead-id');
      const newStatus = select.value;
      select.style.opacity = '0.5';

      try {
        const res = await fetch(`/api/cms/leads/${leadId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus.toLowerCase() })
        });
        const data = await res.json();
        if (data.success) {
          select.style.opacity = '1';
          select.style.borderColor = '#10b981';
          setTimeout(() => { select.style.borderColor = '#cbd5e1'; }, 1500);
        } else {
          alert('Failed to update: ' + data.message);
          select.style.opacity = '1';
        }
      } catch (err) {
        alert('Server communication error.');
        select.style.opacity = '1';
      }
    });
  });
}
