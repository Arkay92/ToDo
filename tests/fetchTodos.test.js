import { fetchTodos, updateTodo, createTodo, deleteTodo } from "../src/services";

beforeEach(() => {
  global.fetch = jest.fn();
});

describe("fetchTodos", () => {
  it("should return a list of todos when the API call is successful", async () => {
    const mockTodos = [{ id: 1, text: "Test todo", done: false }];
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve(mockTodos),
    };
    global.fetch.mockResolvedValueOnce(mockResponse);

    const todos = await fetchTodos();
    expect(todos).toEqual(mockTodos);
    expect(global.fetch).toHaveBeenCalledWith("/api/todos");
  });

  it("should return an empty array when the API call fails", async () => {
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({ error: "Error" }),
    };
    global.fetch.mockResolvedValueOnce(mockResponse);
    const todos = await fetchTodos();
    expect(todos).toEqual([]);
  });
});

describe("updateTodo", () => {
  it("should update a todo and return the updated todo object when API call is successful", async () => {
    const updatedTodo = { id: 1, text: "Test todo", done: true };
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve(updatedTodo),
    };
    global.fetch.mockResolvedValueOnce(mockResponse);

    const result = await updateTodo(1, { done: true, text: "Test todo" });
    expect(result).toEqual(updatedTodo);
    expect(global.fetch).toHaveBeenCalledWith("/api/todos/1", expect.objectContaining({
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ done: true, text: "Test todo" }),
    }));
  });

  it("should return a simulated updated todo if API call fails", async () => {
    // Simulate a failure by returning a non-ok response.
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({ error: "Failed" }),
    };
    global.fetch.mockResolvedValueOnce(mockResponse);
    
    const result = await updateTodo(1, { done: true });
    // Since there is no DOM in tests, our fallback text should be "Untitled"
    expect(result).toEqual({ id: 1, done: true, text: "Untitled" });
  });
});

describe("createTodo", () => {
  it("should create a new todo and return it when API call is successful", async () => {
    const newTodo = { id: 2, text: "New todo", done: false };
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve(newTodo),
    };
    global.fetch.mockResolvedValueOnce(mockResponse);

    const result = await createTodo({ text: "New todo", done: false });
    expect(result).toEqual(newTodo);
    expect(global.fetch).toHaveBeenCalledWith("/api/todos", expect.objectContaining({
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: "New todo", done: false }),
    }));
  });

  it("should return a simulated new todo if API call fails", async () => {
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({ error: "Failed" }),
    };
    global.fetch.mockResolvedValueOnce(mockResponse);
    const result = await createTodo({ text: "New todo", done: false });
    // We cannot predict Date.now() exactly, so we check that it has the provided properties.
    expect(result).toEqual(expect.objectContaining({
      text: "New todo",
      done: false,
    }));
    expect(result).toHaveProperty("id");
  });
});

describe("deleteTodo", () => {
  it("should delete a todo when API call is successful", async () => {
    const mockResponse = {
      ok: true,
      json: () => Promise.resolve({ success: true }),
    };
    global.fetch.mockResolvedValueOnce(mockResponse);
    const result = await deleteTodo(1);
    expect(result).toEqual({ success: true });
    expect(global.fetch).toHaveBeenCalledWith("/api/todos/1", expect.objectContaining({
      method: "DELETE",
    }));
  });

  it("should return a simulated delete response if API call fails", async () => {
    const mockResponse = {
      ok: false,
      json: () => Promise.resolve({ error: "Failed" }),
    };
    global.fetch.mockResolvedValueOnce(mockResponse);
    const result = await deleteTodo(1);
    expect(result).toEqual({ success: true });
  });
});
