/**引入Service */
import { QuestionService } from './question.service';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
/**每个模块都需要的公共模板 */
import { SharedModule } from '@shared/shared.module';
import { RouterModule, Routes } from '@angular/router';
import { QuestionComponent} from './question/question.component';
import { DisplayqusetionComponent } from './displayqusetion/displayqusetion.component';
import { SummaryquestionComponent } from './summaryquestion/summaryquestion.component';

const routes: Routes = [
  { path: 'index', component: DisplayqusetionComponent, data: { text: '问题提报' } },
  { path: 'addquestion', component: QuestionComponent, data: { text: '添加问题' } },
  { path: 'summaryquestion', component: SummaryquestionComponent, data: { text: '问题摘要' } },
];

@NgModule({
  imports: [
    CommonModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
   /**引入页面**/
  declarations: [QuestionComponent,
     DisplayqusetionComponent,
    SummaryquestionComponent
],
  /**注入 Service */
  providers: [ QuestionService ]
})
export class QuestionModule { }
