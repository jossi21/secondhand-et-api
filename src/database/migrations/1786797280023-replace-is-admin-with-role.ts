import { MigrationInterface, QueryRunner } from "typeorm";

export class ReplaceIsAdminWithRole1786797280023 implements MigrationInterface {
    name = 'ReplaceIsAdminWithRole1786797280023'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "isAdmin" TO "role"`);
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`CREATE TYPE "public"."users_role_enum" AS ENUM('admin', 'seller', 'buyer')`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" "public"."users_role_enum" NOT NULL DEFAULT 'buyer'`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "role"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
        await queryRunner.query(`ALTER TABLE "users" ADD "role" boolean NOT NULL DEFAULT false`);
        await queryRunner.query(`ALTER TABLE "users" RENAME COLUMN "role" TO "isAdmin"`);
    }

}
