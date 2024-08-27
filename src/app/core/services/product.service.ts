import {HttpClient} from "@angular/common/http";
import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {environment} from "../../../environments/environment.development";
import {Product, ProductListResponse, ProductResponse} from "../models/product.interface";

@Injectable({
  providedIn: "root",
})
export class ProductService {
  constructor(private http: HttpClient) {}

  getProductList(): Observable<ProductListResponse> {
    return this.http.get<ProductListResponse>(`${environment.apiUrlBase}`);
  }

  saveProduct(product: Product) {
    // return this.http.post(`${environment.apiUrlBase}`, product).subscribe((response) => {
    //   console.log('Updated config:', response);
    // });
    return this.http.post<ProductResponse>(`${environment.apiUrlBase}`, product);
  }

  updateProduct(id: string, product: Product) {
    return this.http.put<ProductResponse>(`${environment.apiUrlBase}/${id}`, product);
  }
  deleteProduct(id: string) {
    return this.http.delete<ProductResponse>(`${environment.apiUrlBase}/${id}`);
  }
}
