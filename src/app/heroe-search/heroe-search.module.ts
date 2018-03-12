import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { HeroesSearchComponent } from './heroe-search.component';
import { FormsModule } from '@angular/forms';

export const routes: Routes = [
  { path: '', component: HeroesSearchComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes)
  ],
  declarations: [HeroesSearchComponent]
})
export class HeroeSearchModule { }
