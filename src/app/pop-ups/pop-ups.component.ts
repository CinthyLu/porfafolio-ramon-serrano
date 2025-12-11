import { Component, ElementRef, ViewChild, viewChild } from '@angular/core';

@Component({
  selector: 'app-pop-ups',
  standalone: true,
  imports: [],
  templateUrl: './pop-ups.component.html',
  styleUrl: './pop-ups.component.scss'
})
export class PopUpsComponent {
  mensaje = "Mensaje de prueba para errores y exitos";

    @ViewChild('success') success!: ElementRef;
    @ViewChild('error') error!: ElementRef;

    desplegarSuccess(contenido: string  ){
      this.mensaje = contenido;
      this.success.nativeElement.classList.remove("hide-pop")
      setTimeout(()=>{console.log("retirando");this.success.nativeElement.classList.add("hide-pop");},1500)
    }

    desplegarError(contenido: string  ){
      this.mensaje = contenido;
      this.error.nativeElement.classList.remove("hide-pop")
      setTimeout(()=>{console.log("retirando");this.error.nativeElement.classList.add("hide-pop");},1500)
    }
}
