import {ComponentFixture, TestBed} from '@angular/core/testing';
import {of, throwError} from 'rxjs';
import {ProductService} from '../../core/services/product.service';
import {ToasterService} from '../../core/services/toaster.service';
import {ProductDeleteModalComponent} from './product-delete-modal.component';
import {ProductResponse} from '../../core/models/product.interface';
import {Router} from '@angular/router';
import {ToasterComponent} from '../../shared/components/toaster/toaster.component';
import {ProductLayoutComponent} from '../product-layout/product-layout.component';

const mockProductResponse: ProductResponse = {
  message: 'Product deleted successfully',
};

describe('ProductDeleteModalComponent', () => {
  let component: ProductDeleteModalComponent;
  let fixture: ComponentFixture<ProductDeleteModalComponent>;
  let productService: jest.Mocked<ProductService>;
  let toasterService: jest.Mocked<ToasterService>;

  beforeEach(() => {
    productService = {
      deleteProduct: jest.fn(),
    } as any;
    toasterService = {
      showToast: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      imports: [ProductLayoutComponent, ProductDeleteModalComponent, ToasterComponent],
      providers: [
        {provide: ProductService, useValue: productService},
        {provide: ToasterService, useValue: toasterService},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductDeleteModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should open the modal when openModal is called', () => {
    component.openModal();
    expect(component.isModalOpen).toBe(true);
  });

  it('should close the modal when closeModal is called', () => {
    component.openModal();
    component.closeModal();
    expect(component.isModalOpen).toBe(false);
  });

  it('should call productService.deleteProduct and emit productDeleted on successful delete', () => {
    productService.deleteProduct.mockReturnValue(of(mockProductResponse));
    component.id = '123';
    const emitSpy = jest.spyOn(component.productDeleted, 'emit');

    component.confirmDelete();

    expect(productService.deleteProduct).toHaveBeenCalledWith('123');
    expect(emitSpy).toHaveBeenCalled();
    expect(component.isModalOpen).toBe(false);
  });

  it('should call toasterService.showToast on error during delete', () => {
    productService.deleteProduct.mockReturnValue(throwError(() => new Error('Delete failed')));

    component.confirmDelete();

    expect(toasterService.showToast).toHaveBeenCalledWith(
      'Error al eliminar el producto.',
      'error',
    );
  });
});
