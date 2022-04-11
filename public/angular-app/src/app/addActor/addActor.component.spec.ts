/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { AddActorComponent } from './addActor.component';

describe('AddActorComponent', () => {
  let component: AddActorComponent;
  let fixture: ComponentFixture<AddActorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddActorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddActorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
