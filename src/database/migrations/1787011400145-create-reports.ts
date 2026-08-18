import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateReports1787011400145 implements MigrationInterface {
    name = 'CreateReports1787011400145'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "reports" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" uuid, "updated_by" uuid, "reason" text NOT NULL, "listing_id" uuid NOT NULL, "reported_by_id" uuid NOT NULL, CONSTRAINT "PK_d9013193989303580053c0b5ef6" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_d1cdc1ed639c70f2ec0bc33e16" ON "reports" ("listing_id") `);
        await queryRunner.query(`ALTER TABLE "reports" ADD CONSTRAINT "FK_d1cdc1ed639c70f2ec0bc33e166" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "reports" ADD CONSTRAINT "FK_fbb0cc68aaa46fae3cd0fd20b93" FOREIGN KEY ("reported_by_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "reports" DROP CONSTRAINT "FK_fbb0cc68aaa46fae3cd0fd20b93"`);
        await queryRunner.query(`ALTER TABLE "reports" DROP CONSTRAINT "FK_d1cdc1ed639c70f2ec0bc33e166"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_d1cdc1ed639c70f2ec0bc33e16"`);
        await queryRunner.query(`DROP TABLE "reports"`);
    }

}
