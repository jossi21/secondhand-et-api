import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddIsAdminToUsers1786794560057 implements MigrationInterface {
  name = 'AddIsAdminToUsers1786794560057';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "users" ADD "isAdmin" boolean NOT NULL DEFAULT false`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "isAdmin"`);
  }
}
