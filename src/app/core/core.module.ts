import { NgModule, SkipSelf, Optional } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';

import { AUTH_CONFIGURATION, authConfiguration } from './auth.configuration';

@NgModule({
  imports: [
    HttpClientModule
  ],
  providers: [
    { provide: AUTH_CONFIGURATION, useFactory: authConfiguration, deps: [HttpClient] }
  ]
})
export class CoreModule {
  constructor (@SkipSelf() @Optional() _parent: CoreModule) {
    if (_parent) {
      throw new Error('The core module can only be injected once');
    }
  }
}
