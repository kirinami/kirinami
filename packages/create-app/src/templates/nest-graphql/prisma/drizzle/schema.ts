import { pgTable, serial, text, timestamp, uniqueIndex } from 'drizzle-orm/pg-core'

export const Translation = pgTable('translations', {
	id: serial('id').notNull().primaryKey(),
	language: text('language').notNull(),
	key: text('key').notNull(),
	value: text('value').notNull(),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 }).notNull().defaultNow()
}, (Translation) => ({
	'Translation_language_key_unique_idx': uniqueIndex('Translation_language_key_key')
		.on(Translation.language, Translation.key)
}));

export const User = pgTable('users', {
	id: serial('id').notNull().primaryKey(),
	email: text('email').notNull().unique(),
	password: text('password').notNull(),
	roles: text('roles').array().notNull(),
	accessToken: text('accessToken'),
	refreshToken: text('refreshToken'),
	createdAt: timestamp('createdAt', { precision: 3 }).notNull().defaultNow(),
	updatedAt: timestamp('updatedAt', { precision: 3 }).notNull().defaultNow()
});