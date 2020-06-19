'use strict'

let textarea = document.getElementById('editingTextarea');
let saveButton = document.getElementById('saveButton');
let storage = JSON.parse(localStorage.getItem('user'));
let url = new URL(`${location.href}`)
let urlId = url.searchParams.get('id');


function editingWindowOnload() {
    for(let record of storage.records) {
        if(urlId === record.timestamp.toString()) {
            textarea.value = record.text;
        }
    }
}

window.onload = editingWindowOnload;
saveButton.onclick = function() {
    for(let record of storage.records) {
        if(urlId === record.timestamp.toString()) {
            record.text = textarea.value;
            localStorage.setItem('user', JSON.stringify(storage));
        }
    }
    window.location.href = 'index.html';
}


