import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MoviesDataService } from '../movies-data.service';

@Component({
  selector: 'app-addActor',
  templateUrl: './addActor.component.html',
  styleUrls: ['./addActor.component.css']
})
export class AddActorComponent implements OnInit {
  addNewActorForm!: FormGroup;
  @Input()
  movieId:string='';
  @Input() addNewFormEditState = false;
  @Input() editData: any;
  @Output() dismiss = new EventEmitter();
  constructor(private _router: Router,
    private _movieService: MoviesDataService,
    public formBuilder: FormBuilder) { }

  ngOnInit() {
    this.addNewActorForm = this.formBuilder.group({
      _id: [null],
      name: ['', Validators.required],
      awards: ['', Validators.required]
    })

    if (this.addNewFormEditState) {
      this.addNewActorForm.patchValue({
        _id: this.editData._id,
        name: this.editData.name,
        awards: this.editData.awards
      });
    } else {
      this.addNewActorForm.reset();
    }
  }


  onAddActor(): void {
    console.log("add actor");
    this._router.navigate(['addactor']);
  }

  save() {
    if (this.addNewFormEditState) {
     this.editNewActor();
    } else {
      this.addNewActor();
    }
  }

  addNewActor() {
    this._movieService.addActor(this.movieId,this.addNewActorForm.value).subscribe({
      next: (response) => console.log('post-actor', response),
      error: (e) => console.log(e),
      complete: () => {
        this._router.navigate([`/movies/`+this.movieId]);
        this.dismiss.next(true);
        console.info('add successful')
      }
    })
  }
  editNewActor() {
    this._movieService.editActor(this.addNewActorForm.value).subscribe({
      next: (response) => console.log('post-actor', response),
      error: (e) => console.log(e),
      complete: () => {
        this.dismiss.next(true);
        console.info('add successful')
      }
    })
  }
}
