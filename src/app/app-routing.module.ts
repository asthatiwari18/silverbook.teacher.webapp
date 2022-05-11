import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AttendenceViewerComponent } from './attendance-viewer/attendance-viewer.component';
import { LoginComponent } from './login/login.component';
import { QrGeneratorComponent } from './qr-generator/qr-generator.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    component: LoginComponent,
  },
  { path: 'view-attendance', component: AttendenceViewerComponent },
  { path: 'qr-generator', component: QrGeneratorComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { relativeLinkResolution: 'legacy' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
