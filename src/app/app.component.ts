import { Component } from '@angular/core';
import {Router} from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'exlibris';
  constructor(private router: Router){}
  ngOnInit() { }
  onClickHome() {
    this.router.navigate(['home']);
  }
  onClickMediaDataBase() {
    this.router.navigate(['mediadatabase']);
  }
}
