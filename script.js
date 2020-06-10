'use strict'
let json = {
    records: []
};

//функция добавления задач
function createNewTask() {
    let taskValue = textarea.value;
    if(!taskValue) return;
    todoUl.insertAdjacentHTML('beforeend', `<li class="taskList">${taskValue}<div id="tasksButtonsDiv"><button class="editButton tasksButtons"></button><button class="deleteButton tasksButtons"></button></div></li>`)
    json.records.push({text: `${taskValue}`, timestamp: Date.now()});
    textarea.value = '';
    localStorage.setItem('user', JSON.stringify(json));
}






let textarea = document.querySelector('textarea');
let todoUl = document.getElementById('todoUl')
let addButton = document.getElementById('AddCard');

todoUl.onmouseover = function(event) {
    let target = event.target;
    if(target.tagName !== 'LI') return
    let buttonsDiv = document.getElementById('tasksButtonsDiv');
    buttonsDiv.style.display = 'block';
}

todoUl.onmouseout = function(event) {
    let target = event.target;
    if(target.tagName !== 'LI') return
    if(event.relatedTarget.tagName === 'BUTTON' && target.tagName === 'LI') return;
    let buttonsDiv = document.getElementById('tasksButtonsDiv');
    buttonsDiv.style.display = 'none';

}

// 1. Запрос к серверу
// 2. ответ от сервера записываем в виде json'a в localstorage
// 3. берем из localstorage json и парсим в список

addButton.onclick = createNewTask;

window.onload = function() {
    let storageFile = JSON.parse(localStorage.getItem('user'));
    if(!storageFile) return
    json = storageFile
    for(let record of storageFile.records) {
        todoUl.insertAdjacentHTML('beforeend', `<li class="taskList">${record.text}<div id="tasksButtonsDiv"><button class="editButton tasksButtons"></button><button class="deleteButton tasksButtons"></button></div></li>`)

    }
}