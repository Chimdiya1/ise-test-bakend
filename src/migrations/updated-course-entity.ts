import { MigrationInterface, QueryRunner } from 'typeorm';

export class UpdatedCourseEntity1693202018727 implements MigrationInterface {
    name = 'UpdatedCourseEntity1693202018727';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TYPE "public"."users_role_enum" AS ENUM('user', 'admin')`
        );
        await queryRunner.query(
            `CREATE TABLE "users" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."users_role_enum" NOT NULL DEFAULT 'user', "fullName" character varying NOT NULL, CONSTRAINT "UQ_97672ac88f789774dd47f7c8be3" UNIQUE ("email"), CONSTRAINT "PK_a3ffb1c0c8416b9fc6f907b7433" PRIMARY KEY ("id"))`
        );
        await queryRunner.query(
            `CREATE INDEX "email_index" ON "users" ("email") `
        );

        await queryRunner.query(
            `CREATE TABLE "courses" ("id" SERIAL NOT NULL, "created_at" TIMESTAMP NOT NULL DEFAULT now(), "updated_at" TIMESTAMP NOT NULL DEFAULT now(), "fileName" character varying NOT NULL, "fileSize" integer NOT NULL, "fileUrl" character varying NOT NULL, "mimetype" character varying NOT NULL, "unsafe" boolean NOT NULL DEFAULT false, "positiveReviews" integer NOT NULL DEFAULT '0', "negativeReviews" integer NOT NULL DEFAULT '0', "reviewed" integer NOT NULL DEFAULT '0', "folderId" integer, "userId" integer, CONSTRAINT "PK_6c16b9093a142e0e7613b04a3d9" PRIMARY KEY ("id"))`
        );

        await queryRunner.query(
            `ALTER TABLE "courses" ADD CONSTRAINT "FK_24dfe39188240d442f380dd8c04" FOREIGN KEY ("folderId") REFERENCES "folders"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
        await queryRunner.query(
            `ALTER TABLE "courses" ADD CONSTRAINT "FK_7e7425b17f9e707331e9a6c7335" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION`
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "courses" DROP CONSTRAINT "FK_7e7425b17f9e707331e9a6c7335"`
        );
        await queryRunner.query(
            `ALTER TABLE "courses" DROP CONSTRAINT "FK_24dfe39188240d442f380dd8c04"`
        );
        await queryRunner.query(`DROP TABLE "courses"`);
        await queryRunner.query(`DROP INDEX "public"."email_index"`);
        await queryRunner.query(`DROP TABLE "users"`);
        await queryRunner.query(`DROP TYPE "public"."users_role_enum"`);
    }
}
