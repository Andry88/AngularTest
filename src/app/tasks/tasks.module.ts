import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// @NgRx
import { StoreModule } from '@ngrx/store';
import { tasksReducer, TasksEffects } from './../core/+store';
import { EffectsModule } from '@ngrx/effects';

import { TasksRoutingModule } from './tasks-routing.module';
import { TasksServicesModule } from './tasks-services.module';
import { TaskListComponent, TaskComponent, TaskFormComponent } from './components';

@NgModule({
  declarations: [
    TaskListComponent,
    TaskComponent,
    TaskFormComponent],
  imports: [
    CommonModule,
    FormsModule,
    TasksRoutingModule,
    TasksServicesModule,
    StoreModule.forFeature('tasks', tasksReducer),
    EffectsModule.forFeature([TasksEffects])
  ]
})
export class TasksModule { }
