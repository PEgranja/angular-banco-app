import {ComponentFixture, TestBed} from '@angular/core/testing';

import {ChangeDetectorRef} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterTestingModule} from '@angular/router/testing';
import {Router} from 'express';
import {of, throwError} from 'rxjs';
import {ProductResponse} from '../../core/models/product.interface';
import {ProductService} from '../../core/services/product.service';
import {ToasterService} from '../../core/services/toaster.service';
import {ToasterComponent} from '../../shared/components/toaster/toaster.component';
import {ProductFormComponent} from './product-form.component';

const mockProductResponse: ProductResponse = {
  message: 'Product added successfully',
  data: {
    id: 'dos',
    name: 'Nombre producto',
    description: 'Descripción producto',
    logo: 'assets-1.png',
    date_release: new Date('2025-01-01'),
    date_revision: new Date('2025-01-01'),
  },
};

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;
  let productService: jest.Mocked<ProductService>;
  let toasterService: jest.Mocked<ToasterService>;
  let router: jest.Mocked<any>;

  beforeEach(() => {
    const productServiceMock = {
      saveProduct: jest.fn(),
      updateProduct: jest.fn(),
      verificationIdProduct: jest.fn(),
    };
    const toasterServiceMock = {
      showToast: jest.fn(),
      toast$: of({text: '', type: 'info'}),
    };
    const routerMock = {
      navigate: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [ProductFormComponent, ToasterComponent],
      providers: [
        {provide: ProductService, useValue: productServiceMock},
        {provide: ToasterService, useValue: toasterServiceMock},
        {provide: Router, useValue: routerMock},
        ChangeDetectorRef,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService) as jest.Mocked<ProductService>;
    toasterService = TestBed.inject(ToasterService) as jest.Mocked<ToasterService>;
    router = TestBed.inject(Router) as jest.Mocked<any>;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with id disabled if id is provided', () => {
    component.id = '123';
    component.ngOnInit();
    expect(component.productForm.get('id')?.value).toBe('123');
    expect(component.productForm.get('id')?.disabled).toBe(true);
  });

  it('should call service.saveProduct and show success toast on successful save', () => {
    productService.saveProduct.mockReturnValue(of(mockProductResponse));
    component.onSave();
    expect(productService.saveProduct).toHaveBeenCalledWith(component.productForm.value);
    expect(toasterService.showToast).toHaveBeenCalledWith(
      'Producto guardado correctamente.',
      'success',
    );
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });

  it('should call service.updateProduct and show success toast on successful update', () => {
    component.id = '123';
    productService.updateProduct.mockReturnValue(of(mockProductResponse));
    component.onSave();
    expect(productService.updateProduct).toHaveBeenCalledWith('123', component.productForm.value);
    expect(toasterService.showToast).toHaveBeenCalledWith(
      'Producto actualizado correctamente.',
      'success',
    );
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });

  it('should call toasterService.showToast on error during save', () => {
    productService.saveProduct.mockReturnValue(throwError(() => new Error('Save failed')));
    component.onSave();
    expect(toasterService.showToast).toHaveBeenCalledWith('Error al guardar el producto.', 'error');
  });
});
