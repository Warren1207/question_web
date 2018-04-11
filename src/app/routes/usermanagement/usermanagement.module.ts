/**引入Service */
import { UsermanagementService } from './usermanagement.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/**每个模块都需要的公共模板 */
import { SharedModule } from '@shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
/**引入页面 */
import { UsermanagementComponent } from './usermanagement/usermanagement.component';
import { UserDetailComponent } from './user-detail/user-detail.component';
import { UserAddComponent } from './user-add/user-add.component';

const routes: Routes = [
  { path: 'index', component: UsermanagementComponent, data: { text: '问题提报' } },
  { path: 'update', component: UserDetailComponent, data: { text: '账号管理' } },
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  /**引入页面**/
  declarations: [UsermanagementComponent, UserDetailComponent, UserAddComponent],
  entryComponents: [UserAddComponent],
  /**注入 Service */
  providers: [UsermanagementService]
})
export class UsermanagementModule { }

