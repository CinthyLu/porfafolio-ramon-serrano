import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { storage } from '../firebase';
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

@Component({
  selector: 'app-upmedia',
  imports: [CommonModule],
  templateUrl: './upmedia.html',
  styleUrl: './upmedia.scss',

})
export class Upmedia {
 mediaUrl: string | null = null;
  mediaType: 'image' | 'video' | null = null;

  async onFileSelected(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const ruta = `uploads/${Date.now()}_${file.name}`;
    const archivoRef = ref(storage, ruta);

    const res = await uploadBytes( archivoRef , file);
    //
  }
}
