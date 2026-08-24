import { MigrationInterface, QueryRunner } from "typeorm";

export class AddListingToRatings1787520947186 implements MigrationInterface {
    name = 'AddListingToRatings1787520947186'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ratings" ADD "listing_id" uuid`);
        await queryRunner.query(`ALTER TABLE "ratings" ADD CONSTRAINT "FK_071a75eaab42bd7f0b170fe708e" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "ratings" DROP CONSTRAINT "FK_071a75eaab42bd7f0b170fe708e"`);
        await queryRunner.query(`ALTER TABLE "ratings" DROP COLUMN "listing_id"`);
    }

}
