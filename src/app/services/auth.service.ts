import { AuthConfig, OAuthService } from 'angular-oauth2-oidc';
import { Injectable } from '@angular/core';

import { environment } from 'src/environments/environment';
import { ActivatedRoute, Route } from '@angular/router';


const oAuthConfig: AuthConfig = {
  issuer: environment.GOOGLE_ISSUER,
  strictDiscoveryDocumentValidation: false,
  redirectUri: window.location.origin+'/dashboard',
  clientId: environment.GOOGLE_CLIENT_ID,
  scope: 'openid profile email'
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private readonly oAuthService: OAuthService, private route: ActivatedRoute) {
    this.oAuthService.configure(oAuthConfig)
    this.oAuthService.logoutUrl = "https://www.google.com/accounts/Logout"
    this.oAuthService.loadDiscoveryDocument().then(()=>{
      this.oAuthService.tryLoginImplicitFlow().then(() => {
        if (!this.oAuthService.hasValidAccessToken()) {
          this.oAuthService.initLoginFlow()
        } else {
          this.oAuthService.loadUserProfile().then( (userProfile) => {
          })
        }
      })
    })
  }

  isLoggedIn(): boolean {
    return this.oAuthService.hasValidAccessToken()
  }

  checkLogIn() {
    // this.oAuthService.tryLogin()
    this.route.queryParams.subscribe(params => {
      const state = params['state'];
      const code = params['code']

    });
  }

  signIn() {

  }

  signOut() {
    const idTokenHint  = this.oAuthService.getIdToken();
    this.oAuthService.logOut({idTokenHint })
  }
}
