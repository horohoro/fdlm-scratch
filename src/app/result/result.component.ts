import { Component, OnInit, OnDestroy } from '@angular/core';
import { Injectable } from '@angular/core';
import { BackendService } from '../backend.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from '../card';

@Injectable({
  providedIn: 'root'
})
@Component({
  selector: 'app-result',
  templateUrl: './result.component.html',
  styleUrls: ['./result.component.scss']
})
export class ResultComponent implements OnInit, OnDestroy {
  cards?: Card[];
  private player?: number;

  constructor(
    private backendService : BackendService,
    private activatedRoute : ActivatedRoute,
    private router : Router) {
      this.activatedRoute.queryParams.subscribe(params => {
        this.player = params['player'];
      })
    }

  ngOnInit(): void {
    this.backendService.GameResult().subscribe(res => 
      this.cards = res);
  }

  ngOnDestroy(): void {
    this.backendService.UnassignPlayer(this.player).subscribe()
  }

  newGame(): void {
    this.backendService.UnselectUnassignedCards().subscribe(
      res => this.router.navigate(['/card-detail'], { queryParamsHandling: "preserve" }))
  }

  leaveGame(): void {
    // The destroy will be called and unassign the player
    this.router.navigate(['/'])
  }

  resetAllCards(): void {
    this.backendService.UnassignPlayer().subscribe(
      res => console.log('all cards have been successfully reset'))
  }

}
