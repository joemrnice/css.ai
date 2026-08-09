// css.ai — shared site behavior (no build step, vanilla JS)

document.addEventListener('DOMContentLoaded', () => {
  initNavToggle();
  initCopyButtons();
  initTocScrollSpy();
  initAccordion();
  initSpecificityCalculator();
  initInterviewFilters();
});

/* Mobile nav toggle */
function initNavToggle() {
  const btn = document.querySelector('.nav-toggle');
  const links = document.querySelector('.nav-links');
  if (!btn || !links) return;
  btn.addEventListener('click', () => {
    links.classList.toggle('open');
    btn.textContent = links.classList.contains('open') ? 'close' : 'menu';
  });
  links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    links.classList.remove('open');
    btn.textContent = 'menu';
  }));
}

/* Copy-to-clipboard on every code block */
function initCopyButtons() {
  document.querySelectorAll('.code-block').forEach(block => {
    const btn = block.querySelector('.copy-btn');
    const pre = block.querySelector('pre');
    if (!btn || !pre) return;
    btn.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(pre.innerText);
        const original = btn.textContent;
        btn.textContent = 'copied';
        setTimeout(() => (btn.textContent = original), 1400);
      } catch (e) {
        btn.textContent = 'select + ⌘C';
      }
    });
  });
}

/* Highlight the active section link in the sticky side TOC */
function initTocScrollSpy() {
  const links = document.querySelectorAll('.side-toc a');
  if (!links.length) return;
  const targets = Array.from(links)
    .map(l => document.querySelector(l.getAttribute('href')))
    .filter(Boolean);
  if (!targets.length) return;

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        const id = '#' + entry.target.id;
        const link = document.querySelector(`.side-toc a[href="${id}"]`);
        if (!link) return;
        if (entry.isIntersecting) {
          links.forEach(l => l.classList.remove('active'));
          link.classList.add('active');
        }
      });
    },
    { rootMargin: '-15% 0px -70% 0px' }
  );
  targets.forEach(t => observer.observe(t));
}

/* Generic accordion (used by interview Q&A) */
function initAccordion() {
  document.querySelectorAll('.qa-question').forEach(btn => {
    btn.addEventListener('click', () => {
      btn.closest('.qa-item').classList.toggle('open');
    });
  });
}

/* Filter interview questions by level/topic */
function initInterviewFilters() {
  const bar = document.querySelector('.filter-bar');
  if (!bar) return;
  const buttons = bar.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.qa-item');

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const filter = btn.dataset.filter;
      items.forEach(item => {
        const show = filter === 'all' || item.dataset.tags?.includes(filter);
        item.style.display = show ? '' : 'none';
      });
    });
  });
}

/* ---------------------------------------------------------------------
   Specificity calculator — the homepage signature widget.
   Parses a comma-free single selector string and estimates CSS
   specificity as (inline, id, class/attr/pseudo-class, type/pseudo-element).
   This is a teaching tool, not a full CSS parser — it covers the
   selector syntax learners actually run into.
--------------------------------------------------------------------- */
function initSpecificityCalculator() {
  const input = document.querySelector('#spec-input');
  const out = document.querySelector('#spec-output');
  if (!input || !out) return;

  const idEl = out.querySelector('[data-id]');
  const classEl = out.querySelector('[data-class]');
  const typeEl = out.querySelector('[data-type]');
  const noteEl = out.querySelector('[data-note]');

  function calculate(selectorRaw) {
    let selector = selectorRaw.trim();
    let ids = 0, classes = 0, types = 0;

    if (!selector) return { ids, classes, types, note: 'Type a selector above.' };

    // strip strings inside attribute selectors so their contents don't get miscounted
    selector = selector.replace(/\[[^\]]*\]/g, m => {
      classes += 1; // attribute selectors count like a class
      return '';
    });

    // pseudo-elements (::before, ::after, single-colon legacy :before/:after/:first-line/:first-letter)
    const pseudoElementNames = ['before', 'after', 'first-line', 'first-letter', 'placeholder', 'marker', 'selection'];
    selector = selector.replace(/::?([a-zA-Z-]+)/g, (m, name) => {
      if (pseudoElementNames.includes(name.toLowerCase())) {
        types += 1;
        return '';
      }
      if (name.toLowerCase() === 'not' || name.toLowerCase() === 'is' || name.toLowerCase() === 'where') {
        // :where() contributes 0; :not()/:is() contribute the specificity of their most specific argument.
        // Simplified teaching approximation: :is()/:not() count as a class, :where() counts as nothing.
        if (name.toLowerCase() === 'where') return '';
        classes += 1;
        return '';
      }
      classes += 1; // other pseudo-classes like :hover, :nth-child()
      return '';
    });

    // class selectors
    selector = selector.replace(/\.[a-zA-Z0-9_-]+/g, () => { classes += 1; return ''; });

    // id selectors
    selector = selector.replace(/#[a-zA-Z0-9_-]+/g, () => { ids += 1; return ''; });

    // remaining type selectors / combinators
    const typeMatches = selector.match(/[a-zA-Z][a-zA-Z0-9]*/g) || [];
    types += typeMatches.length;

    let note = 'Higher tuples win, left column first. Inline styles and !important still beat all of this.';
    if (ids === 0 && classes === 0 && types === 0) note = "That didn't parse as a selector — try something like .card > h3::after";

    return { ids, classes, types, note };
  }

  function render() {
    const { ids, classes, types, note } = calculate(input.value || input.placeholder);
    idEl.textContent = ids;
    classEl.textContent = classes;
    typeEl.textContent = types;
    noteEl.textContent = note;
  }

  input.addEventListener('input', render);
  render();
}
