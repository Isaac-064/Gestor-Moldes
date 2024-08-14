import { Component, inject, OnInit } from '@angular/core';
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

  ngOnInit() {
  }

  // ==========  Cerrar Sesion ==========
  SignOut(){
    this.firebaseSvc.SignOut();
  }

  // ========== Agregr o Actualizar Elemento ==========
  addUpdateElement(){
    this.utilsSvc.presentModal({
      component: AddUpdateElementComponent,
      cssClass: 'add-update-modal'
    })
  }

}
