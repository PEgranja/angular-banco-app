import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ProductService } from '../../core/services/product.service';
import { Observable } from 'rxjs';
import { ProductResults } from '../../core/models/product.interface';

@Component({
  selector: 'app-product-layout',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './product-layout.component.html',
  styleUrl: './product-layout.component.scss',
})
export class ProductLayoutComponent implements OnInit {
  public productList$!: Observable<ProductResults>;
  constructor(private service: ProductService) {}
  ngOnInit(): void {
    this.productList$ = this.service.getProductList();
  }
}
