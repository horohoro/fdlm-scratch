import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerSelectorComponent } from './player-selector/player-selector.component';
import { CardDetailComponent } from './card-detail/card-detail.component';
import { ResultComponent } from './result/result.component';
import { AddCardComponent } from './add-card/add-card.component';
import { ListCardsComponent } from './list-cards/list-cards.component';


const routes: Routes = [
  { path: '', component: PlayerSelectorComponent},
  { path: 'card-detail', component: CardDetailComponent},
  { path: 'result', component: ResultComponent},
  { path: 'add-card', component: AddCardComponent},
  { path: 'list-cards', component: ListCardsComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
