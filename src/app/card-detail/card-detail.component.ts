import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { BackendService } from '../backend.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from '../card';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-card-detail',
  templateUrl: './card-detail.component.html',
  styleUrls: ['./card-detail.component.scss']
})
export class CardDetailComponent implements OnInit {
  player : number = 0;
  card : Card = new Card();

  constructor(
    private backendService : BackendService,
    private activatedRoute : ActivatedRoute,
    private router : Router) { 
      this.activatedRoute.queryParams.subscribe(params => {
        this.player = params['player'];
      })
  }

  ngOnInit(): void {
    this.backendService.UnassignPlayer(this.player).subscribe(res =>
        this.backendService.AssignUnassignedCard(this.player).subscribe(res =>
          this.card = res));
  }

  reloadComponent() {
    let currentUrl = this.router.url.split('?')[0];
    this.router.routeReuseStrategy.shouldReuseRoute = () => false;
    this.router.onSameUrlNavigation = 'reload';
    this.router.navigate([currentUrl], { queryParamsHandling: "preserve" });
  }

}
