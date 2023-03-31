import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/api.service';
import { IDBataille } from 'src/app/bataille';
import { AuthService } from "../../shared/services/auth.service";
import { DataService } from 'src/app/data.service';
import { collection, getCountFromServer, getFirestore } from 'firebase/firestore';
import { AngularFirestore } from '@angular/fire/compat/firestore';
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
  public bannedId: number[] = [0,1,4,7,9,10,23,29,30,31,32,34,36,37,39,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,56,57,60,61,72,84,119,130,131,317,151,181,188,202,208,209,210,230,263,264,282,283,286,295,304,305, 323,324,325,328,352,353,354,355,356,357,358,359,360,361,362,365,366,367,368,369,370,371,372,373,374,374,375,376,282,384,385,386,394,399,412,413,415,416,417,418,420,432,443,444,447,448,449,450,456,461,363,472,474,477,478,484,485,486,487,495,498]
  afs: any;
  constructor(
    public apiService:APIService, public authService: AuthService,public dataService: DataService, private db: AngularFirestore
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
    if (last_bataille_json["date_fin"] <= new Date().getTime()) {

      let passage = false
      while (passage == false) {
        passage = true
        this.idMovie1 = Math.floor(Math.random() * 500);
        this.idMovie2 = Math.floor(Math.random() * 500);
        for(let idx =0; idx < this.bannedId.length; idx++) {
          if (this.bannedId[idx] == this.idMovie1 || this.bannedId[idx] == this.idMovie2) {
            passage = false
          }  
      }

      }
      add_a_bataille = true
    }
    else {
      this.idMovie1 = last_bataille_json["id_movie1"];
      this.idMovie2 = last_bataille_json["id_movie2"];
    }


    
    this.apiService.getMovie(this.idMovie1).subscribe(a => {
      let tamp = JSON.parse(JSON.stringify(a))
      this.nameMovie1 = tamp["title"]
      this.jpgMovie1 = tamp["poster_path"]
      console.log("lepass : ", this.nameMovie1, this.jpgMovie1)
      this.getImg1()
    })
    
      this.apiService.getMovie(this.idMovie2).subscribe(b => {
        let tamp = JSON.parse(JSON.stringify(b))
        this.nameMovie2 = tamp["title"]
        this.jpgMovie2 = tamp["poster_path"]
        console.log("lepass2 : ", this.nameMovie2, this.jpgMovie2)
        this.getImg2(add_a_bataille)
      })
    return add_a_bataille
 
  }



  public getImg1(){
    this.urlImage1 = this.apiService.getImageMovie(this.jpgMovie1)
  }

  public async getImg2(add_a_bataille:boolean) {
    this.urlImage2 = this.apiService.getImageMovie(this.jpgMovie2)
    let minus_one = 1
    if ( add_a_bataille ) {
      await this.dataService.addMovie(this.idMovie1, this.urlImage1, this.idMovie2, this.urlImage2, new Date().getTime()+60*3*1000)
      minus_one = 0
    }



    let long = 1
    const firestore = getFirestore();
    const userCollectionReference = collection(firestore, "bataille");
    const userCollectionSnapshot = await getCountFromServer(userCollectionReference);
    long = userCollectionSnapshot.data().count;
    let last_bataille = this.dataService.getBataille(long-minus_one)
    let last_bataille_json = JSON.parse(JSON.stringify((await last_bataille).data()))

    console.log("----------", last_bataille_json)
    

    let info_user = await this.dataService.getUsers()
    console.log("yyyyyyyyyyyyyyyy", add_a_bataille, info_user["uid"])

    
    
    console.log("iciii", info_user["voteVoter"], last_bataille_json["date_fin"], info_user["dateFinBatailleActu"], info_user)
    if (info_user["voteVoter"]) {
      if (info_user["dateFinBatailleActu"] != last_bataille_json["date_fin"]) {
        this.db.collection("/users").doc(info_user["uid"]).update({dateFinBatailleActu:last_bataille_json["date_fin"]})
        this.db.collection("/users").doc(info_user["uid"]).update({voteVoter:false})
        this.hide("hiddepourcentage")
      }
      else {
        this.calcVote()
      }
    }
    else {
      this.hide("hiddepourcentage")
    }
    }

    public async plus1VoteFilm1() {
      let test_add_a_bataille = await this.getMvi()
      if (test_add_a_bataille == false) {
          await this.dataService.updateVote(1)
          this.calcVote()
          this.hiddePourcent = false
      }
    }

    public async plus1VoteFilm2() {
      let test_add_a_bataille = await this.getMvi()
      if (test_add_a_bataille == false) {
        await this.dataService.updateVote(2)
        this.calcVote()
        this.hiddePourcent = false
      }
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
      this.show("hiddepourcentage")
    }
  

    hide(id:string) {
      var x = document.getElementById(id);
        if(x!=null)
        {
          x.hidden = true
      }}
  
    show(id:string) {
      var x = document.getElementById(id);
        if(x!=null)
        {
          x.hidden = false
      }}


}



