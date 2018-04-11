import { Component, OnInit, Injector, Input } from '@angular/core';
import { _HttpClient, TitleService } from '@delon/theme';
import { NzMessageService } from 'ng-zorro-antd';
import { FormBuilder } from '@angular/forms';
import { QuestionService } from '../question.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ReuseTabService } from '@delon/abc';
import swal from 'sweetalert2';

@Component({
  selector: 'app-summaryquestion',
  templateUrl: './summaryquestion.component.html',
  styleUrls: ['./summaryquestion.component.less'],
})
export class SummaryquestionComponent implements OnInit {
  timeCreated: any;
  workHour: any;
  html: string;
  options = [];
  data: any = {};

  /**接收传值 */
  id = this.route.snapshot.queryParams.id;
  statue = this.route.snapshot.queryParams.statue;

  constructor(private http: _HttpClient,
    public msg: NzMessageService,
    private fb: FormBuilder,
    private injector: Injector,
    private titleSrv: TitleService,
    private route: ActivatedRoute,
    private reuseTabService: ReuseTabService,
    private QuestionService: QuestionService) { }

  ngOnInit() {

    /**跳转页面显示的标题头 */
    const _title = '问题摘要';
    this.titleSrv.setTitle(_title);
    this.reuseTabService.title = _title;
  
    /**查询请求 */
    this.seeFn(this.id,this.statue);
  }
  /**返回函数 */
  callbackFn() {
    const router = this.injector.get(Router);
    router.navigate(['/question/index']);
  }

  /**查看函数 */
  seeFn(id,statue) {
    if(statue =='32'){
      this.QuestionService.getFn('question/closeInfo/?id=' + id).subscribe((res: any) => {
        if (res.code === 0) {
          this.workHour = res.data.workHour;
          this.timeCreated = res.data.timeCreated;
        } else {
          swal({ type: 'error', title: '系统提示 ', text: res['msg'] });
        }
  
      });
    }
    this.QuestionService.getFn('question/getInfo/?id=' + id).subscribe((res: any) => {
      if (res.code === 0) {
        this.data = res.data.issue;
        this.data.content = res.data.issueBody.content;
      } else {
        swal({ type: 'error', title: '系统提示 ', text: res['msg'] });
      }

    });
    this.QuestionService.getFn('question/replyList/?id=' + id).subscribe((res: any) => {
      if (res.code === 0) {
        this.options = res.data;
      } else {
        swal({ type: 'error', title: '系统提示 ', text: res['msg'] });
      }

    });
  }

  /**审核通过 */
  examine(){
    this.QuestionService.getFn('question/confirm/?id=' + this.data.id).subscribe((res: any) => {
      if (res.code === 0) {
        swal({ type: 'success', title: '系统提示 ', text: res['msg'] });
      } else {
        swal({ type: 'error', title: '系统提示 ', text: res['msg'] });
      }
    });
  }

  /** 同意结案 */
  closedFn() {
    this.QuestionService.getFn('question/acceptClose/?id=' + this.data.id).subscribe((res: any) => {
      if (res.code === 0) {
        swal({ type: 'success', title: '系统提示 ', text: res['msg'] });
      } else {
        swal({ type: 'error', title: '系统提示 ', text: res['msg'] });
      }
    });
  }

  /** 继续提问 */
  continueFn() {
    const params = {
      issueId: this.data.id,
      content: this.data.content
    }
    this.QuestionService.postFn('question/keepQuestion', params).subscribe((res: any) => {
      if (res.code === 0) {
        swal({ type: 'success', title: '系统提示 ', text: res['msg'] });
        this.seeFn(this.id,this.statue);
      } else {
        swal({ type: 'error', title: '系统提示 ', text: res['msg'] });
      }
    });
  }
}
