import { Component } from '@angular/core';
@Component({
  template: `
    <p>{{someVar}}</p>
  `
})
export class MediaDataBaseComponent {
  someVar: string = 'MediaDataBaseComponent' ;
}