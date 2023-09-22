import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { Pipe, PipeTransform } from '@angular/core'; 
import { CourseFilterNamePipe,CourseFilterClassePipe,CourseFilterAulaPipe, ArraySortPipe } from './coursefilters.pipe';


@NgModule({
  declarations: [
    AppComponent,
    CourseFilterNamePipe,
    CourseFilterClassePipe,
    CourseFilterAulaPipe,
    ArraySortPipe
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }



// WEBPACK FOOTER //
// /Users/giacomo/Sites/orario_bp/orario-bp/src/app/app.module.ts