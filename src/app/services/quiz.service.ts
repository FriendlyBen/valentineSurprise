import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class QuizService {
  private currentStep = new BehaviorSubject<'home' | 'quiz' | 'result'>('home');
  private score = new BehaviorSubject<number>(0);
  private timer = new BehaviorSubject<number>(60); // 60-second timer

  currentStep$ = this.currentStep.asObservable();
  score$ = this.score.asObservable();
  timer$ = this.timer.asObservable();

  goToQuiz() {
    this.currentStep.next('quiz');
  }

  goToResult(score: number) {
    this.score.next(score);
    this.currentStep.next('result');
  }

  restart() {
    this.currentStep.next('home');
    this.score.next(0);
    this.timer.next(60);
  }

  startTimer() {
    let time = 60;
    const interval = setInterval(() => {
      time--;
      this.timer.next(time);
      if (time <= 0) {
        clearInterval(interval);
        this.goToResult(0); // Auto-submit with 0 score if time runs out
      }
    }, 1000);
  }
}
