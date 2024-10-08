import {Routes} from '@angular/router';
import {ProductLayoutComponent} from './product-layout/product-layout.component';
import {ProductFormComponent} from './product-form/product-form.component';

export const PRODUCT_ROUTES: Routes = [
  {path: '', component: ProductLayoutComponent},
  {path: 'add-product', component: ProductFormComponent},
  {path: 'edit-product/:id', component: ProductFormComponent},
];
