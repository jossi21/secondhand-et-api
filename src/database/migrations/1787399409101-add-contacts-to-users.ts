import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddContactsToUsers1787399409101 implements MigrationInterface {
  name = 'AddContactsToUsers1787399409101';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" ADD "contacts" jsonb`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "contacts"`);
  }
}
