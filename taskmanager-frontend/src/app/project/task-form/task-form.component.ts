import {Component, EventEmitter, inject, Output} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { Task } from '../../task.model';
import { TaskService } from '../../services/task.service';

@Component({
  selector: 'app-task-form',
  imports: [ReactiveFormsModule],
  templateUrl: './task-form.component.html',
  styleUrl: './task-form.component.css'
})
export class TaskFormComponent {
  @Output() closePanel = new EventEmitter<'SUBMIT'>();
  // we define a taskForm
  taskForm: FormGroup;

  private taskService = inject(TaskService);

  constructor(private fb: FormBuilder) {
    this.taskForm = this.fb.group({
      // this group takes an object where we define the fields
      name: ['', Validators.required],
      description: [''],
      dueDate: ['', Validators.required],
      id: [0],            // set to 0 by default
      project: [0],       // set to 0 by default
    })
  }

  handleSubmit() {
    // If the form is valid
    if(this.taskForm.valid) {
      // we create a newTask of type "Task"
      const newTask: Task = {
        // we shall spread the fields that we got from the form
        ...this.taskForm.value,
        // for the dueDate we need to cast it as a date, so we'll use the "Date" method,
        // and we'll use "this.taskForm.value.dueDate"
        dueDate: new Date(this.taskForm.value.dueDate),
        // we'll set completed to false
        completed: false,
      }
      this.taskService.addTask(newTask);
      this.closePanel.emit('SUBMIT');
    }
  }
}
