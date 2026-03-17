import { useState, useCallback, useRef } from 'react';

export function useAITasks() {
  const [tasks, setTasks] = useState([]);
  const [taskIndex, setTaskIndex] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const shuffledRef = useRef([]);

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
      shuffledRef.current = [...data.tasks];
      setTaskIndex(0);
    } catch (err) {
      console.error('Task fetch error:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const getNextTask = useCallback(() => {
    if (shuffledRef.current.length === 0) return null;

    // If we've gone through all tasks, reshuffle
    if (taskIndex >= shuffledRef.current.length) {
      const reshuffled = [...shuffledRef.current];
      for (let i = reshuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [reshuffled[i], reshuffled[j]] = [reshuffled[j], reshuffled[i]];
      }
      shuffledRef.current = reshuffled;
      setTaskIndex(1);
      return reshuffled[0];
    }

    const task = shuffledRef.current[taskIndex];
    setTaskIndex(i => i + 1);
    return task;
  }, [taskIndex]);

  const currentTask = tasks[taskIndex] || null;

  return { tasks, currentTask, getNextTask, fetchTasks, loading, error, taskIndex };
}
