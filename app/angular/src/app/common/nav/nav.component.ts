import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html'
})
export class NavComponent {

    constructor(private _router: Router) { }

    onClick() {
      this._router.navigateByUrl('/');
    }
}