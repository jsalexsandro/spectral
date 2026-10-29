CREATE TABLE "AIKey" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"provider" text NOT NULL,
	"apiKey" text NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "AIKey_userId_provider_key" ON "AIKey" USING btree ("userId","provider");--> statement-breakpoint
CREATE INDEX "AIKey_userId_idx" ON "AIKey" USING btree ("userId");--> statement-breakpoint
ALTER TABLE "AIKey" ADD CONSTRAINT "AIKey_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
