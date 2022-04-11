import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';

import { Movie, Actor } from './movies/movies.component';

@Injectable({
  providedIn: 'root'
})
export class MoviesDataService {
  private baseUrl:string = 'http://localhost:3000/api/';
  constructor(private _http: HttpClient) {

  }
  ngOnInit(): void {

  }
  getMovies():  Observable<Movie[]> {
    return this._http.get<Movie[]>(this.baseUrl+"movies");

  }

  public getMovie(id: string):Observable<Movie> {
    const url: string= this.baseUrl + "movies/" + id;
    return this._http.get<Movie>(url);
    }


    public addMovie(movie:Movie){
      return this._http.post(this.baseUrl+"movies/",movie);
    }


    public editMovie(movie:Movie){
      return this._http.put(`${this.baseUrl}movies/${movie._id}`,movie);
    }

  deleteMovies(movieId: any):Observable<any> {
    return this._http.delete(`${this.baseUrl}movies/${movieId}`);
  }


  getActors(movie_Id:string):  Observable<any> {
    let url =`${this.baseUrl}movies/${movie_Id}/actors`

    console.log('actors-list-url',url);
    return this._http.get<Actor[]>(url);

  }
  public addActor(movieId:string,actor:Actor){
    console.log('add-actor-movieId',movieId)
    return this._http.post(`${this.baseUrl}movies/${movieId}/actors`,actor);
  }


  public editActor(actor:Actor){
    return this._http.put(`${this.baseUrl}movies/actors/${actor._id}`,actor);
  }
  deleteActors(movieId:string,actorId:string):Observable<any> {
    // console.log('service-actorId',actorId)
    return this._http.delete(`${this.baseUrl}movies/${movieId}/actors/${actorId}`);
  }

  private handleError(error: any): Promise<any> {
    return Promise.reject(error.message || error);
  }
}
