import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { catchError, finalize } from 'rxjs/operators';
import { BackendService } from 'src/app/backend.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  users = this.backend.users();
  statusAction: boolean = false;
  taskForm;
  isNew: boolean = true;
  currentModel: any = {};
  isLoading: boolean = false;
  constructor(
    private route: ActivatedRoute,
    private backend: BackendService) { }
  ngOnInit(): void {
    this.createForm();
    const id = this.route.snapshot.paramMap.get('id')!;
    if (id) {
      this.isLoading = true;
      this.backend.task(+id).pipe(
        catchError(() => { throw 'task' }),
        finalize(() => this.isLoading = false)
      ).subscribe(result => {
        if (result) {
          this.isNew = false;
          this.currentModel = result;
          this.taskForm.patchValue(result);
        }
      });
    }
  }
  save() {
    this.isLoading = true
    const {
      value: {
        description = '',
        assigneeId = null,
        completed = false
      },
    } = this.taskForm;
    if (this.isNew) {
      const payload = {
        description
      };
      this.backend.newTask(payload).pipe(
        catchError(() => { throw 'newTask' }),
        finalize(() => this.isLoading = false)
      ).subscribe((reuslt) => {
        this.setStatusAction();
        console.log(reuslt);
      });
    } else {
      const updates = {
        id: this.currentModel.id,
        description,
        assigneeId,
        completed
      };
      this.backend.update(this.currentModel.id, updates).pipe(
        catchError(() => { throw 'update' }),
        finalize(() => this.isLoading = false)
      ).subscribe((reuslt) => {
        this.setStatusAction();
        console.log(reuslt);
      });
    }
  };
  setStatusAction() {
    this.statusAction = true;
    setTimeout(() => {
      this.statusAction = false
    }, 1000);
  };
  createForm() {
    this.taskForm = new FormGroup({
      description: new FormControl(''),
      assigneeId: new FormControl(null),
      completed: new FormControl(false)
    });
  };
  get description() { return this.taskForm.get('description'); }
}
