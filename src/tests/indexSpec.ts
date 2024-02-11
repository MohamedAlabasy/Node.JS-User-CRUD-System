import app from '../index'
import supertest from 'supertest';
import { IUserTestingCaseData } from '../interface/user-testing-case-data.interface';

const request = supertest(app);

describe('check Endpoint API', (): void => {
    let currentLoginUser: IUserTestingCaseData;

    describe('check user Endpoint', (): void => {
        it('register => POST: /user/register', async (): Promise<void> => {
            const response: supertest.Response = await request.post('/user/register')
                .send({
                    name: "mohamed alabasy",
                    email: "eng.mohamed.alabasy@email.com",
                    password: "12346789+Aa",
                    age: 26,
                    country: "egypt",
                    mobile: "98610589069",

                    TESTING_SECRET_KEY:process.env.TESTING_SECRET_KEY // his key is send on testing only to create admin user
                })

            expect(response.status).toBe(200);
        });

        it('login => POST: /user/login', async (): Promise<void> => {
            const response: supertest.Response = await request.post('/user/login')
                .send({
                    email: "eng.mohamed.alabasy@email.com",
                    password: "12346789+Aa"
                })

            currentLoginUser = (response as any)._body
            expect(response.status).toBe(200);
        });

        it('get all users => GET: /user', async (): Promise<void> => {
            const response: supertest.Response = await request.get('/user')
                .set('Authorization', `Bearer ${currentLoginUser.token}`);

            expect(response.status).toBe(200);
        });

        it('get user by id => GET: /user', async (): Promise<void> => {
            const response: supertest.Response = await request.get(`/user/${currentLoginUser.id}`)
                .set('Authorization', `Bearer ${currentLoginUser.token}`);

            expect(response.status).toBe(200);
        });

        it('update user to be an admin => PATCH: /user/admin/:id', async (): Promise<void> => {
            const response: supertest.Response = await request.patch(`/user/admin/${currentLoginUser.id}`)
                .set('Authorization', `Bearer ${currentLoginUser.token}`)
                .send({ is_admin: true });

            expect(response.status).toBe(200);
        });

        it('update user => PATCH: /user/:id', async (): Promise<void> => {
            const response: supertest.Response = await request.patch(`/user/${currentLoginUser.id}`)
                .set('Authorization', `Bearer ${currentLoginUser.token}`)
                .send({
                    name: "alabasy",
                    password: "Password55+",
                    age: 28,
                    country: "egypt",
                    mobile: "98610589069"
                });

            expect(response.status).toBe(200);
        });

        it('delete user => DELETE: /user/:id', async (): Promise<void> => {
            const response: supertest.Response = await request.delete(`/user/${currentLoginUser.id}`)
                .set('Authorization', `Bearer ${currentLoginUser.token}`);

            expect(response.status).toBe(200);
        });

    });

    describe('check wrong login Endpoint', (): void => {
        it('POST /loginAnyThing', async (): Promise<void> => {
            const response: supertest.Response = await request.post('/loginAnyThing');

            expect(response.status).toBe(404);
        });
    });
});

