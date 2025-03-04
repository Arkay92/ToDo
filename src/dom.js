/**
 * Renders the list of todos (sticky notes) into the #todo-list container.
 * Each note includes a delete button and inline editing support.
 *
 * @param {Array} todos - Array of todo objects
 */
export function renderTodoList(todos) {
    const container = document.getElementById("todo-list");
    if (!container) return;
  
    container.innerHTML = todos
      .map(
        (todo) => `
        <div class="todo-item sticky-note" draggable="true" data-id="${todo.id}" tabindex="0" role="article" aria-label="Todo: ${todo.text}">
          <div class="note-header">
            <input type="checkbox" class="todo-checkbox" data-id="${todo.id}" ${todo.done ? "checked" : ""} aria-label="Mark todo as done" />
            <button class="delete-btn" data-id="${todo.id}" aria-label="Delete todo">×</button>
          </div>
          <div class="note-content" data-id="${todo.id}" contenteditable="false" aria-label="Todo text">${todo.text}</div>
        </div>
      `
      )
      .join("");
  }
  
  /**
   * Renders a form to create a new todo.
   */
  export function renderNewTodoForm() {
    const container = document.getElementById("new-todo-form");
    if (!container) return;
    container.innerHTML = `
      <form id="create-todo-form" aria-label="Create new todo">
        <input type="text" id="new-todo-input" placeholder="New todo..." required aria-label="New todo text" />
        <button type="submit">Add</button>
      </form>
    `;
  }
  
  /**
   * Renders any stats or counters.
   *
   * @param {Array} todos - Array of todo objects
   */
  export function renderStats(todos) {
    const statsEl = document.getElementById("stats");
    if (!statsEl) return;
  
    const completed = todos.filter((t) => t.done).length;
    statsEl.textContent = `Completed: ${completed} / ${todos.length}`;
  }
  
  /**
   * Displays an error notification.
   *
   * @param {string} message - The error message.
   */
  export function showNotification(message) {
    const notificationEl = document.getElementById("notification");
    if (!notificationEl) return;
    notificationEl.textContent = message;
    notificationEl.style.display = "block";
    setTimeout(() => {
      notificationEl.style.display = "none";
    }, 3000);
  }
  
  /**
   * Highlights a drop target by adding the 'drop-target' class.
   */
  export function highlightDropTarget(element) {
    element.classList.add("drop-target");
  }
  
  /**
   * Removes drop target highlighting.
   */
  export function removeHighlightDropTarget(element) {
    element.classList.remove("drop-target");
  }
  
  /**
   * Moves a todo DOM element before a target element.
   */
  export function moveTodoElement(draggedEl, targetEl) {
    const container = document.getElementById("todo-list");
    container.insertBefore(draggedEl, targetEl);
  }
  
  /**
   * Update a single todo element's checkbox and text, without re-rendering the whole list.
   */
  export function updateTodoElement(todo) {
    const item = document.querySelector(`.todo-item[data-id="${todo.id}"]`);
    if (item) {
      const checkbox = item.querySelector(".todo-checkbox");
      checkbox.checked = todo.done;
      const textEl = item.querySelector(".note-content");
      textEl.textContent = todo.text;
      if (todo.done) {
        textEl.classList.add("done");
      } else {
        textEl.classList.remove("done");
      }
      item.setAttribute("aria-label", `Todo: ${todo.text}`);
    }
  }
  