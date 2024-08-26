import {AsyncPipe} from "@angular/common";
import {Component, OnInit} from "@angular/core";
import {ProductService} from "../../core/services/product.service";
import {catchError, EMPTY, map, Observable} from "rxjs";
import {ProductResults} from "../../core/models/product.interface";
import {Router} from "@angular/router";
import {ErrorMessageComponent} from "../../error/error-message/error-message.component";

@Component({
  selector: "app-product-layout",
  standalone: true,
  imports: [AsyncPipe, ErrorMessageComponent],
  templateUrl: "./product-layout.component.html",
  styleUrl: "./product-layout.component.scss",
})
export class ProductLayoutComponent implements OnInit {
  productResults$!: Observable<ProductResults>;
  errorMessage!: string;
  itemsPerPage: number = 5;
  displayedData: any[] = [];
  filteredData: any[] = [];
  filterText: string = "";

  constructor(private service: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.productResults$ = this.service.getProductList();
    /*this.productResults$ = this.service.getProductList().pipe(
      catchError((error: string) => {
        this.errorMessage = error;
        return EMPTY;
      }),
    );*/
    this.productResults$
      .pipe(
        map((resultObject) => resultObject.data) /*,
        catchError((error: string) => {
          this.errorMessage = error;
          return EMPTY;
        }),*/,
      )
      .subscribe((data) => {
        this.filteredData = data;
        this.updateDisplayedData();
        /*this.filteredData = data.filter(
          (item) =>
            item.name.toLowerCase().includes(this.filterText) ||
            item.description.toLowerCase().includes(this.filterText),
        );
        this.updateDisplayedData();*/
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

    this.productResults$.pipe(map((resultObject) => resultObject.data)).subscribe((data) => {
      this.filteredData = data.filter(
        (item) =>
          item.name.toLowerCase().includes(this.filterText) ||
          item.description.toLowerCase().includes(this.filterText),
      );
      this.updateDisplayedData();
    });
  }

  addNewItem() {
    this.router.navigate(["/add-product"]);
  }

  editItem(item: any) {
    // Lógica para editar un ítem
    console.log("Editar ítem", item);
  }

  deleteItem(item: any) {
    // Lógica para eliminar un ítem
    console.log("Eliminar ítem", item);
  }

  /*updatePagination() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedData = this.filteredData.slice(startIndex, endIndex);
    this.totalPages = Array(Math.ceil(this.filteredData.length / this.itemsPerPage))
      .fill(0)
      .map((x, i) => i + 1);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePagination();
  }*/
}
