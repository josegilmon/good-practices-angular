import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {DetailComponent} from './heroe-detail.component';

export const routes: Routes = [
  { path: '', component: DetailComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DetailComponent]
})
export class HeroeDetailModule { }
