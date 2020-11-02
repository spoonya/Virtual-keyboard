const KEYBOARD = {
  elements: {
    main: null,
    keysContainer: null,
    keys: [],
    textarea: ''
  },

  properties: {
    value: '',
    capsLock: false,
    shift: false,
    lang: false,
    sound: true,
    isInit: false
  },

  sounds: {
    ru: `assets/char-ru.mp3`,
    en: `assets/char-en.mp3`,
    backspace: `assets/backspace.mp3`,
    caps: `assets/caps.mp3`,
    enter: `assets/enter.mp3`,
    shift: `assets/shift.mp3`,
    lang: `assets/lang.mp3`,
    volume: `assets/sound.mp3`,
    init: `assets/init.mp3`
  },

  speechRec: {
    isSpeech: false,
    recognition: ''
  },

  init() {

    // Create main elements
    this.elements.main = document.createElement('div');
    this.elements.keysContainer = document.createElement('div');

    // Setup main elements
    this.elements.main.classList.add('keyboard', 'keyboard--hidden');
    this.elements.keysContainer.classList.add('keyboard__keys');
    this.elements.keysContainer.append(this._createKeys());

    this.elements.keys = this.elements.keysContainer.querySelectorAll('.keyboard__key');

    // Add to DOM
    this.elements.main.append(this.elements.keysContainer);
    document.body.append(this.elements.main);

    // Automatically use keyboard for elements with .use-keyboard-input
    document.querySelector('.use-keyboard-input').addEventListener('focus', () => {
      this.open();

      setTimeout(() => {
        !this.properties.isInit ? this._soundClick(this.sounds.init) : false;
        this.properties.isInit = true;
      }, 500);

    });
  },

  _createKeys(lang = false) {
    const FRAGMENT = document.createDocumentFragment();
    this.elements.textarea = document.querySelector('.use-keyboard-input');
    const TEXTAREA = this.elements.textarea;
    let keyLayout;

    const KEY_EN = [
      ['`', '~'],
      ['1', '!'],
      ['2', '@'],
      ['3', '#'],
      ['4', '$'],
      ['5', '%'],
      ['6', '^'],
      ['7', '&'],
      ['8', '*'],
      ['9', '('],
      ['0', ')'],
      ['-', '_'],
      ['=', '+'], 'backspace', 'tab',
      'q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', ['[', '{'],
      [']', '}'],
      ['\\', '|'],
      'caps', 'a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', [';', ':'],
      [`'`, `"`], 'enter', 'shift',
      'z', 'x', 'c', 'v', 'b', 'n', 'm', [',', '<'],
      ['.', '>'],
      ['/', '?'], 'sound', 'done', 'lang',
      'space', 'left', 'right', 'speech'
    ];

    const KEY_RU = [
      'ё',
      ['1', '!'],
      ['2', '"'],
      ['3', '№'],
      ['4', ';'],
      ['5', '%'],
      ['6', ':'],
      ['7', '?'],
      ['8', '*'],
      ['9', '('],
      ['0', ')'],
      ['-', '_'],
      ['=', '+'], 'backspace', 'tab',
      'й', 'ц', 'у', 'к', 'е', 'н', 'г', 'ш', 'щ', 'з', 'х', 'ъ', '/',
      'caps', 'ф', 'ы', 'в', 'а', 'п', 'р', 'о', 'л', 'д', 'ж', 'э', 'enter', 'shift',
      'я', 'ч', 'с', 'м', 'и', 'т', 'ь', 'б', 'ю',
      ['.', ','], 'sound',
      'done', 'lang',
      'space', 'left', 'right', 'speech'
    ];

    lang ? keyLayout = KEY_RU : keyLayout = KEY_EN;

    // Creates HTML for an icon
    const createIconHTML = (icon_name) => {
      return `<i class='material-icons'>${icon_name}</i>`;
    };

    keyLayout.forEach(key => {
      const KEY_EL = document.createElement('button');
      const INSERT_LINE_BR = ['backspace', keyLayout[27], 'enter', '?', keyLayout[52]].indexOf(key) !== -1;

      // Add attributes/classes
      KEY_EL.setAttribute('type', 'button');
      KEY_EL.addEventListener('focus', () => {
        document.querySelector('.use-keyboard-input').focus();
      });
      KEY_EL.classList.add('keyboard__key');

      switch (key) {
        case 'backspace':
          KEY_EL.classList.add('keyboard__key--wide', 'keyboard__key--spec');
          KEY_EL.innerHTML = createIconHTML('backspace');
          KEY_EL.setAttribute('id', 'Backspace');

          KEY_EL.addEventListener('click', () => {
            this._soundClick(this.sounds.backspace);
            const start = TEXTAREA.selectionStart;
            const end = TEXTAREA.selectionEnd;

            if (start === end && TEXTAREA.value.length > 0) {
              TEXTAREA.setRangeText('', start - 1, end, 'end');
            } else {
              TEXTAREA.setRangeText('', start, end, 'end');
            }
          });

          break;

        case 'caps':
          KEY_EL.classList.add('keyboard__key--wide', 'keyboard__key--activatable', 'keyboard__key--spec');
          KEY_EL.innerHTML = createIconHTML('keyboard_capslock');
          KEY_EL.setAttribute('id', 'CapsLock');

          KEY_EL.addEventListener('click', () => {
            this._soundClick(this.sounds.caps);
            this._toggleCapsLock();
            KEY_EL.classList.toggle('keyboard__key--active', this.properties.capsLock);
          });

          break;

        case 'shift':
          KEY_EL.classList.add('keyboard__key--wide', 'keyboard__key--activatable', 'keyboard__key--spec');
          KEY_EL.innerHTML = createIconHTML('keyboard_arrow_up');
          KEY_EL.setAttribute('id', 'Shift');

          KEY_EL.addEventListener('click', () => {
            this._soundClick(this.sounds.shift);
            keyLayout = this.properties.lang ? KEY_RU : KEY_EN;
            this._toggleShift(keyLayout);

            KEY_EL.classList.toggle('keyboard__key--active', this.properties.shift);
          });

          break;

        case 'lang':
          KEY_EL.classList.add('keyboard__key--wide', 'keyboard__key--spec');
          KEY_EL.setAttribute('id', 'lang');
          KEY_EL.innerHTML = 'EN';

          KEY_EL.addEventListener('click', () => {
            this._soundClick(this.sounds.lang);
            this.properties.lang = !this.properties.lang;
            this.properties.lang ? KEY_EL.innerHTML = 'RU' : KEY_EL.innerHTML = 'EN';
            keyLayout = this.properties.lang ? KEY_RU : KEY_EN;
            this._lang(keyLayout);

            if (this.speechRec.isSpeech) {
              this._speechRec(this.speechRec.isSpeech = false);
              this._speechRec(this.speechRec.isSpeech = true);
            }
          });

          break;

        case 'sound':
          KEY_EL.classList.add('keyboard__key--wide', 'keyboard__key--activatable', 'keyboard__key--spec', 'keyboard__key--active');
          KEY_EL.innerHTML = createIconHTML('volume_up');
          KEY_EL.setAttribute('id', 'sound');

          KEY_EL.addEventListener('click', () => {
            this.properties.sound = !this.properties.sound;
            this._soundClick(this.sounds.volume);
            KEY_EL.classList.toggle('keyboard__key--active', this.properties.sound);
          });

          break;

        case 'speech':
          KEY_EL.classList.add('keyboard__key--wide', 'keyboard__key--activatable', 'keyboard__key--spec');
          KEY_EL.innerHTML = createIconHTML('keyboard_voice');
          KEY_EL.setAttribute('id', 'speech');

          KEY_EL.addEventListener('click', () => {
            try {
              this.speechRec.isSpeech = !this.speechRec.isSpeech;
              this._speechRec(this.speechRec.isSpeech);
              KEY_EL.classList.toggle('keyboard__key--active', this.properties.speech);
              this._soundClick();
            } catch {
              this.speechRec.isSpeech = !this.speechRec.isSpeech;
              alert('Web Speech API is not supported by this browser. Upgrade to Chrome version 25 or later.');
            }
          });

          break;

        case 'tab':
          KEY_EL.classList.add('keyboard__key--wide', 'keyboard__key--spec');
          KEY_EL.innerHTML = createIconHTML('keyboard_tab');
          KEY_EL.setAttribute('id', 'Tab');

          KEY_EL.addEventListener('click', () => {
            this._soundClick();
            const start = TEXTAREA.selectionStart;
            const end = TEXTAREA.selectionEnd;
            TEXTAREA.setRangeText('   ', start, end, 'end');
          });

          break;

        case 'enter':
          KEY_EL.classList.add('keyboard__key--wide', 'keyboard__key--spec');
          KEY_EL.innerHTML = createIconHTML('keyboard_return');
          KEY_EL.setAttribute('id', 'Enter');

          KEY_EL.addEventListener('click', () => {
            this._soundClick(this.sounds.enter);
            const start = TEXTAREA.selectionStart;
            const end = TEXTAREA.selectionEnd;
            TEXTAREA.setRangeText('\n', start, end, 'end');

          });

          break;

        case 'space':
          KEY_EL.classList.add('keyboard__key--extra-wide');
          KEY_EL.innerHTML = createIconHTML('space_bar');
          KEY_EL.setAttribute('id', ' ');

          KEY_EL.addEventListener('click', () => {
            this._soundClick();
            const start = TEXTAREA.selectionStart;
            const end = TEXTAREA.selectionEnd;
            TEXTAREA.setRangeText(' ', start, end, 'end');

          });

          break;

        case 'left':
          KEY_EL.classList.add('keyboard__key', 'keyboard__key--spec');
          KEY_EL.innerHTML = createIconHTML('keyboard_arrow_left');
          KEY_EL.setAttribute('id', 'ArrowLeft');

          KEY_EL.addEventListener('click', () => {
            this._soundClick();
            const start = TEXTAREA.selectionStart;
            const end = TEXTAREA.selectionEnd;

            if (start === end && TEXTAREA.value.length > 0 && start > 0) {
              let pos = start - 1;
              TEXTAREA.selectionStart = pos,
                TEXTAREA.selectionEnd = pos
            }
          });

          break;

        case 'right':
          KEY_EL.classList.add('keyboard__key', 'keyboard__key--spec');
          KEY_EL.innerHTML = createIconHTML('keyboard_arrow_right');
          KEY_EL.setAttribute('id', 'ArrowRight');

          KEY_EL.addEventListener('click', () => {
            this._soundClick();
            const start = TEXTAREA.selectionStart;
            const end = TEXTAREA.selectionEnd;

            if (start === end && TEXTAREA.value.length > 0) {
              let pos = start + 1;
              TEXTAREA.selectionStart = pos,
                TEXTAREA.selectionEnd = pos
            }
          });

          break;

        case 'done':
          KEY_EL.classList.add('keyboard__key--wide', 'keyboard__key--spec');
          KEY_EL.innerHTML = createIconHTML('check_circle');
          KEY_EL.setAttribute('id', 'done');

          KEY_EL.addEventListener('click', () => {
            this._soundClick();
            document.querySelector('.use-keyboard-input').blur();
            this.close();
          });

          break;

        default:
          KEY_EL.textContent = key[0].toLowerCase();

          KEY_EL.addEventListener('click', () => {
            const start = TEXTAREA.selectionStart;
            const end = TEXTAREA.selectionEnd;
            this._soundClick();

            if (!this.properties.shift) {
              if (this.properties.capsLock) {
                TEXTAREA.setRangeText(KEY_EL.textContent.toUpperCase(), start, end, 'end');
              } else {
                TEXTAREA.setRangeText(KEY_EL.textContent.toLowerCase(), start, end, 'end');
              }
            } else {
              if (Array.isArray(key)) {
                TEXTAREA.setRangeText(KEY_EL.textContent, start, end, 'end');
              } else {
                TEXTAREA.setRangeText(KEY_EL.textContent.toUpperCase(), start, end, 'end');
              }
            }
          });
          break;
      }

      FRAGMENT.append(KEY_EL);

      if (INSERT_LINE_BR) {
        FRAGMENT.append(document.createElement('br'));
      }
    });

    return FRAGMENT;
  },

  _toggleCapsLock() {
    this.properties.capsLock = !this.properties.capsLock;
    if (this.properties.shift) return;

    for (const key of this.elements.keys) {
      if (key.childElementCount === 0 && key.id !== 'lang') {
        key.textContent = this.properties.capsLock ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      }
    }
  },

  _toggleShift(keyLayout) {
    this.properties.shift = !this.properties.shift;

    let i = 0;
    for (const key of this.elements.keys) {
      if (key.childElementCount === 0 && key.id !== 'lang') {
        if (this.properties.shift && keyLayout[i][1]) {
          key.textContent = keyLayout[i++][1];
        } else {
          key.textContent = keyLayout[i++][0];
        }

        if (this.properties.shift) {
          key.textContent = key.textContent.toUpperCase();
        } else if (!this.properties.shift && this.properties.capsLock) {
          key.textContent = key.textContent.toUpperCase();
        } else {
          key.textContent = key.textContent.toLowerCase();
        }
      } else {
        i++;
      }
    }
  },

  _lang(keyLayout) {
    let i = 0;
    for (const key of this.elements.keys) {
      if (key.childElementCount === 0 && key.id !== 'lang') {

        if (this.properties.shift && keyLayout[i][1]) {
          key.textContent = keyLayout[i++][1];
        } else {
          key.textContent = keyLayout[i++][0];
        }

        key.textContent = this.properties.shift ? key.textContent.toUpperCase() : key.textContent.toLowerCase();
      } else {
        i++;
      }
    }
  },

  _soundClick(sound = false) {
    const audio = new Audio();
    audio.volume = 0.3;

    if (sound === false) {
      if (this.properties.lang) {
        sound = this.sounds.ru;
      } else {
        sound = this.sounds.en;
      }
    }

    audio.src = sound;

    this.properties.sound ? audio.play() : false;
  },

  //Speech rec
  _speechRec(isOn) {
    if (!isOn) {
      console.log('stop');
      this.speechRec.recognition.stop();
      this.speechRec.recognition.abort();
      this.speechRec.recognition.removeEventListener('end', this.speechRec.recognition.start);
      this.speechRec.recognition.removeEventListener('result', this.speechRec.recognition.results);
      return;
    }

    window.SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const rec = this.speechRec.recognition = new SpeechRecognition();
    rec.interimResults = true;

    if (this.properties.lang) {
      rec.lang = 'ru-Ru';
    } else {
      rec.lang = 'en-US';
    }

    console.log(rec.lang);

    rec.addEventListener('result', (e) => {
      let transcript = Array.from(e.results)
        .map(res => res[0])
        .map(res => res.transcript).join('');

      transcript = transcript[0].toUpperCase() + transcript.slice(1);

      if (e.results[0].isFinal) {
        if (this.elements.textarea.value.length > 0) {
          this.elements.textarea.value += ' ' + transcript;
        } else {
          this.elements.textarea.value = transcript;
        }
      }

      console.log(transcript);
    });

    rec.addEventListener('end', rec.start);

    rec.start();
  },

  open() {
    this.elements.main.classList.remove('keyboard--hidden');
  },

  close() {
    this.elements.main.classList.add('keyboard--hidden');
  }
};

window.addEventListener('DOMContentLoaded', () => {
  KEYBOARD.init();

  //Keydown
  const KEYBOARD_LEN = KEYBOARD.elements.keys.length;
  const clickEvt = new MouseEvent('click');
  let key;

  document.addEventListener('keyup', () => {
    for (let i = 0; i < KEYBOARD_LEN; i++) {
      KEYBOARD.elements.keys[i].classList.remove('keyboard__key--active-common');
    }
  });

  document.addEventListener('keydown', (e) => {
    key = e.key;

    if (e.ctrlKey && e.shiftKey || e.altKey && e.shiftKey) {
      document.querySelector('#lang').dispatchEvent(clickEvt);
      KEYBOARD._toggleShift(KEYBOARD.elements.keys);
    }

    for (let i = 0; i < KEYBOARD_LEN; i++) {
      if (KEYBOARD.properties.shift || KEYBOARD.properties.capsLock) {
        key = key.toUpperCase();
      } else {
        key = key.toLowerCase();
      }

      if (KEYBOARD.elements.keys[i].innerHTML === key || KEYBOARD.elements.keys[i].id === e.key) {
        KEYBOARD.elements.keys[i].classList.add('keyboard__key--active-common');
        e.preventDefault();
        KEYBOARD.elements.keys[i].dispatchEvent(clickEvt);
      }
    }
  });
});