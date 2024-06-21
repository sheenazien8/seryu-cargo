import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { Repository } from 'typeorm';
import { Driver } from 'src/entities/driver.entity';

function hasErrorMessage(message: string[], errorMessage: string[]): boolean {
  return errorMessage.some((error) => message.includes(error));
}

describe('DriverSalaryController (e2e)', () => {
  let app: INestApplication;
  let repository: Repository<Driver>;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleFixture.createNestApplication();
    await app.init();

    repository = moduleFixture.get('DriverRepository');
  });

  afterAll(async () => {
    await app.close();
  });

  describe('/salary/driver/list (GET)', () => {
    it('200OK', async () => {
      const response = await request(app.getHttpServer())
        .get('/salary/driver/list')
        .query({
          month: 3,
          year: 2024,
          current: 1,
          page_size: 10,
        })
        .expect(200);

      expect(response.body).toHaveProperty('data');
      expect(response.body).toHaveProperty('total_rows');
      expect(response.body).toHaveProperty('current');
      expect(response.body).toHaveProperty('page_size');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it("month params should be filled", async () => {
      const response = await request(app.getHttpServer())
        .get('/salary/driver/list')
        .query({
          year: 2024
        })
        .expect(400);
      const message = response.body.message as Array<string>;
      const errorMessage = [
        'month must not be greater than 12',
        'month must not be less than 1',
        'month must be an integer number',
        'month should not be empty',
      ];

      expect(hasErrorMessage(message, errorMessage)).toBe(true);
    });

    it("year params should be filled", async () => {
      const response = await request(app.getHttpServer())
        .get('/salary/driver/list')
        .query({
          month: 4
        })
        .expect(400);
      const message = response.body.message as Array<string>;
      const errorMessage = [
        'year must not be less than 1997',
        'year should not be empty',
        'year must be an integer number'
      ];

      expect(hasErrorMessage(message, errorMessage)).toBe(true);
    });

    it("status params should be contains [PENDING, CONFIRMED, PAID, UNDFINED]", async () => {
      const response = await request(app.getHttpServer())
        .get('/salary/driver/list')
        .query({
          month: 4,
          year: 2024,
          status: 'NOTFOUND'
        })
        .expect(400);
      const message = response.body.message as Array<string>;
      const errorMessage = ['status must be one of the following values: PENDING, CONFIRMED, PAID, , UNDEFINED'];

      expect(hasErrorMessage(message, errorMessage)).toBe(true);
    });
  });
});

