import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { SettingsService } from '@delon/theme';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { DA_SERVICE_TOKEN, ITokenService } from '@delon/auth';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';

@Component({
    selector: 'header-user',
    templateUrl: './user.component.html'
})
export class HeaderUserComponent implements OnInit {

    isVisible: boolean = false;
    pwd: any = {};
    username: string = "";
    pwdDiff = false;
    userInfo: any={};

    pwdForm: FormGroup;

    constructor(
        public settings: SettingsService,
        private router: Router,
        private fb: FormBuilder,
        private httpClient: HttpClient,
        private msg: NzMessageService,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService) {}

    ngOnInit(): void {
        this.tokenService.change().subscribe((res: any) => {
            this.settings.setUser(res);
            this.username = this.settings.user.username;
        });
        if(sessionStorage.getItem('customer_user_info_qw')){
            this.userInfo = JSON.parse(sessionStorage.getItem('customer_user_info_qw'));

            this.username = this.userInfo ? this.userInfo.username : '';
        }


        this.pwdForm = this.fb.group({
            oldPassword         : [ null, [ Validators.required ] ],
            newPassword    : [ null, [ Validators.required,this.passwordValidate.bind(this) ] ],
            confirmPassword    : [ null, [ Validators.required,this.passwordValidate.bind(this) ] ]
          });
    }

    passwordValidate(control) {
        const formGroup = control.parent;
        if(formGroup){
            const pwd = formGroup.controls["newPassword"].value;
            const pwd_c = formGroup.controls["confirmPassword"].value;
            if( pwd && pwd_c ){
                if( pwd === pwd_c ){
                    this.pwdDiff = false;
                }else{
                    this.pwdDiff = true;
                }
            }else{
                this.pwdDiff = false;
            }
        }
    };

    logout() {
        this.tokenService.clear();
        this.router.navigateByUrl(this.tokenService.login_url);
    }

    showPwd() {
        this.isVisible = true;
    }

    cancel() {
        this.pwdForm.reset();
        this.isVisible = false;
    }

    confirm() {
          /* http Post 请求 head类型 */
        const httpHead = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
        const params : any = this.pwdForm.getRawValue();
        params["username"] = this.username;
        this.httpClient.post('user/access/resetPsw',params,httpHead)
        .subscribe((res: any) => {
            if( res.code !== 0 ){
                this.msg.error(res.msg);
                return;
            }
            this.msg.success('密码修改成功');
            this.isVisible = false;
        }, (err: HttpErrorResponse) => {
            this.msg.error(err.message);
        });
        
    }

    getFormControl(name) {
        return this.pwdForm.controls[ name ];
    }

}
