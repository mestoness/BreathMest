// --- Localization Strings ---
const translations = {
    tr: {
        title: "Nefes Egzersizleri",
        subtitle: "Konuşma bozukluğu olan kişiler için sosyal sorumluluk projesi",
        welcome_title: "Hoş Geldiniz",
        welcome_desc: "Bu platform, konuşma akıcılığını destekleyen özel nefes tekniklerini pratik etmeniz için tasarlanmıştır. Egzersiz sırasındaki yönergelere ve animasyonlara dikkat ederek istediğiniz egzersizi uygulayabilirsiniz.",
        ex1_title: "4-7-8 Nefes Egzersizi",
        ex1_desc_full: "Sinir sistemini sakinleştirmeye yardımcı olan rahatlatıcı bir teknik.",
        tag_4s: "4sn Al",
        tag_7s: "7sn Tut",
        tag_8s: "8sn Ver",
        btn_start: "Başla",
        ex2_title: "Keep it Costal",
        ex2_desc_full: "Diyaframı aktif kullanmak ve nefes kontrolünü sağlamak için etkili yöntem.",
        tag_fast_inhale: "Hızlı Al",
        tag_fast_exhale: "Hemen Ver",
        tag_6s: "6sn Bekle",
        btn_back: "Geri Dön",
        ready: "HAZIR MISINIZ?",
        btn_exercise_start: "Egzersizi Başlat",
        btn_exercise_pause: "Duraklat",
        btn_exercise_resume: "Devam Et",
        audio_playing: "Ses oynatılıyor...",
        credits_text: "Bu proje Ahmet Baki Memiş tarafından hazırlanmıştır.",

        // Exercise specific dynamic descriptions
        ex1_desc: "Rahatlamak ve sakinleşmek için. Yönergelere uyarak nefes al, tut ve ver.",
        ex2_desc: "Diyaframı aktif kullanmak için. Ağzından hızlıca nefes al, hemen ver ve bekle.",

        // Sequence instructions
        seq_inhale: "NEFES AL",
        seq_hold: "NEFESİNİ TUT",
        seq_exhale: "NEFES VER",
        seq_fast_exhale: "HEMEN VER",
        seq_wait: "BEKLE"
    },
    en: {
        title: "Breathing Exercises",
        subtitle: "Social responsibility project for people with speech disorders",
        welcome_title: "Welcome",
        welcome_desc: "This platform is designed to help you practice specific breathing techniques that support speech fluency. Follow the instructions and animations during the exercises.",
        ex1_title: "4-7-8 Breathing Exercise",
        ex1_desc_full: "A relaxing technique that helps calm the nervous system.",
        tag_4s: "Inhale 4s",
        tag_7s: "Hold 7s",
        tag_8s: "Exhale 8s",
        btn_start: "Start",
        ex2_title: "Keep it Costal",
        ex2_desc_full: "An effective method to actively use the diaphragm and gain breath control.",
        tag_fast_inhale: "Quick Inhale",
        tag_fast_exhale: "Quick Exhale",
        tag_6s: "Wait 6s",
        btn_back: "Go Back",
        ready: "READY?",
        btn_exercise_start: "Start Exercise",
        btn_exercise_pause: "Pause",
        btn_exercise_resume: "Resume",
        audio_playing: "Audio playing...",
        credits_text: "This project is developed by Ahmet Baki Memiş.",

        // Exercise specific dynamic descriptions
        ex1_desc: "For relaxation. Follow instructions to inhale, hold, and exhale.",
        ex2_desc: "To use the diaphragm. Inhale quickly, exhale immediately, and wait.",

        // Sequence instructions
        seq_inhale: "INHALE",
        seq_hold: "HOLD BREATH",
        seq_exhale: "EXHALE",
        seq_fast_exhale: "EXHALE NOW",
        seq_wait: "WAIT"
    }
};

let currentLang = 'tr';

function setLanguage(lang) {
    currentLang = lang;
    document.documentElement.lang = lang;
    const t = translations[lang];

    // Update simple text elements via data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (t[key]) {
            el.textContent = t[key];
        }
    });

    // Update active button classes
    document.getElementById('btn-tr').classList.toggle('active', lang === 'tr');
    document.getElementById('btn-en').classList.toggle('active', lang === 'en');

    // Dynamically update current active state bounds if mid-exercise
    if (currentExercise) {
        titleEl.textContent = t[currentExercise.titleKey];
        descEl.textContent = t[currentExercise.descKey];
        if (!isRunning && phaseIndex === 0 && timeRemaining === 0) {
            instructionText.textContent = t.ready;
            playBtnText.textContent = t.btn_exercise_start;
        } else if (isRunning) {
            playBtnText.textContent = t.btn_exercise_pause;
            instructionText.textContent = t[currentExercise.sequence[phaseIndex].nameKey];
        } else {
            playBtnText.textContent = t.btn_exercise_resume;
            instructionText.textContent = t[currentExercise.sequence[phaseIndex].nameKey];
        }
    }
}

// --- DOM Elements ---
const viewHome = document.getElementById('home-view');
const viewExercise = document.getElementById('exercise-view');
const titleEl = document.getElementById('ex-title');
const descEl = document.getElementById('ex-desc');
const instructionText = document.getElementById('instruction-text');
const timerText = document.getElementById('timer-text');
const playBtnText = document.getElementById('play-btn-text');
const playIcon = document.getElementById('play-icon');
const pauseIcon = document.getElementById('pause-icon');
const bOuter = document.getElementById('b-circle');
const innerCircle = document.querySelector('.circle-inner');
const audioStatus = document.getElementById('audio-status');

// --- Audio Setup ---
const audio478 = new Audio('assets/audio/four-seven-eight.wav');
const audioCostal = new Audio('assets/audio/keepitcostal.wav');

// --- Application State ---
let currentExercise = null;
let isRunning = false;
let phaseIndex = 0;
let timeRemaining = 0;
let intervalId = null;
let timeoutId = null;
let currentAudio = null;

// Definition of Breathing Exercises with translation keys
const exercises = {
    '478': {
        titleKey: 'ex1_title',
        descKey: 'ex1_desc',
        audio: audio478,
        sequence: [
            { id: 'inhale', nameKey: 'seq_inhale', duration: 4, className: 'b-inhale' },
            { id: 'hold', nameKey: 'seq_hold', duration: 7, className: 'b-hold' },
            { id: 'exhale', nameKey: 'seq_exhale', duration: 8, className: 'b-exhale' }
        ]
    },
    'costal': {
        titleKey: 'ex2_title',
        descKey: 'ex2_desc',
        audio: audioCostal,
        sequence: [
            { id: 'inhale', nameKey: 'seq_inhale', duration: 1, className: 'b-inhale' },
            { id: 'exhale', nameKey: 'seq_fast_exhale', duration: 1, className: 'b-exhale' },
            { id: 'wait', nameKey: 'seq_wait', duration: 6, className: 'b-wait' }
        ]
    }
};

// --- View Navigation ---
function switchView(view) {
    if (view === 'exercise') {
        viewHome.classList.remove('active');
        setTimeout(() => viewExercise.classList.add('active'), 400);
    } else {
        viewExercise.classList.remove('active');
        setTimeout(() => viewHome.classList.add('active'), 400);
    }
}

function startExercise(exId) {
    currentExercise = exercises[exId];
    const t = translations[currentLang];
    titleEl.textContent = t[currentExercise.titleKey];
    descEl.textContent = t[currentExercise.descKey];

    resetState();
    switchView('exercise');
}

function goHome() {
    stopExercise();
    switchView('home');
}

// --- Exercise Logic ---
function resetState() {
    isRunning = false;
    phaseIndex = 0;
    timeRemaining = 0;
    const t = translations[currentLang];

    instructionText.textContent = t.ready;
    instructionText.style.color = "var(--text-secondary)";
    timerText.textContent = "--";
    playBtnText.textContent = t.btn_exercise_start;

    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    audioStatus.style.opacity = '0';

    // Reset animation classes & transforms
    bOuter.className = 'breathing-circle';
    innerCircle.style.transitionDuration = '0.5s';
    innerCircle.style.transform = '';

    if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
    }

    clearInterval(intervalId);
    clearTimeout(timeoutId);
}

function toggleExercise() {
    if (isRunning) {
        stopExercise();
    } else {
        runExercise();
    }
}

function stopExercise() {
    isRunning = false;
    const t = translations[currentLang];
    playBtnText.textContent = t.btn_exercise_resume;
    playIcon.style.display = 'block';
    pauseIcon.style.display = 'none';
    audioStatus.style.opacity = '0';

    clearInterval(intervalId);
    clearTimeout(timeoutId);

    if (currentAudio) {
        currentAudio.pause();
    }

    // Freeze current innerCircle scale to prevent jumping
    const computedStyle = window.getComputedStyle(innerCircle);
    const transform = computedStyle.getPropertyValue('transform');
    innerCircle.style.transform = transform;
    innerCircle.style.transitionDuration = '0s';

    bOuter.className = 'breathing-circle';
}

function runExercise() {
    isRunning = true;
    const t = translations[currentLang];
    playBtnText.textContent = t.btn_exercise_pause;
    playIcon.style.display = 'none';
    pauseIcon.style.display = 'block';
    audioStatus.style.opacity = '1';

    currentAudio = currentExercise.audio;
    let playPromise = currentAudio.play();
    if (playPromise !== undefined) {
        playPromise.catch(error => console.log('Audio playback prevented or missing:', error));
    }

    if (timeRemaining <= 0) {
        phaseIndex = 0;
        executePhase();
    } else {
        executePhase(timeRemaining);
    }
}

function executePhase(resumeTime = null) {
    if (!isRunning) return;

    const phase = currentExercise.sequence[phaseIndex];
    let duration = resumeTime ? resumeTime : phase.duration;
    const t = translations[currentLang];

    timeRemaining = duration;
    instructionText.textContent = t[phase.nameKey];
    instructionText.style.color = "#fff";
    timerText.textContent = timeRemaining;

    bOuter.className = 'breathing-circle ' + phase.className;

    innerCircle.style.transform = '';
    innerCircle.style.transitionDuration = `${duration}s`;

    clearInterval(intervalId);
    intervalId = setInterval(() => {
        timeRemaining--;
        if (timeRemaining > 0) {
            timerText.textContent = timeRemaining;
        } else {
            timerText.textContent = "0";
        }
    }, 1000);

    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
        clearInterval(intervalId);
        phaseIndex = (phaseIndex + 1) % currentExercise.sequence.length;

        if (phaseIndex === 0 && isRunning && currentAudio) {
            currentAudio.currentTime = 0;
            currentAudio.play().catch(e => console.log('Audio loop replay blocked:', e));
        }

        if (isRunning) {
            timeRemaining = 0;
            executePhase();
        }
    }, duration * 1000);
}

// Initial language rendering
setLanguage(currentLang);
