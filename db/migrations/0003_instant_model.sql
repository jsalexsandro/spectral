CREATE TABLE "InstantModel" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" text NOT NULL,
	"provider" text NOT NULL,
	"modelId" text NOT NULL,
	"enabled" boolean DEFAULT true NOT NULL,
	"createdAt" timestamp DEFAULT now() NOT NULL,
	"updatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX "InstantModel_userId_provider_modelId_key" ON "InstantModel" USING btree ("userId","provider","modelId");--> statement-breakpoint
CREATE INDEX "InstantModel_userId_idx" ON "InstantModel" USING btree ("userId");--> statement-breakpoint
ALTER TABLE "InstantModel" ADD CONSTRAINT "InstantModel_userId_user_id_fk" FOREIGN KEY ("userId") REFERENCES "public"."user"("id") ON DELETE cascade ON UPDATE no action;
