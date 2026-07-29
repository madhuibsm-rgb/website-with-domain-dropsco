const video = document.querySelector("video");

if (video) {
    video.play().catch(() => {});
}

// Hero title letter-by-letter fade-in animation
function animateHeroTitle() {
    const heroTitle = document.getElementById('hero-title');
    if (!heroTitle || heroTitle.dataset.animated === 'true') return;

    const mainText = heroTitle.querySelector('.hero-main-line')?.textContent.trim() || "We're building a long table.";
    const subtitleText = heroTitle.querySelector('.hero-subtitle-line')?.textContent.trim() || "There's a seat for you.";
    heroTitle.innerHTML = '';
    let charIndex = 0;

    const createAnimatedLine = (text, className) => {
        const line = document.createElement('span');
        line.className = `${className} hero-animated-line`;

        text.split(' ').forEach((word) => {
            const wordElement = document.createElement('span');
            wordElement.className = 'hero-word';

            [...word].forEach((char) => {
                const letter = document.createElement('span');
                letter.className = 'hero-letter';
                if (className === 'hero-subtitle-line') letter.classList.add('hero-subtitle-letter');
                letter.textContent = char;
                letter.style.animationDelay = `${charIndex * 50}ms`;
                wordElement.appendChild(letter);
                charIndex += 1;
            });

            line.appendChild(wordElement);
            charIndex += 1;
        });

        heroTitle.appendChild(line);
    };

    createAnimatedLine(mainText, 'hero-main-line');
    createAnimatedLine(subtitleText, 'hero-subtitle-line');
    heroTitle.dataset.animated = 'true';
}

// Start animation when page loads
document.addEventListener('DOMContentLoaded', () => {
    // Small delay to ensure everything is loaded
    setTimeout(animateHeroTitle, 500);
    
    // Initialize new quiz after DOM is loaded
    initializeNewQuiz();
    
    // Initialize reveal animations for about section
    initializeRevealAnimations();
});

// Reveal-on-scroll animation for about section
function initializeRevealAnimations() {
    const revealEls = document.querySelectorAll('.reveal');
    
    if (revealEls.length === 0) return;
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, idx) => {
            if (entry.isIntersecting) {
                // Slight stagger for elements that share a parent
                setTimeout(() => {
                    entry.target.classList.add('in-view');
                }, idx * 60);
                observer.unobserve(entry.target);
            }
        });
    }, { 
        threshold: 0.15, 
        rootMargin: '0px 0px -40px 0px' 
    });

    revealEls.forEach(el => observer.observe(el));
}

// Image section hover functionality with text changing and fade animations
const imageSection = document.querySelector('.image-section');
const storyPanels = document.querySelectorAll('.story-panel');
const storyStatement = document.querySelector('.story-statement');
const storyMobileCopies = document.querySelectorAll('.story-mobile-copy');
const MOBILE_BREAKPOINT = 768;

// Store all text versions
const climbText = "The morning that starts with a decision, and the eleven after it.The part that builds, decides, carries. Most of it invisible, all of it ours.We're good at it. It still isn't the whole thing.";
const herPeopleText = "The school run at three. The parents we keep well.The part that holds everyone together, and is rarely held back.We wouldn't hand it to anyone else. That's not the same as it being light.";
const explorerText = "The solo trip we keep not booking. The thing with no point to it.The part that's curious, restless, and older than any of our responsibilities.Not an escape. Just knowing there's more of us.";
const selfTextDesktop = "Not a role. Not a duty. The part that answers to no one and gets scheduled last. It's still there. It just needs a window.";
const selfTextMobile = "The twenty minutes that belong to nobody. Not a role. Not a duty. The part that answers to no one and gets scheduled last. It's still there. It just needs a window.";

let fadeTimeout;
let hoverActive = false;
let imageSectionInitialized = false;
let mobileObserverAttached = false;

function showText(text) {
  if (fadeTimeout) {
    clearTimeout(fadeTimeout);
  }

  hoverActive = true;
  storyStatement.classList.remove('fade-in');
  storyStatement.classList.add('is-visible');
  storyStatement.innerHTML = `<p>${text}</p>`;

  requestAnimationFrame(() => {
    storyStatement.classList.add('fade-in');
  });
}

function hideText() {
  if (fadeTimeout) {
    clearTimeout(fadeTimeout);
  }

  hoverActive = false;
  storyStatement.classList.remove('fade-in');
  storyStatement.classList.remove('is-visible');
  storyStatement.innerHTML = '';
}

function getPanelCopy(panel, isMobile = false) {
  if (!panel) return '';

  if (panel.classList.contains('panel-climb')) return climbText;
  if (panel.classList.contains('panel-love')) return herPeopleText;
  if (panel.classList.contains('panel-ambition')) return explorerText;
  if (panel.classList.contains('panel-self')) return isMobile ? selfTextMobile : selfTextDesktop;
  return '';
}

function showMobileCopy(panel, text) {
  if (!panel) return;

  const copyEl = panel.querySelector('.story-mobile-copy');
  if (!copyEl) return;

  copyEl.innerHTML = `<p>${text}</p>`;
  copyEl.classList.add('is-visible');
}

function clearMobileCopy() {
  storyMobileCopies.forEach(copyEl => {
    copyEl.classList.remove('is-visible');
    copyEl.innerHTML = '';
  });
}

function activateMobilePanel(panel) {
  if (!panel || !imageSection) return;

  storyPanels.forEach(item => {
    item.classList.toggle('is-active', item === panel);
  });

  const copy = getPanelCopy(panel, true);
  clearMobileCopy();

  if (copy) {
    showMobileCopy(panel, copy);
  }
}

function setupMobileScrollReveal() {
  if (!imageSection || storyPanels.length === 0 || !storyStatement || mobileObserverAttached) return;

  mobileObserverAttached = true;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        activateMobilePanel(entry.target);
      }
    });
  }, { threshold: 0.35 });

  storyPanels.forEach(panel => observer.observe(panel));

  const firstVisible = Array.from(storyPanels).find(panel => panel.getBoundingClientRect().top < window.innerHeight * 0.8);
  if (firstVisible) {
    activateMobilePanel(firstVisible);
  }
}

function syncImageSectionMode() {
  if (!imageSection) return;

  const isMobile = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`).matches || window.matchMedia('(hover: none)').matches;
  imageSection.classList.toggle('is-mobile', isMobile);
  imageSection.classList.toggle('is-desktop', !isMobile);

  if (isMobile) {
    imageSection.classList.remove('hover-climb', 'hover-love', 'hover-ambition', 'hover-self');
    imageSection.classList.add('default-state');
    clearMobileCopy();
    setupMobileScrollReveal();
    return;
  }

  imageSection.classList.add('default-state');
  hideText();
  clearMobileCopy();
}

function setupImageSectionHover() {
  if (!imageSection || storyPanels.length === 0 || !storyStatement) return;
  if (imageSectionInitialized) {
    syncImageSectionMode();
    return;
  }

  imageSectionInitialized = true;
  syncImageSectionMode();

  if (imageSection.classList.contains('is-mobile')) {
    return;
  }

  // Handle individual panel hover
  storyPanels.forEach(panel => {
    panel.addEventListener('mouseenter', () => {
      imageSection.classList.remove('default-state', 'hover-climb', 'hover-love', 'hover-ambition', 'hover-self');

      if (panel.classList.contains('panel-climb')) {
        imageSection.classList.add('hover-climb');
        showText(climbText);
      } else if (panel.classList.contains('panel-love')) {
        imageSection.classList.add('hover-love');
        showText(herPeopleText);
      } else if (panel.classList.contains('panel-ambition')) {
        imageSection.classList.add('hover-ambition');
        showText(explorerText);
      } else if (panel.classList.contains('panel-self')) {
        imageSection.classList.add('hover-self');
        showText(selfTextDesktop);
      }
    });

    panel.addEventListener('mouseleave', (event) => {
      if (event.relatedTarget && imageSection.contains(event.relatedTarget)) {
        return;
      }

      imageSection.classList.remove('hover-climb', 'hover-love', 'hover-ambition', 'hover-self');
      imageSection.classList.add('default-state');
      hideText();
    });
  });

  imageSection.addEventListener('mouseleave', () => {
    imageSection.classList.remove('hover-climb', 'hover-love', 'hover-ambition', 'hover-self');
    imageSection.classList.add('default-state');
    hideText();
  });
}

// Initialize hover effects and keep the image section mode in sync on resize.
setupImageSectionHover();
window.addEventListener('resize', syncImageSectionMode);
window.addEventListener('orientationchange', syncImageSectionMode);

const menuButton = document.querySelector('#site-menu-button');
const siteMenu = document.querySelector('#site-menu');
const menuCloseButton = document.querySelector('.site-menu-close');

function setSiteMenu(open) {
  if (!siteMenu || !menuButton) return;
  siteMenu.hidden = !open;
  menuButton.setAttribute('aria-expanded', String(open));
  document.body.classList.toggle('menu-open', open);
}

/* Quiz section logic */
const quizBody = document.getElementById('quiz-body');
const quizMarks = document.getElementById('quiz-marks');

const SHOW_PERCENTAGES = true;
const BASE = 412;

const QUIZ = {
  intro: {
    headline: 'Six questions about an ordinary day.',
    body: 'You\'ll leave knowing two things you didn\'t — one about your day, and how many women are in it too. Every answer comes with one thing worth knowing about why.',
    fine: 'Two minutes. Nothing to sign up for.',
    cta: 'Start'
  },
  questions: [
    {
      n: 'Question one · the day',
      q: 'When did you eat something that wasn\'t coffee today?',
      know: 'The dip at three usually isn\'t discipline. When the first real input of the day lands late, the crash lands late with it.',
      o: [
        { t:'Before 8', p:19, r:'About 1 in 5 women here manage that.' },
        { t:'Between 8 and 10', p:34, r:'The most common answer so far.' },
        { t:'Between 10 and 12', p:22, r:'Just over 1 in 5 said the same.' },
        { t:'After 12', p:14, r:'14% of women here ate first after midday too.' },
        { t:'Still haven\'t', p:11, r:'11% hadn\'t either, at the time they answered.' }
      ]
    },
    {
      n: 'Question two · the load',
      q: 'How many decisions had you made before nine this morning?',
      know: 'There is no test for this. It\'s the load that doesn\'t appear in any measure of a day, which is part of why it\'s so easy to carry without noticing.',
      o: [
        { t:'None I\'d call decisions', p:8, r:'The rarest answer here.' },
        { t:'A handful', p:26, r:'About a quarter said the same.' },
        { t:'Lost count', p:41, r:'The most common answer, by a distance.' },
        { t:'Somebody else\'s day was sorted before mine started', p:25, r:'A quarter of women here picked this one too.' }
      ]
    },
    {
      n: 'Question three · the night',
      q: 'What time did your screen go off last night?',
      know: 'It\'s rarely the light. It\'s that the mind is still being handed things to do at the point it\'s meant to be putting things down.',
      o: [
        { t:'Before 10', p:12, r:'Earlier than most here.' },
        { t:'10 to 11', p:29, r:'Just under a third said the same.' },
        { t:'11 to midnight', p:33, r:'The most common answer so far.' },
        { t:'After midnight', p:17, r:'17% of women here were up too.' },
        { t:'It didn\'t — I fell asleep with it', p:9, r:'Nearly 1 in 10 answered the same.' }
      ]
    },
    {
      n: 'Question four · the pattern',
      q: 'Did you wake up at roughly the same time on Sunday as on Wednesday?',
      know: 'Researchers have a name for that gap. How steady your wake time is turns out to say more about how you\'ll feel than how long you slept — which is the opposite of what most of us are working on.',
      o: [
        { t:'Within half an hour', p:21, r:'Steadier than most here.' },
        { t:'About an hour later', p:31, r:'The most common answer so far.' },
        { t:'Two hours or more', p:28, r:'Just over a quarter said the same.' },
        { t:'Sunday is the only morning that\'s mine', p:20, r:'1 in 5 women here chose this one too.' }
      ]
    },
    {
      n: 'Question five · yours',
      q: 'When did you last have thirty minutes that belonged to nobody?',
      know: 'Women spend around four hours a day on care — roughly three times what men do. It isn\'t that the half hour got deprioritised. It\'s that there wasn\'t one.',
      o: [
        { t:'Today', p:14, r:'Rarer than it should be.' },
        { t:'This week', p:23, r:'Just under a quarter answered the same.' },
        { t:'This month', p:26, r:'About a quarter said the same.' },
        { t:'I can\'t remember', p:29, r:'The most common answer here.' },
        { t:'Only when I\'m asleep', p:8, r:'8% answered exactly this.' }
      ]
    },
    {
      n: 'Question six · yours',
      q: 'What\'s the last thing you did that nobody asked you to?',
      know: 'This is the only question here with no average and no better answer. We ask it last on purpose.',
      o: [
        { t:'Moved, for no reason', p:null, r:null },
        { t:'Made something', p:null, r:null },
        { t:'Read something with no use', p:null, r:null },
        { t:'Went somewhere I hadn\'t been', p:null, r:null },
        { t:'Nothing\'s coming to mind', p:31, r:'It\'s the hardest question in the set.' }
      ]
    }
  ],
  resultsHeadline: 'Two things you didn\'t know this morning.',
  labels: {
    working: 'What\'s already working',
    knowing: 'One thing worth knowing',
    company: 'Who else is in it'
  },
  working: [
    { src:3, when:a=>a[3]===0, t:'Your wake time barely moves. That\'s steadier than most days manage, and it\'s doing more for how you feel than any supplement will.' },
    { src:2, when:a=>a[2]===0||a[2]===1, t:'Your screen goes off earlier than most. That\'s the cheapest thing anyone can do for their sleep, and you\'re already doing it.' },
    { src:0, when:a=>a[0]===0||a[0]===1, t:'You ate before ten. Most of the afternoon dip people describe starts with not doing that.' },
    { src:4, when:a=>a[4]===0||a[4]===1, t:'You had half an hour this week that belonged to nobody. Fewer than four in ten women here could say that.' },
    { src:5, when:a=>a[5]!==4, t:'You did something nobody asked you to. Most of a day belongs to other people. That bit didn\'t.' },
    { src:-1, when:()=>true, t:'You just answered six questions about a day you\'re still in the middle of. That\'s more attention than most days get.' }
  ],
  knowing: [
    { src:3, asset:'sleep', when:a=>a[3]===2||a[3]===3, t:'The gap between your Sunday and your Wednesday is doing more than you\'d think. Steadiness beats length — a shorter night at the same hour tends to leave people better off than a long lie-in that moves the whole thing.' },
    { src:0, asset:'coffee', when:a=>a[0]===3||a[0]===4, t:'Your first real food lands after midday. The flatness that turns up a few hours later isn\'t a discipline problem — it\'s the day catching up with a start it never got.' },
    { src:2, asset:'sleep', when:a=>a[2]===3||a[2]===4, t:'The screen isn\'t keeping you up because of the light. It\'s that you\'re still being handed things at the hour you\'re meant to be putting them down.' },
    { src:1, asset:'sleep', when:a=>a[1]===2||a[1]===3, t:'You\'d made more decisions before nine than most days are supposed to contain. Nobody measures that, which is exactly why it goes unaccounted for.' },
    { src:4, asset:'sleep', when:a=>a[4]===3||a[4]===4, t:'Around four hours a day goes on care — roughly three times what men spend. The half hour didn\'t get deprioritised. There wasn\'t one.' },
    { src:-1, asset:'sleep', when:()=>true, t:'Of everything on this page, the one worth taking away is the wake time. How steady it is says more about how long you slept.' }
  ],
  company: [
    {when:a=>a[4]===3||a[4]===4, t:'You\'re one of 37% here who couldn\'t name half an hour this week that belonged to them. It\'s the answer we least expected and the one we keep getting.'},
    {when:a=>a[4]===2, t:'A quarter of women here said the same. Another 37% couldn\'t name one at all.'},
    {when:()=>true, t:'You\'re in the smaller group. 37% of women here couldn\'t name half an hour at all.'}
  ],
  signoff: { line: 'That\'s it. No result, no type, nothing to be.', fine: 'These numbers come from everyone who\'ve answered so far. Thanks for adding yours.', base: n=>`Based on ${n.toLocaleString()} answers so far.` },
  assets: { sleep:{hd:'Know what to ask for at your next appointment.', sub:'The tests to request by name, and why they\'re worth it.', decade:true, decadeLabel:'Which decade?', decades:['30s','40s','50s'], cta:'Send it', done:'On its way. It\'s one page — read it before you next sit in a waiting room.'}, coffee:{hd:'The 3pm crash isn\'t what you think it is.', sub:'Coffee was never adding energy. It was muting the tiredness, then handing it back all at once — and taking a little of tonight\'s sleep with it.', decade:false, cta:'Send it', done:'On its way. Read it before your next afternoon cup.'}},
  nextLabel:'Next question', finalLabel:'See what that adds up to', emailPlaceholder:'Your email', emailError:'That doesn\'t look like an email address.'
};

let quizStep = -1;
let answers = [];
let decade = null;

function drawQuizMarks(){
  quizMarks.innerHTML = '';
  QUIZ.questions.forEach((_,i)=>{
    const mark = document.createElement('div');
    mark.className = 'mark' + (quizStep>i ? ' done' : quizStep===i ? ' now' : '');
    quizMarks.appendChild(mark);
  });
  quizMarks.style.opacity = quizStep < 0 ? 0 : 1;
}

function escapeHTML(str){ return String(str).replace(/[&<>\"]/g, c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c])); }

function renderQuiz(transition = false){
  drawQuizMarks();

  const existingStage = quizBody.querySelector('.quiz-stage');
  if (transition && existingStage) {
    existingStage.classList.add('is-exiting');
    window.setTimeout(() => {
      renderQuizContent();
    }, 180);
    return;
  }

  renderQuizContent();
}

function renderQuizContent(){
  if(quizStep === -1){
    const c = QUIZ.intro;
    quizBody.innerHTML = `
      <div class="quiz-stage is-entering">
        <div class="intro">
          <h1>${escapeHTML(c.headline)}</h1>
          <p>${escapeHTML(c.body)}</p>
          <p class="fine">${escapeHTML(c.fine)}</p>
          <button class="btn quiz-next" id="start-quiz">${escapeHTML(c.cta)}</button>
        </div>
      </div>`;
    document.getElementById('start-quiz').onclick = ()=>{ quizStep = 0; renderQuiz(true); };
    return;
  }

  if(quizStep === QUIZ.questions.length){
    renderQuizResults();
    return;
  }

  const current = QUIZ.questions[quizStep];
  quizBody.innerHTML = `
    <div class="quiz-stage is-entering">
      <div class="qwrap">
        <div class="qnum">${escapeHTML(current.n)}</div>
        <h1 class="qtext">${escapeHTML(current.q)}</h1>
        <div class="opts" id="quiz-opts" role="group" aria-label="${escapeHTML(current.q)}"></div>
        <div class="reveal" id="quiz-reveal"></div>
      </div>
    </div>`;

  const optsWrap = document.getElementById('quiz-opts');
  current.o.forEach((option, idx)=>{
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'opt';
    button.textContent = option.t;
    button.onclick = ()=>selectQuizOption(idx);
    optsWrap.appendChild(button);
  });
}

function selectQuizOption(idx){
  answers[quizStep] = idx;
  const current = QUIZ.questions[quizStep];
  document.querySelectorAll('#quiz-opts .opt').forEach((button, buttonIndex)=>{
    button.disabled = true;
    button.classList.add(buttonIndex===idx ? 'sel' : 'dim');
  });

  const selected = current.o[idx];
  const countLine = SHOW_PERCENTAGES && selected.p !== null
    ? `<div class="count"><em>${selected.p}%</em> of women answered the same. ${escapeHTML(selected.r || '')}</div>`
    : '';

  const reveal = document.getElementById('quiz-reveal');
  reveal.innerHTML = `${countLine}<div class="know"><span>${escapeHTML(QUIZ.labels.knowing)}</span>${escapeHTML(current.know)}</div>
     <button class="btn quiz-next" id="quiz-next">${escapeHTML(quizStep === QUIZ.questions.length - 1 ? QUIZ.finalLabel : QUIZ.nextLabel)}</button>`;
  requestAnimationFrame(()=>reveal.classList.add('on'));
  document.getElementById('quiz-next').onclick = ()=>{ quizStep++; renderQuiz(true); };
}

function renderQuizResults(){
  const w = QUIZ.working.find(rule=>rule.when(answers));
  const k = QUIZ.knowing.find(rule=>rule.when(answers) && rule.src !== w.src) || QUIZ.knowing[QUIZ.knowing.length-1];
  const c = QUIZ.company.find(rule=>rule.when(answers));
  const A = QUIZ.assets[k.asset];

  quizBody.innerHTML = `
    <div class="res">
      <h2>${escapeHTML(QUIZ.resultsHeadline)}</h2>
      <div class="finding"><div class="lbl">${escapeHTML(QUIZ.labels.working)}</div><div class="txt">${escapeHTML(w.t)}</div></div>
      <div class="finding"><div class="lbl">${escapeHTML(QUIZ.labels.knowing)}</div><div class="txt">${escapeHTML(k.t)}</div></div>
      <div class="finding"><div class="lbl">${escapeHTML(QUIZ.labels.company)}</div><div class="txt">${escapeHTML(c.t)}</div></div>
      <div class="signoff"><p>${escapeHTML(QUIZ.signoff.line)}</p><p class="fine">${escapeHTML(QUIZ.signoff.fine)}</p></div>
      <div class="capture" id="quiz-cap">
        <div class="cap-hd">${escapeHTML(A.hd)}</div>
        <div class="cap-sub">${escapeHTML(A.sub)}</div>
        ${A.decade ? `
          <div class="dec-q">${escapeHTML(A.decadeLabel)}</div>
          <div class="decs">${A.decades.map(d=>`<button class="dec" type="button" data-d="${escapeHTML(d)}">${escapeHTML(d)}</button>`).join('')}</div>` : ''}
        <div class="cap-row">
          <input id="quiz-email" type="email" placeholder="${escapeHTML(QUIZ.emailPlaceholder)}" autocomplete="email" aria-label="${escapeHTML(QUIZ.emailPlaceholder)}">
          <button id="quiz-sub" type="button">${escapeHTML(A.cta)}</button>
        </div>
        <div class="err" id="quiz-err" hidden>${escapeHTML(QUIZ.emailError)}</div>
      </div>
      ${SHOW_PERCENTAGES ? `<div class="base">${escapeHTML(QUIZ.signoff.base(BASE))}</div>` : ''}
    </div>`;

  document.querySelectorAll('.dec').forEach(button=>{
    button.onclick = ()=>{
      document.querySelectorAll('.dec').forEach(x=>x.classList.remove('on'));
      button.classList.add('on');
      decade = button.dataset.d;
    };
  });

  document.getElementById('quiz-sub').onclick = ()=>{
    const value = document.getElementById('quiz-email').value.trim();
    const err = document.getElementById('quiz-err');
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)){ err.hidden = false; return; }
    err.hidden = true;
    submitEmail(value,{decade,asset:k.asset,answers});
    track('email_capture',{asset:k.asset,decade});
    document.getElementById('quiz-cap').innerHTML = `<div class="cap-hd" style="margin:0">${escapeHTML(A.done)}</div>`;
  };
}

renderQuiz();

if (menuButton && siteMenu) {
  menuButton.addEventListener('click', () => setSiteMenu(siteMenu.hidden));
  menuCloseButton.addEventListener('click', () => setSiteMenu(false));
  siteMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => setSiteMenu(false)));
  document.addEventListener('keydown', (event) => { if (event.key === 'Escape') setSiteMenu(false); });
}

document.querySelector('.footer-signup-form')?.addEventListener('submit', (event) => {
  event.preventDefault();
  const form = event.currentTarget;
  if (!form.checkValidity()) { form.reportValidity(); return; }
  form.querySelector('button').textContent = 'Thank you';
  form.querySelector('button').disabled = true;
});

const primaryArticleCard = document.querySelector('.reading-card--primary');
if (primaryArticleCard) {
  const openPrimaryArticle = (event) => {
    if (event.target.closest('a')) return;
    window.location.href = 'article-healthiest-plates.html';
  };
  primaryArticleCard.addEventListener('click', openPrimaryArticle);
  primaryArticleCard.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); openPrimaryArticle(event); }
  });
}

const coffeeArticleCard = document.querySelector('.reading-card--coffee');
if (coffeeArticleCard) {
  const openCoffeeArticle = (event) => {
    if (event.target.closest('a')) return;
    window.location.href = 'article-3pm-coffee.html';
  };
  coffeeArticleCard.addEventListener('click', openCoffeeArticle);
  coffeeArticleCard.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openCoffeeArticle(event);
    }
  });
}

const nutritionArticleCard = document.querySelector('.reading-card:not(.reading-card--primary):not(.reading-card--coffee)');
if (nutritionArticleCard) {
  const openNutritionArticle = (event) => {
    if (event.target.closest('a')) return;
    window.location.href = 'article-pcos-rename.html';
  };
  nutritionArticleCard.addEventListener('click', openNutritionArticle);
  nutritionArticleCard.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      openNutritionArticle(event);
    }
  });
}

// Advanced Quiz functionality - sophisticated version with all features
function initializeNewQuiz() {
  // Advanced Quiz Configuration
  const QUIZ_CONFIG = {
    intro: {
      headline: 'Six questions about how you navigate your days.',
      body: 'You\'ll leave knowing two things you didn\'t know this morning — one about your patterns, and how many women share them with you. Every answer comes with insight worth knowing.',
      fine: 'Three minutes. Nothing to sign up for.',
      cta: 'Start'
    },
    questions: [
      {
        n: 'Question 01 · Morning',
        q: 'How does your ideal morning begin?',
        know: 'The first hour sets the tone for decision fatigue. Women who start with intention report 40% less afternoon overwhelm.',
        o: [
          { t: 'In silence, before the world wakes up', p: 23, r: 'About 1 in 4 women here choose this.' },
          { t: 'A slow ritual — coffee, notebook, window', p: 31, r: 'The most common answer so far.' },
          { t: 'Already moving — plans, lists, momentum', p: 28, r: 'Just over a quarter said the same.' },
          { t: 'Whatever the day pulls me into', p: 18, r: '18% of women here let the day decide too.' }
        ]
      },
      {
        n: 'Question 02 · Decisions',
        q: 'When you\'re overwhelmed, what helps most?',
        know: 'Research shows women make 35% more daily decisions than men. The recovery method matters as much as the prevention.',
        o: [
          { t: 'Time alone to think it through', p: 34, r: 'The most common coping strategy here.' },
          { t: 'Moving my body until clarity comes', p: 26, r: 'About a quarter choose movement first.' },
          { t: 'Talking it out with someone I trust', p: 22, r: 'Just over 1 in 5 said the same.' },
          { t: 'Diving deeper into work or projects', p: 18, r: '18% work through overwhelm by doing more.' }
        ]
      },
      {
        n: 'Question 03 · Boundaries',
        q: 'What\'s your relationship with your phone?',
        know: 'The average person checks their phone 96 times per day. Women report higher anxiety around phone boundaries than men.',
        o: [
          { t: 'It\'s a tool I control deliberately', p: 15, r: 'Rarer than it should be.' },
          { t: 'We have boundaries, mostly respected', p: 29, r: 'Just under a third said the same.' },
          { t: 'It\'s everywhere, but so is everything else', p: 33, r: 'The most common answer so far.' },
          { t: 'Honestly? It controls more than I\'d like', p: 23, r: 'Nearly 1 in 4 answered the same.' }
        ]
      },
      {
        n: 'Question 04 · Choice',
        q: 'How do you make your biggest decisions?',
        know: 'Decision-making styles correlate with stress levels. Intuitive deciders report higher satisfaction but more second-guessing.',
        o: [
          { t: 'Trust my gut, even when it\'s hard to explain', p: 27, r: 'Just over a quarter trust intuition first.' },
          { t: 'Research thoroughly, then choose confidently', p: 31, r: 'The most analytical approach, most common here.' },
          { t: 'Talk through all angles with trusted people', p: 25, r: 'A quarter prefer collaborative decisions.' },
          { t: 'Test small steps before committing fully', p: 17, r: '17% choose the experimental approach.' }
        ]
      },
      {
        n: 'Question 05 · Energy',
        q: 'What energizes you most?',
        know: 'Energy sources are highly individual, but patterns emerge. Connection-focused women report higher empathy fatigue.',
        o: [
          { t: 'Deep conversations about things that matter', p: 28, r: 'Just over a quarter are energized by depth.' },
          { t: 'Creating something new from nothing', p: 24, r: 'About 1 in 4 choose creation.' },
          { t: 'Being useful to people I care about', p: 30, r: 'The most common energy source here.' },
          { t: 'Mastering something challenging', p: 18, r: '18% find energy in challenge and growth.' }
        ]
      },
      {
        n: 'Question 06 · Fulfillment',
        q: 'At the end of a good day, what happened?',
        know: 'This question has no wrong answer. What constitutes a "good day" reveals core values more than personality tests.',
        o: [
          { t: 'I felt present in my own life', p: 26, r: 'About a quarter prioritize presence.' },
          { t: 'I moved something meaningful forward', p: 29, r: 'The most common definition of a good day.' },
          { t: 'I connected authentically with others', p: 27, r: 'Just over a quarter value connection most.' },
          { t: 'I learned something that changed how I think', p: 18, r: '18% measure days by growth and learning.' }
        ]
      }
    ],
    resultsHeadline: 'Your pattern, and who shares it.',
    labels: {
      working: 'What\'s already working',
      knowing: 'Worth knowing',
      company: 'Who else is here'
    },
    results: [
      {
        type: 'The Intentional',
        working: 'You start days with purpose and end them with reflection. That kind of presence is rarer than it should be.',
        knowing: 'Intentional living requires energy most people don\'t budget for. The exhaustion isn\'t from doing too much — it\'s from being too awake to everything.',
        company: 'You\'re with 28% of women here who measure days by presence rather than productivity.'
      },
      {
        type: 'The Builder',
        working: 'You find clarity in action and meaning in progress. While others plan, you\'re already moving.',
        knowing: 'Builders often struggle with rest because stopping feels like going backward. Progress is addictive, but sustainable building requires recovery.',
        company: 'About 31% of women here are energized by forward motion and creating something better.'
      },
      {
        type: 'The Connector',
        working: 'You see the threads that hold people together and know how to strengthen them. Connection is both your gift and your compass.',
        knowing: 'Highly connected people absorb more emotional information than they realize. Your empathy is an asset, but it needs boundaries.',
        company: 'Just over a quarter of women here navigate the world through relationships and shared understanding.'
      },
      {
        type: 'The Explorer',
        working: 'You\'re driven by curiosity and growth. Where others see problems, you see puzzles worth solving.',
        knowing: 'Explorers often feel restless in systems that reward repetition over innovation. Your need for novelty isn\'t a flaw — it\'s fuel.',
        company: 'You\'re among 17% of women here who measure fulfillment by how much they\'re learning and expanding.'
      }
    ],
    signoff: {
      line: 'That\'s it. No type to be, no box to fit into.',
      fine: 'These insights come from everyone who\'ve shared their patterns. Thank you for adding yours.',
      base: (n) => `Based on ${n.toLocaleString()} responses so far.`
    },
    assets: {
      wellbeing: {
        hd: 'The daily patterns that actually matter.',
        sub: 'Five evidence-based practices that compound over time — and why most wellness advice misses the mark.',
        decade: true,
        decadeLabel: 'Which decade?',
        decades: ['20s', '30s', '40s', '50s+'],
        cta: 'Send it',
        done: 'On its way. Read it before your next wellness decision.'
      },
      boundaries: {
        hd: 'How to set boundaries that actually hold.',
        sub: 'The difference between boundaries that work and boundaries that create more problems — with specific language for each.',
        decade: false,
        cta: 'Send it',
        done: 'Sent. Use it the next time someone pushes back.'
      }
    }
  };

  let quizStep = -1;
  let answers = [];
  let decade = null;
  const SHOW_PERCENTAGES = true;
  const BASE_RESPONSES = 847;

  // Get DOM elements
  const quizBody = document.getElementById('quiz-body');
  const quizMarks = document.getElementById('quiz-marks');

  if (!quizBody || !quizMarks) {
    console.error('Quiz elements not found');
    return;
  }

  // Helper functions
  function escapeHTML(str) {
    return String(str).replace(/[&<>\"]/g, c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;'
    }[c]));
  }

  function drawQuizMarks() {
    quizMarks.innerHTML = '';
    QUIZ_CONFIG.questions.forEach((_, i) => {
      const mark = document.createElement('div');
      mark.className = 'mark' + (quizStep > i ? ' done' : quizStep === i ? ' now' : '');
      quizMarks.appendChild(mark);
    });
    quizMarks.style.opacity = quizStep < 0 ? 0 : 1;
  }

  function renderQuiz(transition = false) {
    drawQuizMarks();

    const existingStage = quizBody.querySelector('.quiz-stage');
    if (transition && existingStage) {
      existingStage.classList.add('is-exiting');
      setTimeout(() => {
        renderQuizContent();
      }, 200);
      return;
    }

    renderQuizContent();
  }

  function renderQuizContent() {
    if (quizStep === -1) {
      const c = QUIZ_CONFIG.intro;
      quizBody.innerHTML = `
        <div class="quiz-stage is-entering">
          <div class="intro">
            <h1>${escapeHTML(c.headline)}</h1>
            <p>${escapeHTML(c.body)}</p>
            <p class="fine">${escapeHTML(c.fine)}</p>
            <button class="btn quiz-next" id="start-quiz-btn">${escapeHTML(c.cta)}</button>
          </div>
        </div>`;
      
      document.getElementById('start-quiz-btn').onclick = () => {
        quizStep = 0;
        renderQuiz(true);
      };
      return;
    }

    if (quizStep === QUIZ_CONFIG.questions.length) {
      renderQuizResults();
      return;
    }

    const current = QUIZ_CONFIG.questions[quizStep];
    quizBody.innerHTML = `
      <div class="quiz-stage is-entering">
        <div class="qwrap">
          <div class="qnum">${escapeHTML(current.n)}</div>
          <h1 class="qtext">${escapeHTML(current.q)}</h1>
          <div class="opts" id="quiz-opts" role="group" aria-label="${escapeHTML(current.q)}"></div>
          <div class="reveal" id="quiz-reveal"></div>
        </div>
      </div>`;

    const optsWrap = document.getElementById('quiz-opts');
    current.o.forEach((option, idx) => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'opt';
      button.textContent = option.t;
      button.onclick = () => selectQuizOption(idx);
      optsWrap.appendChild(button);
    });
  }

  function selectQuizOption(idx) {
    answers[quizStep] = idx;
    const current = QUIZ_CONFIG.questions[quizStep];
    
    document.querySelectorAll('#quiz-opts .opt').forEach((button, buttonIndex) => {
      button.disabled = true;
      button.classList.add(buttonIndex === idx ? 'sel' : 'dim');
    });

    const selected = current.o[idx];
    const countLine = SHOW_PERCENTAGES && selected.p !== null
      ? `<div class="count"><em>${selected.p}%</em> of women answered the same. ${escapeHTML(selected.r || '')}</div>`
      : '';

    const reveal = document.getElementById('quiz-reveal');
    reveal.innerHTML = `
      ${countLine}
      <div class="know">
        <span>${escapeHTML(QUIZ_CONFIG.labels.knowing)}</span>
        ${escapeHTML(current.know)}
      </div>
      <button class="btn quiz-next" id="quiz-next-btn">
        ${escapeHTML(quizStep === QUIZ_CONFIG.questions.length - 1 ? 'See your pattern' : 'Next question')}
      </button>`;
    
    requestAnimationFrame(() => reveal.classList.add('on'));
    
    document.getElementById('quiz-next-btn').onclick = () => {
      quizStep++;
      renderQuiz(true);
    };
  }

  function calculateResult() {
    // More sophisticated result calculation
    const patterns = {
      intentional: 0,
      builder: 0,
      connector: 0,
      explorer: 0
    };

    // Question 1: Morning approach
    if (answers[0] === 0) patterns.intentional += 2;
    if (answers[0] === 1) patterns.intentional += 1;
    if (answers[0] === 2) patterns.builder += 2;
    if (answers[0] === 3) patterns.explorer += 1;

    // Question 2: Overwhelm response
    if (answers[1] === 0) patterns.intentional += 2;
    if (answers[1] === 1) patterns.explorer += 1;
    if (answers[1] === 2) patterns.connector += 2;
    if (answers[1] === 3) patterns.builder += 1;

    // Question 3: Phone relationship
    if (answers[2] === 0) patterns.intentional += 1;
    if (answers[2] === 1) patterns.builder += 1;
    if (answers[2] === 2) patterns.connector += 1;
    if (answers[2] === 3) patterns.explorer += 1;

    // Question 4: Decision making
    if (answers[3] === 0) patterns.explorer += 1;
    if (answers[3] === 1) patterns.builder += 2;
    if (answers[3] === 2) patterns.connector += 2;
    if (answers[3] === 3) patterns.intentional += 1;

    // Question 5: Energy source
    if (answers[4] === 0) patterns.connector += 2;
    if (answers[4] === 1) patterns.explorer += 2;
    if (answers[4] === 2) patterns.connector += 1;
    if (answers[4] === 3) patterns.builder += 1;

    // Question 6: Good day definition
    if (answers[5] === 0) patterns.intentional += 2;
    if (answers[5] === 1) patterns.builder += 2;
    if (answers[5] === 2) patterns.connector += 1;
    if (answers[5] === 3) patterns.explorer += 2;

    // Find dominant pattern
    const maxScore = Math.max(...Object.values(patterns));
    const dominantPattern = Object.keys(patterns).find(key => patterns[key] === maxScore);
    
    const resultMap = {
      intentional: 0,
      builder: 1,
      connector: 2,
      explorer: 3
    };

    return resultMap[dominantPattern] || 0;
  }

  function renderQuizResults() {
    const resultIndex = calculateResult();
    const result = QUIZ_CONFIG.results[resultIndex];
    const assetKey = resultIndex < 2 ? 'wellbeing' : 'boundaries';
    const asset = QUIZ_CONFIG.assets[assetKey];

    quizBody.innerHTML = `
      <div class="res">
        <h2>${escapeHTML(QUIZ_CONFIG.resultsHeadline)}</h2>
        
        <div class="finding">
          <div class="lbl">${escapeHTML(QUIZ_CONFIG.labels.working)}</div>
          <div class="txt">${escapeHTML(result.working)}</div>
        </div>
        
        <div class="finding">
          <div class="lbl">${escapeHTML(QUIZ_CONFIG.labels.knowing)}</div>
          <div class="txt">${escapeHTML(result.knowing)}</div>
        </div>
        
        <div class="finding">
          <div class="lbl">${escapeHTML(QUIZ_CONFIG.labels.company)}</div>
          <div class="txt">${escapeHTML(result.company)}</div>
        </div>
        
        <div class="signoff">
          <p>${escapeHTML(QUIZ_CONFIG.signoff.line)}</p>
          <p class="fine">${escapeHTML(QUIZ_CONFIG.signoff.fine)}</p>
        </div>
        
        <div class="capture" id="quiz-capture">
          <div class="cap-hd">${escapeHTML(asset.hd)}</div>
          <div class="cap-sub">${escapeHTML(asset.sub)}</div>
          
          ${asset.decade ? `
            <div class="dec-q">${escapeHTML(asset.decadeLabel)}</div>
            <div class="decs">
              ${asset.decades.map(d => `
                <button class="dec" type="button" data-decade="${escapeHTML(d)}">${escapeHTML(d)}</button>
              `).join('')}
            </div>` : ''}
          
          <div class="cap-row">
            <input id="quiz-email" type="email" placeholder="your@email.com" autocomplete="email" aria-label="Email address">
            <button id="quiz-submit" type="button">${escapeHTML(asset.cta)}</button>
          </div>
          <div class="err" id="quiz-error" hidden>Please enter a valid email address.</div>
        </div>
        
        ${SHOW_PERCENTAGES ? `<div class="base">${escapeHTML(QUIZ_CONFIG.signoff.base(BASE_RESPONSES))}</div>` : ''}
      </div>`;

    // Decade selection handlers
    if (asset.decade) {
      document.querySelectorAll('.dec').forEach(button => {
        button.onclick = () => {
          document.querySelectorAll('.dec').forEach(b => b.classList.remove('on'));
          button.classList.add('on');
          decade = button.dataset.decade;
        };
      });
    }

    // Email submission handler
    document.getElementById('quiz-submit').onclick = () => {
      const emailInput = document.getElementById('quiz-email');
      const errorDiv = document.getElementById('quiz-error');
      const email = emailInput.value.trim();
      
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
        errorDiv.hidden = false;
        return;
      }
      
      errorDiv.hidden = true;
      
      // Simulate email submission
      console.log('Email submitted:', { email, decade, resultType: result.type, answers });
      
      document.getElementById('quiz-capture').innerHTML = `
        <div class="cap-hd" style="margin:0; text-align: center;">
          ${escapeHTML(asset.done)}
        </div>`;
    };
  }

  // Initialize the quiz
  renderQuiz();
}

// =======================
// WHO'S SETTING THE TABLE SCROLL ANIMATION
// =======================

/* =========================================================
ELEMENTS
========================================================= */
const section = document.getElementById("scrollSection");
const backgroundImage = document.getElementById("backgroundImage");
const backgroundOverlay = document.getElementById("backgroundOverlay");
const questionRow = document.getElementById("questionRow");
const finalContent = document.getElementById("finalContent");
const wordWho = document.getElementById("wordWho");
const wordSetting = document.getElementById("wordSetting");
const wordThe = document.getElementById("wordThe");
const wordTable = document.getElementById("wordTable");
const brandMark = document.getElementById("brandMark");
const heading = document.getElementById("heading");
const bodyArea = document.getElementById("bodyArea");
const quoteArea = document.getElementById("quoteArea");

/* =========================================================
HELPERS
========================================================= */
function clamp(value, min = 0, max = 1) {
    return Math.min(Math.max(value, min), max);
}

function smootherstep(t) {
    t = clamp(t);
    return (t * t * t * (t * (t * 6 - 15) + 10));
}

function range(progress, start, end) {
    return clamp((progress - start) / (end - start));
}

/* =========================================================
1. BACKGROUND REVEAL
This happens BEFORE the typography begins.
Image:
- fades in
- moves toward viewer
- loses blur to a subtle amount for text readability
- dark overlay becomes transparent enough
  to reveal the photograph.
========================================================= */
function animateBackground(progress) {
    const p = smootherstep(range(progress, 0.00, 0.15));
    
    /* FADE IN */
    backgroundImage.style.opacity = p;
    
    /* MOVE FROM BACK TO FRONT */
    const scale = 0.91 + (0.09 * p);
    backgroundImage.style.transform = `scale(${scale})`;
    
    /* BLUR REDUCES TO SUBTLE AMOUNT for text readability */
    const blur = 14 - (12 * p); // Goes from 14px to 2px blur
    backgroundImage.style.filter = `blur(${blur}px)`;
    
    /* Espresso overlay begins at 100%.
       It settles at 65% so the photograph remains
       visible but the text has excellent contrast. */
    const overlayOpacity = 1 - (0.35 * p);
    backgroundOverlay.style.opacity = overlayOpacity;
}

/* =========================================================
WORD ENTRANCE
========================================================= */
function animateWord(element, progress, start, end) {
    const p = smootherstep(range(progress, start, end));
    const y = 72 * (1 - p);
    const scale = 0.94 + (0.06 * p);
    
    element.style.opacity = p;
    element.style.transform = `translate3d(0,${y}vh,0)scale(${scale})`;
}

/* =========================================================
2. QUESTION ANIMATION
Begins AFTER background reveal.
========================================================= */
function animateQuestion(progress) {
    /* WHO'S */
    animateWord(wordWho, progress, 0.14, 0.23);
    
    /* SETTING */
    animateWord(wordSetting, progress, 0.22, 0.31);
    
    /* THE */
    animateWord(wordThe, progress, 0.30, 0.39);
    
    /* TABLE? */
    animateWord(wordTable, progress, 0.38, 0.47);
    
    /* =====================================================
    FULL QUESTION SHRINKS TO ITS FINAL POSITION
    ===================================================== */
    const shrink = smootherstep(range(progress, 0.50, 0.65));
    const mobile = window.innerWidth <= 700;
    const targetScale = mobile ? 0.31 : 0.20;
    const scale = 1 - ((1 - targetScale) * shrink);
    const moveY = mobile ? -39 : -41;
    
    questionRow.style.transform = `translate3d(0,${moveY * shrink}vh,0)scale(${scale})`;
    questionRow.style.transformOrigin = "center center";
}

/* =========================================================
3. FINAL CONTENT
========================================================= */
function animateFinal(progress) {
    /* FINAL SECTION - Start later to avoid overlap */
    const reveal = smootherstep(range(progress, 0.65, 0.75));
    finalContent.style.opacity = reveal;
    finalContent.style.pointerEvents = reveal > 0.95 ? "auto" : "none";
    
    /* BRAND */
    const brandP = smootherstep(range(progress, 0.70, 0.78));
    brandMark.style.opacity = brandP;
    brandMark.style.transform = `translateY(${15 * (1 - brandP)}px)`;
    
    /* HEADING */
    const headingP = smootherstep(range(progress, 0.75, 0.83));
    heading.style.opacity = headingP;
    heading.style.transform = `translateY(${35 * (1 - headingP)}px)`;
    
    /* BODY */
    const bodyP = smootherstep(range(progress, 0.80, 0.88));
    bodyArea.style.opacity = bodyP;
    bodyArea.style.transform = `translateY(${30 * (1 - bodyP)}px)`;
    
    /* QUOTE + CTA */
    const quoteP = smootherstep(range(progress, 0.85, 0.93));
    quoteArea.style.opacity = quoteP;
    quoteArea.style.transform = `translateY(${30 * (1 - quoteP)}px)`;
}

/* =========================================================
MAIN UPDATE
========================================================= */
function update() {
    if (!section) return;
    
    const rect = section.getBoundingClientRect();
    const distance = section.offsetHeight - window.innerHeight;
    const progress = clamp(-rect.top / distance);
    
    animateBackground(progress);
    animateQuestion(progress);
    animateFinal(progress);
}

/* =========================================================
PERFORMANCE FRIENDLY SCROLL
========================================================= */
let ticking = false;

function requestUpdate() {
    if (ticking) {
        return;
    }
    ticking = true;
    requestAnimationFrame(() => {
        update();
        ticking = false;
    });
}

/* =========================================================
EVENTS
========================================================= */
function initializeScrollAnimation() {
    if (section) {
        window.addEventListener("scroll", requestUpdate, { passive: true });
        window.addEventListener("resize", requestUpdate);
        update();
    }
}

// Add to DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
    // Existing initialization code...
    setTimeout(animateHeroTitle, 500);
    initializeNewQuiz();
    initializeRevealAnimations();
    
    // Rest of existing code...
});
