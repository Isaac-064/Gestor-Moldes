import { Component, inject, OnInit } from '@angular/core';
import { Element } from 'src/app/models/element.model';
import { User } from 'src/app/models/user.model';
import { FirebaseService } from 'src/app/services/firebase.service';
import { UtilsService } from 'src/app/services/utils.service';
import { AddUpdateElementComponent } from 'src/app/shared/components/add-update-element/add-update-element.component';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {

  firebaseSvc = inject(FirebaseService);
  utilsSvc = inject(UtilsService);

  elements: Element[] = [];

  ngOnInit() {
  }
  user(): User{
    return this.utilsSvc.getFromLocalStorage('user');
  }
  ionViewWillEnter(){
    this.getElements();
  }

  // ==========  Obtener los elementos ==========
  getElements(){
    let path = `users/${this.user().uid}/elements`;
    let sub = this.firebaseSvc.getCollectionData(path).subscribe({
      next: (res: any) =>{
        console.log(res);
        this.elements = res;
        sub.unsubscribe();
      }
    })
  }

  // ========== Agregr o Actualizar Elemento ==========
  async addUpdateElement(element?: Element){
    let success = await this.utilsSvc.presentModal({
      component: AddUpdateElementComponent,
      cssClass: 'add-update-modal',
      componentProps: { element }
    })
    if(success)  this.getElements();
  }

  
  // ========== Eliminar Producto ==========
  async deleteElement(element : Element){
    let path = `users/${this.user().uid}/elements/${element.id}`
    const loading = await this.utilsSvc.loading();
    await loading. present();
    let imagePath = await this.firebaseSvc.getFilePath(element.image);
    await this.firebaseSvc.deleteFile(imagePath);
    this.firebaseSvc.deleteDocument(path).then(async res => {
      this.elements = this.elements.filter(e => e.id != element.id);
      this.utilsSvc.presentToast({
        message: 'Elemento eliminado exitosamente',
        duration: 1500,
        color: "success",
        position: "middle",
        icon: "checkmark-circle-outline"
      })
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
