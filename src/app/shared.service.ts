import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, forkJoin } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import {
  HttpErrorHandler,
  HandleError,
} from './log-error-handling/http-error-handler.service';
import { Account } from './interface/account';
import { Client } from './interface/client';
import { environment } from '../assets/environment/environment';

@Injectable()
export class SharedService {
  handleError: HandleError;
  constructor(private http: HttpClient, httpErrorHandler: HttpErrorHandler) {
    this.handleError = httpErrorHandler.createHandleError('SharedService');
  }

  getClients(): Observable<Client[]> {
    return this.http.get<Client[]>(`${environment.apiUrl}/clients`).pipe(
      switchMap((firstResponse) => {
        const observables = firstResponse.map((item: { id: any }) => {
          const options = item.id
            ? { params: new HttpParams().set('client', item.id) }
            : {};
          return this.http.get<Account>(
            `${environment.apiUrl}/accounts`,
            options
          );
        });
        return forkJoin(observables).pipe(
          map((secondResponses: any) => {
            return firstResponse.map((item: any, index: string | number) => {
              return { ...item, accountsData: secondResponses[index] };
            });
          })
        );
      })
    );
  }
}
