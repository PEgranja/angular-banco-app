import {ComponentFixture, TestBed} from '@angular/core/testing';
import {Router} from '@angular/router';
import {of, throwError} from 'rxjs';
import {Product, ProductListResponse} from '../../core/models/product.interface';
import {ProductService} from '../../core/services/product.service';
import {ToasterService} from '../../core/services/toaster.service';
import {ToasterComponent} from '../../shared/components/toaster/toaster.component';
import {ProductDeleteModalComponent} from '../product-delete-modal/product-delete-modal.component';
import {ProductLayoutComponent} from './product-layout.component';

describe('ProductLayoutComponent', () => {
  let component: ProductLayoutComponent;
  let fixture: ComponentFixture<ProductLayoutComponent>;
  let productService: jest.Mocked<ProductService>;
  let toasterService: jest.Mocked<ToasterService>;
  let router: jest.Mocked<Router>;

  const mockProductListResponse: ProductListResponse = {
    data: [
      {
        id: 'uno',
        name: 'Nombre producto',
        description: 'Descripción producto',
        logo: 'assets-1.png',
        date_release: new Date('2025-01-01'),
        date_revision: new Date('2025-01-01'),
      },
      {
        id: 'dos',
        name: 'Nombre productos',
        description: 'Descripción productos',
        logo: 'assets-2.png',
        date_release: new Date('2025-01-01'),
        date_revision: new Date('2025-01-01'),
      },
    ],
  };

  beforeEach(() => {
    productService = {
      getProductList: jest.fn(),
    } as any;
    toasterService = {
      showToast: jest.fn(),
      toast$: of({text: '', type: 'info'}),
    } as any;
    router = {
      navigate: jest.fn(),
    } as any;

    TestBed.configureTestingModule({
      imports: [ProductLayoutComponent, ProductDeleteModalComponent, ToasterComponent],
      providers: [
        {provide: ProductService, useValue: productService},
        {provide: ToasterService, useValue: toasterService},
        {provide: Router, useValue: router},
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ProductLayoutComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on initialization', () => {
    productService.getProductList.mockReturnValue(of(mockProductListResponse));

    component.ngOnInit();

    expect(productService.getProductList).toHaveBeenCalled();
    expect(component.filteredData).toEqual(mockProductListResponse.data);
    expect(component.displayedData).toEqual(
      mockProductListResponse.data.slice(0, component.itemsPerPage),
    );
  });

  it('should update displayed data when itemsPerPage changes', () => {
    component.filteredData = mockProductListResponse.data;
    component.itemsPerPage = 1;

    component.updateDisplayedData();

    expect(component.displayedData.length).toBe(1);
    expect(component.displayedData).toEqual(mockProductListResponse.data.slice(0, 1));
  });

  it('should navigate to add-product when addNewItem is called', () => {
    component.addNewItem();
    expect(router.navigate).toHaveBeenCalledWith(['/add-product']);
  });

  it('should open delete modal and emit success toast on successful delete', () => {
    const modal = fixture.componentInstance.modal;
    const product = {id: '1', name: 'Product 1', description: 'Description 1'} as Product;
    productService.getProductList.mockReturnValue(of(mockProductListResponse));
    productService.deleteProduct = jest.fn().mockReturnValue(of({}));

    component.ngOnInit();
    component.deleteItem(product);

    expect(modal.productName).toBe('Product 1');
    expect(modal.id).toBe('1');
    expect(modal.openModal).toHaveBeenCalled();
    expect(toasterService.showToast).toHaveBeenCalledWith(
      'Producto eliminado correctamente.',
      'success',
    );
    expect(productService.getProductList).toHaveBeenCalled();
  });

  it('should handle error and set errorMessage', () => {
    productService.getProductList.mockReturnValue(throwError(() => 'Error occurred'));

    component.loadProducts();

    expect(component.errorMessage).toBe('Error occurred');
  });
});
