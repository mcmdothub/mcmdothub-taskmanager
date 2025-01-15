import {Component, inject} from '@angular/core';
import { Task } from '../../task.model';
import { DatePipe } from '@angular/common';
import { TaskService } from '../../task.service';

@Component({
  selector: 'app-task-list',
  imports: [DatePipe],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  // we have this data: an array of task
  tasks: Task[];

  private tasksService = inject(TaskService);

  constructor() {
    this.tasks = this.tasksService.getTasks();
  }

  // Dynamic change the status if I check / uncheck Task
  // will take the "id" of the component that was clicked
  handleCheckbox(id: number) {
    // If we check a task
    // we want to find the task as that current id and update it
    const taskIndex = this.tasks.findIndex((task) => task.id === id);

    const updatedTask = this.tasks[taskIndex];
    updatedTask.completed = !updatedTask.completed;
    this.tasks = this.tasksService.updateTask(updatedTask);
  }

  deleteTask(id: number) {
    this.tasks = this.tasksService.deleteTask(id);
  }
}
