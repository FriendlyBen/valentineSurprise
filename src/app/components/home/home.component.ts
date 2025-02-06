import { CommonModule } from '@angular/common';
import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../services/api/api.service';

@Component({
  selector: 'app-home',
  imports: [FormsModule, CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss',
  standalone: true
})
export class HomeComponent implements OnInit, OnDestroy {
  @Output() startQuiz = new EventEmitter<string>();

  private audio = new Audio('../../../assets/audio/Fluffing a Duck  Kevin MacLeod (No Copyright Music).mp3');
  userName: string = '';
  isLoading: boolean = false;
  countdown: number = 3;

  constructor(private apiService: ApiService){
    this.getGreeting();
  }

  getGreeting() {
    this.apiService.getGreeting().subscribe({
      next: (response) => {
        console.log('✅ Backend Response:', response);
      },
      error: (err) => {
        console.error('❌ API Error:', err);
      }
    });
  }

  ngOnInit() {
    this.audio.addEventListener('ended', () => this.restartAudio());
    
    // Ensure volume is set correctly
    this.audio.muted = false;
  
    // Load the audio before playing
    this.audio.addEventListener('canplaythrough', () => {
      console.log('Audio loaded, attempting to play...');
      this.tryPlayAudio();
    });
  
    // Try playing immediately if possible
    this.tryPlayAudio();
  }

  tryPlayAudio() {
    const resp = this.audio.play();
    if (resp !== undefined) {
      resp.then(() => {
        console.log('Playing background music');
      }).catch(error => {
        console.log('Autoplay blocked, waiting for user interaction');
        // Add a click event listener to start audio on first user interaction
        document.body.addEventListener('click', this.playOnUserInteraction, { once: true });
      });
    }
  }
  
  // Play audio when the user interacts (fix for autoplay restrictions)
  playOnUserInteraction = () => {
    this.audio.play().then(() => {
      console.log('Audio started after user interaction');
    }).catch(error => console.error("Audio playback error:", error));
  };
  
  restartAudio() {
    this.audio.currentTime = 0;
    this.audio.play().catch(error => console.error("Audio restart error:", error));
  }
  


  // restartAudio(){
  //   this.audio.currentTime = 0;
  //   this.audio.play().catch(error => console.error("Audio restart error:", error))
  // }

  start() {
    if (!this.userName.trim()) {
      alert("Please enter your name before starting the quiz!");
      return;
    }

    this.isLoading = true; // Show countdown screen
    this.countdown = 3; // Reset countdown

    const interval = setInterval(() => {
      this.countdown--;

      if (this.countdown === 0) {
        clearInterval(interval); // Stop countdown
        this.isLoading = false; // Hide countdown
        this.startQuiz.emit(this.userName); // Move to quiz page
      }
    }, 1000); // Reduce every second
  }

  stopMusic() {
    this.audio.pause(); // Stop audio
    this.audio.currentTime = 0; // Reset to beginning
  }

  // ngOnDestroy(){
  //   this.stopMusic();
  // }
  ngOnDestroy() {
    console.log('Destroying HomeComponent, stopping music...');
    this.stopMusic();
    this.audio.src = '';  // 🔥 Completely remove audio reference
    this.audio.load();     // 🔥 Free up memory
    document.body.removeEventListener('click', this.playOnUserInteraction);
  }
}
