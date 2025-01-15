import {Component, inject} from '@angular/core';
import { Task } from '../../task.model';
import { DatePipe } from '@angular/common';
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';

// empty task is going to be an object with a name, description, etc
const emptyTask = {
  id: 0,
  name: "",
  description: "",
  completed: false,
  dueDate: new Date(),
  project: 0
}

@Component({
  selector: 'app-task-list',
  imports: [DatePipe, TaskFormComponent],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  // we have this data: an array of task
  tasks: Task[];
  showModal = false;
  selectedTask: Task = emptyTask;  // default value an empty task

  // keep track of form type
  formType: "CREATE" | "UPDATE" = "CREATE";   // default value is "CREATE"

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

  updateTask(task: Task) {
    // We want to set the selected task
    this.selectedTask = task;

    // because we want to reuse the form between adding and creating, I'd like a variable to keeps track of that
    // set the form type => in our case an UPDATE form
    this.formType = "UPDATE";

    // open the modal
    this.showModal = true;
  }

  deleteTask(id: number) {
    this.tasks = this.tasksService.deleteTask(id);
  }
}
