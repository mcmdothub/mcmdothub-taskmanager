import {Component, EventEmitter, inject, Input, Output, SimpleChanges} from '@angular/core';
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
  @Input() currentTask: Task | null = null;           // default value is null
  @Input() formType: "CREATE" | "UPDATE" = "CREATE";  // default value is "CREATE"
  @Output() closePanel = new EventEmitter<'SUBMIT' | 'CANCEL'>();
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

  // this will be triggered whenever a change happens inside the properties that are being
  // passed into this component ( when the task changes)
  ngOnChanges(changes: SimpleChanges) {
    // if changes of "currentTask" && changes of "currentTask.currentValue" exists
    if (changes['currentTask'] && changes['currentTask'].currentValue) {
      // the task is going to be changes of "currentTask.currentValue"
      const task = changes['currentTask'].currentValue as Task;

      // because HTML form uses a date form which is string based
      // we need to convert the date for now
      // if "task.dueDate" exists then create a new Date object from it,
      // turn it into a ISOString and then I want to remove the time
      // remove the time means we'll split ir at the capital letter "T" and we'll take the first half of that
      // so everything before the "T"
      const dueDateFormatted = task.dueDate
        ? new Date(task.dueDate).toISOString().split('T')[0]
        : '';

      // now we call "this.taskForm.patchValue"
      // we patched in everything I just got: task & dueDate overwrite that to be my dueDateFormatted
      this.taskForm.patchValue({
        ...task,
        dueDate: dueDateFormatted,
      });
    }

  }

  handleSubmit() {
    // If the form is valid
    if(this.taskForm.valid) {
      // we create a newTask of type "Task"
      // Create the new Task object
      const newTask: Task = {
        // we shall spread the fields that we got from the form
        ...this.taskForm.value,
        // for the dueDate we need to cast it as a date, so we'll use the "Date" method,
        // and we'll use "this.taskForm.value.dueDate"
        dueDate: new Date(this.taskForm.value.dueDate).toISOString(), // Convert to ISO string
        // we'll set completed value
        completed:
          this.formType === 'UPDATE' ? this.taskForm.value.completed : false,
      }

      if (this.formType === 'CREATE') {
        // subscribe to the result of that request
        // then we emit closePanel event
        this.taskService.addTask(newTask).subscribe(() => {
          this.closePanel.emit('SUBMIT');
        });
      } else {
        this.taskService.updateTask(newTask).subscribe(() => {
          this.closePanel.emit('SUBMIT');
        });
      }
    }
  }

  handleCancel() {
    // we emit a "CANCEL" event
    this.closePanel.emit('CANCEL');
  }
}
