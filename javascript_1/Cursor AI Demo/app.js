// Todo list management
class TodoList {
    constructor() {
        this.todos = [];
        this.todoList = document.getElementById('todoList');
    }


    addTodo(text) {
        const todo = {
            id: Date.now(),
            text,
            completed: false
        };
        this.todos.push(todo);
        this.renderTodo(todo);
    }

    renderTodo(todo) {
        const li = document.createElement('li');
        li.className = 'flex items-center gap-2 p-2 border rounded';
        li.innerHTML = `
            <input type="checkbox" ${todo.completed ? 'checked' : ''} 
                   class="form-checkbox h-5 w-5 text-blue-600">
            <span class="${todo.completed ? 'line-through text-gray-500' : ''}">${todo.text}</span>
            <button class="ml-auto text-red-500 hover:text-red-700">
                <i class="fas fa-trash"></i>
            </button>
        `;

        li.querySelector('input').addEventListener('change', () => this.toggleTodo(todo.id));
        li.querySelector('button').addEventListener('click', () => this.deleteTodo(todo.id));
        this.todoList.appendChild(li);
    }

    toggleTodo(id) {
        const todo = this.todos.find(t => t.id === id);
        if (todo) {
            todo.completed = !todo.completed;
            this.renderTodos();
        }
    }

    deleteTodo(id) {
        this.todos = this.todos.filter(t => t.id !== id);
        this.renderTodos();
    }

    renderTodos() {
        this.todoList.innerHTML = '';
        this.todos.forEach(todo => this.renderTodo(todo));
    }
}

// Chat interface
class ChatInterface {
    constructor(todoList) {
        this.todoList = todoList;
        // Get reference to the chat container div where messages will be displayed
        this.chatContainer = document.getElementById('chatContainer');
        this.chatInput = document.getElementById('chatInput');
        this.sendButton = document.getElementById('sendMessage');
        
        this.setupEventListeners();
        this.addWelcomeMessage();
    }

    setupEventListeners() {
        this.sendButton.addEventListener('click', () => this.sendMessage());
        this.chatInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });
    }

    addWelcomeMessage() {
        this.addMessage("Hi! I'm your AI todo assistant. How can I help you today?", 'ai');
    }

    addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `flex ${sender === 'user' ? 'justify-end' : 'justify-start'}`;
        
        const message = document.createElement('div');
        message.className = `max-w-[70%] p-3 rounded-lg ${
            sender === 'user' 
                ? 'bg-blue-500 text-white rounded-br-none'
                : 'bg-gray-200 text-gray-800 rounded-bl-none'
        }`;
        message.textContent = text;
        
        messageDiv.appendChild(message);
        this.chatContainer.appendChild(messageDiv);
        this.chatContainer.scrollTop = this.chatContainer.scrollHeight;
    }

    async sendMessage() {
        const message = this.chatInput.value.trim();
        if (!message) return;

        this.addMessage(message, 'user');
        this.chatInput.value = '';

        // Simple command processing (you can expand this or integrate with a real AI API)
        if (message.toLowerCase().includes('add')) {
            const todoText = message.replace(/add/i, '').trim();
            this.todoList.addTodo(todoText);
            this.addMessage(`I've added "${todoText}" to your todo list!`, 'ai');
        } else {
            this.addMessage("I'm here to help! Try saying 'add' followed by your todo item.", 'ai');
        }
    }
}

// Initialize the app
document.addEventListener('DOMContentLoaded', () => {
    const todoList = new TodoList();
    const chat = new ChatInterface(todoList);
}); 