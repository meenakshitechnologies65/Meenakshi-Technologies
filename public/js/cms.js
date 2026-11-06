/**
 * MEENAKSHI TECHNOLOGIES - CMS CLIENT LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  initCmsLeadActions();
  initCmsBlogForm();
});

function initCmsLeadActions() {
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
          select.style.backgroundColor = '#ecfdf5';
          setTimeout(() => { 
            select.style.borderColor = '#cbd5e1'; 
            select.style.backgroundColor = '#ffffff'; 
          }, 1500);
        } else {
          alert('Failed to update lead: ' + data.message);
          select.style.opacity = '1';
        }
      } catch (err) {
        console.error(err);
        alert('Server communication error.');
        select.style.opacity = '1';
      }
    });
  });
}

function initCmsBlogForm() {
  const form = document.getElementById('cmsNewPostForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const postData = {
        title: form.querySelector('[name="title"]').value.trim(),
        category: form.querySelector('[name="category"]').value,
        author: form.querySelector('[name="author"]').value.trim() || 'Tingirikar Teja',
        designation: 'Founder, Meenakshi Technologies',
        readTime: form.querySelector('[name="readTime"]').value.trim() || '5 min read',
        summary: form.querySelector('[name="summary"]').value.trim(),
        metaTitle: form.querySelector('[name="metaTitle"]').value.trim(),
        metaDescription: form.querySelector('[name="metaDescription"]').value.trim(),
        content: form.querySelector('[name="content"]').value.trim()
      };

      if (!postData.title || !postData.content) {
        alert('Please provide title and content.');
        return;
      }

      try {
        const res = await fetch('/api/cms/posts', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(postData)
        });
        const data = await res.json();
        if (data.success) {
          alert('Article published successfully!');
          window.location.href = `/blog/${data.post.slug}`;
        } else {
          alert('Error: ' + data.message);
        }
      } catch (err) {
        console.error(err);
        alert('Failed to save article.');
      }
    });
  }
}

