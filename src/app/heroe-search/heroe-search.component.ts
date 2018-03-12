///<reference path="../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import {HttpClient} from '@angular/common/http';
import {Component} from '@angular/core';
import {Router} from '@angular/router';
import { MarvelService } from '../core/marvel.service';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'heroes-search',
  templateUrl: `heroe-search.component.html`,
  styleUrls: [`heroe-search.component.css`]
})
export class HeroesSearchComponent {

  public heroName: string;
  public limit = 10;
  public heroesResult: Hero[];
  public lastPage = 0;
  public actualPage = 0;
  public loading = false;


  constructor(
    private _marvelService: MarvelService,
    private _http: HttpClient,
    private _router: Router
  ) {

  }

  public launchSearch() {
    this.loading = true;
    this._marvelService
      .getHeroes(this.heroName, this.limit, this.actualPage)
      .subscribe(
        (answer: any) => {
          this.lastPage = Math.ceil(answer.data.total / this.limit) - 1;
          this.heroesResult = answer.data.results.map(
            hero => {
              const frontHero: Hero = {
                id: hero.id,
                name: hero.name,
                description: (hero.description.length > 10) ? hero.description.substring(0, 100) : hero.description
              };

              this.loading = false;
              return frontHero;
            }
          );
        },
        error => { throw new Error(error); }
      );
  }

  public navDetails(heroId) {
    this._router.navigateByUrl(`details/${heroId}`);
  }

  public setPage(page: number) {
    page = (page < 0) ? 0 :
      (page > this.lastPage) ? this.lastPage : page;

    if (page !== this.actualPage) {
      this.actualPage = page;
      this.launchSearch();
    }
  }

  public setLimit() {
    this.actualPage = 0;
    this.launchSearch();
  }
}
