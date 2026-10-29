CREATE TYPE "public"."MessageRole" AS ENUM('user', 'assistant', 'system');--> statement-breakpoint
CREATE TABLE "Message" (
	"id" text PRIMARY KEY NOT NULL,
	"chatId" text NOT NULL,
	"role" "MessageRole" NOT NULL,
	"content" text NOT NULL,
	"parts" jsonb NOT NULL,
	"provider" text,
	"model" text,
	"inputTokens" integer,
	"outputTokens" integer,
	"createdAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Chat" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"title" text DEFAULT 'Nova conversa' NOT NULL,
	"provider" text,
	"model" text,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Message" ADD CONSTRAINT "Message_chatId_Chat_id_fk" FOREIGN KEY ("chatId") REFERENCES "public"."Chat"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE INDEX "Message_chatId_createdAt_idx" ON "Message" USING btree ("chatId","createdAt");--> statement-breakpoint
CREATE INDEX "Chat_userId_updatedAt_idx" ON "Chat" USING btree ("userId","updatedAt");