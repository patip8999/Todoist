import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/enviroments.prod';
import { TaskModel } from '../Models/task.model';
import { TodoistApi } from '@doist/todoist-api-typescript';



@Injectable({
  providedIn: 'root'
})
export class TodoistService {
  private apiUrl = 'https://api.todoist.com/rest/v2';
  private apiToken = environment.todoistApiToken;
  private api = new TodoistApi(this.apiToken);
  httpClient: HttpClient = inject(HttpClient);
  private taskSubject = new BehaviorSubject<TaskModel | null>(null);
  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json'
    });
  }
  getTask(taskId: string): Observable<TaskModel> {
    return this.httpClient.get<TaskModel>(`${this.apiUrl}/tasks/${taskId}`, { headers: this.getHeaders() });
  }
  getTasks(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/tasks`, { headers: this.getHeaders() });
  }
  getCurrentTask(): Observable<TaskModel | null> {
    return this.taskSubject.asObservable();
  }
  setCurrentTask(task: TaskModel): void {
    this.taskSubject.next(task);
  }
  addTask(taskData: { content: string; description: string; due_date: string; priority: number }): Observable<any> {
    return this.httpClient.post(`${this.apiUrl}/tasks`, taskData, { headers: this.getHeaders() });
  }
  deleteTask(taskId: string): Observable<any> {
    return this.httpClient.delete(`${this.apiUrl}/tasks/${taskId}`, { headers: this.getHeaders() });
  }
  updateTask(taskId: string, content: string, description: string, dueDate: string, priority: number) {
    return this.api.updateTask(taskId, {
      content: content,
      description: description,
      dueDate: dueDate, // Poprawne pole do ustawiania daty
      priority: priority,
    });
  }
}
