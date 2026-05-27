import { Routes } from '@angular/router';
import { Test } from './page/test/test';
import { RecursiveAnalize } from './page/recursive-analize/recursive-analize';

export const routes: Routes = [
    {
        component: Test,
        path: ''
    },
    {
        component: RecursiveAnalize,
        path: 'recursive-analize'
    }
];
