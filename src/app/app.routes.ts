import { Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { CreateTaskComponent } from './create-task/create-task.component';
import { TaskDetailComponent } from './task-detail/task-detail.component';


export const routes: Routes = [
    {
        path: '',
        component: TaskListComponent
    },
    {
        path: 'create-task',
        component: CreateTaskComponent
    },
    {
      path: 'detail/:taskId',
        component: TaskDetailComponent
    }
];
