import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateSavedListingsAndRatings1787010523201 implements MigrationInterface {
    name = 'CreateSavedListingsAndRatings1787010523201'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "ratings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" uuid, "updated_by" uuid, "score" integer NOT NULL, "comment" text, "from_user_id" uuid NOT NULL, "to_user_id" uuid NOT NULL, CONSTRAINT "UQ_bd38a6b4a763c11b9034045fdf7" UNIQUE ("from_user_id", "to_user_id"), CONSTRAINT "PK_0f31425b073219379545ad68ed9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_0ab402c56fa2eb451efa04c76f" ON "ratings" ("to_user_id") `);
        await queryRunner.query(`CREATE TABLE "saved_listings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" uuid, "updated_by" uuid, "user_id" uuid NOT NULL, "listing_id" uuid NOT NULL, CONSTRAINT "UQ_424fc7d2f20ec2503690f0316e6" UNIQUE ("user_id", "listing_id"), CONSTRAINT "PK_76fecd34cd602bd01b86147e025" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_c254fef47020a5109201fe0ebf" ON "saved_listings" ("user_id") `);
        await queryRunner.query(`ALTER TABLE "ratings" ADD CONSTRAINT "FK_753b8e7442994cffcdf77581f4e" FOREIGN KEY ("from_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "ratings" ADD CONSTRAINT "FK_0ab402c56fa2eb451efa04c76fc" FOREIGN KEY ("to_user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "saved_listings" ADD CONSTRAINT "FK_c254fef47020a5109201fe0ebf0" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "saved_listings" ADD CONSTRAINT "FK_d5a474776e90e4df0c516dcba05" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "saved_listings" DROP CONSTRAINT "FK_d5a474776e90e4df0c516dcba05"`);
        await queryRunner.query(`ALTER TABLE "saved_listings" DROP CONSTRAINT "FK_c254fef47020a5109201fe0ebf0"`);
        await queryRunner.query(`ALTER TABLE "ratings" DROP CONSTRAINT "FK_0ab402c56fa2eb451efa04c76fc"`);
        await queryRunner.query(`ALTER TABLE "ratings" DROP CONSTRAINT "FK_753b8e7442994cffcdf77581f4e"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_c254fef47020a5109201fe0ebf"`);
        await queryRunner.query(`DROP TABLE "saved_listings"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_0ab402c56fa2eb451efa04c76f"`);
        await queryRunner.query(`DROP TABLE "ratings"`);
    }

}
