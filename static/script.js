document.addEventListener('DOMContentLoaded', loadTodos);

function loadTodos() {
    fetch('/api/todos')
        .then(response => response.json())
        .then(todos => {
            const list = document.getElementById('todo-list');
            list.innerHTML = '';
            todos.forEach(todo => {
                const li = document.createElement('li');
                li.className = todo.completed ? 'completed' : '';
                
                const span = document.createElement('span');
                span.className = 'todo-text';
                span.textContent = todo.content;
                span.onclick = () => toggleTodo(todo.id, !todo.completed);
                
                const deleteBtn = document.createElement('button');
                deleteBtn.className = 'delete-btn';
                deleteBtn.textContent = '删除';
                deleteBtn.onclick = (e) => {
                    e.stopPropagation();
                    deleteTodo(todo.id);
                };
                
                li.appendChild(span);
                li.appendChild(deleteBtn);
                list.appendChild(li);
            });
        });
}

function addTodo() {
    const input = document.getElementById('todo-input');
    const content = input.value.trim();
    if (!content) return;

    fetch('/api/todos', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: content })
    })
    .then(response => response.json())
    .then(() => {
        input.value = '';
        loadTodos();
    });
}

function toggleTodo(id, completed) {
    fetch(`/api/todos/${id}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ completed: completed })
    })
    .then(() => loadTodos());
}

function deleteTodo(id) {
    fetch(`/api/todos/${id}`, {
        method: 'DELETE'
    })
    .then(() => loadTodos());
}
