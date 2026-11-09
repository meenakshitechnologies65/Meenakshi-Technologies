/**
 * CMS MANAGEMENT v2.0 - CLIENT LIVE RANK MATH SEO ENGINE
 * Real-time keystroke diagnostics, debounced API calculation,
 * and dynamic visual gauge updates.
 */

class LiveSeoAnalyzer {
  constructor(options = {}) {
    this.gaugeEl = document.getElementById(options.gaugeId || 'liveSeoGauge');
    this.scoreNumEl = document.getElementById(options.scoreNumId || 'liveSeoScoreNum');
    this.scoreGradeEl = document.getElementById(options.scoreGradeId || 'liveSeoGrade');
    this.checksContainer = document.getElementById(options.checksContainerId || 'liveSeoChecksList');
    this.debounceTimer = null;
    this.currentCategory = 'basic';

    this.initListeners();
  }

  initListeners() {
    const fields = ['articleTitle', 'articleSlug', 'articleKeyword', 'articleMetaDesc', 'articleContent', 'articleCanonical', 'articleSchema'];
    fields.forEach(id => {
      const el = document.getElementById(id);
      if (el) {
        el.addEventListener('input', () => this.triggerAnalysis());
        el.addEventListener('change', () => this.triggerAnalysis());
      }
    });

    // Category tabs
    document.querySelectorAll('.seo-tab-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        document.querySelectorAll('.seo-tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.currentCategory = btn.getAttribute('data-cat') || 'basic';
        this.renderChecks();
      });
    });
  }

  triggerAnalysis() {
    clearTimeout(this.debounceTimer);
    this.debounceTimer = setTimeout(() => this.runAnalysis(), 300);
  }

  async runAnalysis() {
    const payload = {
      title: document.getElementById('articleTitle')?.value || '',
      seoTitle: document.getElementById('articleSeoTitle')?.value || document.getElementById('articleTitle')?.value || '',
      slug: document.getElementById('articleSlug')?.value || '',
      focusKeyword: document.getElementById('articleKeyword')?.value || '',
      metaDescription: document.getElementById('articleMetaDesc')?.value || '',
      contentHtml: this.getContent(),
      canonicalUrl: document.getElementById('articleCanonical')?.value || '',
      schemaType: document.getElementById('articleSchema')?.value || 'Article'
    };

    try {
      const res = await fetch('/api/v2/seo/score', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        this.lastAnalysis = data;
        this.updateGauge(data.score, data.grade, data.badgeColor);
        this.renderChecks();
      }
    } catch (err) {
      console.warn('[Live SEO] Analysis communication notice:', err);
    }
  }

  getContent() {
    const editor = document.getElementById('articleContent');
    return editor ? editor.value : '';
  }

  updateGauge(score, grade, color) {
    if (this.scoreNumEl) this.scoreNumEl.textContent = score;
    if (this.scoreGradeEl) this.scoreGradeEl.textContent = grade;
    if (this.gaugeEl) {
      this.gaugeEl.style.backgroundColor = color;
    }
  }

  renderChecks() {
    if (!this.lastAnalysis || !this.checksContainer) return;
    const catList = this.lastAnalysis.categories[this.currentCategory] || [];

    if (catList.length === 0) {
      this.checksContainer.innerHTML = '<div style="color:var(--cms-muted); font-size:0.8rem; padding:1rem 0;">No diagnostic checks in this category.</div>';
      return;
    }

    this.checksContainer.innerHTML = catList.map(c => `
      <div class="seo-check-item">
        <div class="seo-check-header">
          <span>${c.name}</span>
          <span class="score-pill ${c.status}">${c.status.toUpperCase()}</span>
        </div>
        ${c.issue ? `<div class="seo-check-desc" style="color:var(--cms-danger);">${c.issue}</div>` : ''}
        <div class="seo-check-desc">${c.whyItMatters}</div>
        <div class="seo-check-fix">💡 Fix: ${c.recommendation}</div>
      </div>
    `).join('');
  }
}

// Auto-instantiate if DOM element is present
document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('liveSeoGauge')) {
    window.seoAnalyzer = new LiveSeoAnalyzer();
    window.seoAnalyzer.runAnalysis();
  }
});
