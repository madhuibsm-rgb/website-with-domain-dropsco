(function(){
  'use strict';

  const articleBody = document.getElementById('articleBody');
  const progressFill = document.getElementById('progressFill');
  const tocProgressFill = document.getElementById('tocProgressFill');
  const progressPercent = document.getElementById('progressPercent');
  const readTimeEl = document.getElementById('readTime');
  const toTopBtn = document.getElementById('toTopBtn');

  /* ---------------- Reading time estimate ---------------- */
  function computeReadTime(){
    const text = articleBody.textContent || '';
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    const minutes = Math.max(1, Math.round(words / 220));
    readTimeEl.textContent = minutes + ' min read';
  }
  computeReadTime();

  /* ---------------- Scroll progress ---------------- */
  function updateProgress(){
    const rect = articleBody.getBoundingClientRect();
    const total = articleBody.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY - (articleBody.offsetTop + articleBody.closest('.article-card').offsetTop);
    let pct = 0;
    const docTop = articleBody.getBoundingClientRect().top + window.scrollY;
    const docHeight = articleBody.offsetHeight;
    const winHeight = window.innerHeight;
    const scrollPos = window.scrollY;
    const start = docTop - winHeight * 0.15;
    const end = docTop + docHeight - winHeight * 0.5;
    pct = (scrollPos - start) / (end - start);
    pct = Math.max(0, Math.min(1, pct));
    const pctInt = Math.round(pct * 100);
    progressFill.style.width = (pct * 100) + '%';
    tocProgressFill.style.width = (pct * 100) + '%';
    progressPercent.textContent = pctInt;

    // back to top button
    if(window.scrollY > 500){ toTopBtn.classList.add('visible'); }
    else{ toTopBtn.classList.remove('visible'); }
  }
  window.addEventListener('scroll', updateProgress, { passive: true });
  window.addEventListener('resize', updateProgress);
  updateProgress();

  /* ---------------- Back to top ---------------- */
  toTopBtn.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

  /* ---------------- Back link ---------------- */
  document.getElementById('backLink').addEventListener('click', (e) => {
    e.preventDefault();
    if(history.length > 1){ history.back(); }
    else{ window.location.href = 'index.html'; }
  });

  /* ---------------- Font size controls ---------------- */
  const sizes = [0.9, 1, 1.1, 1.2, 1.3];
  let sizeIndex = 1;
  function applySize(){
    articleBody.style.fontSize = sizes[sizeIndex] + 'rem';
    localStorage.setItem('et-fontsize', sizeIndex);
  }
  const savedSize = localStorage.getItem('et-fontsize');
  if(savedSize !== null && sizes[savedSize] !== undefined){
    sizeIndex = parseInt(savedSize, 10);
    applySize();
  }
  document.getElementById('fontIncrease').addEventListener('click', () => {
    sizeIndex = Math.min(sizes.length - 1, sizeIndex + 1);
    applySize();
  });
  document.getElementById('fontDecrease').addEventListener('click', () => {
    sizeIndex = Math.max(0, sizeIndex - 1);
    applySize();
  });

  /* ---------------- Theme toggle (dark mode) ---------------- */
  const themeBtn = document.getElementById('themeToggle');
  function setTheme(theme){
    if(theme === 'dark'){
      document.documentElement.setAttribute('data-theme', 'dark');
      themeBtn.innerHTML = '<i class="fa-solid fa-sun"></i>';
      themeBtn.classList.add('active');
    } else {
      document.documentElement.removeAttribute('data-theme');
      themeBtn.innerHTML = '<i class="fa-regular fa-moon"></i>';
      themeBtn.classList.remove('active');
    }
    localStorage.setItem('et-theme', theme);
  }
  const savedTheme = localStorage.getItem('et-theme');
  if(savedTheme === 'dark'){ setTheme('dark'); }
  else if(!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches){ setTheme('dark'); }
  themeBtn.addEventListener('click', () => {
    const current = document.documentElement.getAttribute('data-theme');
    setTheme(current === 'dark' ? 'light' : 'dark');
  });

  /* ---------------- Bookmark / Save for later ---------------- */
  const bookmarkBtn = document.getElementById('bookmarkToggle');
  const BOOKMARK_KEY = 'et-bookmark-healthiest-plates';
  function setBookmark(state){
    if(state){
      bookmarkBtn.innerHTML = '<i class="fa-solid fa-bookmark"></i>';
      bookmarkBtn.classList.add('active');
      localStorage.setItem(BOOKMARK_KEY, '1');
    } else {
      bookmarkBtn.innerHTML = '<i class="fa-regular fa-bookmark"></i>';
      bookmarkBtn.classList.remove('active');
      localStorage.removeItem(BOOKMARK_KEY);
    }
  }
  setBookmark(localStorage.getItem(BOOKMARK_KEY) === '1');
  bookmarkBtn.addEventListener('click', () => {
    setBookmark(!bookmarkBtn.classList.contains('active'));
  });

  /* ---------------- Table of contents ---------------- */
  const tocList = document.getElementById('tocList');
  const headings = Array.from(articleBody.querySelectorAll('h2'));
  headings.forEach((h, i) => {
    const id = 'section-' + (i + 1);
    h.id = id;
    const li = document.createElement('li');
    const a = document.createElement('a');
    a.href = '#' + id;
    a.textContent = h.textContent;
    li.appendChild(a);
    tocList.appendChild(li);
  });

  const tocLinks = Array.from(tocList.querySelectorAll('a'));
  function updateActiveToc(){
    let currentId = null;
    headings.forEach(h => {
      const rect = h.getBoundingClientRect();
      if(rect.top < window.innerHeight * 0.4){ currentId = h.id; }
    });
    tocLinks.forEach(link => {
      link.classList.toggle('active', link.getAttribute('href') === '#' + currentId);
    });
  }
  window.addEventListener('scroll', updateActiveToc, { passive: true });
  updateActiveToc();

  tocLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(link.getAttribute('href'));
      if(target){
        const y = target.getBoundingClientRect().top + window.scrollY - 90;
        window.scrollTo({ top: y, behavior: 'smooth' });
      }
    });
  });

  /* ---------------- Sources toggle ---------------- */
  const sourcesToggle = document.getElementById('sourcesToggle');
  const sourcesList = document.getElementById('sourcesList');
  sourcesToggle.addEventListener('click', () => {
    const expanded = sourcesToggle.getAttribute('aria-expanded') === 'true';
    sourcesToggle.setAttribute('aria-expanded', String(!expanded));
    sourcesList.classList.toggle('open', !expanded);
  });

  /* ---------------- Reaction buttons ---------------- */
  document.querySelectorAll('.reaction-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const active = btn.classList.contains('active');
      const countEl = btn.querySelector('.count');
      let count = parseInt(countEl.textContent, 10);
      const icon = btn.querySelector('i');
      if(active){
        count -= 1;
        btn.classList.remove('active');
        if(icon.classList.contains('fa-solid')){ icon.classList.remove('fa-solid'); icon.classList.add('fa-regular'); }
      } else {
        count += 1;
        btn.classList.add('active');
        if(icon.classList.contains('fa-regular')){ icon.classList.remove('fa-regular'); icon.classList.add('fa-solid'); }
      }
      countEl.textContent = count;
    });
  });

  /* ---------------- Share controls ---------------- */
  const pageUrl = () => window.location.href;
  const pageTitle = () => document.title;

  document.getElementById('copyLinkBtn').addEventListener('click', async (e) => {
    try {
      await navigator.clipboard.writeText(pageUrl());
      flashTooltip(e.currentTarget, 'Copied!');
    } catch(err){
      flashTooltip(e.currentTarget, 'Could not copy');
    }
  });

  document.getElementById('shareX').addEventListener('click', () => {
    const url = 'https://twitter.com/intent/tweet?text=' + encodeURIComponent(pageTitle()) + '&url=' + encodeURIComponent(pageUrl());
    window.open(url, '_blank', 'noopener,noreferrer,width=600,height=500');
  });

  document.getElementById('shareWA').addEventListener('click', () => {
    const url = 'https://wa.me/?text=' + encodeURIComponent(pageTitle() + ' — ' + pageUrl());
    window.open(url, '_blank', 'noopener,noreferrer');
  });

  document.getElementById('printBtn').addEventListener('click', () => window.print());

  function flashTooltip(el, msg){
    const original = el.innerHTML;
    el.innerHTML = '<i class="fa-solid fa-check"></i>';
    el.title = msg;
    setTimeout(() => { el.innerHTML = original; }, 1400);
  }

  /* ---------------- Listen (text-to-speech) ---------------- */
  const listenBtn = document.getElementById('listenBtn');
  let speaking = false;
  let utterance = null;
  let readerWords = [];
  let readerText = '';
  let activeReaderWord = null;

  function prepareWordHighlights(){
    if(readerWords.length) return;
    const walker = document.createTreeWalker(articleBody, NodeFilter.SHOW_TEXT, {
      acceptNode(node){
        if(!node.nodeValue.trim() || node.parentElement.closest('.series-box, .sources, sup.src')) return NodeFilter.FILTER_REJECT;
        return NodeFilter.FILTER_ACCEPT;
      }
    });
    const textNodes = [];
    while(walker.nextNode()) textNodes.push(walker.currentNode);

    textNodes.forEach((node) => {
      const fragment = document.createDocumentFragment();
      const words = node.nodeValue.match(/\S+/g) || [];
      let cursor = 0;
      words.forEach((word) => {
        const start = node.nodeValue.indexOf(word, cursor);
        if(start > cursor) fragment.appendChild(document.createTextNode(node.nodeValue.slice(cursor, start)));
        const span = document.createElement('span');
        span.className = 'tts-word';
        span.textContent = word;
        fragment.appendChild(span);
        readerWords.push({ element: span, start: readerText.length });
        readerText += (readerText ? ' ' : '') + word;
        cursor = start + word.length;
      });
      if(cursor < node.nodeValue.length) fragment.appendChild(document.createTextNode(node.nodeValue.slice(cursor)));
      node.parentNode.replaceChild(fragment, node);
    });
  }

  function setActiveReaderWord(charIndex){
    let current = readerWords[0];
    for(let i = 1; i < readerWords.length; i += 1){
      if(readerWords[i].start > charIndex) break;
      current = readerWords[i];
    }
    if(!current || activeReaderWord === current.element) return;
    if(activeReaderWord) activeReaderWord.classList.remove('is-speaking');
    activeReaderWord = current.element;
    activeReaderWord.classList.add('is-speaking');
    const rect = activeReaderWord.getBoundingClientRect();
    if(rect.top < 100 || rect.bottom > window.innerHeight - 90){
      activeReaderWord.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }

  function stopListening(){
    speaking = false;
    if(activeReaderWord) activeReaderWord.classList.remove('is-speaking');
    activeReaderWord = null;
    listenBtn.classList.remove('playing');
    listenBtn.innerHTML = '<i class="fa-solid fa-volume-high"></i> Listen';
  }

  function getArticleText(){
    if(readerText) return readerText;
    const clone = articleBody.cloneNode(true);
    clone.querySelectorAll('.series-box, .sources, sup.src').forEach(el => el.remove());
    return clone.textContent.replace(/\s+/g, ' ').trim();
  }

  listenBtn.addEventListener('click', () => {
    if(!('speechSynthesis' in window)){
      alert('Sorry, your browser does not support text‑to‑speech.');
      return;
    }
    if(speaking){
      window.speechSynthesis.cancel();
      stopListening();
      return;
    }
    prepareWordHighlights();
    const text = getArticleText();
    utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.98;
    utterance.pitch = 1;
    utterance.onboundary = (event) => {
      if(typeof event.charIndex === 'number') setActiveReaderWord(event.charIndex);
    };
    utterance.onend = () => {
      stopListening();
    };
    window.speechSynthesis.speak(utterance);
    speaking = true;
    listenBtn.classList.add('playing');
    listenBtn.innerHTML = '<i class="fa-solid fa-stop"></i> Stop';
  });

  /* ---------------- Subscribe form ---------------- */
  const subscribeForm = document.getElementById('subscribeForm');
  const subscribeNote = document.getElementById('subscribeNote');
  subscribeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('subscribeEmail').value.trim();
    if(email){
      subscribeNote.textContent = 'Thanks — you\u2019re on the list for the next piece.';
      subscribeNote.style.color = 'var(--maroon)';
      subscribeForm.reset();
    }
  });

})();
