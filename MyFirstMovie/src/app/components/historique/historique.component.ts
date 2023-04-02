import { Component } from '@angular/core';
import { collection, getCountFromServer, getFirestore } from 'firebase/firestore';
import { DataService } from 'src/app/data.service';
import { APIService } from 'src/app/api.service';

@Component({
  selector: 'app-historique',
  templateUrl: './historique.component.html',
  styleUrls: ['./historique.component.css']
})
export class HistoriqueComponent {

  pourcent1=10;
  page = 0;
  pageAfiche=5
  maxpage=0
  constructor(
    public apiService:APIService,  public dataService: DataService
  ) { }


  async ngOnInit() {
    await this.getListHistorique();
   }

   public changePage(i:number)
   {
    this.page=this.page+i;
    this.getListHistorique();
   }

   async getListHistorique()
   {








    

    this.old_bataille = []
    let long = 1
    const firestore = getFirestore();
    const userCollectionReference = collection(firestore, "bataille");
    const userCollectionSnapshot = await getCountFromServer(userCollectionReference);
    long = userCollectionSnapshot.data().count;
    this.maxpage = Math.round(long/this.pageAfiche)-1
    for(let i = 0; i < Math.min(this.pageAfiche,long-1-this.page*5) ; i++)
    {
      console.log(i)
      let last_bataille = this.dataService.getBataille(long-1-i-this.page*5)
      console.log(last_bataille)
      let last_bataille_json = JSON.parse(JSON.stringify((await last_bataille).data()))
      await this.setname (last_bataille_json["id_movie1"],last_bataille_json["id_movie2"],i)
      last_bataille_json.percent = Math.round(100*last_bataille_json.nombre_vote1/(last_bataille_json.nombre_vote1 + last_bataille_json.nombre_vote2))
      console.log(last_bataille_json.nombre_vote2)
      console.log(last_bataille_json.nombre_vote1)
      console.log(last_bataille_json.percent)
      last_bataille_json.sizeBar1= 50 //(100*last_bataille_json.percent).toString
      last_bataille_json.sizeBar2= 20 //(100*(1-last_bataille_json.percent)).toString

      this.old_bataille.push(last_bataille_json)
      

    }
    console.log(this.old_bataille)

    if(this.page<1)
    {
      this.hide("myDIV")
    }
    else{
      this.show("myDIV")
    }
    
    if(long-1-this.page*5-5<1)
    {
      this.hide("myDIV2")
    }
    else{
      this.show("myDIV2")
    }

    return(this.old_bataille)
   }

  hide(id:string) {
    
    var x = document.getElementById(id);
      console.log(x)
      if(x!=null)
      {
   
        x.hidden = true
    }

  }

  show(id:string) {
    
    var x = document.getElementById(id);
      console.log(x)
      if(x!=null)
      {
   
        x.hidden = false
    }

  }

   public old_bataille:Array<{   
    date_fin
    :number,
    id_movie1
    :number,
    id_movie2
    :number,
    nombre_vote1
    :number,
    nombre_vote2
    :number,
    url_image1
    :String,
    url_image2
    :String,
    name1
    :String,
    name2
    :String,
    percent
    :number,
    sizeBar1
    :String,
    sizeBar2
    :String
  
  }> = [
];

public async setname (idMovie1:number, idMovie2:number, i :number)
{

  this.apiService.getMovie(idMovie1).subscribe(b => {
    let tamp =  JSON.parse(JSON.stringify(b));
    let nameMovie1 = tamp["title"];
    this.old_bataille[i].name1 = nameMovie1;
    console.log(nameMovie1)
    
  }, (error) => {

    
  })

  this.apiService.getMovie(idMovie2).subscribe(b => {
    let tamp =  JSON.parse(JSON.stringify(b));
    let nameMovie2 = tamp["title"];
    this.old_bataille[i].name2 = nameMovie2;
    console.log(nameMovie2)
    
  }, (error) => {

    
  })

}
  

}
