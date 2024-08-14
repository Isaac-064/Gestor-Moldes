import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth'
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  utilsSvc = inject(UtilsService);

  // ==================== Autenticaciòn ====================
  getAuth(){
    return getAuth();
  }
  // ========== Acceder ==========
  signIn(user: User){
    return signInWithEmailAndPassword(getAuth(), user.email, user.password);
  }
  // ========== Crear Usuario ==========
  signUp(user: User){
    return createUserWithEmailAndPassword(getAuth(), user.email, user.password);
  }
  // ========== Actualizar Usuario ==========
  updateUser(displayName: string){
    return updateProfile(getAuth().currentUser, {displayName})
  }
  // ========== Restablecer Contraseña ==========
  sendRecoveryEmail(email: string){
    return sendPasswordResetEmail(getAuth(), email);
  }
  // ==========  Cerrar Sesion ==========
  SignOut(){
    getAuth().signOut();
    localStorage.removeItem('user');
    this.utilsSvc.routerLink('/auth');
  }

  // ==================== Base de Datos ====================
  // ========== Setear un Documento ==========
  setDocument(path: string, data: any){
    return setDoc(doc(getFirestore(), path), data);
  }
  // ========== Obtener un Documento ==========
  async getDocument(path: string){
    return (await getDoc(doc(getFirestore(), path))).data();
  }
}
