const timeContainer = document.querySelector('.time');
const dateContainer = document.querySelector('.date');
const dayContainer = document.querySelector('.day');

// Utility
function padZero(num) {
    return num.toString().padStart(2, '0');
}

function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

// Display code
function getTime() {
    const date = new Date();
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    if (window.__showSeconds) {
        return `${hours}:${minutes}:${padZero(date.getSeconds())}`;
    }
    return `${hours}:${minutes}`;
}

function getOrdinal(day) {
    if (day > 3 && day < 21) return 'th';
    switch (day % 10) {
        case 1: return 'st';
        case 2: return 'nd';
        case 3: return 'rd';
        default: return 'th';
    }
}

function getDate() {
    const listOfMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
    const date = new Date();
    const day = date.getDate();
    const month = listOfMonths[date.getMonth()];
    const year = date.getFullYear();
    const dayText = getOrdinal(day);

    return `${day}<sup>${dayText}</sup> ${month}<br><span>${year}</span>`;
}

function getDay() {
    const listOfDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date();
    return listOfDays[date.getDay()];
}

let prevTimeStr = '';
function setTime() {
    const newTime = getTime();
    if (newTime === prevTimeStr) return;

    // Rebuild the digit spans only when the length changes (e.g. seconds toggled)
    if (timeContainer.childElementCount !== newTime.length) {
        timeContainer.innerHTML = '';
        for (const ch of newTime) {
            const span = document.createElement('span');
            span.className = ch === ':' ? 'time-char time-colon' : 'time-char';
            span.textContent = ch;
            timeContainer.appendChild(span);
        }
        prevTimeStr = newTime;
        return;
    }

    // Otherwise only update + animate the characters that actually changed
    const spans = timeContainer.children;
    for (let i = 0; i < newTime.length; i++) {
        if (spans[i].textContent === newTime[i]) continue;
        spans[i].textContent = newTime[i];
        if (newTime[i] === ':') continue;
        spans[i].classList.remove('flip');
        void spans[i].offsetWidth; // restart animation
        spans[i].classList.add('flip');
    }
    prevTimeStr = newTime;
}

function setDate() {
    dateContainer.innerHTML = getDate();
}

function setDay() {
    dayContainer.textContent = getDay();
}

function startClock() {
    setTime();
    setInterval(() => {
        setTime();
        setDate();
        setDay();
    }, 1000);
}

startClock();
setDate();
setDay();


// Modal system
const modalOverlay = document.getElementById('modal-overlay');
const modalTitle = modalOverlay.querySelector('.modal-title');
const modalFields = modalOverlay.querySelector('.modal-fields');
const modalConfirm = modalOverlay.querySelector('.modal-confirm');
const modalCancel = modalOverlay.querySelector('.modal-cancel');

function openModal({ title, confirmText = 'Add', fields }) {
    return new Promise((resolve) => {
        modalTitle.textContent = title;
        modalConfirm.textContent = confirmText;
        modalFields.innerHTML = '';

        const inputs = fields.map((field) => {
            const input = document.createElement('input');
            input.type = 'text';
            input.className = 'modal-input';
            input.placeholder = field.placeholder || '';
            input.value = field.value || '';
            input.dataset.optional = field.optional ? '1' : '';
            input.addEventListener('input', () => input.classList.remove('error'));
            modalFields.appendChild(input);
            return input;
        });

        modalOverlay.classList.add('active');
        modalOverlay.setAttribute('aria-hidden', 'false');
        setTimeout(() => inputs[0] && inputs[0].focus(), 60);

        function cleanup(result) {
            modalOverlay.classList.remove('active');
            modalOverlay.setAttribute('aria-hidden', 'true');
            modalConfirm.removeEventListener('click', onConfirm);
            modalCancel.removeEventListener('click', onCancel);
            modalOverlay.removeEventListener('mousedown', onOverlay);
            document.removeEventListener('keydown', onKey);
            resolve(result);
        }

        function onConfirm() {
            const values = inputs.map((input) => input.value.trim());
            let valid = true;
            inputs.forEach((input, i) => {
                if (values[i].length === 0 && !input.dataset.optional) {
                    input.classList.add('error');
                    valid = false;
                }
            });
            if (!valid) return;
            cleanup(values);
        }

        function onCancel() {
            cleanup(null);
        }

        function onOverlay(event) {
            if (event.target === modalOverlay) onCancel();
        }

        function onKey(event) {
            if (event.key === 'Escape') onCancel();
            if (event.key === 'Enter') onConfirm();
        }

        modalConfirm.addEventListener('click', onConfirm);
        modalCancel.addEventListener('click', onCancel);
        modalOverlay.addEventListener('mousedown', onOverlay);
        document.addEventListener('keydown', onKey);
    });
}


// Todo Code
const todoContainer = document.querySelector('#todo-container');
const todoHead = document.querySelector('.to-do-head p');
const todoAddButton = document.getElementById('todo-add-btn');
const todoList = document.getElementById('todo-list');
const todoCount = document.getElementById('todo-count');
const todoEmpty = document.getElementById('todo-empty');

let todoTasks = [];

function getTaskFromLocalStorage() {
    const todos = localStorage.getItem('todo');
    return todos ? JSON.parse(todos) : [];
}

function saveTasksToLocalStorage() {
    localStorage.setItem('todo', JSON.stringify(todoTasks));
}

function updateTodoMeta() {
    const remaining = todoTasks.filter((task) => task.taskStatus == 0).length;
    todoCount.textContent = remaining;
    todoCount.classList.toggle('visible', remaining > 0);
    todoEmpty.classList.toggle('visible', todoTasks.length === 0);
}

function renderTasks() {
    todoList.innerHTML = '';
    todoTasks.forEach((task, index) => {
        const todoCard = document.createElement('div');
        todoCard.className = `todo-card-container ${task.taskStatus == 0 ? '' : 'completed'}`;
        todoCard.id = `task-no-${index}`;
        todoCard.innerHTML = `
            <div class="todo-mark-container">
                <input type="checkbox" ${task.taskStatus == 0 ? '' : 'checked'} name="comp" id="task-${index}">
            </div>
            <div class="todo-task-container">
                <label for="task-${index}">
                    ${escapeHtml(task.taskTitle)}
                </label>
            </div>
            <div class="todo-delete-container">
                <button class="todo-delete-btn" data-index="${index}" title="Delete task" aria-label="Delete task">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z" fill="red" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                </button>
            </div>
        `;
        todoList.appendChild(todoCard);
    });
    updateTodoMeta();
}

function addTask(task) {
    todoTasks.push(task);
    saveTasksToLocalStorage();
    renderTasks();
}

function deleteTask(index) {
    todoTasks.splice(index, 1);
    saveTasksToLocalStorage();
    renderTasks();
}

(function init() {
    todoTasks = getTaskFromLocalStorage();
    renderTasks();
})();

todoHead.addEventListener('click', () => {
    todoContainer.classList.toggle('active');
});

todoAddButton.addEventListener('click', async () => {
    const result = await openModal({
        title: 'New task',
        fields: [{ placeholder: 'What needs doing?' }],
    });
    if (!result) return;
    addTask({ taskTitle: result[0], taskStatus: 0 });
    todoContainer.classList.add('active');
});

todoList.addEventListener('click', (event) => {
    const deleteButton = event.target.closest('.todo-delete-btn');
    if (deleteButton) {
        const index = parseInt(deleteButton.getAttribute('data-index'));
        deleteTask(index);
    }
});

todoList.addEventListener('change', (event) => {
    if (event.target.type === 'checkbox') {
        const index = parseInt(event.target.id.split('-')[1]);
        const taskCard = document.querySelector(`#task-no-${index}`);
        taskCard.classList.toggle('completed', event.target.checked);
        todoTasks[index].taskStatus = event.target.checked ? 1 : 0;
        saveTasksToLocalStorage();
        updateTodoMeta();
    }
});


// Site
const mostVisitedSites = document.getElementById('most-visited-sites');
const siteList = mostVisitedSites.querySelector('.site-list');
const addSiteButton = document.getElementById('most-add-btn');

let sites = [];

function getSitesFromLocalStorage() {
    const storedSites = localStorage.getItem('mostVisitedSites');
    return storedSites ? JSON.parse(storedSites) : [];
}

function saveSitesToLocalStorage() {
    localStorage.setItem('mostVisitedSites', JSON.stringify(sites));
}

function renderSites() {
    siteList.innerHTML = '';

    if (sites.length === 0) {
        const empty = document.createElement('span');
        empty.className = 'site-empty';
        empty.textContent = 'Add your favourite sites';
        siteList.appendChild(empty);
        return;
    }

    sites.forEach((site, index) => {
        const siteCard = document.createElement('div');
        siteCard.className = 'site-card-wrapper';
        siteCard.innerHTML = `
            <a href="${escapeHtml(site.url)}" target="_blank" class="site-card-container" data-url="${escapeHtml(site.url)}">
                <img src="${escapeHtml(site.favicon)}" alt="${escapeHtml(site.name)} favicon" onerror="this.classList.add('hidden')">
                <span class="site-fallback">${escapeHtml(site.name.charAt(0))}</span>
            </a>
            <span class="site-name">${escapeHtml(site.name)}</span>
            <button class="site-delete-btn" data-index="${index}" title="Remove bookmark" aria-label="Remove bookmark">
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M18 6 6 18M6 6l12 12"/>
                </svg>
            </button>
        `;
        siteList.appendChild(siteCard);
    });
}

function addSite(name, url) {
    if (!/^https?:\/\//i.test(url)) {
        url = 'https://' + url;
    }
    const favicon = `https://www.google.com/s2/favicons?domain=${url}&sz=64`;
    sites.push({ name, url, favicon });
    saveSitesToLocalStorage();
    renderSites();
}

function deleteSite(index) {
    sites.splice(index, 1);
    saveSitesToLocalStorage();
    renderSites();
}

function openSite(url) {
    if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
        chrome.tabs.create({ url });
    } else {
        window.open(url, '_blank');
    }
}

(function init() {
    sites = getSitesFromLocalStorage();
    renderSites();
})();

addSiteButton.addEventListener('click', async () => {
    const result = await openModal({
        title: 'Add a site',
        fields: [
            { placeholder: 'Name (e.g. GitHub)' },
            { placeholder: 'URL (e.g. github.com)' },
        ],
    });
    if (!result) return;
    addSite(result[0], result[1]);
});

siteList.addEventListener('click', (event) => {
    const deleteButton = event.target.closest('.site-delete-btn');
    const link = event.target.closest('a');

    if (deleteButton) {
        event.preventDefault();
        const index = parseInt(deleteButton.getAttribute('data-index'));
        deleteSite(index);
    } else if (link) {
        event.preventDefault();
        openSite(link.getAttribute('data-url'));
    }
});
