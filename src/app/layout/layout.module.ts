import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { AboutComponent, LoginComponent, MessagesComponent, PathNotFoundComponent } from './components';

@NgModule({
  declarations: [AboutComponent, LoginComponent, MessagesComponent, PathNotFoundComponent],
  imports: [
    CommonModule,
    FormsModule
  ]
})
export class LayoutModule { }
