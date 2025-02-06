import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CommonModule } from '@angular/common';
import { QuizComponent } from './components/quiz/quiz.component';
import { ResultComponent } from './components/result/result.component';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [HomeComponent, QuizComponent, ResultComponent, CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  currentStep: 'home' | 'quiz' | 'result' = 'home';
  userName: string = '';
  score: number = 0; 
  hearts: {left: string; delay: string}[] = [];

  constructor(){
    this.generateHearts(20);
  }

  generateHearts(count: number) {
    this.hearts = Array.from({ length: count }, () => ({
      left: `${Math.random() * 100}%`, // Random left position (0% - 100%)
      delay: `${Math.random() * 5}s`, // Random delay (0s - 5s)
    }));
  }

  goToQuiz(userName: string) {
    this.userName = userName
    this.currentStep = 'quiz';
  }

  goToResult(data:any) {
    this.score = data['score'];
    this.userName = data['userName'];
    this.currentStep = 'result';
  }

  goToHome() {
    this.currentStep = 'home';
    this.userName = '';
    this.score = 0;
  }
}
