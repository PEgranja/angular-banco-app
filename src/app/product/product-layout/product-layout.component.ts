import {AsyncPipe} from '@angular/common';
import {Component, OnInit, ViewChild} from '@angular/core';
import {Router, RouterModule} from '@angular/router';
import {catchError, EMPTY, map, Observable} from 'rxjs';
import {Product, ProductListResponse} from '../../core/models/product.interface';
import {ProductService} from '../../core/services/product.service';
import {ToasterService} from '../../core/services/toaster.service';
import {ErrorMessageComponent} from '../../error/error-message/error-message.component';
import {ToasterComponent} from '../../shared/components/toaster/toaster.component';
import {ProductDeleteModalComponent} from '../product-delete-modal/product-delete-modal.component';
import {error} from 'console';

@Component({
  selector: 'app-product-layout',
  standalone: true,
  imports: [
    AsyncPipe,
    ErrorMessageComponent,
    RouterModule,
    ProductDeleteModalComponent,
    ToasterComponent,
  ],
  templateUrl: './product-layout.component.html',
  styleUrl: './product-layout.component.scss',
})
export class ProductLayoutComponent implements OnInit {
  @ViewChild(ProductDeleteModalComponent) modal!: ProductDeleteModalComponent;
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;

  productResults$!: Observable<ProductListResponse>;
  errorMessage!: string;
  itemsPerPage: number = 5;
  displayedData: Product[] = [];
  filteredData: Product[] = [];
  filterText: string = '';
  isEdit = true;

  constructor(
    private service: ProductService,
    private router: Router,
    private toasterService: ToasterService,
  ) {}

  ngOnInit(): void {
    this.loadProducts();
    this.toasterService.toast$.subscribe((data) => {
      this.toaster.addMessage(data.text, data.type);
    });
    /*const message = this.toasterService.getMessage();
    if (message) {
      this.toasterService.showToast(message.message, message.type);
    }*/
  }

  loadProducts() {
    this.productResults$ = this.service.getProductList().pipe(
      catchError((error: string) => {
        this.errorMessage = error;
        return EMPTY;
      }),
    );
    this.productResults$.pipe(map((resultObject) => resultObject.data)).subscribe((data) => {
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
      this.toasterService.showToast('Producto eliminado correctamente.', 'success');
      this.loadProducts();
    });
  }
}
