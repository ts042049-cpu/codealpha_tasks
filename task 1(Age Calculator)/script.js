/**
 * Age Calculator — script.js
 * Calculates exact age (years, months, days) from a given Date of Birth.
 * Uses the JavaScript Date object and DOM manipulation.
 */

// ─── DOM References ───────────────────────────────────────────────────────────
const dobInput      = document.getElementById('dob');
const calcBtn       = document.getElementById('calcBtn');
const resultSection = document.getElementById('resultSection');
const errorMsg      = document.getElementById('errorMsg');
const currentDateEl = document.getElementById('current-date');

const resYears  = document.getElementById('res-years');
const resMonths = document.getElementById('res-months');
const resDays   = document.getElementById('res-days');
const sentence  = document.getElementById('resultSentence');

// ─── Show Today's Date ────────────────────────────────────────────────────────
/**
 * Formats a Date object into a human-friendly string.
 * e.g. "Tuesday, 19 May 2026"
 */
function formatDate(date) {
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day:     'numeric',
    month:   'long',
    year:    'numeric'
  });
}

// Display current date in the subtitle and restrict future dates in the input
const today = new Date();
currentDateEl.textContent = formatDate(today);

// Restrict the date-picker so users can't pick a future date
const todayISO = today.toISOString().split('T')[0]; // "YYYY-MM-DD"
dobInput.setAttribute('max', todayISO);

// ─── Utility: Show / Hide UI Elements ────────────────────────────────────────
function showError(msg) {
  errorMsg.textContent = msg;
  errorMsg.hidden = false;
  resultSection.hidden = true;
}

function hideError() {
  errorMsg.hidden = true;
  errorMsg.textContent = '';
}

// ─── Core: Calculate Age ──────────────────────────────────────────────────────
/**
 * Calculates the exact difference between two dates.
 * Returns { years, months, days }.
 *
 * Algorithm:
 * 1. Start with the raw difference in calendar fields.
 * 2. If the day component is negative, borrow from months (using last month's days).
 * 3. If the month component is negative, borrow 12 months from years.
 */
function calculateAge(dob, today) {
  let years  = today.getFullYear() - dob.getFullYear();
  let months = today.getMonth()    - dob.getMonth();
  let days   = today.getDate()     - dob.getDate();

  // If days are negative, borrow from the previous month
  if (days < 0) {
    months -= 1; // reduce a month
    // Get the number of days in the previous month relative to today
    const prevMonth = new Date(today.getFullYear(), today.getMonth(), 0);
    days += prevMonth.getDate();
  }

  // If months are negative, borrow from the year
  if (months < 0) {
    years  -= 1;
    months += 12;
  }

  return { years, months, days };
}

// ─── Animate Number Change ────────────────────────────────────────────────────
/**
 * Briefly pops a tile to draw attention to the updated value.
 */
function popTile(tileId) {
  const tile = document.getElementById(tileId);
  tile.style.transform = 'scale(1.12)';
  tile.style.transition = 'transform 0.2s cubic-bezier(0.34, 1.56, 0.64, 1)';
  setTimeout(() => {
    tile.style.transform = '';
  }, 300);
}

// ─── Main Handler ─────────────────────────────────────────────────────────────
function handleCalculate() {
  hideError();

  // 1. Validate: field must not be empty
  const dobValue = dobInput.value;
  if (!dobValue) {
    showError('⚠️ Please select your date of birth first.');
    return;
  }

  // 2. Parse the DOB
  const dob = new Date(dobValue);

  // 3. Validate: DOB must not be in the future (belt-and-suspenders check)
  if (dob > today) {
    showError('⚠️ Date of birth cannot be in the future. Please choose a valid date.');
    return;
  }

  // 4. Calculate
  const age = calculateAge(dob, today);

  // 5. Update DOM
  resYears.textContent  = age.years;
  resMonths.textContent = age.months;
  resDays.textContent   = age.days;

  // Build the sentence with highlighted numbers
  sentence.innerHTML =
    `You are <strong>${age.years}</strong> year${age.years !== 1 ? 's' : ''},
     <strong>${age.months}</strong> month${age.months !== 1 ? 's' : ''}, and
     <strong>${age.days}</strong> day${age.days !== 1 ? 's' : ''} old.`;

  // 6. Show result section
  resultSection.hidden = false;
  // Re-trigger the fade-in animation
  resultSection.style.animation = 'none';
  void resultSection.offsetWidth; // force reflow
  resultSection.style.animation = '';

  // 7. Pop each tile for visual delight
  ['tile-years', 'tile-months', 'tile-days'].forEach((id, i) => {
    setTimeout(() => popTile(id), i * 80);
  });
}

// ─── Event Listeners ──────────────────────────────────────────────────────────
// Button click
calcBtn.addEventListener('click', handleCalculate);

// Allow Enter key while input is focused
dobInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') handleCalculate();
});

// Clear error as soon as user changes the date
dobInput.addEventListener('change', hideError);
