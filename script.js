'use strict'


let json = {
    records: []
};
const limitOfRecordsOnPage = 5;



//функция добавления задач
function createNewTask() {
    let taskValue = textarea.value;
    if(!taskValue) return;
    todoUl.insertAdjacentHTML('beforeend', `<li data-id="${Date.now()}" class="taskList"><div class="firstColumn"><input type="checkbox" class="checkbox">${taskValue}</div><div id="tasksButtonsDiv"><button class="editButton tasksButtons"></button><button class="deleteButton tasksButtons"></button></div></li>`)
    json.records.push({text: `${taskValue}`, timestamp: Date.now(), isChecked: false});
    textarea.value = '';
    localStorage.setItem('user', JSON.stringify(json));
}

const textarea = document.querySelector('textarea');
const todoUl = document.getElementById('todoUl')
const addButton = document.getElementById('AddCard');
const sortingButton = document.getElementById('sortingButton');
const prevButton = document.getElementById('prevPage');
const nextButton = document.getElementById('nextPage');
let checkboxes = document.getElementsByClassName('checkbox');

//для пагинация

let url = new URL(window.location);
let params = url.searchParams;
let page = params.get('page') || 1;

function clearing() {
    todoUl.innerHTML = ''
}

prevButton.onclick = function() {
    console.log('test')
    if (page === 1) return;
    page -= 1;
    console.log(page);
    clearing()
    renderLocalstorageJson(page);
}

nextButton.onclick = function() {
    console.log('test')
    page += 1;
    console.log(page);
    clearing()
    renderLocalstorageJson(page);
}

console.log(checkboxes)

sortingButton.onclick = function() {
    reverseChildren(todoUl)
}

todoUl.onmouseover = function(event) {
    let target = event.target;
    if(target.tagName !== 'LI') return
    let li = target.closest('li');
    let buttonsDiv = target.lastChild;
    buttonsDiv.style.display = 'block'
}

todoUl.onmouseout = function(event) {
    let target = event.target;
    if(target.tagName !== 'LI') return
    let li = target.closest('li');
    if (!event.relatedTarget) return;
    let isOnChildDiv = event.relatedTarget.classList.contains('firstColumn');
    let isOnActionsButtons = event.relatedTarget.tagName === 'BUTTON' && target.tagName === 'LI';
    if(isOnActionsButtons || isOnChildDiv) return;
    let buttonsDiv = target.lastChild;
    buttonsDiv.style.display = 'none'
}

function reverseChildren(parent) {
    for (let i = 1; i < parent.childNodes.length; i++){
        parent.insertBefore(parent.childNodes[i], parent.firstChild);
    }
}

todoUl.onclick = function(event) {
    let target = event.target;
    if(target.tagName === 'BUTTON') {
        if(target.classList.contains('deleteButton')) {
            deleteTusk(event);
        } else {
            editTusk(event);
        }
    }
    if(target.tagName === 'INPUT') {
        let liId = event.target.parentNode.parentNode.dataset.id;
        for(let record of json.records) {
            if(liId === record.timestamp.toString()) {
                let status = record.isChecked ? false : true;
                console.log(status)
                record.isChecked = status;
            }
        }
        localStorage.setItem('user', JSON.stringify(json));

        console.log(liId)
    }
}

//функция удаления
function deleteTusk(event) {
    let liId = event.target.parentNode.parentNode.dataset.id;
    for(let record of json.records) {
        if(liId === record.timestamp.toString()) {
            json.records.splice(record, 1);
            localStorage.setItem('user', JSON.stringify(json));
            console.log(json.records);
            event.target.parentNode.parentNode.remove();
        }
    }


}
//функция редактирования
function editTusk(event) {
    console.log(event.target.parentNode.parentNode.dataset.id);
    // let editableValue = event.target.parentNode.parentNode.textContent;
    window.location.href = `editpage.html?id=${event.target.closest('li').dataset.id}`;
    // let editTextarea = document.getElementById(`editTextarea`);
}

// 1. Запрос к серверу
// 2. ответ от сервера записываем в виде json'a в localstorage
// 3. берем из localstorage json и парсим в список

addButton.onclick = createNewTask;

function renderLocalstorageJson(page) {
    let storageFile = JSON.parse(localStorage.getItem('user'));
    if(!storageFile) return
    json = storageFile
    let amountOfRecords = limitOfRecordsOnPage * page;
    let records = storageFile.records.slice(amountOfRecords - limitOfRecordsOnPage, amountOfRecords)
    console.log(records);
    for(let record of records) {
        if(record.isChecked === true) {
            todoUl.insertAdjacentHTML('beforeend', `<li data-id = '${record.timestamp}' class="taskList"><div class="firstColumn"><input type="checkbox" class="checkbox" checked>${record.text}</div><div id="tasksButtonsDiv"><button class="editButton tasksButtons"></button><button class="deleteButton tasksButtons"></button></div></li>`)

        } else {
            todoUl.insertAdjacentHTML('beforeend', `<li data-id = '${record.timestamp}' class="taskList"><div class="firstColumn"><input type="checkbox" class="checkbox">${record.text}</div><div id="tasksButtonsDiv"><button class="editButton tasksButtons"></button><button class="deleteButton tasksButtons"></button></div></li>`)
        }
    }
}

function renderLocalstorageJson2() {
    let storageFile = JSON.parse(localStorage.getItem('user'));
    if(!storageFile) return
    json = storageFile

    let params = (new URL(document.location)).searchParams;
    let page = params.get("page") || 1;

    let endJsonElem = limitOfRecordsOnPage * page
    const records = storageFile.records.slice(endJsonElem - limitOfRecordsOnPage, endJsonElem);

    for(let record of records) {
        if(record.isChecked === true) {
            todoUl.insertAdjacentHTML('beforeend', `<li data-id = '${record.timestamp}' class="taskList"><div class="firstColumn"><input type="checkbox" class="checkbox" checked>${record.text}</div><div id="tasksButtonsDiv"><button class="editButton tasksButtons"></button><button class="deleteButton tasksButtons"></button></div></li>`)

        } else {
            todoUl.insertAdjacentHTML('beforeend', `<li data-id = '${record.timestamp}' class="taskList"><div class="firstColumn"><input type="checkbox" class="checkbox">${record.text}</div><div id="tasksButtonsDiv"><button class="editButton tasksButtons"></button><button class="deleteButton tasksButtons"></button></div></li>`)
        }
    }
}

window.onload = renderLocalstorageJson(page);