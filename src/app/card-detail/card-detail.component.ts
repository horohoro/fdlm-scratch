import { Component, OnInit } from '@angular/core';
import { Injectable } from '@angular/core';
import { BackendService } from '../backend.service';
import { ActivatedRoute } from '@angular/router';
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
  private player : number = 0;
  card : Card = new Card();

  constructor(
    private backendService : BackendService,
    private activatedRoute: ActivatedRoute) { 
      this.activatedRoute.queryParams.subscribe(params => {
        this.player = params['player']
      })
  }

  ngOnInit(): void {
    this.backendService.UnassignPlayer(this.player).subscribe(res =>
        this.backendService.AssignUnassignedCard(this.player).subscribe(res =>
          this.card = res));
  }

}
