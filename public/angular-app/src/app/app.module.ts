
import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { AppComponent } from './app.component';
import { NavigationComponent } from './navigation/navigation.component';
import { MoviesComponent } from './movies/movies.component';
import { ErrorPageComponent } from './error-page/error-page.component';
import { HomePageComponent } from './home-page/home-page.component';
import { MovieComponent } from './movie/movie.component';
import { AddMovieComponent } from './add-movie/add-movie.component';
import { ParentComponent } from './parent/parent.component';
import { ChildComponent } from './child/child.component';
import { FooterComponent } from './footer/footer.component';
import { ReactiveFormsModule } from '@angular/forms';
import { ActorsComponent } from './actors/actors.component';
import { AddActorComponent } from './addActor/addActor.component';
@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    MoviesComponent,
    MovieComponent,
    ErrorPageComponent,
    AddMovieComponent,
    ParentComponent,
    ChildComponent,
    FooterComponent,
    ActorsComponent,
      AddActorComponent
   ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    ReactiveFormsModule,
    FormsModule,
    Ng2SearchPipeModule,
    RouterModule.forRoot([
      {
        path:"",
        component: HomePageComponent
      },
      {
        path:"movies",
        component: MoviesComponent
      },
      {
        path:"movies/:movieId",
        component: MovieComponent
      },
      {
        path:"addmovie",
        component: AddMovieComponent
      }
      ,
      {
        path:"**",
        component: ErrorPageComponent
      }
    ])
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
