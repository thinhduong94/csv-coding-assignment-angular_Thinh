import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { forkJoin } from 'rxjs';
import { catchError, finalize } from 'rxjs/operators';
import { BackendService } from 'src/app/backend.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  filterForm;
  tasks = [];
  users = [];
  originalTask = [];
  isLoading = false;
  constructor(private backend: BackendService) { }
  ngOnInit(): void {
    this.createForm();
    this.loadTask();
    this.filterForm.valueChanges.subscribe((value) => {
      const tempTask = this.originalTask.filter(item => (value.assigneeId === null || +value.assigneeId === item.assigneeId) && (value.completed === null || value.completed === item.completed));
      this.tasks = tempTask;
    });
  }
  loadTask() {
    this.isLoading = true;
    let reqs = [
      this.backend.tasks().pipe(catchError(() => { throw 'tasks' })),
      this.backend.users().pipe(catchError(() => { throw 'users' }))
    ];
    forkJoin(reqs).pipe(
      finalize(() => {
        this.isLoading = false;
      }),
    ).subscribe(([t, u]) => {
      t.forEach(tItem => {
        const { name } = (u as any[]).find(uItem => +tItem.assigneeId === uItem.id) || {};
        (tItem as any).assignee = name;
      });
      this.tasks = t;
      this.originalTask = t;
      this.users = u;
    }, error => {
      console.log(error);
    });
  }
  refresh() {
    this.loadTask();
    this.filterForm.reset();
  }
  createForm() {
    this.filterForm = new FormGroup({
      assigneeId: new FormControl(null),
      completed: new FormControl(null)
    });
  }
}
