import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIconToCategories1787271993549 implements MigrationInterface {
  name = 'AddIconToCategories1787271993549';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "categories" ADD "icon" character varying`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "categories" DROP COLUMN "icon"`);
  }
}
