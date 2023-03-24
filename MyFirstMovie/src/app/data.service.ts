import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { IDBataille } from './bataille';
import { getCountFromServer, getFirestore, collection } from 'firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private dbPath = "/bataille";
  movieRef: AngularFirestoreCollection<IDBataille>;

  constructor(private db: AngularFirestore) {
    this.movieRef = db.collection(this.dbPath);
   }

   getAllMovie(): AngularFirestoreCollection<IDBataille> {
    return this.movieRef;
   }

   async addMovie(idMovie1:number, jpgMovie1:string,idMovie2:number, jpgMovie2:string) {
    let long = 1
    const firestore = getFirestore();
  const userCollectionReference = collection(firestore, "bataille");
  const userCollectionSnapshot = await getCountFromServer(userCollectionReference);
  long = userCollectionSnapshot.data().count;
      this.db.collection(this.dbPath).doc(long.toString()).set({
        id_movie1: idMovie1,
        url_image1: jpgMovie1,
        url_image2: jpgMovie2,
        id_movie2: idMovie2,
        nombre_vote1: 0,
        nombre_vote2: 0
      })
   }
   
}
