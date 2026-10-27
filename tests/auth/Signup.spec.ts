import { test, expect} from '../../fixtures/fixtures';
import { createUser } from '../../data/userFactory';
import { faker } from '@faker-js/faker';


test.describe('test đang ky', () => {
    test('dang ky khong dien username', async ({openedSigupPage, page}) => {
        const user = createUser();
        await openedSigupPage.fillInfor('', user.password, user.firstname, user.lastname, user.dob);
        await expect(openedSigupPage.errorOf('username')).toHaveText('Tên đăng nhập tối thiểu 3 ký tự');
        await openedSigupPage.errorOf('username').scrollIntoViewIfNeeded();
        await page.screenshot({ path: 'screenshots/username-error.png' })
    });

    test('dang ky khong dien password', async ({openedSigupPage, page}) => {
        const user = createUser();
        await openedSigupPage.fillInfor(user.username, '', user.firstname, user.lastname, user.dob);
        await expect(openedSigupPage.errorOf('password')).toHaveText('Mật khẩu tối thiểu 8 ký tự');
        await openedSigupPage.errorOf('password').scrollIntoViewIfNeeded();
        await page.screenshot({ path: 'screenshots/password-error.png' })
    });

    test('dang ky khong dien First name' , async ({openedSigupPage, page}) => {
        const user = createUser();
        await openedSigupPage.fillInfor(user.username, user.password, '', user.lastname, user.dob);
        await expect(openedSigupPage.errorOf('firstname')).toHaveText('Vui lòng nhập tên');
        await openedSigupPage.errorOf('firstname').scrollIntoViewIfNeeded();
        await page.screenshot({ path: 'screenshots/firstname-error.png' })
    });

    test('dang ky khong dien Last name', async ({openedSigupPage, page}) => {
        const user = createUser();
        await openedSigupPage.fillInfor(user.username, user.password, user.firstname, '', user.dob);
        await expect(openedSigupPage.errorOf('lastname')).toHaveText('Vui lòng nhập họ');
        await openedSigupPage.errorOf('lastname').scrollIntoViewIfNeeded();
        await page.screenshot({ path: 'screenshots/lastname-error.png' })
    });

    test('dang ky khong dien DOB', async ({openedSigupPage, page}) => {
        const user = createUser();
        await openedSigupPage.fillInfor(user.username, user.password, user.firstname, user.lastname, '');
        await expect(openedSigupPage.errorOf('dob')).toHaveText('Vui lòng chọn ngày sinh');
        await openedSigupPage.errorOf('dob').scrollIntoViewIfNeeded();
        await page.screenshot({ path: 'screenshots/dob-error.png' })
    });

    test('dang ky khong du tuoi', async ({openedSigupPage, page}) => {
        const user = createUser();
        await openedSigupPage.fillInfor(user.username, user.password, user.firstname, user.lastname, faker.date.birthdate({ min: 1, max: 9, mode: 'age' }).toISOString().slice(0, 10));
        await expect(openedSigupPage.formAlert).toHaveText('Your age must be at least 10');
        await page.screenshot({ path: 'screenshots/dobNotEnough-error.png' })
    });

    test('tai khoan da ton tai', async ({openedSigupPage, page}) => {
        await openedSigupPage.fillInfor('cuong123123', '12345678', 'Cuong', 'Tran', '1996-06-09');
        await expect(openedSigupPage.formAlert).toHaveText('User Existed');
        await page.screenshot({ path: 'screenshots/existedUser-error.png' })
    });

    test('dang ky thanh cong', async ({openedSigupPage, page}) => {
        const user = createUser();
        await openedSigupPage.fillInfor(user.username, user.password, user.firstname, user.lastname, user.dob);
        await expect(page.getByRole('button', { name: user.username })).toContainText(user.username);
        await page.screenshot({ path: 'screenshots/Signup-success.png' })
    });
})
