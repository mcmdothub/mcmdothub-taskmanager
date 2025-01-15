import { Injectable } from '@angular/core';
import { Task } from './task.model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // we have this data: an array of task
  tasks: Task[] = [
    {
      id: 1,
      name: "Design wireframe",
      description: "",
      completed: false,
      dueDate: new Date("2023-07-31"),
      project: 1,
    },
    {
      id: 2,
      name: "Design frontend",
      description: "",
      completed: true,
      dueDate: new Date("2023-06-15"),
      project: 1,
    },
    {
      id: 3,
      name: "Implement backend",
      description: "",
      completed: false,
      dueDate: new Date("2023-07-31"),
      project: 1,
    },
    {
      id: 4,
      name: "Have a party",
      description: "",
      completed: true,
      dueDate: new Date("2023-11-31"),
      project: 1,
    }
  ];

  constructor() { }

  // getTasks
  getTasks() {
    return this.tasks;
  }

  // addTask
  addTask(task: Task) {
    this.tasks.push(task);
    return this.tasks;
  }

  // updateTask
  updateTask(newTask: Task) {
    // Find the Index inside array "this.tasks"
    // And find the index where task as a "task.id" which matches our "newTask.id"
    const taskIndex = this.tasks.findIndex((task) => task.id === newTask.id);

    // Once we find that
    this.tasks[taskIndex] = newTask;

    return this.tasks;
  }

  // deleteTask
  deleteTask(id: number) {
    const taskIndex = this.tasks.findIndex((task) => task.id === id);

    // we remove 1 element with this "taskIndex" from array/list of "this.tasks"
    this.tasks.splice(taskIndex, 1);
    return this.tasks;
  }
}
