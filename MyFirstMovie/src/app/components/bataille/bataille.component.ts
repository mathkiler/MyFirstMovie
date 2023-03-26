import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/api.service';
import { IDBataille } from 'src/app/bataille';
import { AuthService } from "../../shared/services/auth.service";
import { DataService } from 'src/app/data.service';
import { collection, getCountFromServer, getFirestore } from 'firebase/firestore';
@Component({
  selector: 'app-bataille',
  templateUrl: './bataille.component.html',
  styleUrls: ['./bataille.component.css']
})



export class BatailleComponent implements OnInit {
  public idMovie1:number = -1
  public idMovie2:number = -1
  public nameMovie1 = ""
  public nameMovie2 = ""
  public jpgMovie1 = ""
  public jpgMovie2 = ""
  public urlImage1 = ""
  public urlImage2 = ""
  public pourcent1 = 0
  public pourcent2 = 0
  public hiddePourcent = true
  afs: any;
  constructor(
    public apiService:APIService, public authService: AuthService,public dataService: DataService
  ) { }
  ngOnInit() { 
    this.getMvi()
  }
  public async getMvi(){
    let long = 1
    const firestore = getFirestore();
    const userCollectionReference = collection(firestore, "bataille");
    const userCollectionSnapshot = await getCountFromServer(userCollectionReference);
    long = userCollectionSnapshot.data().count;
    let last_bataille = this.dataService.getBataille(long-1)
    let last_bataille_json = JSON.parse(JSON.stringify((await last_bataille).data()))


    let add_a_bataille = false
    if (last_bataille_json["date_fin"] >= new Date().getTime()) {
      this.idMovie1 = Math.floor(Math.random() * 500);
      this.idMovie2 = Math.floor(Math.random() * 500);
      add_a_bataille = true
    }
    else {
      this.idMovie1 = last_bataille_json["id_movie1"];
      this.idMovie2 = last_bataille_json["id_movie2"];
    }


    this.apiService.getMovie(this.idMovie1).subscribe(a => {
      let tamp = JSON.parse(JSON.stringify(a))
      console.log("lepass : ", tamp)
      this.nameMovie1 = tamp["title"]
      this.jpgMovie1 = tamp["poster_path"]
      if (this.jpgMovie1 == null) {
        this.getMvi()
        add_a_bataille = false
        return
      }
      this.getImg(1, add_a_bataille)
    },(error) => {
      this.getMvi()
      return
    })
    
      this.apiService.getMovie(this.idMovie2).subscribe(b => {
        let tamp = JSON.parse(JSON.stringify(b))
        this.nameMovie2 = tamp["title"]
        this.jpgMovie2 = tamp["poster_path"]
        if (this.jpgMovie2 == null) {
          this.getMvi()
          add_a_bataille = false
          return
        }
        this.getImg(2, add_a_bataille)
    },(error) => {
      this.getMvi()
      return
    })
    if (this.hiddePourcent == false) 
      this.calcVote()
    
  }
  public getImg(num_film:number, add_a_bataille: boolean){
    if ( num_film == 1 ) {
    this.urlImage1 = this.apiService.getImageMovie(this.jpgMovie1)
    }
    else {
    this.urlImage2 = this.apiService.getImageMovie(this.jpgMovie2)

      if ( add_a_bataille && this.urlImage1 != "" && this.urlImage2 != "" && this.urlImage1 != this.urlImage2) {
        this.dataService.addMovie(this.idMovie1, this.urlImage1, this.idMovie2, this.urlImage2, new Date().getTime()+60*60*1000)
      }
    }}

    public plus1VoteFilm1() {

      this.dataService.updateVote(1)
      this.calcVote()
      this.hiddePourcent = false
    }

    public plus1VoteFilm2() {

      this.dataService.updateVote(2)
      this.calcVote()
      this.hiddePourcent = false
    }

   public async calcVote() {
      let long = 1
      const firestore = getFirestore();
      const userCollectionReference = collection(firestore, "bataille");
      const userCollectionSnapshot = await getCountFromServer(userCollectionReference);
      long = userCollectionSnapshot.data().count;
      let last_bataille = this.dataService.getBataille(long-1)
      let last_bataille_json = JSON.parse(JSON.stringify((await last_bataille).data()))
        console.log(last_bataille_json["nombre_vote1"])
        this.pourcent1 = Math.round(100*last_bataille_json["nombre_vote1"]/(last_bataille_json["nombre_vote1"]+last_bataille_json["nombre_vote2"]))
        this.pourcent2 = Math.round(100*last_bataille_json["nombre_vote2"]/(last_bataille_json["nombre_vote1"]+last_bataille_json["nombre_vote2"]))
      document.documentElement.style.setProperty('--pourcent1-width', this.pourcent1.toString()+"%")
      document.documentElement.style.setProperty('--pourcent2-width', this.pourcent2.toString()+"%")
    }
  

}
