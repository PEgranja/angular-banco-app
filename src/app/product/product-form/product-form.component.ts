import {Component, Input, OnInit, ViewChild} from "@angular/core";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {releaseDateValidator} from "../../shared/directives/release-date-validator.directive";
import {ProductService} from "../../core/services/product.service";
import {Router} from "@angular/router";
import {ToasterComponent} from "../../shared/components/toaster/toaster.component";
import {ToasterService} from "../../core/services/toaster.service";
import {response} from "express";

@Component({
  selector: "app-product-form",
  standalone: true,
  imports: [ReactiveFormsModule, ToasterComponent],
  templateUrl: "./product-form.component.html",
  styleUrl: "./product-form.component.scss",
})
export class ProductFormComponent implements OnInit {
  @ViewChild(ToasterComponent) toaster!: ToasterComponent;

  @Input() id!: string;
  productForm: FormGroup = new FormGroup({
    id: new FormControl("", [
      Validators.required,
      Validators.minLength(3),
      Validators.maxLength(10),
    ]),
    name: new FormControl("", [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100),
    ]),
    description: new FormControl("", [
      Validators.required,
      Validators.minLength(10),
      Validators.maxLength(200),
    ]),
    logo: new FormControl("", [Validators.required]),
    date_release: new FormControl("", [Validators.required, releaseDateValidator()]),
    date_revision: new FormControl("", [Validators.required]),
  });

  constructor(
    private service: ProductService,
    private router: Router,
    private toasterService: ToasterService,
  ) {}

  ngOnInit(): void {
    console.log(this.id);
    if (this.id) {
      this.productForm.get("id")!.patchValue(this.id);
      this.productForm.get("id")?.disable();
    }
    this.toasterService.toast$.subscribe((data) => {
      this.toaster.addMessage(data.text, data.type);
    });
  }

  onSave() {
    //if (this.productForm.valid) {
    if (this.id) {
      this.service.putProduct(this.id, this.productForm.value);
      this.toasterService.showToast("Producto actualizado correctamente.", "success");
    } else {
      this.service.postProduct(this.productForm.value).subscribe({
        next: (response) => {
          console.log(response);
          this.toasterService.setMessage("Producto actualizado correctamente.", "success");
          this.router.navigate([""]);
        },
        error: (error) => {
          console.log(error);
          this.toasterService.showToast("Error al actualizar el producto.", "error");
        },
      });
    }

    this.resetForm();

    //}
  }

  resetForm(): void {
    this.productForm.reset();
  }
}
