export const initialData = {
    todos: [
      { id: 1, text: "Buy groceries", done: false },
      { id: 2, text: "Read a book", done: false },
      { id: 3, text: "Write code", done: false },
    ],
  };
  
  /**
   * A robust lens that supports nested objects and arrays.
   * The lens takes a path array (strings or numbers) and returns an object with:
   * - view(obj): returns the value at that path
   * - set(value, obj): returns a new object with the value at that path updated immutably
   */
  export function createLens(path) {
    return {
      view(obj) {
        return path.reduce((acc, key) => (acc != null ? acc[key] : undefined), obj);
      },
      set(value, obj) {
        if (path.length === 0) return value;
        const [key, ...rest] = path;
        let newObj;
        if (Array.isArray(obj)) {
          newObj = obj.slice();
        } else if (typeof obj === "object" && obj !== null) {
          newObj = { ...obj };
        } else {
          newObj = {};
        }
        newObj[key] = createLens(rest).set(value, obj ? obj[key] : undefined);
        return newObj;
      }
    };
  }
  