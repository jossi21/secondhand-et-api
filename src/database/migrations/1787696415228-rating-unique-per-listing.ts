import { MigrationInterface, QueryRunner } from "typeorm";

export class RatingUniquePerListing1787696415228 implements MigrationInterface {
    name = 'RatingUniquePerListing1787696415228'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ratings" DROP CONSTRAINT "UQ_bd38a6b4a763c11b9034045fdf7"`);
        await queryRunner.query(`ALTER TABLE "ratings" ADD CONSTRAINT "UQ_f9cd2e3f50b449d0427975e858d" UNIQUE ("from_user_id", "listing_id")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ratings" DROP CONSTRAINT "UQ_f9cd2e3f50b449d0427975e858d"`);
        await queryRunner.query(`ALTER TABLE "ratings" ADD CONSTRAINT "UQ_bd38a6b4a763c11b9034045fdf7" UNIQUE ("from_user_id", "to_user_id")`);
    }

}
