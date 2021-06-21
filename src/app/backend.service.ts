import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { Card } from './card';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class BackendService {

  endpoint: string = 'http://localhost:8000/api';
  headers = new HttpHeaders().set('Content-Type', 'application/json');

  constructor(
    private http: HttpClient,
    private matSnackBar: MatSnackBar) { }

  // REST (not used ?)
  // Add card
  AddCard(data: Card): Observable<Card> {
    let API_URL = `${this.endpoint}/card`;
    return this.http.post<Card>(API_URL, data)
      .pipe(
        map((res: Card) => {
          this.matSnackBar.open(`${res.person!.en!} was added sucessfully`, 'Close', {duration: 2000});
          return res;
        }),
        catchError(BackendService.errorMgmt(this.matSnackBar))
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
        catchError(BackendService.errorMgmt(this.matSnackBar))
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
        catchError(BackendService.errorMgmt(this.matSnackBar))
      )
  }

  // Update card
  UpdateCard(id : string, data : Card): Observable<Card> {
    let API_URL = `${this.endpoint}/card/${id}`;
    return this.http.put<Card>(API_URL, data, { headers: this.headers })
      .pipe(
        catchError(BackendService.errorMgmt(this.matSnackBar))
      )
  }

  // Delete card
  DeleteCard(id : string): Observable<Card> {
    var API_URL = `${this.endpoint}/card/${id}`;
    return this.http.delete<Card>(API_URL)
      .pipe(
        catchError(BackendService.errorMgmt(this.matSnackBar))
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
        catchError(BackendService.errorMgmt(this.matSnackBar))
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
        catchError(BackendService.errorMgmt(this.matSnackBar))
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
        catchError(BackendService.errorMgmt(this.matSnackBar))
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
        catchError(BackendService.errorMgmt(this.matSnackBar))
      )
  }

  // Preload a card based on limited information
  PreloadCard(card: Card): Observable<Card>{
    let API_URL = `${this.endpoint}/PreloadCard`;

    return this.http.post<Card>(API_URL, card)
      .pipe(
        map((res: Card) => {
          return res;
        }),
        catchError(BackendService.errorMgmt(this.matSnackBar))
      )
  }

  // Private methods
  // Error handling 
  private static errorMgmt(matSnackBar: MatSnackBar) {
    return (error: HttpErrorResponse) => {
      let errorMessage = '';
      if (error.error instanceof ErrorEvent) {
        // Get client-side error
        errorMessage = error.error.message;
      } else {
        // Get server-side error
        errorMessage = `Error Code: ${error.status}\nMessage: ${error.error}`;
      }
      matSnackBar.open(errorMessage, 'Close', {duration: 2000})
      console.log(errorMessage);
      return throwError(errorMessage);
    }
  }

}
