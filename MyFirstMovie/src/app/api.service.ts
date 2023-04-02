import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IDBataille } from './bataille';

@Injectable({
  providedIn: 'root'
})
export class APIService {
  public baseurl = 'https://api.themoviedb.org/3/';
  public baseurlimage = 'https://image.tmdb.org/t/p/';
  public apikey = "?api_key=1beca4164532e3c24e7afa6582015516";
  constructor(private http: HttpClient) {} 
    getMovie(id:number): Observable<IDBataille> {
      return this.http.get<IDBataille>(this.baseurl + 'movie/' + id + this.apikey)
    }
    getImageMovie(jpg:any): string {
      return this.baseurlimage + "w342" + jpg
    }
}
