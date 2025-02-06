import { Component, Input, Output, EventEmitter, OnInit, SimpleChanges, OnDestroy, OnChanges } from '@angular/core';
import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quiz',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './quiz.component.html',
  styleUrls: ['./quiz.component.scss'],
  animations: [
    trigger('pulse', [
      transition(':enter', [
        animate('0.8s ease-in-out', keyframes([
          style({ transform: 'scale(0.8)', opacity: 0, offset: 0 }), // Start small
          style({ transform: 'scale(1.05)', opacity: 1, offset: 0.5 }), // Expand slightly
          style({ transform: 'scale(1)', opacity: 1, offset: 1 }) // Settle at normal size
        ]))
      ])
    ])
  ]
})
export class QuizComponent implements OnInit, OnDestroy {
  @Output() quizCompleted = new EventEmitter<number>() ;
  @Input() userName: string = '';
  private audioFiles = [
    new Audio('assets/audio/kahoot_sound1.mp3'),
    new Audio('assets/audio/kahoot_sound2.mp3'),
    new Audio('assets/audio/kahoot_sound3.mp3'),
  ];
  private currentAudioIndex = 0; 
  private timerInterval: any; 
  timer: number = 12;
  isLowTime: boolean = false;

  score: number = 0;
  currentQuestionIndex: number = 0;
  totalQuestions: number = 10;

  flashColor: string = '';

  quizes = [
    {
      'q':"What is Garnette's favorite snack?",
      'c':[{'img':'assets/question1/eminems.jpg','ans':'eminems'},{'img':'assets/question1/nips.png','ans':'nipples'},
        {'img':'assets/question1/skittles.webp','ans':'titties'},{'img':'assets/question1/borneo.webp','ans':'borneo'}],
      'a':'nipples'
    },
    {
      'q':"Which show is Garnette afraid of?",
      'c':[{'img':'assets/question2/shrek.jpg','ans':'Shrek'},{'img':'assets/question2/cars.jpg','ans':'Cars'},
        {'img':'assets/question2/nemo.jpeg','ans':'Nemo'},{'img':'assets/question2/incredible.png','ans':'Mr.Incredible'}],
      'a':'Shrek'
    },
    {
      'q':"Garnette's weirdest habits?",
      'c':[{'img':'assets/question3/pick-nose.jpg','ans':'Picking her nose'},{'img':'assets/question3/forgot-phone.jpg','ans':'Constantly losing her phone'},
        {'img':'assets/question3/fart.jpg','ans':'Bomboclaat'},{'img':'assets/question3/pillow-corner.jpg','ans':'Playing the corner of a pillow'}],
      'a':'Playing the corner of a pillow'
    },
    {
      'q':"Who is Garnette's favorite NBA player",
      'c':[{'img':'assets/question4/tingus-pingus.webp','ans':'Tingus Pingus'},{'img':'assets/question4/dick.jpg','ans':'Big Dick'},
        {'img':'assets/question4/jokic.avif','ans':'Nikola Jokic'},{'img':'assets/question4/garnett.jpg','ans':'Kevin Garnett'}],
        'a':'Nikola Jokic'},
    {
      'q':"Which animal is Garnette's favorite?",
      'c':[{'img':'assets/question5/oiiai.gif','ans':'OIIAI'},{'img':'assets/question5/dancingdog.gif','ans':'Dancing Dog'},
        {'img':'assets/question5/susdog.png','ans':'Lie Detektor'},{'img':'assets/question5/mcdrabbit.jpeg','ans':'McDonald\'s Worker'}],
        'a':'McDonald\'s Worker'
    },
    {
      'q':"Which emote does Garnette like Bentley doing most?",
      'c':[{'img':'assets/question6/black.gif','ans':'Black Lives Matter'},{'img':'assets/question6/speed.gif','ans':'iShowSpeed'},
        {'img':'assets/question6/orangejustice.gif','ans':'Orange Justice'},{'img':'assets/question6/defaultdance.gif','ans':'Default Dance'}],
        'a':'iShowSpeed'
    },
    {
      'q':"Which animal does Bentley think Garnette look like?",
      'c':[{'img':'assets/question7/dog.jpg','ans':'Doggo'},{'img':'assets/question7/hamster.jpg','ans':'Louis Litt'},
        {'img':'assets/question7/rabbit.jpg','ans':'Cute Rabbit'},{'img':'assets/question7/cat.jpeg','ans':'Pretty Kitty'}],
        'a':'Pretty Kitty'
    },
    {
      'q':"Which part of Garnette does Bentley like the most?",
      'c':[{'img':'assets/question8/eyes.jpeg','ans':'Her Eyes'},{'img':'assets/question8/dimple.jpeg','ans':'Her Dimples'},
        {'img':'assets/question8/lips.jpeg','ans':'Her Lips'},{'img':'assets/question8/nose.jpeg','ans':'Her Nose'}],
        'a':'Her Eyes'
    },
    {
      'q':"Which version of Garnette does Bentley like the most",
      'c':[{'img':'assets/question9/aunty-garnette.jpeg','ans':'Aunty Garnette'},{'img':'assets/question9/date-garnette.jpeg','ans':'Dating Garnette'},
        {'img':'assets/question9/sunglasses-garnette.jpeg','ans':'Sunglasses Garnette'},{'img':'assets/question9/work-garnette.jpeg','ans':'Working Garnette'}],
        'a':'Sunglasses Garnette'
    },
    {
      'q':"Where will Garnette choose for her Valentine's dinner?",
      'c':[{'img':'assets/question10/idk.jpg','ans':"I don't know"},{'img':'assets/question10/jogoya.jpg','ans':'Jogoya'},
        {'img':'assets/question10/omakase.jpg','ans':'Omakase'},{'img':'assets/question10/sky-dine.png','ans':'Sky Dine'}],
        'a': "I don't know"
    }
  ]

  ngOnInit(){
    this.startTimer()
    this.setupAudioLoop();
    this.playAudio();
  }

  ngOnDestroy(){
    this.stopTimer();
    this.stopAudio();
    this.audioFiles.forEach(audio => audio.removeEventListener('ended', this.playNextAudio));
  }

  startTimer() {
    this.timerInterval = setInterval(() => {
      if (this.timer > 0) {
        this.timer--;
        this.isLowTime = this.timer <= 5;
      } else {
        this.chooseAnswer(''); // Auto-submit with 0 points if time runs out
      }
    }, 1000);
  }

  resetTimer() {
    this.stopTimer();
    this.timer = 12; // Reset timer to 30 seconds
    this.isLowTime = false;
    this.startTimer();
  }

  stopTimer() {
    if (this.timerInterval) {
      clearInterval(this.timerInterval);
    }
  }

  setupAudioLoop() {
    this.audioFiles.forEach(audio => audio.addEventListener('ended', this.playNextAudio));
  }

  playNextAudio = () => {
    this.currentAudioIndex = (this.currentAudioIndex + 1) % this.audioFiles.length; // Move to the next audio file
    this.audioFiles[this.currentAudioIndex].play();
  };

  playAudio() {
    this.audioFiles[this.currentAudioIndex].play().catch(error => console.error("Audio playback error:", error));
  }

  stopAudio() {
    this.audioFiles.forEach(audio => {
      audio.pause();
      audio.currentTime = 0;
    });
  }

  chooseAnswer(answer: string) {
    const correctAnswer = this.quizes[this.currentQuestionIndex].a;
    const isCorrect = answer === correctAnswer;
  
    this.flashColor = isCorrect ? 'correct' : 'wrong'; // Show flash overlay

    if(isCorrect){
      this.playCorrectSound();
    }else {
      this.playWrongSound();
    }
  
    setTimeout(() => {
      this.flashColor = ''; // Remove effect after 1.5s
      this.nextQuestion(isCorrect ? 1 : 0);
    }, 300);
  }

  playCorrectSound() {
    const correctAudio = new Audio('assets/audio/quiz/correct-sound.mp3');
    correctAudio.play();
  }
  
  // Play random wrong sound
  playWrongSound() {
    const wrongSounds = [
      'assets/audio/quiz/wrong-answer/goddamn.mp3',
      'assets/audio/quiz/wrong-answer/bruh.mp3',
      'assets/audio/quiz/wrong-answer/you-stupid.mp3'
    ];
    
    const randomIndex = Math.floor(Math.random() * wrongSounds.length);
    const wrongAudio = new Audio(wrongSounds[randomIndex]);
    wrongAudio.play();
  }
  

  nextQuestion(points: number) {
    this.score += points; // Keep score

    if (this.currentQuestionIndex < this.totalQuestions - 1) {
      this.currentQuestionIndex++; // Move to next question
      this.resetTimer(); // Only reset timer, not component
    } else {
      this.finishQuiz(); // If last question, finish the quiz
    }
  }

  finishQuiz() {
    this.stopTimer();
    const data: any = {'score': this.score, 'userName': this.userName}
    this.quizCompleted.emit(data);
  }

}
