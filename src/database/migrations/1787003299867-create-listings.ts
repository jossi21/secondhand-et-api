import { MigrationInterface, QueryRunner } from "typeorm";

export class CreateListings1787003299867 implements MigrationInterface {
    name = 'CreateListings1787003299867'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."listings_condition_enum" AS ENUM('brand_new', 'lightly_used', 'fair_condition')`);
        await queryRunner.query(`CREATE TYPE "public"."listings_status_enum" AS ENUM('active', 'sold', 'removed')`);
        await queryRunner.query(`CREATE TABLE "listings" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" uuid, "updated_by" uuid, "title" character varying NOT NULL, "description" text NOT NULL, "price" numeric(10,2) NOT NULL, "condition" "public"."listings_condition_enum" NOT NULL, "status" "public"."listings_status_enum" NOT NULL DEFAULT 'active', "city" character varying NOT NULL, "neighborhood" character varying, "viewCount" integer NOT NULL DEFAULT '0', "seller_id" uuid NOT NULL, "category_id" uuid NOT NULL, CONSTRAINT "PK_520ecac6c99ec90bcf5a603cdcb" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE INDEX "IDX_8b630da2e6546b091484b101ef" ON "listings" ("city") `);
        await queryRunner.query(`CREATE INDEX "IDX_139d0d17dc81520f3693d758f3" ON "listings" ("category_id", "status") `);
        await queryRunner.query(`CREATE TABLE "listing_images" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "deleted_at" TIMESTAMP, "created_by" uuid, "updated_by" uuid, "url" character varying NOT NULL, "sortOrder" integer NOT NULL DEFAULT '0', "listing_id" uuid NOT NULL, CONSTRAINT "PK_2abb5c9d795f27dbc4b10ced9dc" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "listings" ADD CONSTRAINT "FK_6d2846ee6b337ce5225c8c7286b" FOREIGN KEY ("seller_id") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "listings" ADD CONSTRAINT "FK_9315deed3e8f6d9171c23131418" FOREIGN KEY ("category_id") REFERENCES "categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "listing_images" ADD CONSTRAINT "FK_94041359df3c1b14c4420808d16" FOREIGN KEY ("listing_id") REFERENCES "listings"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "listing_images" DROP CONSTRAINT "FK_94041359df3c1b14c4420808d16"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP CONSTRAINT "FK_9315deed3e8f6d9171c23131418"`);
        await queryRunner.query(`ALTER TABLE "listings" DROP CONSTRAINT "FK_6d2846ee6b337ce5225c8c7286b"`);
        await queryRunner.query(`DROP TABLE "listing_images"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_139d0d17dc81520f3693d758f3"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_8b630da2e6546b091484b101ef"`);
        await queryRunner.query(`DROP TABLE "listings"`);
        await queryRunner.query(`DROP TYPE "public"."listings_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."listings_condition_enum"`);
    }

}
