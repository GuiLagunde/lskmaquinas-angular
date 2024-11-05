import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './layout/footer/footer.component';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { HomeComponent } from './home/home.component';
import { ClientesListaComponent } from './clientes/clientes-lista/clientes-lista.component';
import { HttpClientModule } from '@angular/common/http';
import { ButtonComponent } from './componentes/button/button.component';
import { ClientesCadastroComponent } from './clientes/clientes-cadastro/clientes-cadastro.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule, DatePipe } from '@angular/common';
import { MovimentacoesFinanceirasComponent } from './movimentacoes-financeiras/movimentacoes-financeiras.component';
import { ServicosListaComponent } from './servicos/servicos-lista/servicos-lista.component';
import { ServicosCadastroComponent } from './servicos/servicos-cadastro/servicos-cadastro.component';
import { ServicosComponent } from './servicos/servicos/servicos.component';
import { ServicosItensCadastroComponent } from './servicos/servicos-itens-cadastro/servicos-itens-cadastro.component';
import { InputMaskModule } from 'primeng/inputmask';
import { InputNumberModule } from 'primeng/inputnumber';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';


@NgModule({
  declarations: [
    AppComponent,
    FooterComponent,
    NavbarComponent,
    SidebarComponent,
    HomeComponent,
    ClientesListaComponent,
    ButtonComponent,
    ClientesCadastroComponent,
    MovimentacoesFinanceirasComponent,
    ServicosListaComponent,
    ServicosCadastroComponent,
    ServicosComponent,
    ServicosItensCadastroComponent,
   
  ],
  imports: [
    FormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    CommonModule,
    DatePipe,
    InputMaskModule,
    InputNumberModule,
    ToastModule
  ],
  providers: [DatePipe, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }
