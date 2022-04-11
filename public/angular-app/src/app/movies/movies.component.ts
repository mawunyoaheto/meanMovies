import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MoviesDataService } from '../movies-data.service';



export class Actor {
  #_id!: string;
  #name!: string;
  #awards!: number;

  get _id() { return this.#_id; }
  get name() { return this.#name; }
  get awards() { return this.#awards; }

  set _id(_id: string) { this.#_id = _id; }

  set name(name: string) { this.#name = name; }
  set awards(awards: number) { this.#awards = awards; }

  constructor(actor: any) {
    this.#_id = actor._id;
    this.#name = actor.name;
    this.#awards = actor.awards;
  }
}



export class Movie {
  #_id!: string;
  #title!: string;
  #year!: number;
  #actors!: Actor[];

  get _id() { return this.#_id; }
  get actors() { return this.#actors; }
  get title() { return this.#title; }
  get year() { return this.#year; }

  set _id(_id: string) { this.#_id = _id; }

  set actors(actors: Actor[]) { this.#actors = actors; }
  set title(title: string) { this.#title = title; }
  set year(year: number) { this.#year = year; }

  constructor(movie: any) {
    this.#_id = movie._id;
    this.#actors = movie.actors;
    this.#title = movie.title;
    this.#year = movie.year;
  }
}

@Component({
  selector: 'app-movies',
  templateUrl: './movies.component.html',
  styleUrls: ['./movies.component.css']
})
export class MoviesComponent implements OnInit {
  movies!: Movie[];
  count: number = 1; showForm = false;
  addNewFormEditState = false;
  editData!: Movie;
  title: any
  constructor(private _moviesService: MoviesDataService, private _router: Router, private appService: AppService) {
  }

  loadMovies(): void {
    console.log('load clicked');
    this._moviesService.getMovies().subscribe({
      next: (response) => this.fillMoviesFromService(response),
      error: (e) => console.error(e),
      complete: () => console.info('complete')
    });

  }

  onDelete(movie_id: string) {
    this._moviesService.deleteMovies(movie_id).subscribe({
      next: (response) => console.log('delete-response', response),
      error: (e) => console.error(e),
      complete: () => {
        this.loadMovies();
        console.info('delete successful')
      }
    });

    console.log('deleted movieId: ' + movie_id);
  }


  ngOnInit(): void {

    this._moviesService.getMovies().subscribe(response => this.fillMoviesFromService(response));
  }
  private fillMoviesFromService(movies: Movie[]) {
    this.movies = movies;
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

      this.loadMovies();
      this.openForm();
    }
  }

  onAddMovie(): void {
    console.log("movies clicked");
    this._router.navigate(['addmovie']);
  }

  editMovie(movie: Movie) {
    this.addNewFormEditState = true;
    this.editData = movie;
    this.openForm();
  }

}
