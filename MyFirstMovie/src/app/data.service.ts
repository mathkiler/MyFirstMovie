import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { IDBataille } from './bataille';
import { getCountFromServer, getFirestore, collection } from 'firebase/firestore';
import { AuthService } from './shared/services/auth.service';

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

   async addMovie(idMovie1:number, jpgMovie1:string,idMovie2:number, jpgMovie2:string, dateTime:number) {
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
        nombre_vote2: 0,
        date_fin: dateTime
      })
   }

    getBataille(long: number) {
  let last_bataille = (this.db.collection(this.dbPath).doc(long.toString()).ref.get())
  return last_bataille 
  }

  async updateVote(qui_vote:number) {
    let long = 1
    const firestore = getFirestore();
  const userCollectionReference = collection(firestore, "bataille");
  const userCollectionSnapshot = await getCountFromServer(userCollectionReference);
  long = userCollectionSnapshot.data().count-1;
  const collect = (await this.db.collection(this.dbPath).doc(long.toString()).ref.get()).data()
    let tamp = JSON.parse(JSON.stringify(collect))
    let nb_vote1 = tamp["nombre_vote1"]
    let nb_vote2 = tamp["nombre_vote2"]

  if (qui_vote == 1)
    this.db.collection(this.dbPath).doc(long.toString()).update({nombre_vote1:nb_vote1+1})
  else 
    this.db.collection(this.dbPath).doc(long.toString()).update({nombre_vote2:nb_vote2+1})

    // this.db.collection("/users").doc(users).update({nombre_vote2:nb_vote2+1})

 


  }


}
