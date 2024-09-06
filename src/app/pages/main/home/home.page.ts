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

}
