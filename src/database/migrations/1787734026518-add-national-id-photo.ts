import { MigrationInterface, QueryRunner } from "typeorm";

export class AddNationalIdPhoto1787734026518 implements MigrationInterface {
    name = 'AddNationalIdPhoto1787734026518'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "nationalIdPhotoUrl" character varying`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "nationalIdPhotoUrl"`);
    }

}
