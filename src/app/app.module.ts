import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './layout/footer/footer.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HomeComponent } from './home/home.component';
import { ClientesListaComponent } from './clientes/clientes-lista/clientes-lista.component';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { DataTableComponent } from './componentes/data-table/data-table.component';
import { HttpClientModule } from '@angular/common/http';
import { ButtonComponent } from './componentes/button/button.component';
import { ClientesCadastroComponent } from './clientes/clientes-cadastro/clientes-cadastro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    HomeComponent,
    ClientesListaComponent,
    DataTableComponent,
    ButtonComponent,
    ClientesCadastroComponent,
  ],
  imports: [
    FormsModule,
    BrowserModule,
    ReactiveFormsModule,
    AppRoutingModule,
    NgxDatatableModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
