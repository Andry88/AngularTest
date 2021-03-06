import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TaskModel } from './../../models/task.model';
import { TaskPromiseService } from '../../services';

// @NgRx
import { Store, select } from '@ngrx/store';
import { AppState, TasksState } from './../../../core/+store';

// @RxJs
import { Observable } from 'rxjs';

@Component({
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.css']
})
export class TaskListComponent implements OnInit {
  tasks: Promise<Array<TaskModel>>;
  tasksState$: Observable<TasksState>;

  constructor(
    private taskPromiseService: TaskPromiseService,
    private router: Router,
    private store: Store<AppState>) { }

  ngOnInit() {
    console.log('We have a store! ', this.store);
    this.tasksState$ = this.store.select('tasks');
  }

  onCompleteTask(task: TaskModel): void {
    this.updateTask(task).catch(err => console.log(err));
  }

  onEditTask(task: TaskModel): void {
    const link = ['/edit', task.id];
    this.router.navigate(link);
  }

  onCreateTask() {
    const link = ['/add'];
    this.router.navigate(link);
  }

  onDeleteTask(task: TaskModel) {
    this.taskPromiseService
      .deleteTask(task)
      .then(() => (this.tasks = this.taskPromiseService.getTasks()))
      .catch(err => console.log(err));
  }

  private async updateTask(task: TaskModel) {
    const updatedTask = await this.taskPromiseService.updateTask({
      ...task,
      done: true
    });

    const tasks: TaskModel[] = await this.tasks;
    const index = tasks.findIndex(t => t.id === updatedTask.id);
    tasks[index] = { ...updatedTask };
  }
}
