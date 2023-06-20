import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { PlanartestComponent } from './planartest/planartest.component';

const routes: Routes = [
  { path: '', component: PlanartestComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

