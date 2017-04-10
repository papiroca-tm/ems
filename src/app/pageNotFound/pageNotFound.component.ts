import { Component } from '@angular/core';
@Component({
  template: `
    <p>{{someVar}}</p>
  `
})
export class PageNotFoundComponent {
  someVar: string = 'PageNotFoundComponent';
}