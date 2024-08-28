import {CommonModule} from '@angular/common';
import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {ProductService} from '../../core/services/product.service';
import {ToasterService} from '../../core/services/toaster.service';
import {ToasterComponent} from '../../shared/components/toaster/toaster.component';
import {releaseDateValidator} from '../../shared/directives/date-release-validator.directive';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule, ToasterComponent, CommonModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit {
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;

  @Input() id!: string;

  productForm: FormGroup = new FormGroup({
    id: new FormControl('', [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(10),
    ]),
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100),
    ]),
    description: new FormControl('', [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(200),
    ]),
    logo: new FormControl('', [Validators.required]),
    date_release: new FormControl('', [Validators.required, releaseDateValidator()]),
    date_revision: new FormControl('', Validators.required),
  });

  constructor(
    private service: ProductService,
    private router: Router,
    private toasterService: ToasterService,
  ) {}

  ngOnInit(): void {
    this.productForm.get('id')?.setErrors(null);
    if (this.id) {
      this.productForm.get('id')!.patchValue(this.id);
      this.productForm.get('id')?.disable();
    }
    this.toasterService.toast$.subscribe((data) => {
      this.toaster.addMessage(data.text, data.type);
    });
  }

  onSave() {
    if (this.productForm.valid) {
      if (this.id) {
        this.service.updateProduct(this.id, this.productForm.value).subscribe({
          next: (response) => {
            this.toasterService.showToast('Producto actualizado correctamente.', 'success');
            setTimeout(() => {
              this.router.navigate(['']);
            }, 1000);
          },
          error: (error) => {
            this.toasterService.showToast('Error al actualizar el producto.', 'error');
          },
        });
      } else {
        this.service.saveProduct(this.productForm.value).subscribe({
          next: (response) => {
            this.toasterService.showToast('Producto guardado correctamente.', 'success');
            setTimeout(() => {
              this.router.navigate(['']);
            }, 1000);
          },
          error: (error) => {
            this.toasterService.showToast('Error al guardar el producto.', 'error');
          },
        });
      }

      this.resetForm();
    }
  }

  resetForm(): void {
    this.productForm.reset();
  }
  onDateReleaseChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const releaseDate = new Date(input.value);

    if (!isNaN(releaseDate.getTime())) {
      const revisionDate = this.addOneYear(releaseDate);
      this.productForm.get('date_revision')!.patchValue(this.formatDateToYYYYMMDD(revisionDate));
    }
  }

  formatDateToYYYYMMDD(date: Date): string {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  }

  addOneYear(date: Date): Date {
    const newDate = new Date(date);
    newDate.setFullYear(date.getFullYear() + 1);
    return newDate;
  }

  onIdChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.service.verificationIdProduct(input.value).subscribe({
      next: (response) => {
        if (response) {
          this.productForm.get('id')?.setErrors({idVerificationError: 'ID no válido!'});
        }
      },
      error: (error) => {
        this.toasterService.showToast('Error al verificar el id.', 'error');
      },
    });
  }
}
