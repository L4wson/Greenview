// Popup script for Job Listing Highlighter

const DEFAULT_RULES = {
  preferred: ['greenhouse.io', 'lever.co', 'ashbyhq.com'],
  warning: ['myworkdayjobs.com', 'successfactors.com', 'ultipro.com'],
  blocked: []
};

// Load current settings
chrome.storage.sync.get(['highlightRules'], (result) => {
  const rules = result.highlightRules || DEFAULT_RULES;
  
  document.getElementById('preferred').value = rules.preferred.join('\n');
  document.getElementById('warning').value = rules.warning.join('\n');
  document.getElementById('blocked').value = rules.blocked.join('\n');
});

// Save settings
document.getElementById('save').addEventListener('click', () => {
  const preferred = document.getElementById('preferred').value
    .split('\n')
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  const warning = document.getElementById('warning').value
    .split('\n')
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  const blocked = document.getElementById('blocked').value
    .split('\n')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  const rules = { preferred, warning, blocked };

  chrome.storage.sync.set({ highlightRules: rules }, () => {
    // Show success message
    const status = document.getElementById('status');
    status.textContent = 'Settings saved successfully!';
    status.className = 'status success';
    status.style.display = 'block';

    setTimeout(() => {
      status.style.display = 'none';
    }, 2000);
  });
});