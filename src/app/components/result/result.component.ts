import { Component, EventEmitter, Input, OnInit, OnDestroy, Output } from '@angular/core';
import { ApiService } from '../../services/api/api.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-result',
  imports: [CommonModule],
  templateUrl: './result.component.html',
  styleUrl: './result.component.scss',
  standalone: true
})
export class ResultComponent implements OnInit, OnDestroy {

  @Output() restart = new EventEmitter<void>();
  @Input() score: number = 0;
  @Input() userName: string = '';

  topResults: any[] = [];
  loading: boolean = true; // Track loading state
  private audio = new Audio('../../../assets/ending/luther.mp3');

  constructor(private apiService: ApiService) {}

  ngOnInit(): void {
    this.uploadResult();
    this.playAudio();
  }

  ngOnDestroy(): void {
    this.stopAudio();
  }

  uploadResult() {
    this.loading = true; // Start loading

    if (this.userName && this.score !== null) {
      this.apiService.sendResults(this.userName, this.score).subscribe(
        (response) => {
          this.topResults = response.topResults;
          this.loading = false; // Stop loading after getting data
          console.log('see top 10: ', this.topResults);
        },
        (error) => {
          console.error('Error uploading results: ', error);
          this.loading = false; // Stop loading even if an error occurs
        }
      );
    }
  }

  playAudio() {
    this.audio.currentTime = 12; 
    this.audio.loop = false;
    this.audio.play().catch(error => console.error('Audio playback failed:', error));
  }

  stopAudio() {
    if (this.audio) {
      this.audio.pause();
      this.audio.currentTime = 0; // Reset audio
      this.audio.src = ''; // Clean up reference
    }
  }

  restartQuiz() {
    this.restart.emit();
    this.stopAudio(); // Stop audio when restarting
  }
}
