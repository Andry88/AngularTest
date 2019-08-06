import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { switchMap } from 'rxjs/operators';

import { TaskModel } from './../../models/task.model';
import { TaskPromiseService } from '../../../tasks/services';

@Component({
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.css']
})
export class TaskFormComponent implements OnInit {
  task: TaskModel;

  constructor(
    private taskPromiseService: TaskPromiseService,
    private route: ActivatedRoute,
    private router: Router) { }

  ngOnInit(): void {
    this.task = new TaskModel();

    this.route.paramMap
      .pipe(
        switchMap((params: Params) => {
          return params.get('taskID')
            ? this.taskPromiseService.getTask(+params.get('taskID'))
            // when Promise.resolve(null) => task = null => {...null} => {}
            : Promise.resolve(null);
        }))
      .subscribe(task => (this.task = {...task}), err => console.log(err));
  }

  onSaveTask() {
    const task = { ...this.task };

    const method = task.id ? 'updateTask' : 'createTask';
    this.taskPromiseService[method](task)
      .then(() => this.onGoBack())
      .catch(err => console.log(err));
  }

  onGoBack(): void {
    this.router.navigate(['/home']);
  }
}
