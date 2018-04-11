import { Component, OnDestroy, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NzMessageService } from 'ng-zorro-antd';
import { SettingsService } from '@delon/theme';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { SocialService, SocialOpenType, ITokenService, DA_SERVICE_TOKEN } from '@delon/auth';
import { environment } from '@env/environment';

@Component({
    selector: 'passport-login',
    templateUrl: './login.component.html',
    styleUrls: [ './login.component.less' ],
    providers: [ SocialService ]
})
export class UserLoginComponent implements OnDestroy {

    form: FormGroup;
    error = '';
    /** 表单类型，`0` 表示账密登录，`1` 表示手机登录 */
    type = 0;
    loading = false;

        /* http Post 请求 head类型 */
    httpHead = { headers: new HttpHeaders({ 'Content-Type': 'application/json' }) };
    

    constructor(
        fb: FormBuilder,
        private router: Router,
        public msg: NzMessageService,
        private settingsService: SettingsService,
        private socialService: SocialService,
        private http: HttpClient,
        @Inject(DA_SERVICE_TOKEN) private tokenService: ITokenService
    ) {
        this.form = fb.group({
            userName: [null, [Validators.required, Validators.minLength(5)]],
            password: [null, Validators.required],
            mobile: [null, [Validators.required, Validators.pattern(/^1\d{10}$/)]],
            captcha: [null, [Validators.required]],
            remember: [true]
        });
    }

    // region: fields

    get userName() { return this.form.controls.userName; }
    get password() { return this.form.controls.password; }
    get mobile() { return this.form.controls.mobile; }
    get captcha() { return this.form.controls.captcha; }

    // endregion

    switch(ret: any) {
        this.type = ret.index;
    }

    // region: get captcha

    count = 0;
    interval$: any;

    getCaptcha() {
        this.count = 59;
        this.interval$ = setInterval(() => {
            this.count -= 1;
            if (this.count <= 0)
                clearInterval(this.interval$);
        }, 1000);
    }

    // endregion

    submit() {
        this.error = '';
        if (this.type === 0) {
            this.userName.markAsDirty();
            this.password.markAsDirty();
            if (this.userName.invalid || this.password.invalid) return;
        } else {
            this.mobile.markAsDirty();
            this.captcha.markAsDirty();
            if (this.mobile.invalid || this.captcha.invalid) return;
        }
        // mock http
        this.loading = true;
        this.http.post('user/access/login',{
            "username": this.userName.value,
            "password": this.password.value
        }, this.httpHead).subscribe((res: any) => {
            if (res) {
                this.loading = false;
                if ( res.code !== 0 ) {
                    this.error = res.msg;
                    return;
                }
                const user: any = {
                    name: res.data.name,
                    avatar: './assets/img/zorro.svg',
                    email: res.data.email,
                    token: '123456789',
                    id: res.data.id,
                    username: res.data.username,
                    customerId: res.data.customerId,
                };
                this.settingsService.setUser(user);
                sessionStorage.setItem('customer_user_info_qw',JSON.stringify(user));
                this.router.navigate(['/']);
            }
        });
    }

    // endregion

    ngOnDestroy(): void {
        if (this.interval$) clearInterval(this.interval$);
    }
}
