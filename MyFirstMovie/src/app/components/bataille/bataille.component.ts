import { Component, OnInit } from '@angular/core';
import { APIService } from 'src/app/api.service';
import { IDBataille } from 'src/app/bataille';
import { AuthService } from "../../shared/services/auth.service";
import { DataService } from 'src/app/data.service';
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
  afs: any;
  constructor(
    public apiService:APIService, public authService: AuthService,public dataService: DataService
  ) { }
  ngOnInit() { 
    console.log('iniiiiiit')
  }
  public getMvi(){
    
    this.idMovie1 = Math.floor(Math.random() * 500);
    this.apiService.getMovie(this.idMovie1).subscribe(a => {
      let tamp = JSON.parse(JSON.stringify(a))
      this.nameMovie1 = tamp["title"]
      this.jpgMovie1 = tamp["poster_path"]
      this.getImg(1)
    })
    this.idMovie2 = Math.floor(Math.random() * 500);
      this.apiService.getMovie(this.idMovie2).subscribe(b => {
        let tamp = JSON.parse(JSON.stringify(b))
        this.nameMovie2 = tamp["title"]
        this.jpgMovie2 = tamp["poster_path"]
        this.getImg(2)
    })
    
  }
  public getImg(num_film:number){
    if ( num_film == 1 ) {
    this.urlImage1 = this.apiService.getImageMovie(this.jpgMovie1)
      // if (this.jpgMovie == null) {
      //   this.getMvi()
      // }
    }
    else {
    this.urlImage2 = this.apiService.getImageMovie(this.jpgMovie2)
      console.log(this.urlImage2)
      // if (this.jpgMovie == null) {
      //   this.getMvi()
      // }
      this.dataService.addMovie(this.idMovie1, this.urlImage1, this.idMovie2, this.urlImage2)
    }}
  

}
