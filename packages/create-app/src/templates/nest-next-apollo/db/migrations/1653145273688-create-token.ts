import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateToken1653145273688 implements MigrationInterface {
  name = 'CreateToken1653145273688';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "tokens" (
        "id" SERIAL NOT NULL,
        "userId" integer,
        "key" character varying NOT NULL,
        "value" character varying NOT NULL,
        "ttl" integer NOT NULL DEFAULT '-1',
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_3001e89ada36263dabf1fb6210a" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_ae77625cd9ffb11a3b61b64280" ON "tokens"("key") WHERE (("userId") IS NULL)`);
    await queryRunner.query(`CREATE UNIQUE INDEX "IDX_40d99c7e6591cbd1d1409aac60" ON "tokens"("userId", "key") WHERE (("userId") IS NOT NULL)`);
    await queryRunner.query(`
      ALTER TABLE "tokens"
      ADD CONSTRAINT "FK_d417e5d35f2434afc4bd48cb4d2" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "tokens" DROP CONSTRAINT "FK_d417e5d35f2434afc4bd48cb4d2"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_40d99c7e6591cbd1d1409aac60"`);
    await queryRunner.query(`DROP INDEX "public"."IDX_ae77625cd9ffb11a3b61b64280"`);
    await queryRunner.query(`DROP TABLE "tokens"`);
  }
}
