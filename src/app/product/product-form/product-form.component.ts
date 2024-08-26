import {Component, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {releaseDateValidator} from '../../shared/directives/release-date-validator.directive';
import {ProductService} from '../../core/services/product.service';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit {
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
    date_revision: new FormControl('', [Validators.required]),
  });

  formValue: any;

  constructor(private service: ProductService) {}

  ngOnInit(): void {}

  onSave() {
    //if (this.productForm.valid) {
    this.formValue = this.productForm.value;
    this.service.postProduct(this.formValue).subscribe(
      (res) => {
        if (res.status == 200) {
          console.log(res);
        }
      },
      (err) => {
        alert('There was a problem');
      },
    );

    console.log('Nuevo producto agregado:', this.productForm.value);
    this.resetForm();
    //}
  }

  resetForm(): void {
    this.productForm.reset();
  }
}
