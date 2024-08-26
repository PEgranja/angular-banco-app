import {Component, Input, OnInit} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {releaseDateValidator} from '../../shared/directives/release-date-validator.directive';
import {ProductService} from '../../core/services/product.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.scss',
})
export class ProductFormComponent implements OnInit {
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
    date_revision: new FormControl('', [Validators.required]),
  });

  constructor(private service: ProductService, private router: Router) {
    /*this.router.events.subscribe((event) => {
      console.log(event);
    });*/
  }

  ngOnInit(): void {
    console.log(this.id);
    if (this.id) {
      this.productForm.get('id')!.patchValue(this.id);
      this.productForm.get('id')?.disable();
    }
  }

  onSave() {
    //if (this.productForm.valid) {
    if (this.id) {
      this.service.putProduct(this.id, this.productForm.value);
    } else {
      this.service.postProduct(this.productForm.value);
    }

    console.log('Nuevo producto agregado:', this.productForm.value);
    this.resetForm();
    this.router.navigate(['']);
    //}
  }

  resetForm(): void {
    this.productForm.reset();
  }
}
