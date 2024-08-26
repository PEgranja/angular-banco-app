import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {Product, ProductResponse, ProductResults} from '../models/product.interface';
import {Observable} from 'rxjs';
import {environment} from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProductList(): Observable<ProductResults> {
    return this.http.get<ProductResults>(`${environment.apiUrlBase}`);
  }

  postProduct(product: Product) {
    return this.http.post('http://localhost:3002/bp/products', product, {
      observe: 'response',
    });
  }
}
