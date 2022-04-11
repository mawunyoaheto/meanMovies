import { AppService } from './../app.service';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MoviesDataService } from '../movies-data.service';

@Component({
  selector: 'app-add-movie',
  templateUrl: './add-movie.component.html',
  styleUrls: ['./add-movie.component.css']
})
export class AddMovieComponent implements OnInit {
  addNewMovieForm!: FormGroup;

  @Input() addNewFormEditState = false;
  @Input() editData: any;
  @Output() dismiss = new EventEmitter();
  constructor(private _router: Router,
    private _movieService: MoviesDataService,
    private appService: AppService,
    public formBuilder: FormBuilder) {


  }

  ngOnInit(): void {
    this.addNewMovieForm = this.formBuilder.group({
      _id: [null],
      title: ['', Validators.required],
      year: ['', Validators.required]
    })

    if (this.addNewFormEditState) {
      this.addNewMovieForm.patchValue({
        _id: this.editData._id,
        title: this.editData.title,
        year: this.editData.year
      });
    } else {
      this.addNewMovieForm.reset();
    }
  }

  onAddMovie(): void {
    console.log("movies clicked");
    this._router.navigate(['addmovie']);
  }

  save() {
    if (this.addNewFormEditState) {
     this.editNewMovie();
    } else {
      this.addNewMovie();
    }
  }

  addNewMovie() {
    this._movieService.addMovie(this.addNewMovieForm.value).subscribe({
      next: (response) =>{
        console.log('post-movie', response);
        this.appService.alert.next({isSuccess: true, show: true, message: 'Movie saved successfully'});
    },
      error: (e) => {console.log(e)
        this.appService.alert.next({isSuccess: false, show: true, message: JSON.stringify(e)});
      },
      complete: () => {
        this._router.navigate(['movies']);
        console.info('add successful')
      }
    })
  }

  editNewMovie() {
    this._movieService.editMovie(this.addNewMovieForm.value).subscribe({
      next: (response) => console.log('post-movie', response),
      error: (e) => console.log(e),
      complete: () => {
        this.dismiss.next(true);
        console.info('add successful')
      }
    })
  }
}
