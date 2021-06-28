import { Injectable } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { BackendService } from '../backend.service';
import { Card } from '../card';

@Injectable({
  providedIn: "root"
})
@Component({
  selector: 'app-list-cards',
  templateUrl: './list-cards.component.html',
  styleUrls: ['./list-cards.component.scss']
})
export class ListCardsComponent implements OnInit {
  cards?: Card[];
  displayedColumns = ['en', 'fr', 'ja', 'difficulty', 'image', 'delete']

  constructor(
    private backendService : BackendService) {
      
  }

  ngOnInit(): void {
    this.backendService.GetCards().subscribe(
      (cards) => this.cards = cards
    );
  }

  deleteCard(cardId : string): void {
    this.backendService.DeleteCard(cardId).subscribe(
      (deletedCard) => {
        this.cards = this.cards?.filter((card) => card._id != deletedCard._id)
      }
    )
  }

}
