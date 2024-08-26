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
    return this.http.post(`${environment.apiUrlBase}`, product).subscribe((response) => {
      console.log('Updated config:', response);
    });
  }

  putProduct(id: string, product: Product) {
    return this.http.put(`${environment.apiUrlBase}/${id}`, product).subscribe((response) => {
      console.log('Updated config:', response);
    });
  }
  deleteProduct(id: string) {
    return this.http.delete(`${environment.apiUrlBase}/${id}`).subscribe((response) => {
      console.log('Updated config:', response);
    });
  }
}
