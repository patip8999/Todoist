import { Routes } from '@angular/router';
import { TaskListComponent } from './task-list/task-list.component';
import { CreateTaskComponent } from './create-task/create-task.component';


export const routes: Routes = [
    {
        path: '',
        component: TaskListComponent
    },
    {
        path: 'create-task',
        component: CreateTaskComponent
    }
];
