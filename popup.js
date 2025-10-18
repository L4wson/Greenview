// Popup script for Job Listing Highlighter

const DEFAULT_RULES = {
  preferred: ['greenhouse.io', 'lever.co', 'ashbyhq.com'],
  warning: ['myworkdayjobs.com', 'successfactors.com', 'ultipro.com'],
  blocked: [],
  company: ['careers', 'jobs', 'apply']
};

// Initialize storage with defaults if empty
chrome.storage.sync.get(['highlightRules'], (result) => {
  if (!result.highlightRules) {
    // First time setup - save defaults
    chrome.storage.sync.set({ highlightRules: DEFAULT_RULES }, () => {
      console.log('Initialized with default rules');
      loadSettings();
    });
  } else {
    loadSettings();
  }
});

function loadSettings() {
  chrome.storage.sync.get(['highlightRules'], (result) => {
    const rules = result.highlightRules || DEFAULT_RULES;
    
    document.getElementById('preferred').value = (rules.preferred || []).join('\n');
    document.getElementById('company').value = (rules.company || []).join('\n');
    document.getElementById('warning').value = (rules.warning || []).join('\n');
    document.getElementById('blocked').value = (rules.blocked || []).join('\n');
    
    console.log('Loaded rules:', rules);
  });
}

// Save settings
document.getElementById('save').addEventListener('click', () => {
  const preferred = document.getElementById('preferred').value
    .split('\n')
    .map(s => s.trim())
    .filter(s => s.length > 0);
  
  const company = document.getElementById('company').value
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

  const rules = { preferred, company, warning, blocked };

  chrome.storage.sync.set({ highlightRules: rules }, () => {
    // Show success message
    const status = document.getElementById('status');
    status.textContent = '✓ Settings saved! Reload pages to see changes.';
    status.className = 'status success';
    status.style.display = 'block';

    // Log for debugging
    console.log('Saved rules:', rules);

    setTimeout(() => {
      status.style.display = 'none';
    }, 3000);
  });
});

// Add reset button functionality
document.getElementById('reset').addEventListener('click', () => {
  if (confirm('Reset to default settings? This will erase your custom rules.')) {
    chrome.storage.sync.set({ highlightRules: DEFAULT_RULES }, () => {
      loadSettings();
      const status = document.getElementById('status');
      status.textContent = '✓ Reset to defaults!';
      status.className = 'status success';
      status.style.display = 'block';
      
      setTimeout(() => {
        status.style.display = 'none';
      }, 2000);
    });
  }
});