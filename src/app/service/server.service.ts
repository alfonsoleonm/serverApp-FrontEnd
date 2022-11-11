import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, tap, throwError } from 'rxjs';
import { Status } from '../enum/status.enum';
import { CustomResponse } from '../interface/custom-response';
import { Server } from '../interface/server';

@Injectable({
  providedIn: 'root'
})
export class ServerService {
  
  private baseUrl = 'http://localhost:8080/';

  constructor(private httpClient: HttpClient) { }

  servers$ = <Observable<CustomResponse>> 
  this.httpClient.get<CustomResponse>(this.baseUrl + "server/list")
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  save$ =(server: Server) => <Observable<CustomResponse>> 
  this.httpClient.post<CustomResponse>(this.baseUrl + "server/save", server)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  ping$ =(ipAddress: string) => <Observable<CustomResponse>> 
  this.httpClient.get<CustomResponse>(this.baseUrl + "server/save/"+ipAddress)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  filter$ =(status: Status, response: CustomResponse) => <Observable<CustomResponse>> 
  new Observable<CustomResponse>(
    subscriber => {
      console.log(response);
      subscriber.next(
        status === Status.ALL ? {...response, message: 'Servers filtered by ' + status}:
        {
          ...response,
          message: response.data.servers.filter(server => server.status === status).length > 0 ? 
          'Servers filtered by ' + (status === Status.SERVER_UP ? 'SERVER UP': 'SERVER DOWN') :
          `No servers of ${status} found`,
          data: {servers: response.data.servers.filter(server => server.status === status)}
        }
      );
      subscriber.complete();
      
    }
  )
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  delete$ =(serverId: number) => <Observable<CustomResponse>> 
  this.httpClient.delete<CustomResponse>(this.baseUrl + "server/delete/" + serverId)
  .pipe(
    tap(console.log),
    catchError(this.handleError)
  );

  private handleError(error: HttpErrorResponse): Observable<never> {
    console.log(error);
    return throwError ('An error occurred - Error code: ' + error.status);
  }
}
