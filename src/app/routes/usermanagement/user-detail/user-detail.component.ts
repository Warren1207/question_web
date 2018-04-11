import { Component, OnInit, Injector, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UsermanagementService } from '../usermanagement.service';
import { FormGroup, FormBuilder, Validators, FormControl} from '@angular/forms';
import { isNullOrUndefined } from 'util';
import swal from 'sweetalert2';
import { TitleService } from '@delon/theme';
import { ReuseTabService } from '@delon/abc';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.component.html',
  styles: []
})
export class UserDetailComponent implements OnInit {

  form: FormGroup;
  url: string;
  statueOptions = [];
  showType = false;

  id: number = this.activateInfo.snapshot.params["list"];

  constructor(
    private fb: FormBuilder,
    private injector: Injector,
    private ser: UsermanagementService,
    private titleSrv: TitleService,
    private reuseTabService: ReuseTabService,
    private activateInfo: ActivatedRoute
  ) {
  }

  ngOnInit() {
    this.form = this.fb.group({
      id: [null],
      customerId: [null],
      username: [null],
      name: [null],
      position: [null],
      mobile: [null],
      weixin: [null],
      qq: [null],
      skype: [null],
      email: [null, [ Validators.email ] ],
      statue: [null],
      isQuesstion: 0,
      isConfirm: 0,
      password: [ null, [ Validators.required ] ],
      checkPassword: [ null, [ Validators.required,  this.confirmationValidator] ],
    });

    this.statueOptions = [
      { value: 2, label: '激活' },
      { value: 4, label: '锁定' }
    ]

    this.init();
  }

  /** 初始化 */
  init() {

    const _title = '账号管理';
    this.titleSrv.setTitle(_title);
    this.reuseTabService.title = _title;

    if (isNullOrUndefined(this.id)) {
        this.showType = false;
    } else {
      this.showType = true;
      this.ser.getFn('user/queryid/?id=' + this.id).subscribe(res => {
        if (res.code === 0) {
          this.form.patchValue(res.data);
        }else {
          swal({ type: 'error', title: '系统提示 ', text: res['msg'] });
        }
      });
    }
  }

  cancelFn() {
    const router = this.injector.get(Router);
    router.navigate(['/user/index']);
  }

  ok() {
    const params:any = this.form.getRawValue();
    delete params.checkPassword;
    this.changeFn(params);
    /** this.list 是 null 为新增 否则为修改 */
    if (isNullOrUndefined(this.id)) {
      this.url = 'user/create';
    } else {
      delete params.password;
      this.url = 'user/modify';
    }
    this.ser.postFn(this.url, params).subscribe(res => {
      if (res.code === 0) {
        swal({ type: 'success', title: '系统提示 ', text: res['msg'] });
        this.cancelFn();
      }else {
        swal({ type: 'error', title: '系统提示 ', text: res['msg'] });
      }
    });
  }
  
  /** 字段转换 */
  changeFn(params) {
    if(params.isQuesstion) {
      params.isQuesstion = 1 ;
    }else{
      params.isQuesstion = 0 ;
    }
    if(params.isConfirm) {
      params.isConfirm = 1 ;
    }else{
      params.isConfirm = 0 ;
    }
  }

  /** 密码验证 */
  getFormControl(name) {
    return this.form.controls[ name ];
  }

  updateConfirmValidator() {
    /** wait for refresh value */
    setTimeout(_ => {
      this.form.controls[ 'checkPassword' ].updateValueAndValidity();
    });
  }

  confirmationValidator = (control: FormControl): { [s: string]: boolean } => {
    if (!control.value) {
      return { required: true };
    } else if (control.value !== this.form.controls[ 'password' ].value) {
      return { confirm: true, error: true };
    }
  };

  getCaptcha(e: MouseEvent) {
    e.preventDefault();
  }


}
