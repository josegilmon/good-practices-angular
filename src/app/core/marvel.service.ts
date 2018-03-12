import { Inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Md5 } from 'ts-md5';
import { AuthToken } from './auth-token';
import { AUTH_CONFIGURATION } from './auth.configuration';

@Injectable()
export class MarvelService {

  private _configToken: AuthToken;
  private _url: string;

  constructor(private http: HttpClient) {

    this._configToken = {
      marvelPublicKey: '5b19ff35a6b2a9a58fe860448cc82161',
      marvelPrivateKey: '7f2d73992caae0b0563c716172f39ecb546672b4'
    };

    this._url = 'https://gateway.marvel.com/v1/public/characters';
  }

  getHeroes(heroName: string, limit: number, actualPage: number) {
    return this.http.get(this._formUrl(heroName, limit, actualPage));
  }

  private _formUrl(heroName: string, limit: number, actualPage: number) {

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

    finalUrl = `${this._url}?nameStartsWith=${heroName}&limit=${limit}&offset=${actualPage * limit}`;
    finalUrl = `${finalUrl}&ts=${ts}&hash=${hash}&apikey=${apikey}`;

    return finalUrl;
  }

}
