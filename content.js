// Job Listing Highlighter Content Script

const DEFAULT_RULES = {
  preferred: ['greenhouse.io', 'lever.co', 'ashbyhq.com'],
  warning: ['myworkdayjobs.com', 'successfactors.com', 'ultipro.com'],
  blocked: [],
  company: ['careers', 'jobs', 'apply']
};

let highlightRules = DEFAULT_RULES;

// Load rules from storage
chrome.storage.sync.get(['highlightRules'], (result) => {
  if (result.highlightRules) {
    highlightRules = result.highlightRules;
  }
  highlightLinks();
});

// Listen for rule updates
chrome.storage.onChanged.addListener((changes) => {
  if (changes.highlightRules) {
    highlightRules = changes.highlightRules.newValue;
    highlightLinks();
  }
});

function matchesRule(url, domains) {
  return domains.some(domain => url.includes(domain));
}

function highlightLinks() {
  // Remove existing highlights
  document.querySelectorAll('.job-highlight-preferred, .job-highlight-warning, .job-highlight-blocked, .job-highlight-company').forEach(el => {
    el.classList.remove('job-highlight-preferred', 'job-highlight-warning', 'job-highlight-blocked', 'job-highlight-company');
  });

  // Find all links
  const links = document.querySelectorAll('a[href]');
  
  links.forEach(link => {
    const href = link.getAttribute('href');
    if (!href) return;

    // Handle relative URLs
    let fullUrl;
    try {
      fullUrl = new URL(href, window.location.href).href;
    } catch (e) {
      return;
    }

    // Check against rules
    const isPreferred = matchesRule(fullUrl, highlightRules.preferred);
    const isWarning = matchesRule(fullUrl, highlightRules.warning);
    const isBlocked = matchesRule(fullUrl, highlightRules.blocked);
    const isCompany = matchesRule(fullUrl, highlightRules.company);
    
    if (isBlocked) {
      link.classList.add('job-highlight-blocked');
      addBadge(link, '🚫', 'Blocked');
    } else if (isWarning) {
      link.classList.add('job-highlight-warning');
      addBadge(link, '⚠️', 'Warning');
    } else if (isPreferred) {
      link.classList.add('job-highlight-preferred');
      addBadge(link, '✓', 'Preferred');
    } else if (isCompany) {
      // Only highlight as company page if it doesn't match any ATS
      link.classList.add('job-highlight-company');
      addBadge(link, '🏢', 'Company Page');
    }
  });
}

function addBadge(link, icon, title) {
  // Check if badge already exists
  if (link.querySelector('.job-badge')) return;

  const badge = document.createElement('span');
  badge.className = 'job-badge';
  badge.textContent = icon;
  badge.title = title;
  
  // Insert badge at the beginning of the link
  link.insertBefore(badge, link.firstChild);
}

// Re-run highlighting when DOM changes (for dynamically loaded content)
const observer = new MutationObserver(() => {
  highlightLinks();
});

observer.observe(document.body, {
  childList: true,
  subtree: true
});

// Initial highlight
highlightLinks();