import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    const url = state.url;
    if (url == '' || url.startsWith('/?')) {
      return true; // Permite acessar a página inicial e URLs com parâmetros
    } else {
      // Redireciona para a página inicial (rota '') quando a rota for vazia ('')
      this.router.navigate(['']);
      return false;
    }
  }
}
