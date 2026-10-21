/**
 * Personal Productivity Dashboard
 * Pure Vanilla JavaScript implementation
 * Features:
 * - Real-time Clock & Time-based Greeting
 * - Light / Dark Mode Toggle with Local Storage
 * - Custom Name in Greeting with Local Storage
 * - Customizable Pomodoro Timer (Presets + Custom minutes)
 * - To-Do List with Prevent Duplicate Tasks, Sorting, Edit, and Local Storage
 * - Quick Links with Local Storage CRUD
 */

document.addEventListener('DOMContentLoaded', () => {
  initThemeManager();
  initClockAndGreeting();
  initFocusTimer();
  initTaskManager();
  initQuickLinks();
});

/* ==========================================================================
   1. Theme Manager (Light / Dark Mode)
   ========================================================================== */
function initThemeManager() {
  const STORAGE_KEY = 'dashboard_theme_preference';
  const toggleBtn = document.getElementById('theme-toggle-btn');
  const themeIcon = document.getElementById('theme-icon');
  const themeLabel = document.getElementById('theme-label');

  function getPreferredTheme() {
    const savedTheme = localStorage.getItem(STORAGE_KEY);
    if (savedTheme) {
      return savedTheme;
    }
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  }

  function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEY, theme);

    if (theme === 'dark') {
      themeIcon.textContent = '☀️';
      themeLabel.textContent = 'Light Mode';
      toggleBtn.title = 'Switch to Light Mode';
    } else {
      themeIcon.textContent = '🌙';
      themeLabel.textContent = 'Dark Mode';
      toggleBtn.title = 'Switch to Dark Mode';
    }
  }

  // Initial theme application
  const currentTheme = getPreferredTheme();
  applyTheme(currentTheme);

  toggleBtn.addEventListener('click', () => {
    const activeTheme = document.documentElement.getAttribute('data-theme') || 'light';
    const nextTheme = activeTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
  });
}

/* ==========================================================================
   2. Clock & Custom Name Greeting Module
   ========================================================================== */
function initClockAndGreeting() {
  const NAME_STORAGE_KEY = 'dashboard_user_name';
  const timeDisplay = document.getElementById('time-display');
  const dateDisplay = document.getElementById('date-display');
  const greetingSalutation = document.getElementById('greeting-salutation');
  const greetingName = document.getElementById('greeting-name');
  const editNameBtn = document.getElementById('edit-name-btn');
  const nameEditForm = document.getElementById('name-edit-form');
  const nameInput = document.getElementById('name-input');
  const cancelNameBtn = document.getElementById('cancel-name-btn');

  function getUserName() {
    return localStorage.getItem(NAME_STORAGE_KEY) || 'Friend';
  }

  function setUserName(name) {
    const trimmed = name.trim() || 'Friend';
    localStorage.setItem(NAME_STORAGE_KEY, trimmed);
    greetingName.textContent = trimmed;
  }

  function updateClock() {
    const now = new Date();

    // Format Time: HH:MM:SS
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const seconds = String(now.getSeconds()).padStart(2, '0');
    timeDisplay.textContent = `${hours}:${minutes}:${seconds}`;

    // Format Date: e.g. Tuesday, January 27, 2026
    const dateOptions = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    };
    dateDisplay.textContent = now.toLocaleDateString('en-US', dateOptions);

    // Dynamic greeting based on time of day
    const hour = now.getHours();
    let salutation = 'Good Morning';

    if (hour >= 12 && hour < 17) {
      salutation = 'Good Afternoon';
    } else if (hour >= 17 && hour < 21) {
      salutation = 'Good Evening';
    } else if (hour >= 21 || hour < 5) {
      salutation = 'Good Night';
    }

    greetingSalutation.textContent = salutation;
  }

  // Initialize Name
  greetingName.textContent = getUserName();

  // Name Editing handlers
  function showNameEditForm() {
    nameInput.value = getUserName();
    nameEditForm.classList.remove('hidden');
    nameInput.focus();
    nameInput.select();
  }

  function hideNameEditForm() {
    nameEditForm.classList.add('hidden');
  }

  greetingName.addEventListener('click', showNameEditForm);
  editNameBtn.addEventListener('click', showNameEditForm);

  nameEditForm.addEventListener('submit', (e) => {
    e.preventDefault();
    setUserName(nameInput.value);
    hideNameEditForm();
  });

  cancelNameBtn.addEventListener('click', hideNameEditForm);

  // Initialize clock and update every second
  updateClock();
  setInterval(updateClock, 1000);
}

/* ==========================================================================
   3. Focus Timer Module (Configurable Pomodoro Time)
   ========================================================================== */
function initFocusTimer() {
  const TIMER_STORAGE_KEY = 'dashboard_pomodoro_minutes';
  
  // Default minutes or saved preference
  let currentMinutes = parseInt(localStorage.getItem(TIMER_STORAGE_KEY), 10) || 25;
  let remainingSeconds = currentMinutes * 60;
  let timerInterval = null;
  let isRunning = false;

  const timerDisplay = document.getElementById('timer-display');
  const startBtn = document.getElementById('timer-start-btn');
  const stopBtn = document.getElementById('timer-stop-btn');
  const resetBtn = document.getElementById('timer-reset-btn');
  
  const presetButtons = document.querySelectorAll('.preset-btn[data-minutes]');
  const customTimeBtn = document.getElementById('custom-time-btn');
  const customTimeWrapper = document.getElementById('custom-time-wrapper');
  const customMinutesInput = document.getElementById('custom-minutes-input');
  const setCustomTimeBtn = document.getElementById('set-custom-time-btn');

  function renderTimer() {
    const minutes = Math.floor(remainingSeconds / 60);
    const seconds = remainingSeconds % 60;
    timerDisplay.textContent = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
  }

  function updateActivePresetButton() {
    let matchedPreset = false;
    presetButtons.forEach(btn => {
      const mins = parseInt(btn.dataset.minutes, 10);
      if (mins === currentMinutes) {
        btn.classList.add('active');
        matchedPreset = true;
      } else {
        btn.classList.remove('active');
      }
    });

    if (customTimeBtn) {
      if (!matchedPreset) {
        customTimeBtn.classList.add('active');
      } else {
        customTimeBtn.classList.remove('active');
      }
    }
  }

  function setTimerDuration(minutes) {
    if (minutes < 1) minutes = 1;
    if (minutes > 180) minutes = 180;

    currentMinutes = minutes;
    localStorage.setItem(TIMER_STORAGE_KEY, currentMinutes);

    // Stop and reset timer to new duration
    clearInterval(timerInterval);
    isRunning = false;
    remainingSeconds = currentMinutes * 60;
    startBtn.textContent = 'Start';
    startBtn.style.opacity = '1';

    updateActivePresetButton();
    renderTimer();
  }

  function playAlarm() {
    try {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(587.33, audioCtx.currentTime); // D5
      oscillator.frequency.exponentialRampToValueAtTime(880, audioCtx.currentTime + 0.3); // A5

      gainNode.gain.setValueAtTime(0.3, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.8);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.8);
    } catch {
      // Audio context might be restricted before user gesture
    }
  }

  function startTimer() {
    if (isRunning) return;

    isRunning = true;
    startBtn.textContent = 'Running';
    startBtn.style.opacity = '0.8';

    timerInterval = setInterval(() => {
      if (remainingSeconds > 0) {
        remainingSeconds--;
        renderTimer();
      } else {
        clearInterval(timerInterval);
        isRunning = false;
        startBtn.textContent = 'Start';
        startBtn.style.opacity = '1';
        playAlarm();
        alert(`🎉 Focus session of ${currentMinutes} minutes completed! Great job.`);
      }
    }, 1000);
  }

  function stopTimer() {
    if (!isRunning) return;

    clearInterval(timerInterval);
    isRunning = false;
    startBtn.textContent = 'Resume';
    startBtn.style.opacity = '1';
  }

  function resetTimer() {
    clearInterval(timerInterval);
    isRunning = false;
    remainingSeconds = currentMinutes * 60;
    renderTimer();
    startBtn.textContent = 'Start';
    startBtn.style.opacity = '1';
  }

  // Presets click listeners
  presetButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      customTimeWrapper.classList.add('hidden');
      const mins = parseInt(btn.dataset.minutes, 10);
      setTimerDuration(mins);
    });
  });

  // Custom Time toggle listener
  if (customTimeBtn) {
    customTimeBtn.addEventListener('click', () => {
      customTimeWrapper.classList.toggle('hidden');
      if (!customTimeWrapper.classList.contains('hidden')) {
        customMinutesInput.value = currentMinutes;
        customMinutesInput.focus();
        customMinutesInput.select();
      }
    });
  }

  // Apply custom time button
  if (setCustomTimeBtn) {
    setCustomTimeBtn.addEventListener('click', () => {
      const val = parseInt(customMinutesInput.value, 10);
      if (!isNaN(val) && val >= 1 && val <= 180) {
        setTimerDuration(val);
        customTimeWrapper.classList.add('hidden');
      } else {
        alert('Please enter a valid duration between 1 and 180 minutes.');
      }
    });

    customMinutesInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        setCustomTimeBtn.click();
      }
    });
  }

  startBtn.addEventListener('click', startTimer);
  stopBtn.addEventListener('click', stopTimer);
  resetBtn.addEventListener('click', resetTimer);

  updateActivePresetButton();
  renderTimer();
}

/* ==========================================================================
   4. Tasks (To-Do List) Module with Duplicate Prevention & Sorting
   ========================================================================== */
function initTaskManager() {
  const STORAGE_KEY = 'dashboard_tasks_data';
  const SORT_STORAGE_KEY = 'dashboard_tasks_sort';
  
  const taskForm = document.getElementById('task-form');
  const taskInput = document.getElementById('task-input');
  const taskList = document.getElementById('task-list');
  const sortSelect = document.getElementById('task-sort-select');
  const feedbackMsg = document.getElementById('task-feedback-msg');

  // Initial sample tasks
  const defaultTasks = [
    { id: '1', text: 'belanja', completed: false, createdAt: 1700000000000 },
    { id: '2', text: 'belajar', completed: false, createdAt: 1700000001000 }
  ];

  function getTasks() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultTasks));
      return defaultTasks;
    }
    try {
      const parsed = JSON.parse(saved);
      // Ensure all tasks have createdAt timestamp
      return parsed.map((item, index) => {
        if (!item.createdAt) {
          item.createdAt = Date.now() - (parsed.length - index) * 1000;
        }
        return item;
      });
    } catch {
      return [];
    }
  }

  function saveTasks(tasks) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }

  function getSortPreference() {
    return localStorage.getItem(SORT_STORAGE_KEY) || 'newest';
  }

  function setSortPreference(sortValue) {
    localStorage.setItem(SORT_STORAGE_KEY, sortValue);
  }

  function showFeedback(message) {
    feedbackMsg.textContent = message;
    feedbackMsg.classList.remove('hidden');

    taskInput.style.borderColor = '#ef4444';

    setTimeout(() => {
      feedbackMsg.classList.add('hidden');
      taskInput.style.borderColor = '';
    }, 3500);
  }

  function getSortedTasks(tasks, criteria) {
    const sorted = [...tasks];

    switch (criteria) {
      case 'newest':
        return sorted.sort((a, b) => (b.createdAt || 0) - (a.createdAt || 0));
      case 'oldest':
        return sorted.sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0));
      case 'alphabetical':
        return sorted.sort((a, b) => a.text.localeCompare(b.text, undefined, { sensitivity: 'base' }));
      case 'status':
        // Incomplete (active) first, completed last
        return sorted.sort((a, b) => Number(a.completed) - Number(b.completed));
      default:
        return sorted;
    }
  }

  function renderTasks() {
    const allTasks = getTasks();
    const currentSort = getSortPreference();
    if (sortSelect) {
      sortSelect.value = currentSort;
    }

    const sortedTasks = getSortedTasks(allTasks, currentSort);
    taskList.innerHTML = '';

    if (sortedTasks.length === 0) {
      taskList.innerHTML = '<li class="empty-placeholder">No tasks yet. Add one above!</li>';
      return;
    }

    sortedTasks.forEach(task => {
      const li = document.createElement('li');
      li.className = `task-item ${task.completed ? 'completed' : ''}`;
      li.dataset.id = task.id;

      // Left section: Checkbox & Text
      const leftDiv = document.createElement('div');
      leftDiv.className = 'task-left';

      const checkbox = document.createElement('input');
      checkbox.type = 'checkbox';
      checkbox.className = 'task-checkbox';
      checkbox.checked = task.completed;
      checkbox.addEventListener('change', () => toggleTaskComplete(task.id));

      const spanText = document.createElement('span');
      spanText.className = 'task-text';
      spanText.textContent = task.text;
      spanText.title = 'Double click to edit';
      spanText.addEventListener('dblclick', () => startEditing(li, task));

      leftDiv.appendChild(checkbox);
      leftDiv.appendChild(spanText);

      // Right section: Actions (Edit & Delete)
      const actionsDiv = document.createElement('div');
      actionsDiv.className = 'task-actions';

      const editBtn = document.createElement('button');
      editBtn.type = 'button';
      editBtn.className = 'btn btn-edit';
      editBtn.textContent = 'Edit';
      editBtn.addEventListener('click', () => startEditing(li, task));

      const deleteBtn = document.createElement('button');
      deleteBtn.type = 'button';
      deleteBtn.className = 'btn btn-danger';
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', () => deleteTask(task.id));

      actionsDiv.appendChild(editBtn);
      actionsDiv.appendChild(deleteBtn);

      li.appendChild(leftDiv);
      li.appendChild(actionsDiv);

      taskList.appendChild(li);
    });
  }

  function addTask(text) {
    const trimmed = text.trim();
    if (!trimmed) return;

    const tasks = getTasks();

    // Prevent duplicate tasks (case-insensitive check)
    const isDuplicate = tasks.some(t => t.text.toLowerCase() === trimmed.toLowerCase());
    if (isDuplicate) {
      showFeedback(`⚠️ Task "${trimmed}" already exists! Duplicates are not allowed.`);
      return;
    }

    const newTask = {
      id: Date.now().toString(),
      text: trimmed,
      completed: false,
      createdAt: Date.now()
    };

    tasks.push(newTask);
    saveTasks(tasks);
    renderTasks();
  }

  function toggleTaskComplete(id) {
    const tasks = getTasks();
    const task = tasks.find(t => t.id === id);
    if (task) {
      task.completed = !task.completed;
      saveTasks(tasks);
      renderTasks();
    }
  }

  function deleteTask(id) {
    const tasks = getTasks().filter(t => t.id !== id);
    saveTasks(tasks);
    renderTasks();
  }

  function startEditing(li, task) {
    const leftDiv = li.querySelector('.task-left');
    const actionsDiv = li.querySelector('.task-actions');
    const spanText = leftDiv.querySelector('.task-text');

    if (!spanText) return; // Already in edit mode

    // Create edit input
    const editInput = document.createElement('input');
    editInput.type = 'text';
    editInput.className = 'task-edit-input';
    editInput.value = task.text;

    leftDiv.replaceChild(editInput, spanText);
    editInput.focus();
    editInput.select();

    // Replace actions with Save / Cancel
    actionsDiv.innerHTML = '';

    const saveBtn = document.createElement('button');
    saveBtn.type = 'button';
    saveBtn.className = 'btn btn-primary btn-sm';
    saveBtn.style.marginRight = '6px';
    saveBtn.textContent = 'Save';

    const cancelBtn = document.createElement('button');
    cancelBtn.type = 'button';
    cancelBtn.className = 'btn btn-secondary btn-sm';
    cancelBtn.textContent = 'Cancel';

    function commitSave() {
      const newText = editInput.value.trim();
      if (!newText) {
        renderTasks();
        return;
      }

      // Check duplicate when editing (excluding current task id)
      const tasks = getTasks();
      const isDuplicate = tasks.some(t => t.id !== task.id && t.text.toLowerCase() === newText.toLowerCase());
      if (isDuplicate) {
        showFeedback(`⚠️ Another task named "${newText}" already exists!`);
        editInput.focus();
        return;
      }

      const found = tasks.find(t => t.id === task.id);
      if (found) {
        found.text = newText;
        saveTasks(tasks);
      }
      renderTasks();
    }

    saveBtn.addEventListener('click', commitSave);
    cancelBtn.addEventListener('click', () => renderTasks());

    editInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        commitSave();
      } else if (e.key === 'Escape') {
        renderTasks();
      }
    });

    actionsDiv.appendChild(saveBtn);
    actionsDiv.appendChild(cancelBtn);
  }

  // Handle task form submit
  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addTask(taskInput.value);
    if (!feedbackMsg.classList.contains('hidden')) {
      // Keep input text if duplicate error
    } else {
      taskInput.value = '';
    }
  });

  // Handle Sort Select changes
  if (sortSelect) {
    sortSelect.value = getSortPreference();
    sortSelect.addEventListener('change', (e) => {
      setSortPreference(e.target.value);
      renderTasks();
    });
  }

  renderTasks();
}

/* ==========================================================================
   5. Quick Links Module
   ========================================================================== */
function initQuickLinks() {
  const STORAGE_KEY = 'dashboard_quicklinks_data';
  const quickLinksForm = document.getElementById('quicklinks-form');
  const nameInput = document.getElementById('link-name-input');
  const urlInput = document.getElementById('link-url-input');
  const linksContainer = document.getElementById('quicklinks-list');

  // Default links matching sample
  const defaultLinks = [
    { id: '1', name: 'Google', url: 'https://www.google.com' },
    { id: '2', name: 'Gmail', url: 'https://mail.google.com' },
    { id: '3', name: 'Calendar', url: 'https://calendar.google.com' }
  ];

  function getLinks() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultLinks));
      return defaultLinks;
    }
    try {
      return JSON.parse(saved);
    } catch {
      return [];
    }
  }

  function saveLinks(links) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(links));
  }

  function formatUrl(url) {
    const trimmed = url.trim();
    if (!/^https?:\/\//i.test(trimmed)) {
      return 'https://' + trimmed;
    }
    return trimmed;
  }

  function renderLinks() {
    const links = getLinks();
    linksContainer.innerHTML = '';

    if (links.length === 0) {
      linksContainer.innerHTML = '<span class="empty-placeholder">No quick links added yet.</span>';
      return;
    }

    links.forEach(link => {
      const linkItem = document.createElement('a');
      linkItem.className = 'quicklink-item';
      linkItem.href = formatUrl(link.url);
      linkItem.target = '_blank';
      linkItem.rel = 'noopener noreferrer';

      const spanText = document.createElement('span');
      spanText.className = 'quicklink-text';
      spanText.textContent = link.name;

      const removeBtn = document.createElement('button');
      removeBtn.type = 'button';
      removeBtn.className = 'quicklink-remove-btn';
      removeBtn.innerHTML = '&times;';
      removeBtn.title = 'Remove link';

      removeBtn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        removeLink(link.id);
      });

      linkItem.appendChild(spanText);
      linkItem.appendChild(removeBtn);
      linksContainer.appendChild(linkItem);
    });
  }

  function addLink(name, url) {
    const trimmedName = name.trim();
    const trimmedUrl = url.trim();

    if (!trimmedName || !trimmedUrl) return;

    const links = getLinks();
    const newLink = {
      id: Date.now().toString(),
      name: trimmedName,
      url: trimmedUrl
    };

    links.push(newLink);
    saveLinks(links);
    renderLinks();
  }

  function removeLink(id) {
    const links = getLinks().filter(l => l.id !== id);
    saveLinks(links);
    renderLinks();
  }

  quickLinksForm.addEventListener('submit', (e) => {
    e.preventDefault();
    addLink(nameInput.value, urlInput.value);
    nameInput.value = '';
    urlInput.value = '';
    nameInput.focus();
  });

  renderLinks();
}
