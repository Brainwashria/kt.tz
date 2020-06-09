'use strict'
const json = {
    records: [{
        text: 'record 1',
    }, {
        text: 'record 2',
    }]
};

function createNewTask() {
    let taskValue = textarea.value;
    if(!taskValue) return;
    let newLi = document.createElement('li');
    newLi.innerText = taskValue;
    newLi.classList.add('taskList');
    todoUl.append(newLi);
    json.records.push({text: `${taskValue}`} )
    console.log(json);
    textarea.value = ''
    localStorage.setItem('user', JSON.stringify(json));
}

let textarea = document.querySelector('textarea');
let todoUl = document.getElementById('todoUl')
let addButton = document.getElementById('AddCard');


// 1. Запрос к серверу
// 2. ответ от сервера записываем в виде json'a в localstorage
// 3. берем из localstorage json и парсим в список


addButton.onclick = createNewTask;


window.onload = function() {
    console.log(localStorage.getItem('user'));
    let storageFile = JSON.parse(localStorage.getItem('user'));
    console.log(storageFile);
    for(let record of storageFile.records) {
        console.log(record.text);
        let li = document.createElement('li');
        li.innerText = record.text;
        li.classList.add('taskList');
        todoUl.append(li);
    }
}

