import { type Page, type Locator } from "@playwright/test";

type SignupField = 'username' | 'password' | 'lastname' | 'firstname' | 'dob' | '';

export class SignupPage {
    readonly page: Page;
    readonly signup: Locator;
    readonly username: Locator;
    readonly password: Locator;
    readonly lastname: Locator;
    readonly firstname: Locator;
    readonly dob: Locator;
    readonly createAcount: Locator;
    readonly homelink: Locator;
    readonly banner: Locator;
    readonly shipIcon: Locator;
    readonly shipTitle: Locator;
    readonly shipDescrible: Locator;
    readonly returnIcon: Locator;
    readonly returnTitle: Locator;
    readonly returnDescrible: Locator;
    readonly paymentIcon: Locator;
    readonly paymentTitle: Locator;
    readonly paymentDescrible: Locator;
    readonly formAlert: Locator;

    constructor (page: Page) {
        this.page = page;
        this.signup = page.getByRole('link', { name: 'Đăng ký' });
        this.username = page.getByRole('textbox', { name: 'Tên đăng nhập' });
        this.password = page.getByRole('textbox', { name: 'Mật khẩu' });
        this.lastname = page.getByRole('textbox', { name: 'Họ' });
        this.firstname = page.getByRole('textbox', { name: 'Tên', exact: true });
        this.dob = page.getByRole('textbox', { name: 'Ngày sinh' });
        this.createAcount = page.getByRole('button', { name: 'Tạo tài khoản' });
        this.homelink = page.getByRole('link', { name: 'Quini Bear, về trang chủ' });
        this.banner = page.getByText('Chất liệu tử tế, phong cách c');
        this.shipIcon = page.locator('span').nth(5);
        this.shipTitle = page.getByText('Giao nhanh toàn quốc');
        this.shipDescrible = page.getByText('Theo dõi đơn hàng từng bước,');
        this.returnIcon = page.locator('li:nth-child(2) > .au__benefit-icon');
        this.returnTitle = page.getByText('Đổi trả trong 7 ngày');
        this.returnDescrible = page.getByText('Không vừa ý? Chúng tôi đổi');
        this.paymentIcon = page.locator('li:nth-child(3) > .au__benefit-icon');
        this.paymentTitle = page.getByText('Thanh toán an toàn');
        this.paymentDescrible = page.getByText('MoMo hoặc COD, thông tin của');
        this.formAlert = page.getByRole('alert');

    }

    async goToSignup (){
        await this.page.goto('/');
        await this.signup.click();

    }


    async fillInfor(username: string, password: string, firstname: string, lastname: string, dob: string){
        await this.username.fill(username);
        await this.password.fill(password);
        await this.lastname.fill(lastname);
        await this.firstname.fill(firstname);
        await this.dob.fill(dob);
        await this.createAcount.click();
    }

    

    errorOf(field: SignupField) {
    return this.page.locator(`#signup-${field}-msg`);
}

}