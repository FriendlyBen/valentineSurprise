import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private backendUrl = 'https://forgarnettebackend.onrender.com';

  constructor(private http: HttpClient) {}

  getGreeting(): Observable<any> {
    return this.http.get(`${this.backendUrl}/`);
  }

  sendResults(username: string, score: number): Observable<any> {
    const payload = {username, score};
    return this.http.post(`${this.backendUrl}/api/results/save`, payload);
  }
}
