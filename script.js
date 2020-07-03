'use strict'


let json = {
    records: []
};
const limitOfRecordsOnPage = 5;



//функция добавления задач
function createNewTask() {
    let taskValue = textarea.value;
    if(!taskValue) return;
    json.records.push({text: `${taskValue}`, timestamp: Date.now(), isChecked: false});
    textarea.value = '';
    localStorage.setItem('user', JSON.stringify(json));
    let li = document.querySelectorAll('li');
    if(li.length >= limitOfRecordsOnPage) return;
    todoUl.insertAdjacentHTML('beforeend', `<li data-id="${Date.now()}" class="taskList"><div class="firstColumn"><input type="checkbox" class="checkbox"><span>${taskValue}</span></div><div id="tasksButtonsDiv"><button class="editButton tasksButtons"></button><button class="deleteButton tasksButtons"></button></div></li>`)
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
    if (page === 1) return;
    page -= 1;
    clearing()
    renderLocalstorageJson(page);
}

nextButton.onclick = function() {
    console.log('test')
    page += 1;
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
    let buttonsDiv = target.lastChild;
    buttonsDiv.style.display = 'block'
}

todoUl.onmouseout = function(event) {
    let target = event.target;
    if(target.tagName !== 'LI') return
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
        let span = event.target.parentNode.childNodes[1];
        for(let record of json.records) {
            if(liId === record.timestamp.toString()) {

                let status = record.isChecked ? false : true;
                record.isChecked = status;
                if(status) {
                    span.style.textDecoration = 'line-through';
                } else {
                    span.style.textDecoration = '';
                }

            }
        }
        localStorage.setItem('user', JSON.stringify(json));
    }
}

//функция удаления
function deleteTusk(event) {
    let liId = event.target.parentNode.parentNode.dataset.id;
    console.log(liId);
    for(let record of json.records) {
        if(liId === record.timestamp.toString()) {
            json.records.splice(json.records.indexOf(record), 1);
            event.target.parentNode.parentNode.remove();
            localStorage.setItem('user', JSON.stringify(json));
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
    for(let record of records) {
        if(record.isChecked === true) {
            todoUl.insertAdjacentHTML('beforeend', `<li data-id = '${record.timestamp}' class="taskList"><div class="firstColumn"><input type="checkbox" class="checkbox" checked><span style="text-decoration: line-through">${record.text}</span></div><div id="tasksButtonsDiv"><button class="editButton tasksButtons"></button><button class="deleteButton tasksButtons"></button></div></li>`)

        } else {
            todoUl.insertAdjacentHTML('beforeend', `<li data-id = '${record.timestamp}' class="taskList"><div class="firstColumn"><input type="checkbox" class="checkbox"><span>${record.text}</span></div><div id="tasksButtonsDiv"><button class="editButton tasksButtons"></button><button class="deleteButton tasksButtons"></button></div></li>`)
        }
    }
}

window.onload = renderLocalstorageJson(page);