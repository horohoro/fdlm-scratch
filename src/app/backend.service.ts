import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Card } from './card';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  endpoint: string = 'http://localhost:8000/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(private http: HttpClient) { }

  // REST (not used ?)
  // Add card
  AddCard(data: Card): Observable<Card> {
    let API_URL = `${this.endpoint}/card`;
    return this.http.post<Card>(API_URL, data)
      .pipe(
        catchError(BackendService.errorMgmt)
      )
  }

  // Get all cards
  GetCards() : Observable<Card[]>{
    return this.http.get<Card[]>(`${this.endpoint}/cards`);
  }

  // Get random Card
  GetCard(): Observable<Card> {
    let API_URL = `${this.endpoint}/card`;
    return this.http.get<Card>(API_URL, { headers: this.headers })
      .pipe(
        map((res: Card) => {
          return res;
        }),
        catchError(BackendService.errorMgmt)
      )
  }

  // Get single card by ID
  GetCardById(id : string): Observable<Card> {
    let API_URL = `${this.endpoint}/card/${id}`;
    return this.http.get<Card>(API_URL, { headers: this.headers })
      .pipe(
        map((res: Card) => {
          return res;
        }),
        catchError(BackendService.errorMgmt)
      )
  }

  // Update card
  UpdateCard(id : string, data : Card): Observable<Card> {
    let API_URL = `${this.endpoint}/card/${id}`;
    return this.http.put<Card>(API_URL, data, { headers: this.headers })
      .pipe(
        catchError(BackendService.errorMgmt)
      )
  }

  // Delete card
  DeleteCard(id : string): Observable<Card> {
    var API_URL = `${this.endpoint}/card/${id}`;
    return this.http.delete<Card>(API_URL)
      .pipe(
        catchError(BackendService.errorMgmt)
      )
  }

  // SOAP
  // Pick and assign an unassigned card
  AssignUnassignedCard(player : number): Observable<Card> {
    let API_URL = `${this.endpoint}/AssignUnassignedCard`;
    return this.http.get<Card>(API_URL, { headers: this.headers, params: { player: player } })
      .pipe(
        map((res: Card) => {
          return res;
        }),
        catchError(BackendService.errorMgmt)
      )
  }

  // Unassign player(s)
  UnassignPlayer(player? : number): Observable<number> {
    let API_URL = `${this.endpoint}/UnassignPlayer`;
    
    let params = {}
    if (player) {
      params = {player: player}
    }
    return this.http.get<number>(API_URL, { headers: this.headers, params: params })
      .pipe(
        map((res: number) => {
          return res;
        }),
        catchError(BackendService.errorMgmt)
      )
  }

  // Return result
  GameResult(): Observable<Card[]> {
    let API_URL = `${this.endpoint}/GameResult`;

    return this.http.get<Card[]>(API_URL, { headers: this.headers })
      .pipe(
        map((res: Card[]) => {
          return res;
        }),
        catchError(BackendService.errorMgmt)
      )
  }

  // Unselect (reset) card that are not assigned to users already
  UnselectUnassignedCards(): Observable<number> {
    let API_URL = `${this.endpoint}/UnselectUnassignedCards`;

    return this.http.get<number>(API_URL, { headers: this.headers })
      .pipe(
        map((res: number) => {
          return res;
        }),
        catchError(BackendService.errorMgmt)
      )
  }

  // Private methods
  // Error handling 
  private static errorMgmt(error: HttpErrorResponse) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }

}
