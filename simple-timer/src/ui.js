/**
 * DOM bindings and render functions for the timer UI.
 * Subscribes to state changes; never manages intervals directly.
 */

import {
  selectPreset,
  start,
  pause,
  reset,
  subscribe,
  initState,
} from './state.js';
import { formatTime } from './timer.js';

/** @type {NodeListOf<HTMLButtonElement> | null} */
let presetButtons = null;

/** @type {HTMLElement | null} */
let countdownEl = null;

/** @type {HTMLElement | null} */
let completionEl = null;

/** @type {HTMLElement | null} */
let idleHintEl = null;

/** @type {HTMLButtonElement | null} */
let letsGoButton = null;

/** @type {HTMLButtonElement | null} */
let pauseButton = null;

/** @type {HTMLButtonElement | null} */
let startOverButton = null;

/**
 * Handles preset button click — reads duration from data-minutes attribute.
 * @param {Event} event
 */
function handlePresetClick(event) {
  const button = event.currentTarget;
  if (!(button instanceof HTMLButtonElement)) {
    return;
  }

  const minutes = Number(button.dataset.minutes);
  selectPreset(minutes);
}

/**
 * Starts or resumes the countdown.
 */
function handleLetsGoClick() {
  start();
}

/**
 * Pauses the running countdown.
 */
function handlePauseClick() {
  pause();
}

/**
 * Resets the timer to the selected preset duration.
 */
function handleStartOverClick() {
  reset();
}

/**
 * Updates preset button selection and disabled states.
 * @param {ReturnType<typeof import('./state.js').getState>} state
 */
function renderPresets(state) {
  if (!presetButtons) {
    return;
  }

  const isDisabled =
    state.status === 'running' ||
    state.status === 'paused';

  presetButtons.forEach((button) => {
    const minutes = Number(button.dataset.minutes);
    const isSelected = minutes === state.presetMinutes;

    button.classList.toggle('selected', isSelected);
    button.setAttribute('aria-pressed', String(isSelected));
    button.classList.toggle('disabled', isDisabled);
    button.disabled = isDisabled;
  });
}

/**
 * Updates the countdown display with formatted remaining time.
 * @param {ReturnType<typeof import('./state.js').getState>} state
 */
function renderCountdown(state) {
  if (!countdownEl) {
    return;
  }

  countdownEl.textContent = formatTime(state.remainingMs);
}

/**
 * Toggles completion message visibility based on timer state.
 * @param {ReturnType<typeof import('./state.js').getState>} state
 */
function renderCompletionMessage(state) {
  if (!completionEl) {
    return;
  }

  if (state.status === 'complete') {
    completionEl.style.visibility = 'visible';
    completionEl.setAttribute('aria-hidden', 'false');
  } else {
    completionEl.style.visibility = 'hidden';
    completionEl.setAttribute('aria-hidden', 'true');
  }
}

/**
 * Shows or hides the idle hint after first preset interaction.
 * @param {ReturnType<typeof import('./state.js').getState>} state
 */
function renderIdleHint(state) {
  if (!idleHintEl) {
    return;
  }

  idleHintEl.classList.toggle('hidden', state.hasInteractedWithPreset);
}

/**
 * Updates control button visibility per state matrix.
 * @param {ReturnType<typeof import('./state.js').getState>} state
 */
function renderControls(state) {
  if (!letsGoButton || !pauseButton || !startOverButton) {
    return;
  }

  switch (state.status) {
    case 'idle':
      letsGoButton.hidden = false;
      pauseButton.hidden = true;
      startOverButton.hidden = false;
      break;
    case 'running':
      letsGoButton.hidden = true;
      pauseButton.hidden = false;
      startOverButton.hidden = false;
      break;
    case 'paused':
      letsGoButton.hidden = false;
      pauseButton.hidden = true;
      startOverButton.hidden = false;
      break;
    case 'complete':
      letsGoButton.hidden = true;
      pauseButton.hidden = true;
      startOverButton.hidden = false;
      break;
    default:
      break;
  }
}

/**
 * Orchestrates all sub-render functions for a state snapshot.
 * @param {ReturnType<typeof import('./state.js').getState>} state
 */
function render(state) {
  renderPresets(state);
  renderCountdown(state);
  renderCompletionMessage(state);
  renderIdleHint(state);
  renderControls(state);
}

/**
 * Caches DOM references and wires event listeners.
 */
export function initUI() {
  presetButtons = document.querySelectorAll('.preset');
  countdownEl = document.querySelector('.countdown');
  completionEl = document.querySelector('.completion');
  idleHintEl = document.querySelector('.idle-hint');
  letsGoButton = document.querySelector('.btn-primary');
  pauseButton = document.querySelector('.btn-pause');
  startOverButton = document.querySelector('.btn-start-over');

  const requiredElements = [
    { selector: '.countdown', element: countdownEl },
    { selector: '.completion', element: completionEl },
    { selector: '.btn-primary', element: letsGoButton },
    { selector: '.btn-pause', element: pauseButton },
    { selector: '.btn-start-over', element: startOverButton },
  ];

  requiredElements.forEach(({ selector, element }) => {
    if (!element) {
      console.warn(`initUI: missing required element "${selector}"`);
    }
  });

  if (!presetButtons || presetButtons.length === 0) {
    console.warn('initUI: missing required preset buttons');
  }

  presetButtons.forEach((button) => {
    button.addEventListener('click', handlePresetClick);
  });

  if (letsGoButton) {
    letsGoButton.addEventListener('click', handleLetsGoClick);
  }

  if (pauseButton) {
    pauseButton.addEventListener('click', handlePauseClick);
  }

  if (startOverButton) {
    startOverButton.addEventListener('click', handleStartOverClick);
  }

  subscribe(render);
  initState();
}
