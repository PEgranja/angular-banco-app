import {HttpClientTestingModule, HttpTestingController} from '@angular/common/http/testing';
import {TestBed} from '@angular/core/testing';
import {of, throwError} from 'rxjs';
import {Product} from '../models/product.interface';
import {ProductService} from './product.service';

const productListMock = [
  {
    data: [
      {
        id: 'uno',
        name: 'Nombre producto',
        description: 'Descripción producto',
        logo: 'assets-1.png',
        date_release: '2025-01-01',
        date_revision: '2025-01-01',
      },
    ],
  },
];

const productResponseMock = [
  {
    message: 'Product added successfully',
    data: {
      id: 'dos',
      name: 'Nombre producto',
      description: 'Descripción producto',
      logo: 'assets-1.png',
      date_release: '2025-01-01',
      date_revision: '2025-01-01',
    },
  },
];

const productDeleteResponseMock = [
  {
    message: 'Product removed successfully',
  },
];

const httpClientMock = {
  get: jest.fn(),
  post: jest.fn(),
  put: jest.fn(),
  delete: jest.fn(),
};

const postDataMock: Product = {
  id: 'dos',
  name: 'Nombre producto',
  description: 'Descripción producto',
  logo: 'assets-1.png',
  date_release: new Date('2025-01-01'),
  date_revision: new Date('2025-01-01'),
};

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService],
    });
    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return data from GET request', () => {
    jest.spyOn(httpClientMock, 'get').mockReturnValue(of(productListMock));

    service.getProductList().subscribe((data) => {
      expect(data).toEqual(productListMock);
    });

    const req = httpMock.expectOne('/bp/products');
    expect(req.request.method).toBe('GET');
    req.flush(productListMock);
  });

  it('should post data and return response', () => {
    jest.spyOn(httpClientMock, 'post').mockReturnValue(of(productResponseMock));

    service.saveProduct(postDataMock).subscribe((response) => {
      expect(response).toEqual(productResponseMock);
    });

    const req = httpMock.expectOne('/bp/products');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(postDataMock);
    req.flush(productResponseMock);
  });

  it('should put data and return response', () => {
    jest.spyOn(httpClientMock, 'put').mockReturnValue(of(productResponseMock));

    service.updateProduct('dos', postDataMock).subscribe((response) => {
      expect(response).toEqual(productResponseMock);
    });

    const req = httpMock.expectOne('/bp/products/dos');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(postDataMock);
    req.flush(productResponseMock);
  });

  it('should delete data and return response', () => {
    jest.spyOn(httpClientMock, 'delete').mockReturnValue(of(productDeleteResponseMock));

    service.deleteProduct('dos').subscribe((response) => {
      expect(response).toEqual(productDeleteResponseMock);
    });

    const req = httpMock.expectOne('/bp/products/dos');
    expect(req.request.method).toBe('DELETE');

    req.flush(productResponseMock);
  });

  it('should handle errors', () => {
    const errorMessage = 'Error occurred';
    jest.spyOn(httpClientMock, 'get').mockReturnValue(throwError(() => new Error(errorMessage)));

    service.getProductList().subscribe({
      next: () => fail('should have failed with an error'),
      error: (error) => {
        expect(error.message).toContain(errorMessage);
      },
    });

    const req = httpMock.expectOne('/bp/products');
    expect(req.request.method).toBe('GET');
    req.flush({message: errorMessage}, {status: 500, statusText: 'Server Error'});
  });
});
