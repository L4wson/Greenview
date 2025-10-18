// --- Cross-browser WebExtension API shim
const API = (typeof browser !== 'undefined') ? browser : chrome;

// Choose storage area. Firefox can lack sync in some profiles; fall back to local.
const storageArea = (API.storage && API.storage.sync) ? API.storage.sync : API.storage.local;

// Default rules used for prefill and first-run initialize
// DEFAULT_RULES in popup.js (or merge into your stored highlightRules)
const DEFAULT_RULES = {
  preferred: [
    'greenhouse.io',        // covers boards.greenhouse.io & job-boards.greenhouse.io
    'lever.co',             // covers jobs.lever.co
    'ashbyhq.com',
    'grnh.se'               // Greenhouse short links seen in the repo
  ],
  warning: [
    'myworkdayjobs.com',
    'successfactors.com',
    'ultipro.com',
    'icims.com',
    'avature.net',
    'taleo.net',            // often shows as *.oraclecloud.com too
    'oraclecloud.com',
    'smartrecruiters.com',
    'bamboohr.com',
    'workable.com',
    'eightfold.ai',
    'recruiting.adp.com',   // ADP
    'dayforcehcm.com'       // Ceridian/Dayforce
  ],
  blocked: [
    // (unchanged — add anything you want to outright hide)
  ],
  company: ['careers', 'jobs', 'apply'] // (unchanged)
};


// Utility: get from storage as a Promise (works for both chrome & browser)
function storageGet(keys) {
  return new Promise((resolve, reject) => {
    try {
      // Support both string and array
      const done = (res) => resolve(res || {});
      // If the API supports promise-returning calls (Firefox browser.* or new chrome.*)
      let p;
      try { p = storageArea.get(keys); } catch {}
      if (p && typeof p.then === 'function') {
        p.then(done).catch(reject);
      } else {
        // Callback form
        storageArea.get(keys, done);
      }
    } catch (e) { reject(e); }
  });
}

function storageSet(obj) {
  return new Promise((resolve, reject) => {
    try {
      let p;
      try { p = storageArea.set(obj); } catch {}
      if (p && typeof p.then === 'function') {
        p.then(resolve).catch(reject);
      } else {
        storageArea.set(obj, resolve);
      }
    } catch (e) { reject(e); }
  });
}

document.addEventListener('DOMContentLoaded', initPopup);

async function initPopup() {
  // Grab elements (guard for null to avoid other runtime errors)
  const preferredEl = document.getElementById('preferred');
  const companyEl   = document.getElementById('company');
  const warningEl   = document.getElementById('warning');
  const blockedEl   = document.getElementById('blocked');
  const statusEl    = document.getElementById('status');
  const saveBtn     = document.getElementById('save');
  const resetBtn    = document.getElementById('reset');

  if (!preferredEl || !companyEl || !warningEl || !blockedEl || !saveBtn || !resetBtn) {
    console.error('Popup elements missing; check popup.html ids match.');
    return;
  }

  // Prefill placeholders AND initial values immediately (so it never looks blank)
  const prefill = (el, list) => {
    const text = (list || []).join('\n');
    el.placeholder = text;
    el.value = text;
  };
  prefill(preferredEl, DEFAULT_RULES.preferred);
  prefill(companyEl,   DEFAULT_RULES.company);
  prefill(warningEl,   DEFAULT_RULES.warning);
  prefill(blockedEl,   DEFAULT_RULES.blocked);

  try {
    // Load saved rules (if any)
    const result = await storageGet(['highlightRules']);  // <- result will be {} if nothing saved
    const saved = result && result.highlightRules;

    const rules = saved ? saved : DEFAULT_RULES;

    // Overwrite fields with saved values if present
    preferredEl.value = (rules.preferred || []).join('\n');
    companyEl.value   = (rules.company   || []).join('\n');
    warningEl.value   = (rules.warning   || []).join('\n');
    blockedEl.value   = (rules.blocked   || []).join('\n');

    // If nothing saved yet, initialize storage so content.js also sees them
    if (!saved) {
      await storageSet({ highlightRules: DEFAULT_RULES });
      console.log('Initialized storage with DEFAULT_RULES');
    }
  } catch (e) {
    console.error('Error loading rules from storage:', e);
    // Keep the prefilled defaults visible
  }

  saveBtn.addEventListener('click', async () => {
    const parse = (el) => el.value.split('\n').map(s => s.trim()).filter(Boolean);
    const rules = {
      preferred: parse(preferredEl),
      company:   parse(companyEl),
      warning:   parse(warningEl),
      blocked:   parse(blockedEl)
    };
    try {
      await storageSet({ highlightRules: rules });
      showStatus(statusEl, '✓ Settings saved! Reload pages to see changes.');
      console.log('Saved rules:', rules);
    } catch (e) {
      showStatus(statusEl, '⚠️ Failed to save settings.', true);
      console.error('Save error:', e);
    }
  });

  resetBtn.addEventListener('click', async () => {
    if (!confirm('Reset to default settings? This will erase your custom rules.')) return;
    try {
      await storageSet({ highlightRules: DEFAULT_RULES });
      preferredEl.value = DEFAULT_RULES.preferred.join('\n');
      companyEl.value   = DEFAULT_RULES.company.join('\n');
      warningEl.value   = DEFAULT_RULES.warning.join('\n');
      blockedEl.value   = DEFAULT_RULES.blocked.join('\n');
      showStatus(statusEl, '✓ Reset to defaults!');
    } catch (e) {
      showStatus(statusEl, '⚠️ Failed to reset.', true);
      console.error('Reset error:', e);
    }
  });
}

function showStatus(el, msg, isError = false) {
  if (!el) return;
  el.textContent = msg;
  el.className = 'status ' + (isError ? 'error' : 'success');
  el.style.display = 'block';
  setTimeout(() => { el.style.display = 'none'; }, 3000);
}
