import { Component } from '@angular/core';
import { Task } from '../../task.model';
import {DatePipe} from '@angular/common';

@Component({
  selector: 'app-task-list',
  imports: [DatePipe],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
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

  // Dynamic change the status if I check / uncheck Task
  // will take the "id" of the component that was clicked
  handleCheckbox(id: number) {
    console.log(id);
    // If we check a task
    // we want to find the task as that current id and update it
    const taskIndex = this.tasks.findIndex((task) => task.id === id);

    this.tasks[taskIndex].completed = !this.tasks[taskIndex].completed;
  }
}
