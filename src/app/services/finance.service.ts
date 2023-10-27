import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Finance } from '../core/models/finance.model';

@Injectable({
  providedIn: 'root',
})
export class FinanceService {
  apiUrl = environment.api;
  private dataProductFinance$ = new BehaviorSubject<any>('');

  constructor(private http: HttpClient) {}

  getSharetProductFinance(): Observable<any> {
    return this.dataProductFinance$.asObservable();
  }

  setSharetProductFinance(data: any): void {
    this.dataProductFinance$.next(data);
  }

  createdNewProductFinance(data: Finance): Observable<any> {
    const body = { ...data };
    return this.http.post(`${this.apiUrl}/bp/products`, body);
  }

  updateProductFinance(data: Finance): Observable<any> {
    const body = { ...data };
    return this.http.put(`${this.apiUrl}/bp/products`, body);
  }

  getProductFinance(): Observable<any> {
    return this.http.get(`${this.apiUrl}/bp/products`);
  }

  deleteProductFinance(id: string): Observable<any> {
    console.log('🚀  deleteProductFinance ~ id:', id);
    return this.http.delete(`${this.apiUrl}/bp/products?id=${id}`);
  }
}
