import { NzModalService } from 'ng-zorro-antd';
import { Component, OnInit, Injector } from '@angular/core';
import swal from 'sweetalert2';
/**引入Service */
import { UsermanagementService } from '../usermanagement.service';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { UserAddComponent } from '../user-add/user-add.component';

@Component({
  selector: 'app-usermanagement',
  templateUrl: './usermanagement.component.html',
  styles: []
})
export class UsermanagementComponent implements OnInit {

  /**
   * 表格数据源
   */
  list: any = [];
  loading = false;
  pi = 1;
  ps = 10;
  total = 0;


  constructor(
    private fb: FormBuilder,
    private modal: NzModalService,
    private ser: UsermanagementService,
    private injector: Injector,
  ) { }

  /**
   * 初始化
   */
  ngOnInit() {
   this.queryFn();
  }

   /**
   * 查询
   */
  queryFn() {
    this.ser.getFn('user/query').subscribe(res => {
      if (res.code === 0) {
        this.list = res.data;
      }else {
        swal({ type: 'error', title: '系统提示 ', text: res['msg'] });
      }
    });
  }

  /**
   * 增加
   */
  addFn() {
    const router = this.injector.get(Router);
    router.navigate(['/user/update']);
  }

  /**
   * 修改
   */
  modifyFn(id) {
    const router = this.injector.get(Router);
    const lis = id;
    router.navigate(['/user/update',{list : lis}]);
  }

  /**
   *  删除
   */
  deleteFn(id) {
    this.ser.getFn('user/delete/?id=' + id).subscribe(res => {
      if (res.code === 0) {
        swal({ type: 'success', title: '系统提示 ', text: res['msg'] });
        this.queryFn();
      }else {
        swal({ type: 'error', title: '系统提示 ', text: res['msg'] });
      }
    });
  }

  /**
   * 重置密码
   */
  resetFn(data) {
    this.modal.open({
      wrapClassName: 'modal-md',
      content: UserAddComponent,
      footer: false,
      maskClosable: false,
      componentParams: {
        name: data.name,
        userName: data.userName
      }
    });
  }

}
