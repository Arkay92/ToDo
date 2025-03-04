import { initialData } from "./data.js";
import { renderTodoList, renderStats, renderNewTodoForm, showNotification, highlightDropTarget, removeHighlightDropTarget, moveTodoElement, updateTodoElement } from "./dom.js";
import { fetchTodos, updateTodo, createTodo, deleteTodo, reorderTodos } from "./services.js";

let appState = { ...initialData };
let draggedEl = null;
let draggedItemId = null;

/**
 * Re-render the todo list and stats.
 */
function fullRender() {
  renderTodoList(appState.todos);
  renderStats(appState.todos);
}

/**
 * Attach global event handlers.
 */
function attachEventHandlers() {
  const container = document.getElementById("todo-list");
  if (!container) return;

  // Drag and drop (delegated)
  container.addEventListener("dragstart", (e) => {
    const target = e.target.closest(".todo-item");
    if (target) {
      draggedEl = target;
      draggedItemId = target.getAttribute("data-id");
      e.dataTransfer.effectAllowed = "move";
      target.classList.add("dragging");
    }
  });

  container.addEventListener("dragover", (e) => {
    e.preventDefault();
    const target = e.target.closest(".todo-item");
    if (target && target.getAttribute("data-id") !== draggedItemId) {
      highlightDropTarget(target);
    }
  });

  container.addEventListener("dragleave", (e) => {
    const target = e.target.closest(".todo-item");
    if (target) removeHighlightDropTarget(target);
  });

  container.addEventListener("drop", (e) => {
    e.preventDefault();
    const target = e.target.closest(".todo-item");
    if (!target) return;
    removeHighlightDropTarget(target);
    const droppedItemId = target.getAttribute("data-id");
    if (!droppedItemId || droppedItemId === draggedItemId) return;

    // Update state with new order
    appState.todos = reorderTodos(appState.todos, draggedItemId, droppedItemId);
    // Move DOM element (partial update)
    handleDOMReorder(draggedItemId, droppedItemId);
    // Clean up drag styles
    if (draggedEl) {
      draggedEl.classList.remove("dragging");
      draggedEl = null;
      draggedItemId = null;
    }
  });

  // Checkbox update and inline editing (delegated)
  container.addEventListener("change", async (e) => {
    if (e.target && e.target.classList.contains("todo-checkbox")) {
      const todoId = e.target.getAttribute("data-id");
      const checked = e.target.checked;
      try {
        const updatedTodo = await updateTodo(parseInt(todoId, 10), { done: checked });
        appState.todos = appState.todos.map((todo) =>
          todo.id === updatedTodo.id ? { ...todo, done: updatedTodo.done } : todo
        );
        updateTodoElement(updatedTodo);
        renderStats(appState.todos);
      } catch (error) {
        showNotification(error.message);
        e.target.checked = !checked; // revert on error
      }
    }
  });

  // Delete button (delegated)
  container.addEventListener("click", async (e) => {
    if (e.target && e.target.classList.contains("delete-btn")) {
      const todoId = e.target.getAttribute("data-id");
      try {
        await deleteTodo(parseInt(todoId, 10));
        appState.todos = appState.todos.filter((todo) => todo.id !== parseInt(todoId, 10));
        fullRender();
      } catch (error) {
        showNotification(error.message);
      }
    }
  });

  // Inline editing: double-click to enable editing, save on blur or Enter.
  container.addEventListener("dblclick", (e) => {
    const textEl = e.target.closest(".note-content");
    if (textEl) {
      textEl.contentEditable = true;
      textEl.focus();
    }
  });

  container.addEventListener("keydown", async (e) => {
    const textEl = e.target.closest(".note-content");
    if (textEl && e.key === "Enter") {
      e.preventDefault();
      textEl.blur();
    }
  });

  container.addEventListener("blur", async (e) => {
    const textEl = e.target.closest(".note-content");
    if (textEl && textEl.contentEditable === "true") {
      textEl.contentEditable = false;
      const todoId = textEl.parentElement.getAttribute("data-id");
      const newText = textEl.textContent.trim();
      try {
        const updatedTodo = await updateTodo(parseInt(todoId, 10), { text: newText });
        appState.todos = appState.todos.map((todo) =>
          todo.id === updatedTodo.id ? { ...todo, text: updatedTodo.text } : todo
        );
        updateTodoElement(updatedTodo);
      } catch (error) {
        showNotification(error.message);
      }
    }
  }, true);
}

/**
 * Move the dragged DOM element before the target element (partial update).
 */
function handleDOMReorder(draggedId, droppedId) {
  const draggedItemEl = document.querySelector(`.todo-item[data-id="${draggedId}"]`);
  const dropTargetEl = document.querySelector(`.todo-item[data-id="${droppedId}"]`);
  if (draggedItemEl && dropTargetEl) {
    moveTodoElement(draggedItemEl, dropTargetEl);
  }
}

/**
 * Attach event listener to the new todo creation form.
 */
function attachCreationFormHandler() {
  const form = document.getElementById("create-todo-form");
  if (!form) return;
  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const input = document.getElementById("new-todo-input");
    const text = input.value.trim();
    if (!text) return;
    try {
      // Create new todo via POST
      const newTodo = await createTodo({ text, done: false });
      appState.todos.push(newTodo);
      fullRender();
      input.value = "";
    } catch (error) {
      showNotification(error.message);
    }
  });
}

/**
 * Initialize the app.
 */
async function init() {
  try {
    const serverTodos = await fetchTodos();
    appState.todos = serverTodos;
  } catch (err) {
    console.warn("Failed to fetch from server, using local data:", err);
  }
  fullRender();
  renderNewTodoForm();
  attachEventHandlers();
  attachCreationFormHandler();
  renderStats(appState.todos);
}

document.addEventListener("DOMContentLoaded", init);
