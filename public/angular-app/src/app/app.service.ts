import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AppService {
public alert = new Subject<AlertModel>();
constructor() { }

}

export interface AlertModel{
  isSuccess?: boolean;
  message?: string;
  show?: boolean;
}
