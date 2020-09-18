import { Component, OnInit } from '@angular/core';
import { TokenService } from './shared/services/token.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'akwantu';

  constructor(private tokenService: TokenService,) { }

  ngOnInit(): void {
    let tokenExpiration = +localStorage.getItem('expiresAt');
    console.log('is token valid in app component', this.tokenService.isTokenValid());

    if (!this.tokenService.isTokenValid()) {
      this.tokenService.getAccessToken().subscribe(res => console.log({ res }));
    }

  }


}
