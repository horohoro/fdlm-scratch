import { Component, Injectable } from '@angular/core';
import { BackendService } from './backend.service';
import { ActivatedRoute, Router } from '@angular/router';

@Injectable({providedIn: 'root'})
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'fdlm-scratch';
  private player?: number;

  constructor(
    private backendService : BackendService,
    private activatedRoute : ActivatedRoute,
    private router : Router) {
      this.activatedRoute.queryParams.subscribe(params => {
        this.player = params['player'];
      })
    }

  goToHome() {
    this.goToRoute('/')
  }

  goToAddCards() {
    this.goToRoute('/add-card')
  }

  goToRoute(route : string){
    let navigateToRoute = () => this.router.navigate([route]);

    if (this.player) {
      this.backendService.UnassignPlayer(this.player).subscribe(navigateToRoute)
      return
    }

    navigateToRoute()
  }
}
