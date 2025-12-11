import { Component, ElementRef, ViewChild } from '@angular/core';

@Component({
  selector: 'app-confirm-dialogs',
  standalone: true,
  imports: [],
  templateUrl: './confirm-dialogs.component.html',
  styleUrl: './confirm-dialogs.component.scss'
})
export class ConfirmDialogsComponent {
 mensaje = "Mensaje de prueba para confirmar acciones";

 @ViewChild('cuadro') cuadro!: ElementRef;

 desplegarConfirmacion(contenido: string, metodo: () => void){
  this.mensaje = contenido;
  this.cuadro.nativeElement.classList.remove("hide-pop");
  this.funcion = metodo;
  }

  funcion: () => void = () => {
    console.log("Ejecutando función...");
  };
  

  Aceptar(){
    console.log("retirando");this.cuadro.nativeElement.classList.add("hide-pop");
    this.funcion();
  }

  Denegar(){
    console.log("retirando");this.cuadro.nativeElement.classList.add("hide-pop");
    
  }
}
