import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DetailComponent } from './component/task/detail/detail.component';
import { ListComponent } from './component/task/list/list.component';

const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'task/:id', component: DetailComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
