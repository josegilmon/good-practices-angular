import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { MarvelService } from './core/marvel.service';
import { CoreModule } from './core/core.module';


export const routes: Routes = [
  { path: '', redirectTo: 'heroes-search', pathMatch: 'full' },
  { path: 'heroes-search', loadChildren: './heroe-search/heroe-search.module#HeroeSearchModule' },
  { path: 'details/:id', loadChildren: './heroe-detail/heroe-detail.module#HeroeDetailModule' }
];

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes),
    CoreModule
  ],
  providers: [MarvelService],
  bootstrap: [AppComponent]
})
export class AppModule { }
