'use strict';
let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY';
let globalActiveHabbitId;

/* page */
const page = {
    menu: document.querySelector('.nav__list'),
    header: {
        h1: document.querySelector('.content-header__title'),
        progressPercent: document.querySelector('.progress__perecent'),
        progressCoverBar: document.querySelector('.progress__bar-cover')
    },
    content: {
        daysContainer: document.querySelector('.days'),
        nextDay: document.querySelector('.task__day')
    },
    popup: {
        index: document.getElementById('add-task-popup'),
        iconField: document.querySelector('.popup__form input[name="icon"]')
    }
}

/* utils */
function loadData() {
    const habbitString = localStorage.getItem(HABBIT_KEY);
    const habbitArray = JSON.parse(habbitString);
    if(Array.isArray(habbitArray)) {
        habbits = habbitArray;
    }
}

function saveData() {
    localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

function togglePopup() {
    if (page.popup.index.classList.contains('cover_hidden')) {
        page.popup.index.classList.remove('cover_hidden')
    } else {
        page.popup.index.classList.add('cover_hidden')
    }
}

function resetForm(form, fields) {
    for (const field of fields) {
        form[field].value = '';
    }
}

function validateAndGetFormData(form, fields) {
    const formData = new FormData(form);
    const res = {};
    for (const field of fields) {
        const fieldValue = formData.get(field);
        form[field].classList.remove('task__input--error');
        if (!fieldValue) {
            form[field].classList.add('task__input--error');
        }
        res[field] = fieldValue;
    }
    let isValid = true;
    for (const field of fields) {
        if(!res[field]) {
            isValid = false;
        }
    }
    if (!isValid) {
        return;
    }
    return res;
}

/* render */
function renderMenu(activeHabbit) {
    for (const habbit of habbits) {
        const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);
        if (!existed) {
            const element = document.createElement('button');
            element.setAttribute('menu-habbit-id', habbit.id);
            element.classList.add('nav__btn');
            element.innerHTML = `<img src="img/${habbit.icon}.svg" alt="${habbit.name}">
            <svg class="nav__btn-close" onclick="deleteHabbit(${habbit.id - 1})" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" x="0px" y="0px"
            viewBox="0 0 48 48" style="enable-background:new 0 0 48 48;" xml:space="preserve">
       <linearGradient id="SVGID_1_" gradientUnits="userSpaceOnUse" x1="9.8581" y1="9.8581" x2="38.1419" y2="38.1419">
           <stop  offset="0" style="stop-color:#F44F5A"/>
           <stop  offset="0.4429" style="stop-color:#EE3D4A"/>
           <stop  offset="1" style="stop-color:#E52030"/>
       </linearGradient>
       <path style="fill:url(#SVGID_1_);" d="M44,24c0,11.045-8.955,20-20,20S4,35.045,4,24S12.955,4,24,4S44,12.955,44,24z"/>
       <path style="opacity:0.05;" d="M33.192,28.95L28.243,24l4.95-4.95c0.781-0.781,0.781-2.047,0-2.828l-1.414-1.414
           c-0.781-0.781-2.047-0.781-2.828,0L24,19.757l-4.95-4.95c-0.781-0.781-2.047-0.781-2.828,0l-1.414,1.414
           c-0.781,0.781-0.781,2.047,0,2.828l4.95,4.95l-4.95,4.95c-0.781,0.781-0.781,2.047,0,2.828l1.414,1.414
           c0.781,0.781,2.047,0.781,2.828,0l4.95-4.95l4.95,4.95c0.781,0.781,2.047,0.781,2.828,0l1.414-1.414
           C33.973,30.997,33.973,29.731,33.192,28.95z"/>
       <path style="opacity:0.07;" d="M32.839,29.303L27.536,24l5.303-5.303c0.586-0.586,0.586-1.536,0-2.121l-1.414-1.414
           c-0.586-0.586-1.536-0.586-2.121,0L24,20.464l-5.303-5.303c-0.586-0.586-1.536-0.586-2.121,0l-1.414,1.414
           c-0.586,0.586-0.586,1.536,0,2.121L20.464,24l-5.303,5.303c-0.586,0.586-0.586,1.536,0,2.121l1.414,1.414
           c0.586,0.586,1.536,0.586,2.121,0L24,27.536l5.303,5.303c0.586,0.586,1.536,0.586,2.121,0l1.414-1.414
           C33.425,30.839,33.425,29.889,32.839,29.303z"/>
       <path style="fill:#FFFFFF;" d="M31.071,15.515l1.414,1.414c0.391,0.391,0.391,1.024,0,1.414L18.343,32.485
           c-0.391,0.391-1.024,0.391-1.414,0l-1.414-1.414c-0.391-0.391-0.391-1.024,0-1.414l14.142-14.142
           C30.047,15.124,30.681,15.124,31.071,15.515z"/>
       <path style="fill:#FFFFFF;" d="M32.485,31.071l-1.414,1.414c-0.391,0.391-1.024,0.391-1.414,0L15.515,18.343
           c-0.391-0.391-0.391-1.024,0-1.414l1.414-1.414c0.391-0.391,1.024-0.391,1.414,0l14.142,14.142
           C32.876,30.047,32.876,30.681,32.485,31.071z"/>
       </svg>`;
            element.addEventListener('click', () => {
                return rerender(habbit.id);
            });

            if (activeHabbit.id === habbit.id) {
                element.classList.add('nav__btn--active');
            }
            page.menu.appendChild(element);
            continue;
        }
        if (activeHabbit.id === habbit.id) {
            existed.classList.add('nav__btn--active');
        } else {
            existed.classList.remove('nav__btn--active');
        }
    }
}

function renderHead(activeHabbit) {
    page.header.h1.innerText = activeHabbit.name;
    const progress = activeHabbit.days.length / activeHabbit.target > 1
        ? 100
        : activeHabbit.days.length / activeHabbit.target * 100;
        page.header.progressPercent.innerText = progress.toFixed(0) + '%';
        page.header.progressCoverBar.setAttribute('style', `width: ${progress}%`);
}

function renderContent(activeHabbit) {
    page.content.daysContainer.innerHTML = '';
  
    for(const index in activeHabbit.days) {
      const element = document.createElement('div');
      element.classList.add('task');
      element.innerHTML = `
      <div class="task__day">День ${Number(index) + 1}</div>
      <p class="task__comment">${activeHabbit.days[index].comment}</p>
      <button class="task__delete btn-reset" onclick="deleteDay(${index})">
        <img src="img/delete.svg" alt="Удалить день ${Number(index) + 1}" class="habbit__delete-img" onclick="deleteDays(${index})">
      </button>`;
      page.content.daysContainer.appendChild(element);
    }
    page.content.nextDay.innerHTML = `День ${activeHabbit.days.length + 1}`;
  }

function rerender(activeHabbitId) {
    globalActiveHabbitId = activeHabbitId;
    const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
    if (!activeHabbit) {
        return;
    }
    document.location.replace(document.location.pathname + '#' + activeHabbitId);
    renderMenu(activeHabbit);
    renderHead(activeHabbit);
    renderContent(activeHabbit);
}


/* work with gays */
function addDay(event) {
    event.preventDefault();
    const data = validateAndGetFormData(event.target, ['comment']);
    if (!data) {
        return;
    }

    habbits = habbits.map(habbit => {
        if (habbit.id === globalActiveHabbitId) {
            return {
                ...habbit,
                days: habbit.days.concat([{ comment: data.comment }])
            }
        }
        return habbit;
    });

    resetForm(event.target, ['comment']);
    rerender(globalActiveHabbitId);
    saveData();
}

function deleteDay(index) {
    habbits = habbits.map(habbit => {
        if (habbit.id === globalActiveHabbitId) {
            habbit.days.splice(index, 1);
            return {
                ...habbit,
                days: habbit.days 
            }
        }
        return habbit;
    });
    rerender(globalActiveHabbitId);
    saveData();
}

/* working with popup habbits */
function setIcon(context, icon) {
    page.popup.iconField.value = icon;

    const activeIcon = document.querySelector('.icon--active');
    activeIcon.classList.remove('icon--active');
    context.classList.add('icon--active');
}

function addHabbit(event) {
    event.preventDefault();
    const data = validateAndGetFormData(event.target, ['name', 'icon', 'target']);
    if (!data) {
        return;
    }

    const maxId = habbits.reduce((acc, habbit) => {
        if (acc > habbit.id) {
            return acc;
        } else {
            return habbit.id;
        }
    }, 0);

    habbits.push({
        id: maxId + 1,
        name: data.name,
        target: data.target,
        icon: data.icon,
        days: []
    });
    resetForm(event.target, ['name', 'target']);
    togglePopup();
    saveData(); 
    rerender(maxId + 1);
}

function deleteHabbit(index) {
    console.log(index);
}

/* init */
(() => {
    loadData();
    const hashId = Number(document.location.hash.replace('#', ''));
    const urlHabbit = habbits.find(habbit => habbit.id === hashId);
    if (urlHabbit) {
        rerender(urlHabbit.id);
    } else {
        rerender(habbits[0].id);
    }
})();

