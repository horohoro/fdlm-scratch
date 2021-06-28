import { Component, OnInit, OnDestroy } from '@angular/core';
import { Injectable } from '@angular/core';
import { BackendService } from '../backend.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Card } from '../card';
import { FilterSettings } from '../filter-settings';

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
  displayedColumns: string[] = ['en', 'fr', 'ja'];
  filterSettings = new FilterSettings();

  constructor(
    private backendService : BackendService,
    private activatedRoute : ActivatedRoute,
    private router : Router) {
      this.activatedRoute.queryParams.subscribe(params => {
        this.player = params['player'];
        if (params['selectedDifficulty']) {
          this.filterSettings = new FilterSettings(params['selectedDifficulty'])
        }
      })
    }

  ngOnInit(): void {
    this.backendService.GameResult(this.filterSettings.selectedDifficultyToString()).subscribe(
      res => this.cards = res);
  }

  ngOnDestroy(): void {

  }

  newGame(): void {
    this.backendService.UnassignPlayer(this.player).subscribe(
      () => this.backendService.UnselectUnassignedCards().subscribe(
        () => this.router.navigate(['/card-detail'], { queryParamsHandling: "preserve" })))
  }

  leaveGame(): void {
    // The destroy will be called and unassign the player
    this.backendService.UnassignPlayer(this.player).subscribe(
      () => this.backendService.UnselectUnassignedCards().subscribe(
        () => this.router.navigate(['/'])))
  }

  resetAllCards(): void {
    this.backendService.UnassignPlayer().subscribe(
      res => console.log('All cards have been successfully reset'))
  }

}
