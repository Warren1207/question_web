import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, ViewEncapsulation, Injector } from '@angular/core';
import { NzMessageService, NzModalService } from 'ng-zorro-antd';
import { _HttpClient, TitleService, SettingsService } from '@delon/theme';
import swal, { SweetAlertType } from 'sweetalert2';
import { HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { SimpleTableColumn, ReuseTabService } from '@delon/abc';
/**引入service方法 */
import { QuestionService } from '../question.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styles: []
})
export class QuestionComponent implements OnInit {
  validateForm: FormGroup;
  options = [{}];
  questionType = {};

  constructor(private http: _HttpClient,
    public msg: NzMessageService,
    private fb: FormBuilder,
    private injector: Injector,
    /**跳转页面 */
    private titleSrv: TitleService,
    private reuseTabService: ReuseTabService,
    /**页面跳转传值 */
    private route: ActivatedRoute,
    /**传值 */
    public settings: SettingsService,
    /**http请求 */
    private QuestionService: QuestionService) { }

  ngOnInit() {
    this.options = [
      { value: '1', label: '上海威友企业管理咨询有限公司' },
      { value: '2', label: '威智荟智能科技' },
    ];
    this.questionType = [
      { value: '10', label: '操作问题' },
      { value: '20', label: '流程问题' },
      { value: '30', label: '数据核对问题' },
      { value: '40', label: '系统功能改进' },
      { value: '50', label: '系统异常' },
      { value: '60', label: '威智荟智能科技' },
    ]
    /**跳转页面显示的标题头 */
    const _title = '添加问题';
    this.titleSrv.setTitle(_title);
    this.reuseTabService.title = _title;

   /**接收传值 */
   const id = this.route.snapshot.queryParams.id;

    this.validateForm = this.fb.group({
      id: [null],
      inputer:this.settings.user.name,
      reporter: [null],
      department: [null],
      category: [null],
      ckcx: [null],
      ckmz: [null],
      summary: [null],
      ccEmail: [ null, [ Validators.email ] ],
      customerId: this.settings.user.customerId,
      content: []
    });
     /**查询请求 */
     if(!!id){
      this.seeFn(id);
     } 
  }

   /** 初始化查看函数 */
   seeFn(id: any) {

    this.QuestionService.getFn('question/getInfo/?id=' + id).subscribe((res: any) => {
      if (res.code === 0) {
        const data = res.data.issue;
        data.content = res.data.issueBody.content;
        this.validateForm.patchValue(data);
      } else {
        swal({ type: 'error', title: '系统提示 ', text: res['msg'] });
      }

    });
  }

  /**提交函数 */
  Preservation() {
    if (this.route.snapshot.queryParams.id) {
      const params = this.validateForm.value

      this.QuestionService.postFn('question/modify', params).subscribe((res: any) => {
        if (res.code === 0) {
          swal({ type: 'success', title: '系统提示 ', text: res['msg'] });
        } else {
          swal({ type: 'error', title: '系统提示 ', text: res['msg'] });
        }

      }); 
    }else{
      const params = this.validateForm.value

      this.QuestionService.postFn('question/save', params).subscribe((res: any) => {
        if (res.code === 0) {
          swal({ type: 'success', title: '系统提示 ', text: res['msg'] });
        } else {
          swal({ type: 'error', title: '系统提示 ', text: res['msg'] });
        }

      });
    }

  }
  /**返回函数 */
  Return() {
    const router = this.injector.get(Router);
    router.navigate(['/question/index']);
  }

  /**验证函数 */
  getFormControl(name) {
    return this.validateForm.controls[ name ];
  }

}
