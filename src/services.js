/**
 * Fetch the todos from the API (GET /api/todos).
 * If the API call fails, simulate by returning an empty array.
 */
export async function fetchTodos() {
    try {
      const response = await fetch("/api/todos");
      if (!response.ok) throw new Error("Network response was not ok");
      return await response.json();
    } catch (error) {
      console.warn("Simulated fetchTodos response due to error:", error);
      // Simulate a fallback response (empty list or default data)
      return [];
    }
}

/**
 * Update an existing todo (PUT /api/todos/:id).
 * If the API call fails, simulate the update by returning an updated todo object.
 * If updateData doesn't include text, try to preserve existing text.
 */
export async function updateTodo(id, updateData) {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      });
      if (!response.ok) throw new Error("Failed to update todo on server");
      return await response.json();
    } catch (error) {
      console.warn("Simulated updateTodo response due to error:", error);
      // If updateData doesn't include text, try to retrieve it from the DOM if available
      let currentText = "Untitled";
      if (typeof document !== "undefined") {
        const textEl = document.querySelector(`.note-content[data-id="${id}"]`);
        if (textEl) {
          currentText = textEl.textContent.trim() || "Untitled";
        }
      }
      return { id, text: currentText, ...updateData };
    }
}

/**
 * Create a new todo (POST /api/todos).
 * If the API call fails, simulate creation by returning a new todo with a generated id.
 */
export async function createTodo(newTodo) {
    try {
      const response = await fetch("/api/todos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newTodo),
      });
      if (!response.ok) throw new Error("Failed to create todo on server");
      return await response.json();
    } catch (error) {
      console.warn("Simulated createTodo response due to error:", error);
      // Simulate a new todo with a generated id
      return { id: Date.now(), ...newTodo };
    }
}

/**
 * Delete a todo (DELETE /api/todos/:id).
 * If the API call fails, simulate deletion by returning a success flag.
 */
export async function deleteTodo(id) {
    try {
      const response = await fetch(`/api/todos/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete todo on server");
      return await response.json();
    } catch (error) {
      console.warn("Simulated deleteTodo response due to error:", error);
      // Simulate successful deletion
      return { success: true };
    }
}

/**
 * Reorder the todos array after drag-and-drop.
 */
export function reorderTodos(todos, draggedId, droppedId) {
    const dId = parseInt(draggedId, 10);
    const dpId = parseInt(droppedId, 10);
    const draggedIndex = todos.findIndex((t) => t.id === dId);
    const droppedIndex = todos.findIndex((t) => t.id === dpId);
    if (draggedIndex < 0 || droppedIndex < 0) return todos;
    const newTodos = [...todos];
    const [removed] = newTodos.splice(draggedIndex, 1);
    newTodos.splice(droppedIndex, 0, removed);
    return newTodos;
} 
  