const timeContainer = document.querySelector('.time');
const dateContainer = document.querySelector('.date');
const dayContainer = document.querySelector('.day');

// Display code
function padZero(num) {
    return num.toString().padStart(2, '0');
}

function getTime() {
    const date = new Date();
    const hours = padZero(date.getHours());
    const minutes = padZero(date.getMinutes());
    return `${hours}:${minutes}`;
}

function getDate() {
    const listOfMonths = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
    const dayTextList = {
        1: 'st',
        2: 'nd',
        3: 'rd',
        21: 'st',
        31: 'st',
        22: 'nd',
        23: 'rd'
    }
    const dayTextToChange = [1, 2, 3, 21, 31, 22, 23];
    const date = new Date();
    const day = date.getDate();
    const month = listOfMonths[date.getMonth()];
    const year = date.getFullYear();
    const dayText = (dayTextToChange.includes(dayTextToChange)) ? dayTextList[day] : 'th';

    return `${day}'${dayText} ${month}<br><span>${year}</span>`;
}

function getDay() {
    let listOfDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const date = new Date();
    const day = listOfDays[date.getDay()];
    return day;
}

function setTime() {
    timeContainer.textContent = getTime();
}

function setDate() {
    dateContainer.innerHTML = getDate();
}

function setDay() {
    dayContainer.textContent = getDay();
}

function startClock() {
    setTime();
    setInterval(setTime, 1000);
}

startClock();
setDate();
setDay();


// Todo Code
const todoContainer = document.querySelector('#todo-container');
const todoHead = document.querySelector('.to-do-head p')
const todoAddButton = document.getElementById('todo-add-btn');
const todoList = document.getElementById('todo-list');

let todoTasks = [];

async function getTaskFromLocalStorage() {
    const todos = localStorage.getItem('todo');
    if(!todos) {
        return;
    }
    return JSON.parse(todos);
}

async function setTasks() {
    const tasks = await getTaskFromLocalStorage();
    if(!tasks)
        return;
    todoTasks = tasks;
}

function saveTasksToLocalStorage() {
    localStorage.setItem('todo', JSON.stringify(todoTasks));
}

function renderTasks() {
    todoList.innerHTML = '';
    todoTasks.forEach((task, index) => {
        const todoCard = document.createElement('div');
        todoCard.className = `todo-card-container ${(task.taskStatus == 0)? '': 'completed'}`;
        todoCard.id = `task-no-${index}`
        todoCard.innerHTML = `
            <div class="todo-mark-container">
                <input type="checkbox" ${task.taskStatus == 0? '': 'checked'} name="comp" id="task-${index}">
            </div>
            <div class="todo-task-container">
                <label for="task-${index}">
                    ${task.taskTitle}
                </label>
            </div>
            <div class="todo-delete-container">
                <button class="todo-delete-btn" data-index="${index}">
                    <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z" fill="red" fill-rule="evenodd" clip-rule="evenodd"></path></svg>
                </button>
            </div>
        `;
        todoList.appendChild(todoCard);
    });
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

(async function init() {
    await setTasks();
    renderTasks();
})();

todoHead.addEventListener('click', () => {
    todoContainer.classList.toggle('active');
});

todoAddButton.addEventListener('click', (event) => {
    let task = window.prompt('Enter new task');
    if(!task || task.trim().length === 0){
        return;
    }
    addTask({
        'taskTitle': task.trim(),
        'taskStatus': 0,
    });
});

todoList.addEventListener('click', (event) => {
    if (event.target.closest('.todo-delete-btn')) {
        const index = parseInt(event.target.closest('.todo-delete-btn').getAttribute('data-index'));
        deleteTask(index);
    }
});

todoList.addEventListener('change', (event) => {
    if (event.target.type === 'checkbox') {
        const index = parseInt(event.target.id.split('-')[1]);
        const taskCard = document.querySelector(`#task-no-${index}`)
        taskCard.classList.toggle('completed');
        todoTasks[index].taskStatus = taskCard.classList.contains('completed')? 1: 0;
        saveTasksToLocalStorage();
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
    sites.forEach((site, index) => {
        const siteCard = document.createElement('div');
        siteCard.className = 'site-card-wrapper';
        siteCard.innerHTML = `
            <a href="${site.url}" target="_blank" class="site-card-container" title="${site.name}" data-url="${site.url}">
                <img src="${site.favicon}" alt="${site.name} favicon" onerror="this.src='default-favicon.png';">
            </a>
            <button class="site-delete-btn" data-index="${index}">
                <svg width="15" height="15" viewBox="0 0 15 15" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5.5 1C5.22386 1 5 1.22386 5 1.5C5 1.77614 5.22386 2 5.5 2H9.5C9.77614 2 10 1.77614 10 1.5C10 1.22386 9.77614 1 9.5 1H5.5ZM3 3.5C3 3.22386 3.22386 3 3.5 3H5H10H11.5C11.7761 3 12 3.22386 12 3.5C12 3.77614 11.7761 4 11.5 4H11V12C11 12.5523 10.5523 13 10 13H5C4.44772 13 4 12.5523 4 12V4L3.5 4C3.22386 4 3 3.77614 3 3.5ZM5 4H10V12H5V4Z" fill="red" fill-rule="evenodd" clip-rule="evenodd"/>
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

// Initialize the sites
(function init() {
    sites = getSitesFromLocalStorage();
    renderSites();
})();

addSiteButton.addEventListener('click', () => {
    const name = prompt('Enter the site name:');
    if (!name) return;
    
    const url = prompt('Enter the site URL:');
    if (!url) return;

    addSite(name, url);
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
        const url = link.getAttribute('data-url');
        chrome.tabs.create({ url: url });
    }
});