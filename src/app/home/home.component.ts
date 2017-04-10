import { Component } from '@angular/core';
@Component({
  styleUrls: ['./home.component.css'],
  template: `
    <p>{{someVar}}</p>
  `
})
export class HomeComponent {
  someVar: string = 'home';
}
