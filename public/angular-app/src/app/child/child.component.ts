import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-child',
  templateUrl: './child.component.html',
  styleUrls: ['./child.component.css']
})
export class ChildComponent implements OnInit {
  @Input()
x:number=0;

@Input()
y:number=0;

@Input()
z:number=0;

@Output()
addevent:EventEmitter<number> = new EventEmitter()


  constructor() { }

  ngOnInit(): void {
  }


add(){
  this.z=this.x+this.y;
  this.addevent.emit(this.z);
}
}
