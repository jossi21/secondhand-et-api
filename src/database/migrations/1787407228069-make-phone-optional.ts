import { MigrationInterface, QueryRunner } from "typeorm";

export class MakePhoneOptional1787407228069 implements MigrationInterface {
    name = 'MakePhoneOptional1787407228069'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "phone" DROP NOT NULL`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ALTER COLUMN "phone" SET NOT NULL`);
    }

}
