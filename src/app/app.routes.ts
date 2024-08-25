import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./product/product.routes').then((m) => m.PRODUCT_ROUTES),
  },
];
