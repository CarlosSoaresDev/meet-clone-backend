import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './Common/guard/auth.guard';
import { CallScreenComponent } from './components/call-screen/call-screen.component';
import { MeetComponent } from './components/meet/meet.component';

const routes: Routes = [
  { path: 'meet', component: MeetComponent },
  { path: '', component: MeetComponent },
  { path: ':id', component: CallScreenComponent, canActivate: [AuthGuard] },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
