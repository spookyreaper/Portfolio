(() => {
  'use strict';
  const STORAGE_KEY = 'brandon-portfolio-v2';
  const categories = ['Web apps', 'Games', 'APIs'];
  const defaultData = structuredClone(window.PORTFOLIO_DATA);
  const $ = (selector, root = document) => root.querySelector(selector);
  const $$ = (selector, root = document) => [...root.querySelectorAll(selector)];
  const escape = (value = '') => String(value).replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
  const safeUrl = (value) => {
    if (!value) return '';
    try { const url = new URL(value); return ['http:', 'https:'].includes(url.protocol) ? url.href : ''; } catch { return ''; }
  };
  const imageUrl = value => /^assets\/[a-z0-9_-]+\.(svg|png|jpe?g|webp|avif|gif)$/i.test(value || '') ? value : safeUrl(value);
  const arrow = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 18 18 6M6 6h12v12"/></svg>';
  let data = structuredClone(defaultData);
  let selectedCategory = 'All projects';
  let toastTimer;

  function validateData(value) {
    if (!value || typeof value !== 'object' || !value.profile || !Array.isArray(value.projects) || value.projects.length > 200) throw new Error('Choose a portfolio backup with a profile and up to 200 projects.');
    const profile = {};
    const profileKeys = ['name', 'shortName', 'role', 'intro', 'about', 'aboutSecond', 'email', 'github', 'linkedin'];
    for (const key of profileKeys) {
      if (typeof value.profile[key] !== 'string' || value.profile[key].length > 3000) throw new Error('The backup has an invalid profile.');
      profile[key] = value.profile[key].trim();
    }
    if (!profile.name || !profile.shortName || !profile.role || !profile.intro) throw new Error('Add a name, short name, role, and introduction.');
    if (profile.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(profile.email)) throw new Error('Please use a valid email address.');
    profile.github = safeUrl(profile.github);
    profile.linkedin = safeUrl(profile.linkedin);
    if (!Array.isArray(value.profile.skills) || value.profile.skills.length > 30 || value.profile.skills.some(skill => typeof skill !== 'string' || skill.length > 100)) throw new Error('The backup has invalid skills.');
    profile.skills = value.profile.skills.filter(Boolean);
    const ids = new Set();
    const projects = value.projects.map(project => {
      if (!project || typeof project !== 'object' || !project.title || typeof project.title !== 'string' || !categories.includes(project.category)) throw new Error('The backup has an invalid project.');
      const result = {};
      for (const key of ['id', 'title', 'subtitle', 'description', 'year', 'image', 'live', 'source']) {
        if (typeof project[key] !== 'string' || project[key].length > 6000) throw new Error('The backup has an invalid project field.');
        result[key] = project[key].trim();
      }
      if (!result.id || ids.has(result.id) || !/^20\d{2}$|^2100$/.test(result.year)) throw new Error('Project IDs must be unique, and years must be between 2000 and 2100.');
      ids.add(result.id);
      if (!result.title || !result.subtitle || !result.description) throw new Error('Add a project name, short description, and story.');
      if (!Array.isArray(project.tags) || project.tags.length > 30 || project.tags.some(tag => typeof tag !== 'string' || tag.length > 100)) throw new Error('The backup has invalid project technologies.');
      result.tags = project.tags.filter(Boolean);
      result.category = project.category;
      result.demo = project.demo === true;
      result.color = /^#[0-9a-f]{6}$/i.test(project.color || '') ? project.color : '#e5eadd';
      result.live = safeUrl(result.live);
      result.source = safeUrl(result.source);
      if (result.image && !imageUrl(result.image)) throw new Error('Use an HTTP(S) image URL or a file in assets/.');
      result.image = imageUrl(result.image);
      return result;
    });
    return { profile, projects };
  }

  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) data = validateData(JSON.parse(saved));
  } catch { /* A blocked or outdated browser store falls back to the published data. */ }

  function toast(message) {
    clearTimeout(toastTimer);
    $('#toast').textContent = message;
    $('#toast').classList.add('visible');
    toastTimer = setTimeout(() => $('#toast').classList.remove('visible'), 4200);
  }

  function persist() {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); return true; }
    catch { toast('Browser storage is unavailable. Export a backup to keep these changes.'); return false; }
  }

  function coverMarkup(project, detail = false) {
    const src = imageUrl(project.image);
    if (src) return `<img ${detail ? 'class="detail-image"' : 'loading="lazy"'} src="${escape(src)}" alt="${escape(project.title)} project preview" decoding="async" referrerpolicy="no-referrer">`;
    return `<div class="project-placeholder${detail ? ' detail-image' : ''}" style="--card-color:${project.color}"><span class="placeholder-symbol" aria-hidden="true">&lt;/&gt;</span><span class="placeholder-name">${escape(project.title)}</span></div>`;
  }

  document.addEventListener('error', event => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement)) return;
    const placeholder = document.createElement('div');
    placeholder.className = `project-placeholder ${image.classList.contains('detail-image') ? 'detail-image' : ''}`;
    placeholder.setAttribute('role', 'img');
    placeholder.setAttribute('aria-label', image.alt);
    placeholder.innerHTML = '<span class="placeholder-symbol" aria-hidden="true">&lt;/&gt;</span>';
    image.replaceWith(placeholder);
  }, true);

  function renderProfile() {
    $$('[data-profile]').forEach(element => {
      const key = element.dataset.profile;
      element.textContent = data.profile[key] || '';
      if (key === 'shortName') {
        const dot = document.createElement('span'); dot.className = 'brand-dot'; dot.textContent = '.'; element.append(dot);
      }
    });
    document.title = `${data.profile.name} — Developer & Maker`;
    $('meta[property="og:title"]').content = document.title;
    $('meta[name="description"]').content = data.profile.intro;
    $('.skills').innerHTML = data.profile.skills.map(skill => `<span class="skill">${escape(skill)}</span>`).join('');
    const email = data.profile.email;
    const contactUrl = email ? `mailto:${encodeURIComponent(email)}` : safeUrl(data.profile.github) || '#contact';
    const contactLink = $('#email-link');
    contactLink.href = contactUrl;
    contactLink.innerHTML = `${email ? 'Say hello' : data.profile.github ? 'Find me on GitHub' : 'Say hello'} ${arrow}`;
    if (!email && data.profile.github) { contactLink.target = '_blank'; contactLink.rel = 'noopener noreferrer'; } else { contactLink.removeAttribute('target'); contactLink.removeAttribute('rel'); }
    $('#copy-email').hidden = !email;
    $('#social-links').innerHTML = [['github', 'GitHub'], ['linkedin', 'LinkedIn']].filter(([key]) => safeUrl(data.profile[key])).map(([key, label]) => `<a href="${escape(safeUrl(data.profile[key]))}" target="_blank" rel="noopener noreferrer">${label} <span aria-hidden="true">↗</span></a>`).join('');
  }

  function renderFilters() {
    $('.filters').innerHTML = ['All projects', ...categories].map(category => {
      const count = category === 'All projects' ? data.projects.length : data.projects.filter(project => project.category === category).length;
      return `<button class="filter-button" data-filter="${category}" aria-pressed="${selectedCategory === category}">${category}<span class="filter-count">${String(count).padStart(2, '0')}</span></button>`;
    }).join('');
  }

  function renderProjects() {
    const projects = data.projects.filter(project => selectedCategory === 'All projects' || project.category === selectedCategory);
    $('#project-grid').innerHTML = projects.map((project, index) => `<article class="project-card" style="--card-color:${project.color};animation-delay:${Math.min(index, 5) * 35}ms"><button class="project-cover ${project.image && !project.image.endsWith('.svg') ? 'screenshot-cover' : ''}" data-project="${escape(project.id)}" aria-label="View ${escape(project.title)} project details">${coverMarkup(project)}<span class="view-project">Take a closer look ${arrow}</span></button><div class="project-info"><div><div class="project-title-row"><h3><button class="project-title" data-project="${escape(project.id)}">${escape(project.title)}</button></h3>${project.demo ? '<span class="demo-badge">DEMO</span>' : ''}</div><p class="project-subtitle">${escape(project.subtitle)}</p></div><button class="project-arrow" data-project="${escape(project.id)}" aria-label="View ${escape(project.title)} project details">${arrow}</button></div><div class="project-meta"><span>${escape(project.category)}${project.tags.length ? `<span class="meta-dot" aria-hidden="true"></span><span class="tech-label">${escape(project.tags.slice(0, 2).join(' / '))}</span>` : ''}</span><span>${escape(project.year)}</span></div></article>`).join('');
    $('.project-count').textContent = `${String(projects.length).padStart(2, '0')} project${projects.length === 1 ? '' : 's'}`;
    $('#demo-notice').hidden = !data.projects.some(project => project.demo);
    $('#empty-state').hidden = projects.length !== 0;
    const isEmptyCollection = data.projects.length === 0;
    $('#empty-state h3').textContent = isEmptyCollection ? 'Room for your next idea.' : 'A new category to explore.';
    $('#empty-state p').textContent = isEmptyCollection ? 'Add a project to start your collection.' : 'No projects in this category yet. Add one or try another filter.';
  }

  function render() { renderProfile(); renderFilters(); renderProjects(); }

  function openDialog(dialog) {
    $$('dialog[open]').forEach(open => open.close());
    dialog.showModal();
    dialog.scrollTop = 0;
  }

  function showProject(id) {
    const project = data.projects.find(item => item.id === id);
    if (!project) return;
    $('#project-detail').innerHTML = `${coverMarkup(project, true)}<div class="detail-copy"><div class="detail-eyebrow"><span>${escape(project.category)}</span><span>·</span><span>${escape(project.year)}</span>${project.demo ? '<span class="demo-badge">DEMO PROJECT</span>' : ''}</div><h2 id="detail-title">${escape(project.title)}</h2><p class="detail-subtitle">${escape(project.subtitle)}</p><div class="detail-tags">${project.tags.map(tag => `<span class="skill">${escape(tag)}</span>`).join('')}</div><p class="detail-story">${escape(project.description)}</p>${project.live || project.source ? `<div class="detail-actions">${project.live ? `<a class="button button-dark" href="${escape(project.live)}" target="_blank" rel="noopener noreferrer">Visit project ${arrow}</a>` : ''}${project.source ? `<a class="button" href="${escape(project.source)}" target="_blank" rel="noopener noreferrer">View source ${arrow}</a>` : ''}</div>` : ''}${project.demo ? '<div class="detail-demo-label">This is a sample project to help you get started. Use Customize to add your own story, cover image, and links.</div>' : ''}</div>`;
    openDialog($('#project-dialog'));
  }

  function fillProfileForm() {
    const form = $('#profile-form');
    for (const [key, value] of Object.entries(data.profile)) {
      if (form.elements.namedItem(key)) form.elements.namedItem(key).value = Array.isArray(value) ? value.join(', ') : value;
    }
  }

  function renderEditorProjects() {
    $('#editor-project-list').innerHTML = data.projects.length ? data.projects.map(project => `<div class="editor-project-row">${coverMarkup(project)}<div><h4>${escape(project.title)}</h4><p>${escape(project.category)}${project.demo ? ' · Demo' : ''}</p></div><button class="row-action" data-edit-project="${escape(project.id)}" aria-label="Edit ${escape(project.title)}">Edit</button><button class="row-action danger-text" data-delete-project="${escape(project.id)}" aria-label="Delete ${escape(project.title)}">Delete</button></div>`).join('') : '<p class="editor-note">Your next project can be the first. Add it above.</p>';
  }

  function switchTab(name) {
    for (const tab of ['profile', 'projects']) {
      const selected = tab === name;
      $(`#tab-${tab}`).setAttribute('aria-selected', String(selected));
      $(`#tab-${tab}`).tabIndex = selected ? 0 : -1;
      $(`#panel-${tab}`).hidden = !selected;
    }
  }

  function openEditor() { fillProfileForm(); renderEditorProjects(); $('#project-form').hidden = true; switchTab('profile'); openDialog($('#editor-dialog')); }

  function editProject(id) {
    const project = id ? data.projects.find(item => item.id === id) : null;
    const form = $('#project-form');
    form.reset();
    $('#project-form-title').textContent = project ? 'Edit project' : 'Add a project';
    for (const key of ['id', 'title', 'category', 'year', 'subtitle', 'description', 'tags', 'image', 'live', 'source']) {
      let value = project ? project[key] : '';
      if (!project && key === 'year') value = String(new Date().getFullYear());
      if (!project && key === 'category') value = 'Web apps';
      form.elements.namedItem(key).value = Array.isArray(value) ? value.join(', ') : value;
    }
    form.hidden = false;
    form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    form.elements.title.focus({ preventScroll: true });
  }

  document.addEventListener('click', event => {
    const target = event.target.closest('button, a');
    if (!target) return;
    if (target.hasAttribute('data-project')) showProject(target.dataset.project);
    if (target.hasAttribute('data-filter')) {
      selectedCategory = target.dataset.filter;
      renderFilters(); renderProjects();
      $$('.filter-button').find(button => button.dataset.filter === selectedCategory)?.focus({ preventScroll: true });
    }
    if (target.hasAttribute('data-open-editor')) openEditor();
    if (target.hasAttribute('data-close-dialog')) target.closest('dialog').close();
    if (target.hasAttribute('data-edit-project')) editProject(target.dataset.editProject);
    if (target.hasAttribute('data-delete-project')) {
      const project = data.projects.find(item => item.id === target.dataset.deleteProject);
      if (project && window.confirm(`Delete “${project.title}” from this browser’s portfolio?`)) {
        data.projects = data.projects.filter(item => item.id !== project.id);
        if ($('#project-form').elements.id.value === project.id) $('#project-form').hidden = true;
        const saved = persist(); render(); renderEditorProjects();
        if (saved) toast('Project removed from this browser.');
      }
    }
  });

  $$('dialog').forEach(dialog => dialog.addEventListener('click', event => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  }));

  $('#email-link').addEventListener('click', event => { if (!data.profile.email && !data.profile.github) { event.preventDefault(); openDialog($('#contact-dialog')); } });
  $('#copy-email').addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(data.profile.email); toast('Email copied. Say hello anytime.'); }
    catch { toast(data.profile.email); }
  });

  $('#tab-profile').addEventListener('click', () => switchTab('profile'));
  $('#tab-projects').addEventListener('click', () => switchTab('projects'));
  $('.editor-tabs').addEventListener('keydown', event => {
    if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
    event.preventDefault();
    const name = event.key === 'Home' ? 'profile' : event.key === 'End' ? 'projects' : $('#tab-profile').getAttribute('aria-selected') === 'true' ? 'projects' : 'profile';
    switchTab(name); $(`#tab-${name}`).focus();
  });

  $('#profile-form').addEventListener('submit', event => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    values.skills = values.skills.split(',').map(value => value.trim()).filter(Boolean);
    try { data = validateData({ profile: values, projects: data.projects }); }
    catch (error) { toast(error.message); return; }
    const saved = persist(); render(); if (saved) toast('Profile saved in this browser. Looking good.');
  });

  $('#add-project').addEventListener('click', () => editProject());
  $('#cancel-project').addEventListener('click', () => { $('#project-form').hidden = true; $('#add-project').focus(); });
  $('#project-form').addEventListener('submit', event => {
    event.preventDefault();
    const values = Object.fromEntries(new FormData(event.currentTarget));
    const original = data.projects.find(project => project.id === values.id);
    const project = {
      ...values, id: original?.id || crypto.randomUUID(),
      tags: values.tags.split(',').map(value => value.trim()).filter(Boolean),
      image: values.image,
      color: original?.color || ['#e5ece5', '#ece9f5', '#f4edda'][data.projects.length % 3],
      demo: false
    };
    const projects = original ? data.projects.map(item => item.id === project.id ? project : item) : [...data.projects, project];
    try { data = validateData({ profile: data.profile, projects }); }
    catch (error) { toast(error.message); return; }
    selectedCategory = 'All projects';
    const saved = persist(); render(); renderEditorProjects(); event.currentTarget.hidden = true;
    $('#add-project').focus(); if (saved) toast(original ? 'Project updated in this browser.' : 'New project added. Nice work.');
  });

  $('#export-data').addEventListener('click', () => {
    const url = URL.createObjectURL(new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' }));
    const anchor = document.createElement('a'); anchor.href = url; anchor.download = 'my-portfolio-backup.json'; anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000); toast('Portfolio backup exported.');
  });

  $('#import-button').addEventListener('click', () => $('#import-data').click());
  $('#import-data').addEventListener('change', async event => {
    const file = event.target.files[0]; if (!file) return;
    try {
      if (file.size > 2_000_000) throw new Error('Please choose a JSON backup smaller than 2 MB.');
      const imported = validateData(JSON.parse(await file.text()));
      if (!window.confirm('Replace this browser’s portfolio with the imported backup?')) return;
      data = imported; selectedCategory = 'All projects';
      const saved = persist(); render(); fillProfileForm(); renderEditorProjects(); $('#project-form').hidden = true;
      if (saved) toast('Your portfolio backup is ready.');
    } catch (error) { toast(error instanceof SyntaxError ? 'This file is not valid JSON. Choose an exported portfolio backup.' : error.message); }
    finally { event.target.value = ''; }
  });

  $('#reset-data').addEventListener('click', () => {
    if (!window.confirm('Reset this browser’s profile and projects to the published portfolio? Export a backup first if you want to keep your changes.')) return;
    data = structuredClone(defaultData); selectedCategory = 'All projects';
    const saved = persist(); render(); fillProfileForm(); renderEditorProjects(); $('#project-form').hidden = true;
    if (saved) toast('Published portfolio restored in this browser.');
  });

  const sectionObserver = 'IntersectionObserver' in window ? new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      $$('.nav-link').forEach(link => {
        const active = link.getAttribute('href') === `#${entry.target.id}`;
        link.classList.toggle('active', active);
        if (active) link.setAttribute('aria-current', 'location'); else link.removeAttribute('aria-current');
        link.querySelector('.nav-dot')?.remove();
        if (active) { const dot = document.createElement('span'); dot.className = 'nav-dot'; dot.setAttribute('aria-hidden', 'true'); link.append(dot); }
      });
    });
  }, { rootMargin: '-10% 0px -65% 0px' }) : null;
  $$('section[id]').forEach(section => sectionObserver?.observe(section));
  $('#current-year').textContent = new Date().getFullYear();
  render();
})();
