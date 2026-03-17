import { useState, useCallback } from 'react';

export function useAITasks() {
  const [tasks, setTasks] = useState([]);
  const [taskIndex, setTaskIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async (mode, level, age, topic, count) => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/generate-tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mode, level, age: Number(age), topic, count }),
      });
      if (!res.ok) throw new Error('Failed to fetch tasks');
      const data = await res.json();
      setTasks(data.tasks);
      setTaskIndex(0);
    } catch (err) {
      console.error('Task fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getNextTask = useCallback(() => {
    if (taskIndex >= tasks.length) {
      return tasks[taskIndex % tasks.length] || null;
    }
    const task = tasks[taskIndex];
    setTaskIndex(i => i + 1);
    return task;
  }, [tasks, taskIndex]);

  const currentTask = tasks[taskIndex] || null;

  return { tasks, currentTask, getNextTask, fetchTasks, loading, error, taskIndex };
}
