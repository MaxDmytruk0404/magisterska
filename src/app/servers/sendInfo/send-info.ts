import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class SendInfo {
  // Для зберігання логів
  private logsSubject = new BehaviorSubject<any[]>([]);
  logs$ = this.logsSubject.asObservable();

  // Для зберігання результатів тестів
  private resultsSubject = new BehaviorSubject<any[]>([]);
  results$ = this.resultsSubject.asObservable();

  addLog(log: any) {
    this.logsSubject.next([log,...this.logsSubject.value]);
  }
  

  addResults(results: any) {
    this.resultsSubject.next([results,...this.resultsSubject.value]);
  }

  deleteLogs() {
    this.logsSubject.next([]);
  }
}
