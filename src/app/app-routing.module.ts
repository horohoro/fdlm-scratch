import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlayerSelectorComponent } from './player-selector/player-selector.component';
import { CardDetailComponent } from './card-detail/card-detail.component';
import { ResultComponent } from './result/result.component';


const routes: Routes = [
  { path: '', component: PlayerSelectorComponent},
  { path: 'card-detail', component: CardDetailComponent},
  { path: 'result', component: ResultComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
