import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, Injector, Inject } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient } from '@delon/theme';
import swal, { SweetAlertType } from 'sweetalert2';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { SimpleTableColumn } from '@delon/abc';
import { SettingsService } from '@delon/theme';
/**引入service方法 */
import { QuestionService } from '../question.service';
/**页面跳转路由方法 */
import { Router } from '@angular/router';

@Component({
  selector: 'app-displayqusetion',
  templateUrl: './displayqusetion.component.html',
  styles: []
})
export class DisplayqusetionComponent implements OnInit {

  options: any = [
    { value: '', label: '所有' },
    { value: 2, label: '开立' },
    { value: 4, label: '提交' },
    { value: 8, label: '已受理' },
    { value: 16, label: '处理中' },
    { value: 32, label: '处理完毕' },
    { value: 64, label: '已结案' },
    { value: 62, label: '未结案' }
  ];
  queryParams: any = {};
  questionType = [];
  data = [];
  user = null;

  constructor(
    private http: _HttpClient,
    public msg: NzMessageService,
    private fb: FormBuilder,
    private injector: Injector,
    public settings: SettingsService,
    private QuestionService: QuestionService) { }

  ngOnInit() {
    this.queryParams["status"] = 62;
  }
  /**查询事件 */
  queryFn() {
    const userInfo = this.settings.user;
    const params = {
      "customerId": userInfo.customerId,
      "statue": this.queryParams.status,
      "summary": this.queryParams.key
    };
    this.QuestionService.postFn('question/query', params).subscribe((res: any) => {
      if (res.code === 0) {
        this.data = res.data;
      } else {
        swal({ type: 'error', title: '系统提示 ', text: res['message'] });
      }

    });
  }
  /**页面跳转创建问题 */
  addquestionFn(user) {
    const router = this.injector.get(Router);
    router.navigate(['/question/addquestion']);
  }
  /**查看函数 */
  seeFn(id,statue) {
    const router = this.injector.get(Router);
    router.navigate(['/question/summaryquestion'], { queryParams: { id: id ,statue: statue} });
  }
  /**修改函数 */
  updataFn(id: any) {
    const router = this.injector.get(Router);
    router.navigate(['/question/addquestion'], { queryParams: { id: id } });
  }
}
