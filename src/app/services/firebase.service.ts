import { inject, Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { createUserWithEmailAndPassword, getAuth, signInWithEmailAndPassword, updateProfile, sendPasswordResetEmail } from 'firebase/auth'
import { User } from '../models/user.model';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { getFirestore, setDoc, doc, getDoc, addDoc, collection, collectionData, query, updateDoc } from '@angular/fire/firestore';
import { UtilsService } from './utils.service';
import { AngularFireStorage } from '@angular/fire/compat/storage';
import { getStorage, uploadString, ref, getDownloadURL } from "firebase/storage";

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  auth = inject(AngularFireAuth);
  firestore = inject(AngularFirestore);
  storage = inject(AngularFireStorage);
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
  // ========== Obtener documentos de una coleccion ==========
  getCollectionData(path: string, collectionQuery?: any){
    const ref = collection(getFirestore(), path);
    return collectionData(query(ref, collectionQuery), {idField: 'id'})
  }
  // ========== Setear un Documento ==========
  setDocument(path: string, data: any){
    return setDoc(doc(getFirestore(), path), data);
  }
  // ========== Actualizar un Documento ==========
  updateDocument(path: string, data: any){
    return updateDoc(doc(getFirestore(), path), data);
  }
  // ========== Obtener un Documento ==========
  async getDocument(path: string){
    return (await getDoc(doc(getFirestore(), path))).data();
  }
  // ========== Agregar un Documento ==========
  addDocument(path: string, data: any){
    return addDoc(collection(getFirestore(), path), data);
  }

  // ==================== Almacenamiento ====================
  // ========== Subir imagen ==========
  async uploadImage(path: string, data_url: string){
    return uploadString(ref(getStorage(), path), data_url, 'data_url').then(() =>{
      return getDownloadURL(ref(getStorage(), path))
    })
  }
  async getFilePath(url: string){
    return ref(getStorage(), url).fullPath
  }
}
