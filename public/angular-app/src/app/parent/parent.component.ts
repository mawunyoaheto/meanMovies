import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-parent',
  templateUrl: './parent.component.html',
  styleUrls: ['./parent.component.css']
})
export class ParentComponent implements OnInit {
  @Input()
  x: number = 3;

  @Input()
  y: number = 4;

  z:number=0;
  constructor() { }

  ngOnInit(): void {
  }

  setz(result: number) {
    this.z = result;
  }
 

}
