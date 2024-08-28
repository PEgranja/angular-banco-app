import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ProductService} from '../../core/services/product.service';
import {ToasterService} from '../../core/services/toaster.service';

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

  constructor(private service: ProductService, private toasterService: ToasterService) {}
  openModal() {
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  confirmDelete() {
    this.service.deleteProduct(this.id).subscribe({
      next: (response) => {
        this.productDeleted.emit();
        this.closeModal();
      },
      error: (error) => {
        this.toasterService.showToast('Error al eliminar el producto.', 'error');
      },
    });
  }
}
