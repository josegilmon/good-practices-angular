///<reference path="../../../node_modules/@angular/core/src/metadata/directives.d.ts"/>
import {Md5} from 'ts-md5';
import {HttpClient} from '@angular/common/http';
import {Observable} from 'rxjs/Observable';
import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

import 'rxjs/add/operator/concatMap';
import 'rxjs/add/observable/of';
import { AuthToken } from '../core/auth-token';

@Component({
  // tslint:disable-next-line:component-selector
  selector: 'detail-page',
  templateUrl: `heroe-detail.component.html`,
  styleUrls: [`heroe-detail.component.css`]
})
export class DetailComponent {

  private _configToken: AuthToken;
  private _urlDetails: string;
  private _urlComics: string;
  private _urlSeries: string;
  private _limit = 5;

  public hero: Hero;
  public comics: MarvelElements[];
  public series: MarvelElements[];
  public loadingImage = true;
  public loadingComics = true;
  public loadingSeries = true;

  public comicsPage = 0;
  public comicsLastPage = 0;

  public seriesPage = 0;
  public seriesLastPage = 0;

  constructor(
    private _http: HttpClient,
    private _router: ActivatedRoute,
    private _navRouter: Router
  ) {

    let id: string;

    this._configToken = {
      marvelPublicKey: '5b19ff35a6b2a9a58fe860448cc82161',
      marvelPrivateKey: '7f2d73992caae0b0563c716172f39ecb546672b4'
    };

    id = this._router.snapshot.params.id;

    this._urlDetails = `https://gateway.marvel.com/v1/public/characters/${id}`;
    this._urlComics = `${this._urlDetails}/comics`;
    this._urlSeries = `${this._urlDetails}/series`;

    this._getUrl(this._urlDetails)
      .concatMap((url: string) => this._http.get(url))
      .concatMap((result: any) => {
        this.hero = {
          id: result.data.results[0].id,
          name: result.data.results[0].name,
          description: result.data.results[0].description,
          image: `${result.data.results[0].thumbnail.path}.${result.data.results[0].thumbnail.extension}`
        };

        this.loadingImage = false;
        return Observable.of(this.hero);
      })
      .subscribe(
        () => {},
        (err) => { throw new Error(err); }
      );

    this._getComics();
    this._getSeries();
  }

  private _getUrl(url: string, limit?: number, page?: number): Observable<string> {
    let ts: string;
    let hash: string;
    let apikey: string;

    let finalUrl: string;

    const md5: Md5 = new Md5();

    ts = new Date().getTime().toString();
    apikey = this._configToken.marvelPublicKey;

    md5.appendStr(ts);
    md5.appendStr(this._configToken.marvelPrivateKey);
    md5.appendStr(this._configToken.marvelPublicKey);

    hash = md5.end().toString();

    finalUrl = `${url}?ts=${ts}&hash=${hash}&apikey=${apikey}`;

    finalUrl = finalUrl + ((limit != null) ? `&limit=${limit}` : '');
    finalUrl = finalUrl + ((page != null) ? `&offset=${page * limit}` : '');

    return Observable.of(finalUrl);
  }

  private _getComics() {
    this.loadingComics = true;
    this._getUrl(this._urlComics, this._limit, this.comicsPage)
      .concatMap((url: string) => this._http.get(url))
      .subscribe((result: any) => {
        this.comicsLastPage = Math.ceil(result.data.total / this._limit) - 1;
        this.comics = result.data.results.map((marvelComic: any) => {
          const comic: MarvelElements = {
            id: marvelComic.id,
            title: marvelComic.title,
            description: (marvelComic.description) ? `${marvelComic.description.substring(0, 50)}...` : ''
          };

          return comic;
        });

        this.loadingComics = false;
      });
  }

  private _getSeries() {
    this.loadingSeries = true;
    this._getUrl(this._urlSeries, this._limit, this.seriesPage)
      .concatMap((url: string) => this._http.get(url))
      .subscribe((result: any) => {
        this.seriesLastPage = Math.ceil(result.data.total / this._limit) - 1;
        this.series = result.data.results.map((marvelSerie: any) => {
          const serie: MarvelElements = {
            id: marvelSerie.id,
            title: marvelSerie.title,
            description: (marvelSerie.description) ? `${marvelSerie.description.substring(0, 50)}...` : ''
          };

          return serie;
        });

        this.loadingSeries = false;
      });
  }

  public goHome() {
    this._navRouter.navigateByUrl('heroes-search');
  }

  public setComicPage(page: number) {
    this.comicsPage = (page < 0) ? 0 :
      (page > this.comicsLastPage) ? this.comicsLastPage : page;

    this._getComics();
  }

  public setSeriesPage (page: number) {
    this.seriesPage = (page < 0) ? 0 :
      (page > this.seriesLastPage) ? this.seriesLastPage : page;

    this._getSeries();
  }
}
