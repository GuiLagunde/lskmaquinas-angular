import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ClientesListaComponent } from './clientes/clientes-lista/clientes-lista.component';
import { ClientesCadastroComponent } from './clientes/clientes-cadastro/clientes-cadastro.component';

const routes: Routes = [

  { path: '', component: HomeComponent },
  { path: 'clientes', component: ClientesListaComponent},
  { path: 'clientes/cadastro', component: ClientesCadastroComponent},
  { path: 'clientes/cadastro/:id', component: ClientesCadastroComponent},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
