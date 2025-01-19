import { Injectable } from '@angular/core';
import { Task } from '../task.model';
import { HttpClient } from '@angular/common/http';
import {Observable} from 'rxjs';

const BASE_URL = 'http://localhost:8080/api';

@Injectable({
  providedIn: 'root'
})
export class TaskService {
  // Injecting HTTP Client
  constructor(private http: HttpClient) { }

  // getTasks
  // will return an Observable which will resolve to an array of tasks
  getTasks(): Observable<Task[]> {
    return this.http.get<Task[]>(`${BASE_URL}/tasks`);
  }

  // addTask
  addTask(task: Task) {
    return this.http.post(`${BASE_URL}/tasks`, { ...task, project: null });
  }

  // updateTask
  updateTask(newTask: Task) {
    return this.http.put(`${BASE_URL}/tasks/${newTask.id}`, {
      ...newTask,
      project: null,
    });
  }

  // deleteTask
  deleteTask(id: number) {
    return this.http.delete(`${BASE_URL}/tasks/${id}`);
  }
}
