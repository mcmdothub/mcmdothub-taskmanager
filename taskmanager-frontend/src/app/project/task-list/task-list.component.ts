import {Component, inject} from '@angular/core';
import { Task } from '../../task.model';
import {AsyncPipe, DatePipe} from '@angular/common';
import { TaskService } from '../../services/task.service';
import { TaskFormComponent } from '../task-form/task-form.component';
import {Observable} from 'rxjs';

// empty task is going to be an object with a name, description, etc
const emptyTask = {
  id: 0,
  name: '',
  description: '',
  dueDate: new Date(),
  completed: false,
  project: 1,
};

@Component({
  selector: 'app-task-list',
  imports: [DatePipe, TaskFormComponent, AsyncPipe],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.css'
})
export class TaskListComponent {
  // we have this data: an array of task
  tasks: Task[] = [];
  showModal: boolean = false;
  selectedTask: Task = emptyTask;  // default value an empty task

  // We mark observables with "$"
  // To fix this error: "TS2564: Property tasks$ has no initializer and is not definitely assigned in the constructor."
  // add "!" because i know this observable will have a value
  tasks$!: Observable<Task[]>;

  // keep track of form type
  formType: "CREATE" | "UPDATE" = "CREATE";   // default value is "CREATE"

  private taskService = inject(TaskService);

  constructor() {
    this.updateTasks();
  }

  updateTasks() {
    this.tasks$ = this.taskService.getTasks();
  }

  // Dynamic change the status if I check / uncheck Task
  // will take the "id" of the component that was clicked
  handleCheckbox(id: number) {
    // If we check a task
    // we want to find the task as that current id and update it
    const taskIndex = this.tasks.findIndex((task) => task.id === id);

    const updatedTask = this.tasks[taskIndex];
    updatedTask.completed = !updatedTask.completed;
    this.taskService.updateTask(updatedTask);
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

  addNewTask() {
    this.selectedTask = emptyTask;
    this.formType = 'CREATE';
    this.showModal = true;
  }

  deleteTask(id: number) {
    this.taskService.deleteTask(id).subscribe(() => {
      this.updateTasks();
    });
  }

  handleModalClose(type: 'SUBMIT' | 'CANCEL') {
    if (type === 'SUBMIT') {
      this.updateTasks();
    }
    this.showModal = false;
  }
}
