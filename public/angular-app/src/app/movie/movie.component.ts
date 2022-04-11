import { AppService } from './../app.service';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { MoviesDataService } from '../movies-data.service';
import { Actor, Movie } from '../movies/movies.component';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css']
})
export class MovieComponent implements OnInit {

  movie!: Movie
  movieId!:string
  // actors!: Actor[]
  constructor(private movieService: MoviesDataService, private route: ActivatedRoute, private appService: AppService) {
    this.movie = new Movie({ _id: "1", title: "Lord of the rings", year: 2022, actors: [{ name: "Mike Pence", awards: 3 }, { name: "Joana Annan", awards: 8 }]});
  }

  ngOnInit(): void {
    this.movieId = this.route.snapshot.params["movieId"];

    this.movieService.getMovie(this.movieId).subscribe({
      next: (response) => this.fillMovieFromService(response),
      error: (e) => console.error(e),
      complete: () => console.log('get movie', this.movie)
    });
  }

  private fillMovieFromService(movie: Movie): void {
    this.movie = movie;
    console.log('got movie', movie);
  }

  editMovie(movieId:string, actorId:string) {
    // this.addNewFormEditState = true;
    // this.editData = movie;
    // this.openForm();
  }

  onDelete(movieId:string, actorId:string) {
    console.log('actor-ID',actorId);
    this.movieService.deleteActors(movieId,actorId).subscribe({
      next: (response) => console.log('delete-response', response),
      error: (e) => {
        console.error(e)

      },
      complete: () => {
       // this.loadMovies();
        console.info('delete successful')
      }
    });

    console.log('deleted actorId: ' + actorId);
  }
}
