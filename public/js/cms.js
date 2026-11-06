/**
 * MEENAKSHI TECHNOLOGIES - CMS CLIENT LOGIC
 */

document.addEventListener('DOMContentLoaded', () => {
  initCmsLeadActions();
  initCmsBlogForm();
});

function initCmsLeadActions() {
  document.querySelectorAll('.update-lead-status-btn').forEach(btn => {
    btn.addEventListener('click', async (e) => {
      const leadId = btn.getAttribute('data-lead-id');
      const newStatus = prompt('Enter new status (new, contacted, converted):', 'contacted');

      if (!newStatus) return;

      try {
        const res = await fetch(`/api/cms/leads/${leadId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus.toLowerCase() })
        });
        const data = await res.json();
        if (data.success) {
          window.location.reload();
        } else {
          alert('Failed to update lead: ' + data.message);
        }
      } catch (err) {
        console.error(err);
        alert('Server communication error.');
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
