import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FilterSettings } from '../filter-settings';


@Component({
  selector: 'app-player-selector',
  templateUrl: './player-selector.component.html',
  styleUrls: ['./player-selector.component.scss']
})
export class PlayerSelectorComponent implements OnInit {
  filterSettings = new FilterSettings();

  constructor(
    private backendService : BackendService,
    private activatedRoute : ActivatedRoute,
    private router : Router) { }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe(params => {
        if (params['player']) {
          this.backendService.UnassignPlayer(params['player']).subscribe(() =>
            this.router.navigate(['/']))
        }
    })
  }
}
