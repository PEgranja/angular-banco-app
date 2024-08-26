import {AsyncPipe} from '@angular/common';
import {
  AfterViewInit,
  Component,
  contentChild,
  effect,
  OnInit,
  viewChild,
  ViewChild,
} from '@angular/core';
import {ProductService} from '../../core/services/product.service';
import {catchError, EMPTY, map, Observable} from 'rxjs';
import {Product, ProductResults} from '../../core/models/product.interface';
import {Router, RouterModule} from '@angular/router';
import {ErrorMessageComponent} from '../../error/error-message/error-message.component';
import {ProductDeleteModalComponent} from '../product-delete-modal/product-delete-modal.component';

@Component({
  selector: 'app-product-layout',
  standalone: true,
  imports: [AsyncPipe, ErrorMessageComponent, RouterModule, ProductDeleteModalComponent],
  templateUrl: './product-layout.component.html',
  styleUrl: './product-layout.component.scss',
})
export class ProductLayoutComponent implements OnInit {
  @ViewChild(ProductDeleteModalComponent) modal!: ProductDeleteModalComponent;

  productResults$!: Observable<ProductResults>;
  errorMessage!: string;
  itemsPerPage: number = 5;
  displayedData: any[] = [];
  filteredData: any[] = [];
  filterText: string = '';
  isEdit = true;

  constructor(private service: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productResults$ = this.service.getProductList();
    this.productResults$
      .pipe(
        map((resultObject) => resultObject.data),
        catchError((error: string) => {
          this.errorMessage = error;
          return EMPTY;
        }),
      )
      .subscribe((data) => {
        this.filteredData = data;
        this.updateDisplayedData();
      });
  }

  updateDisplayedData() {
    this.displayedData = this.filteredData.slice(0, this.itemsPerPage);
  }

  changeItemsPerPage(event: Event) {
    const target = event.target as HTMLSelectElement;
    this.itemsPerPage = +target.value || this.itemsPerPage;
    this.updateDisplayedData();
  }

  applyFilter(event: Event) {
    const target = event.target as HTMLInputElement;
    this.filterText = target.value.toLowerCase();

    this.productResults$
      .pipe(
        map((resultObject) => resultObject.data),
        catchError((error: string) => {
          this.errorMessage = error;
          return EMPTY;
        }),
      )
      .subscribe((data) => {
        this.filteredData = data.filter(
          (item) =>
            item.name.toLowerCase().includes(this.filterText) ||
            item.description.toLowerCase().includes(this.filterText),
        );
        this.updateDisplayedData();
      });
  }

  addNewItem() {
    this.router.navigate(['/add-product']);
  }

  deleteItem(product: Product) {
    this.modal.productName = product.name;
    this.modal.id = product.id;
    this.modal.openModal();
    this.modal.productDeleted.subscribe(() => {
      this.loadProducts();
    });
  }
}
