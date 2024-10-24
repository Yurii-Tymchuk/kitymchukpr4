document.addEventListener("DOMContentLoaded", () => {
    const taskInput = document.getElementById("new-task-input"); // Поле для вводу нового завдання
    const taskList = document.getElementById("task-list"); // Список завдань
    const allBtn = document.getElementById("all"); // Кнопка для показу всіх завдань
    const completedBtn = document.getElementById("completed"); // Кнопка для показу виконаних завдань
    const incompleteBtn = document.getElementById("incomplete"); // Кнопка для показу невиконаних завдань
  
    let tasks = JSON.parse(localStorage.getItem("tasks")) || []; // Завантаження завдань із localStorage або створення порожнього масиву
  
    // Функція для відображення завдань (з фільтрацією за статусом)
    function renderTasks(filter = "all") {
      taskList.innerHTML = ""; // Очищуємо список перед рендерингом
  
      // Фільтруємо завдання за статусом (всі, виконані або невиконані)
      const filteredTasks = tasks.filter(task => {
        if (filter === "completed") return task.completed;
        if (filter === "incomplete") return !task.completed;
        return true; // Якщо фільтр "всі"
      });
  
      // Створюємо HTML для кожного завдання
      filteredTasks.forEach((task, index) => {
        const taskItem = document.createElement("li");
        taskItem.classList.add("task-item");
        if (task.completed) taskItem.classList.add("completed"); // Додаємо клас "completed", якщо завдання виконане
  
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.checked = task.completed;
        checkbox.addEventListener("change", () => toggleComplete(index)); // Відмітка завдання виконаним
  
        const taskText = document.createElement("span");
        taskText.textContent = `${task.text} (${task.date})`; // Текст завдання + дата додавання
        taskText.addEventListener("dblclick", () => editTask(index)); // Подвійний клік для редагування завдання
  
        const deleteBtn = document.createElement("span");
        deleteBtn.textContent = "✖";
        deleteBtn.classList.add("delete-btn");
        deleteBtn.addEventListener("click", () => deleteTask(index)); // Видалення завдання
  
        if (!task.completed) {
          taskItem.appendChild(checkbox); // Додаємо чекбокс тільки якщо завдання не виконане
        }
        taskItem.appendChild(taskText); // Додаємо текст завдання
        taskItem.appendChild(deleteBtn); // Додаємо кнопку видалення
        taskList.appendChild(taskItem); // Додаємо елемент списку в DOM
      });
    }
  
    // Додавання нового завдання
    function addTask(text) {
      const date = new Date();
      // Форматування дати додавання завдання
      const formattedDate = `${date.getDate()}.${date.getMonth() + 1}.${date.getFullYear()}, ${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
      tasks.push({ text, date: formattedDate, completed: false }); // Додаємо нове завдання до масиву
      saveTasks(); // Збереження у localStorage
      renderTasks(); // Перерендеринг завдань
    }
  
    // Видалення завдання
    function deleteTask(index) {
      tasks.splice(index, 1); // Видаляємо завдання з масиву за індексом
      saveTasks(); // Оновлюємо localStorage
      renderTasks(); // Перерендеринг завдань
    }
  
    // Перемикання статусу завдання (виконане/невиконане)
    function toggleComplete(index) {
      tasks[index].completed = !tasks[index].completed; // Зміна статусу
      saveTasks(); // Оновлення у localStorage
      renderTasks(); // Оновлення списку завдань
    }
  
    // Редагування завдання
    function editTask(index) {
      const taskItem = taskList.children[index];
      const input = document.createElement("input");
      input.type = "text";
      input.value = tasks[index].text; // Початкове значення input — це текст завдання
      input.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
          tasks[index].text = input.value; // Оновлюємо текст завдання при натисканні Enter
          saveTasks(); // Зберігаємо зміни
          renderTasks(); // Перерендеримо список завдань
        }
      });
  
      taskItem.replaceChild(input, taskItem.childNodes[1]); // Заміна тексту завдання на input
      input.focus(); // Автоматичний фокус на поле редагування
    }
  
    // Збереження завдань у localStorage
    function saveTasks() {
      localStorage.setItem("tasks", JSON.stringify(tasks)); // Зберігаємо масив завдань як рядок у localStorage
    }
  
    // Додавання нового завдання при натисканні Enter
    taskInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && taskInput.value.trim()) {
        addTask(taskInput.value.trim()); // Додаємо нове завдання, якщо введений текст не порожній
        taskInput.value = ""; // Очищуємо поле вводу
      }
    });
  
    // Фільтрація завдань (всі/виконані/невиконані)
    allBtn.addEventListener("click", () => renderTasks("all"));
    completedBtn.addEventListener("click", () => renderTasks("completed"));
    incompleteBtn.addEventListener("click", () => renderTasks("incomplete"));
  
    renderTasks(); // Початкове відображення завдань при завантаженні сторінки
  });
  