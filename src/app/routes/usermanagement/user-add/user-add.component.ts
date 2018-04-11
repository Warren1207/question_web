import { Params } from '@angular/router';
import { UsermanagementService } from '../usermanagement.service';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Component, OnInit, Input } from '@angular/core';
import { NzModalSubject, NzModalService} from 'ng-zorro-antd';
import { isNullOrUndefined } from 'util';
import swal, { SweetAlertType } from 'sweetalert2';
import { Observable } from 'rxjs/Observable';
import { map, delay, debounceTime } from 'rxjs/operators'; 
import { ModalHelper } from '@delon/theme';
import { ArrayObservable } from 'rxjs/observable/ArrayObservable';

@Component({
  selector: 'app-user-add',
  templateUrl: './user-add.component.html',
  styles: []
})
export class UserAddComponent implements OnInit {

  form: FormGroup;
  url: string;
  loading = false;
  @Input() name: any ;
  @Input() userName: any ;

  constructor( 
    private fb: FormBuilder,
    private subject: NzModalSubject,
    private ser: UsermanagementService, 
    private modal: NzModalService,) { }

  /**
   * 初始化
   */
  ngOnInit() {
    this.form = this.fb.group({
      newPassword: [ null, [ Validators.required ] ],
      checkPassword: [ null, [ Validators.required,  this.confirmationValidator] ]
    });
  }

  /**
   * 关闭模态框
   */
  cancelFn() {
    this.subject.destroy();
  }

  /**
   * 修改保存数据
   */
  ok() {
    const params:any = this.form.getRawValue();
    params.username = this.userName;
    delete params.checkPassword;
    this.ser.postFn('user/resetPassword',params).subscribe( res => {
      if (res.code === 0) {
        swal({type: 'success', title: '系统提示 ' , text: res['msg']});
        this.cancelFn();
      }else {
        swal({type: 'error', title: '系统提示 ' , text: res['msg']});
      }
    });
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
      } else if (control.value !== this.form.controls[ 'newPassword' ].value) {
        return { confirm: true, error: true };
      }
    };
  
    getCaptcha(e: MouseEvent) {
      e.preventDefault();
    }

}

