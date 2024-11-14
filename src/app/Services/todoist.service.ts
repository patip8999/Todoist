import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { Observable } from 'rxjs';
import { environment } from '../../environments/enviroments.prod';


@Injectable({
  providedIn: 'root'
})
export class TodoistService {
  private apiUrl = 'https://api.todoist.com/rest/v2';
  private apiToken = environment.todoistApiToken;

  httpClient: HttpClient = inject(HttpClient)

  private getHeaders(): HttpHeaders {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.apiToken}`,
      'Content-Type': 'application/json'
    });
  }

  getTasks(): Observable<any> {
    return this.httpClient.get(`${this.apiUrl}/tasks`, { headers: this.getHeaders() });
  }

  addTask(content: string): Observable<any> {
    const body = { content };
    return this.httpClient.post(`${this.apiUrl}/tasks`, body, { headers: this.getHeaders() });
  }
}
