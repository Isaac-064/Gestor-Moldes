import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';

@Component({
  selector: 'app-add-update-element',
  templateUrl: './add-update-element.component.html',
  styleUrls: ['./add-update-element.component.scss'],
})
export class AddUpdateElementComponent  implements OnInit {

  form = new FormGroup({
    id: new FormControl(''),
    image: new FormControl('', [Validators.required]),
    Nmolde: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    family: new FormControl('', [Validators.required]),
    model: new FormControl('', [Validators.required]),
    Npart: new FormControl('', [Validators.required]),
    state: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    shoots: new FormControl('', [Validators.required]),
    mttoPrev: new FormControl('', [Validators.required]),
    coments: new FormControl('', [Validators.required]),
  })

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  ngOnInit() { }

  // ******************** Tomar / Seleccionar Imagen ********************
  async takeImage(){
    const dataUrl = (await this.utilsSvc.takePicture('Imagen del molde')).dataUrl;
    this.form.controls.image.setValue(dataUrl);
  }

  async submit(){
    if (this.form.valid) {
      const loading = await this.utilsSvc.loading();
      await loading. present();
      this.firebaseSvc.signUp(this.form.value as User).then(async res => {
        
      }).catch(error =>{
        this.utilsSvc.presentToast({
          message: error.message,
          duration: 2500,
          color: "primary",
          position: "middle",
          icon: "alert-circle-outline"
        })
      }).finally(() => {
        loading.dismiss();
      })
    }
  }

}
