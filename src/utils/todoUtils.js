/**
 * 过滤待办事项
 * @param {Array} todos - 所有待办事项
 * @param {string} filter - 过滤条件：'all' | 'active' | 'completed'
 * @returns {Array} 过滤后的待办事项
 */
export const filterTodos = (todos, filter) => {
  switch (filter) {
    case "active":
      return todos.filter((todo) => !todo.completed);
    case "completed":
      return todos.filter((todo) => todo.completed);
    default:
      return todos;
  }
};

/**
 * 生成唯一ID
 * @returns {string} 随机ID
 */
export const generateId = () => {
  return Math.random().toString(36).substr(2, 9);
};
