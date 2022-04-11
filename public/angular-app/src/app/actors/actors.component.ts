import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MoviesDataService } from '../movies-data.service';
import { Actor } from '../movies/movies.component';

@Component({
  selector: 'app-actors',
  templateUrl: './actors.component.html',
  styleUrls: ['./actors.component.css']
})
export class ActorsComponent implements OnInit {
  actors!: Actor[];

  @Input()
  movieId = '';

  @Input()
  movId!: any;

  count: number = 1; showForm = false;
  addNewFormEditState = false;
  editData!: Actor;
  title: any
  constructor(private _moviesService: MoviesDataService, private _router: Router) { }

  loadActors(): void {
    console.log('load clicked', this.movieId);
    this._moviesService.getActors(this.movieId).subscribe({
      next: (response) => this.fillActorsFromService(response.actors),
      error: (e) => console.error(e),
      complete: () => console.info('complete')
    });
  }
  onDelete(actor_id: string) {
    this._moviesService.deleteActors(this.movieId,actor_id).subscribe({
      next: (response) => console.log('delete-response', response),
      error: (e) => console.error(e),
      complete: () => {
        this.loadActors();
        console.info('delete successful')
      }
    });

    console.log('deleted movieId: ' + actor_id);
  }

  ngOnInit(): void {
    console.log('actors-init', this.movieId);
    this.loadActors();
  }
  private fillActorsFromService(actors: Actor[]) {
    this.actors = actors;
    console.log('got actors', actors);
  }
  openForm() {
    this.showForm = !this.showForm;
    if (!this.showForm) {
      this.addNewFormEditState = false;
    }
  }

  closeForm(event: boolean) {
    if (event) {
      this.addNewFormEditState = false;

      this.loadActors();
      this.openForm();
    }
  }

  onAddActor(): void {
    console.log("actors clicked");
    this._router.navigate(['addmovie']);
  }

  editActor(actor: Actor) {
    this.addNewFormEditState = true;
    this.editData = actor;
    this.openForm();
  }
}

