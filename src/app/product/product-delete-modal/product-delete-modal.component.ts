import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ProductService} from '../../core/services/product.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-product-delete-modal',
  standalone: true,
  imports: [],
  templateUrl: './product-delete-modal.component.html',
  styleUrl: './product-delete-modal.component.scss',
})
export class ProductDeleteModalComponent {
  @Input() productName!: string;
  @Input() id!: string;
  @Output() productDeleted: EventEmitter<void> = new EventEmitter<void>();

  isModalOpen: boolean = false;

  constructor(private service: ProductService, private router: Router) {}
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  confirmDelete() {
    this.service.deleteProduct(this.id);
    console.log(`Producto ${this.productName} eliminado`);
    this.productDeleted.emit();
    this.closeModal();
  }
}
