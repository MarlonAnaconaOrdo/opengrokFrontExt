import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environment/environment';
import { MethodCallpOut, resultResponse, results ,entity} from '../models/interface';

@Injectable({
  providedIn: 'root'
})
export class HttpServicesService {

  baseUrl= environment.url
  baseUrlOpengrok=environment.urlOpengrok
  constructor(private httpClient:HttpClient) { }


  getMethodByName(method:string): Observable<resultResponse>{

    return this.httpClient.get<resultResponse>(this.baseUrl+'findMethods/'+method)
  }



  CallHierrarchy(data:resultResponse): Observable<MethodCallpOut>{
    return this.httpClient.post<MethodCallpOut>(this.baseUrl+'callHierarchy',data)
  }

  getTablesByProyect(idProyect:number): Observable<entity[]>{  
    return this.httpClient.get<entity[]>(this.baseUrl+'getTables/'+idProyect)
  }


}
