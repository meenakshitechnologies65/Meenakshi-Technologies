/**
 * CMS MANAGEMENT v2.0 - VISUAL GUTENBERG-STYLE BLOCK EDITOR
 * Drag-and-drop block insertions, HTML formatting, tables, FAQs,
 * product cards, and PDF download blocks.
 */

class BlockEditor {
  constructor(canvasId, textareaId) {
    this.canvas = document.getElementById(canvasId);
    this.textarea = document.getElementById(textareaId);
    this.initToolbar();
  }

  initToolbar() {
    document.querySelectorAll('.cms-tool-btn[data-block]').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const blockType = btn.getAttribute('data-block');
        this.insertBlock(blockType);
      });
    });
  }

  insertBlock(type) {
    let html = '';
    switch (type) {
      case 'h2':
        html = `\n<h2>Subheading Title</h2>\n<p>Explain the details and context for this section here...</p>\n`;
        break;
      case 'h3':
        html = `\n<h3>Detailed Technical Point</h3>\n<p>Further specifications or operational details...</p>\n`;
        break;
      case 'paragraph':
        html = `\n<p>Write your detailed, informative paragraph here with natural terminology.</p>\n`;
        break;
      case 'callout':
        html = `\n<div class="cms-callout-box" style="padding:1.25rem; background:#f0f9ff; border-left:4px solid #0284c7; border-radius:6px; margin:1.25rem 0;">\n  <h4 style="margin:0 0 0.5rem 0; color:#0369a1;">Pro Tip / Key Consideration</h4>\n  <p style="margin:0; font-size:0.95rem;">Highlight critical operational tips or essential client advice here.</p>\n</div>\n`;
        break;
      case 'table':
        html = `\n<table style="width:100%; border-collapse:collapse; margin:1.25rem 0;">\n  <thead>\n    <tr style="background:#f1f5f9;">\n      <th style="padding:0.6rem; border:1px solid #cbd5e1;">Feature</th>\n      <th style="padding:0.6rem; border:1px solid #cbd5e1;">Model Specification</th>\n      <th style="padding:0.6rem; border:1px solid #cbd5e1;">Enterprise Advantage</th>\n    </tr>\n  </thead>\n  <tbody>\n    <tr>\n      <td style="padding:0.6rem; border:1px solid #cbd5e1;"><strong>Fingerprint Capacity</strong></td>\n      <td style="padding:0.6rem; border:1px solid #cbd5e1;">2,000 Templates</td>\n      <td style="padding:0.6rem; border:1px solid #cbd5e1;">Zero buddy-punching</td>\n    </tr>\n    <tr>\n      <td style="padding:0.6rem; border:1px solid #cbd5e1;"><strong>Connectivity</strong></td>\n      <td style="padding:0.6rem; border:1px solid #cbd5e1;">TCP/IP &amp; Wi-Fi</td>\n      <td style="padding:0.6rem; border:1px solid #cbd5e1;">Instant cloud sync</td>\n    </tr>\n  </tbody>\n</table>\n`;
        break;
      case 'image':
        html = `\n<figure style="margin:1.5rem 0; text-align:center;">\n  <img src="/images/products/essl-k90-pro.png" alt="Biometric machine installation in Hyderabad" style="max-width:100%; height:auto; border-radius:8px; box-shadow:0 4px 6px -1px rgba(0,0,0,0.1);">\n  <figcaption style="font-size:0.85rem; color:#64748b; margin-top:0.5rem;">eSSL Attendance Machine Hardware Installation</figcaption>\n</figure>\n`;
        break;
      case 'faq':
        html = `\n<div class="faq-accordion" style="margin:1.5rem 0;">\n  <div class="faq-item" style="border:1px solid #e2e8f0; border-radius:8px; padding:1rem; margin-bottom:0.75rem;">\n    <h4 style="margin:0 0 0.4rem 0; color:#0b2545;">Frequently Asked Question Title?</h4>\n    <p style="margin:0; font-size:0.92rem; color:#334155;">Provide a concise, direct answer satisfying user search intent.</p>\n  </div>\n</div>\n`;
        break;
      case 'product':
        html = `\n<div class="cms-product-card" style="border:1.5px solid #0284c7; border-radius:10px; padding:1.25rem; background:#ffffff; margin:1.5rem 0; display:flex; gap:1.25rem; align-items:center;">\n  <img src="/images/products/essl-k30-pro.png" alt="eSSL K30 Pro" style="width:120px; height:auto; border-radius:6px;">\n  <div>\n    <h4 style="margin:0 0 0.4rem 0; font-size:1.15rem; color:#0b2545;">eSSL K30 Pro Biometric Attendance Machine</h4>\n    <p style="margin:0 0 0.6rem 0; font-size:0.88rem; color:#64748b;">Built-in battery backup, access control relay, and free desktop attendance software.</p>\n    <a href="/products/essl-k30-pro-biometric-attendance" target="_blank" style="display:inline-block; padding:0.4rem 0.9rem; background:#0284c7; color:#fff; border-radius:6px; font-weight:600; text-decoration:none; font-size:0.85rem;">View Specifications &amp; Pricing &rarr;</a>\n  </div>\n</div>\n`;
        break;
      case 'pdf':
        html = `\n<div class="cms-pdf-block" style="padding:1.25rem; border:2px dashed #0284c7; border-radius:10px; background:#f0f9ff; text-align:center; margin:1.5rem 0;">\n  <h4 style="margin:0 0 0.4rem 0; color:#0369a1;">Download Official 2026 Product Catalogue</h4>\n  <p style="margin:0 0 0.8rem 0; font-size:0.85rem; color:#64748b;">Complete specifications and wiring schematics for eSSL &amp; Biomax models.</p>\n  <a href="/catalogues/meenakshi-technologies-product-catalogue-2026.pdf" download class="btn btn-primary" style="display:inline-flex; align-items:center; gap:0.4rem; padding:0.5rem 1.25rem; background:#0284c7; color:#fff; border-radius:6px; text-decoration:none; font-weight:700;">\n    <span>Download PDF Brochure (9.8 MB)</span>\n  </a>\n</div>\n`;
        break;
    }

    if (this.textarea) {
      const start = this.textarea.selectionStart || this.textarea.value.length;
      const end = this.textarea.selectionEnd || this.textarea.value.length;
      const text = this.textarea.value;
      this.textarea.value = text.substring(0, start) + html + text.substring(end);
      this.textarea.focus();
      this.textarea.selectionStart = this.textarea.selectionEnd = start + html.length;

      // Trigger live SEO analyzer update
      if (window.seoAnalyzer) {
        window.seoAnalyzer.triggerAnalysis();
      }
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  if (document.getElementById('articleContent')) {
    window.blockEditor = new BlockEditor('blockCanvas', 'articleContent');
  }
});
