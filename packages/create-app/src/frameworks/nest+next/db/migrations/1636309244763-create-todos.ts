import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateTodos1636309244763 implements MigrationInterface {
  name = 'CreateTodos1636309244763';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE "todos" (
        "id" SERIAL NOT NULL,
        "userId" integer NOT NULL,
        "title" character varying NOT NULL,
        "completed" boolean NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        CONSTRAINT "PK_ca8cafd59ca6faaf67995344225" PRIMARY KEY ("id")
      )
    `);
    await queryRunner.query(`
      ALTER TABLE "todos"
      ADD CONSTRAINT "FK_4583be7753873b4ead956f040e3" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE NO ACTION ON UPDATE NO ACTION
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      ALTER TABLE "todos" DROP CONSTRAINT "FK_4583be7753873b4ead956f040e3"
    `);
    await queryRunner.query(`
      DROP TABLE "todos"
    `);
  }
}
