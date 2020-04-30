# Migration `20200429135857-init`

This migration has been generated by Sergei Ovchinnikov at 4/29/2020, 1:58:57 PM.
You can check out the [state of the schema](./schema.prisma) after the migration.

## Database Steps

```sql
CREATE TYPE "Role" AS ENUM ('ROOT', 'ADMIN', 'CUSTOMER');

CREATE TYPE "OrderStatus" AS ENUM ('DONE', 'PROCESSING', 'NEW', 'CANCELED');

CREATE TABLE "public"."Item" (
    "asin" text  NOT NULL ,
    "categoryName" text  NOT NULL ,
    "createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" text  NOT NULL ,
    "isAvailable" boolean  NOT NULL DEFAULT true,
    "longDescription" text  NOT NULL ,
    "media" integer  NOT NULL ,
    "name" text  NOT NULL ,
    "price" integer  NOT NULL ,
    "primaryMedia" integer  NOT NULL ,
    "shortDescription" text  NOT NULL ,
    "stars" integer  NOT NULL DEFAULT 0,
    "stock" integer  NOT NULL ,
    "updatedAt" timestamp(3)  NOT NULL ,
    "userID" text  NOT NULL ,
    "vendorName" text  NOT NULL ,
    PRIMARY KEY ("id")
) 

CREATE TABLE "public"."Category" (
    "id" text  NOT NULL ,
    "name" text  NOT NULL ,
    "parentID" text   ,
    PRIMARY KEY ("id")
) 

CREATE TABLE "public"."Vendor" (
    "id" text  NOT NULL ,
    "name" text  NOT NULL ,
    PRIMARY KEY ("id")
) 

CREATE TABLE "public"."User" (
    "avatar" boolean  NOT NULL DEFAULT false,
    "createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" text  NOT NULL ,
    "id" text  NOT NULL ,
    "name" text   ,
    "password" text  NOT NULL ,
    "resetToken" text   ,
    "resetTokenExpiry" text   ,
    "role" "Role" NOT NULL DEFAULT 'CUSTOMER',
    PRIMARY KEY ("id")
) 

CREATE TABLE "public"."CartItem" (
    "id" text  NOT NULL ,
    "itemID" text  NOT NULL ,
    "qty" integer  NOT NULL ,
    "userID" text  NOT NULL ,
    PRIMARY KEY ("id")
) 

CREATE TABLE "public"."Order" (
    "charge" text  NOT NULL ,
    "createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" text  NOT NULL ,
    "status" "OrderStatus" NOT NULL DEFAULT 'NEW',
    "total" integer  NOT NULL ,
    "updatedAt" timestamp(3)  NOT NULL ,
    "userID" text  NOT NULL ,
    PRIMARY KEY ("id")
) 

CREATE TABLE "public"."OrderItem" (
    "id" text  NOT NULL ,
    "itemID" text  NOT NULL ,
    "name" text  NOT NULL ,
    "orderID" text  NOT NULL ,
    "price" integer  NOT NULL ,
    "primaryMedia" integer  NOT NULL ,
    "qty" integer  NOT NULL ,
    "userID" text  NOT NULL ,
    PRIMARY KEY ("id")
) 

CREATE TABLE "public"."Rating" (
    "createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dislikes" integer  NOT NULL DEFAULT 0,
    "id" text  NOT NULL ,
    "isVerified" integer  NOT NULL ,
    "itemID" text  NOT NULL ,
    "likes" integer  NOT NULL DEFAULT 0,
    "media" integer   ,
    "review" text   ,
    "stars" integer  NOT NULL ,
    "title" text   ,
    "userID" text  NOT NULL ,
    PRIMARY KEY ("id")
) 

CREATE TABLE "public"."RatingComment" (
    "createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" text  NOT NULL ,
    "ratingID" text  NOT NULL ,
    "text" text  NOT NULL ,
    "userID" text  NOT NULL ,
    PRIMARY KEY ("id")
) 

CREATE TABLE "public"."Question" (
    "createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" text  NOT NULL ,
    "itemID" text  NOT NULL ,
    "name" text  NOT NULL ,
    "votes" integer  NOT NULL DEFAULT 0,
    PRIMARY KEY ("id")
) 

CREATE TABLE "public"."Answer" (
    "createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dislikes" integer  NOT NULL DEFAULT 0,
    "id" text  NOT NULL ,
    "likes" integer  NOT NULL DEFAULT 0,
    "questionID" text  NOT NULL ,
    "text" text  NOT NULL ,
    "userID" text  NOT NULL ,
    PRIMARY KEY ("id")
) 

CREATE TABLE "public"."AnswerComment" (
    "answerID" text  NOT NULL ,
    "createdAt" timestamp(3)  NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "id" text  NOT NULL ,
    "text" text  NOT NULL ,
    "userID" text  NOT NULL ,
    PRIMARY KEY ("id")
) 

CREATE UNIQUE INDEX "Item.asin" ON "public"."Item"("asin")

CREATE UNIQUE INDEX "Category.name" ON "public"."Category"("name")

CREATE UNIQUE INDEX "Vendor.name" ON "public"."Vendor"("name")

CREATE UNIQUE INDEX "User.email" ON "public"."User"("email")

CREATE UNIQUE INDEX "User.resetToken" ON "public"."User"("resetToken")

ALTER TABLE "public"."Item" ADD FOREIGN KEY ("userID")REFERENCES "public"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Item" ADD FOREIGN KEY ("categoryName")REFERENCES "public"."Category"("name") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Item" ADD FOREIGN KEY ("vendorName")REFERENCES "public"."Vendor"("name") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Category" ADD FOREIGN KEY ("parentID")REFERENCES "public"."Category"("id") ON DELETE SET NULL  ON UPDATE CASCADE

ALTER TABLE "public"."CartItem" ADD FOREIGN KEY ("itemID")REFERENCES "public"."Item"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."CartItem" ADD FOREIGN KEY ("userID")REFERENCES "public"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Order" ADD FOREIGN KEY ("userID")REFERENCES "public"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."OrderItem" ADD FOREIGN KEY ("userID")REFERENCES "public"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."OrderItem" ADD FOREIGN KEY ("orderID")REFERENCES "public"."Order"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Rating" ADD FOREIGN KEY ("userID")REFERENCES "public"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Rating" ADD FOREIGN KEY ("itemID")REFERENCES "public"."Item"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."RatingComment" ADD FOREIGN KEY ("userID")REFERENCES "public"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."RatingComment" ADD FOREIGN KEY ("ratingID")REFERENCES "public"."Rating"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Question" ADD FOREIGN KEY ("itemID")REFERENCES "public"."Item"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Answer" ADD FOREIGN KEY ("questionID")REFERENCES "public"."Question"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."Answer" ADD FOREIGN KEY ("userID")REFERENCES "public"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."AnswerComment" ADD FOREIGN KEY ("userID")REFERENCES "public"."User"("id") ON DELETE CASCADE  ON UPDATE CASCADE

ALTER TABLE "public"."AnswerComment" ADD FOREIGN KEY ("answerID")REFERENCES "public"."Answer"("id") ON DELETE CASCADE  ON UPDATE CASCADE
```

## Changes

```diff
diff --git schema.prisma schema.prisma
migration ..20200429135857-init
--- datamodel.dml
+++ datamodel.dml
@@ -1,0 +1,167 @@
+datasource postgresql {
+  provider = "postgresql"
+  url      = env("DATABASE_URL")
+}
+
+generator client {
+  provider = "prisma-client-js"
+}
+
+model Item {
+  id               String     @id
+  name             String
+  price            Int
+  shortDescription String
+  longDescription  String
+  stock            Int
+  stars            Int        @default(0)
+  asin             String     @unique
+  media            Int
+  primaryMedia     Int
+  createdAt        DateTime   @default(now())
+  updatedAt        DateTime   @updatedAt
+  isAvailable      Boolean    @default(true)
+  ratings          Rating[]
+  questions        Question[]
+  user             User       @relation(fields: [userID], references: [id])
+  userID           String
+  category         Category   @relation(fields: [categoryName], references: [name])
+  categoryName     String
+  vendor           Vendor     @relation(fields: [vendorName], references: [name])
+  vendorName       String
+}
+
+model Category {
+  id       String    @default(cuid()) @id
+  name     String    @unique
+  parent   Category? @relation("CategoryToCategory", fields: [parentID], references: [id])
+  parentID String?
+}
+
+model Vendor {
+  id   String @default(cuid()) @id
+  name String @unique
+}
+
+model User {
+  id               String      @default(cuid()) @id
+  name             String?
+  email            String      @unique
+  password         String
+  avatar           Boolean     @default(false)
+  createdAt        DateTime    @default(now())
+  resetToken       String?     @unique
+  resetTokenExpiry String?
+  role             Role        @default(CUSTOMER)
+  cart             CartItem[]
+  items            Item[]
+  orders           Order[]
+  orderItems       OrderItem[]
+}
+
+model CartItem {
+  id     String @default(cuid()) @id
+  qty    Int
+  item   Item   @relation(fields: [itemID], references: [id])
+  itemID String
+  user   User   @relation(fields: [userID], references: [id])
+  userID String
+}
+
+model Order {
+  id         String      @id
+  total      Int
+  charge     String
+  createdAt  DateTime    @default(now())
+  updatedAt  DateTime    @updatedAt
+  status     OrderStatus @default(NEW)
+  orderItems OrderItem[]
+  user       User        @relation(fields: [userID], references: [id])
+  userID     String
+}
+
+model OrderItem {
+  id           String @default(cuid()) @id
+  name         String
+  primaryMedia Int
+  price        Int
+  qty          Int
+  itemID       String
+  user         User   @relation(fields: [userID], references: [id])
+  userID       String
+  order        Order  @relation(fields: [orderID], references: [id])
+  orderID      String
+}
+
+model Rating {
+  id         String          @default(cuid()) @id
+  stars      Int
+  title      String?
+  review     String?
+  media      Int?
+  likes      Int             @default(0)
+  dislikes   Int             @default(0)
+  isVerified Int
+  createdAt  DateTime        @default(now())
+  comments   RatingComment[]
+  user       User            @relation(fields: [userID], references: [id])
+  userID     String
+  item       Item            @relation(fields: [itemID], references: [id])
+  itemID     String
+}
+
+model RatingComment {
+  id        String   @default(cuid()) @id
+  text      String
+  createdAt DateTime @default(now())
+  user      User     @relation(fields: [userID], references: [id])
+  userID    String
+  rating    Rating   @relation(fields: [ratingID], references: [id])
+  ratingID  String
+}
+
+model Question {
+  id        String   @default(cuid()) @id
+  name      String
+  votes     Int      @default(0)
+  createdAt DateTime @default(now())
+  answers   Answer[]
+  item      Item     @relation(fields: [itemID], references: [id])
+  itemID    String
+}
+
+model Answer {
+  id         String          @default(cuid()) @id
+  text       String
+  likes      Int             @default(0)
+  dislikes   Int             @default(0)
+  createdAt  DateTime        @default(now())
+  comments   AnswerComment[]
+  question   Question        @relation(fields: [questionID], references: [id])
+  questionID String
+  user       User            @relation(fields: [userID], references: [id])
+  userID     String
+}
+
+model AnswerComment {
+  id        String   @default(cuid()) @id
+  text      String
+  createdAt DateTime @default(now())
+  user      User     @relation(fields: [userID], references: [id])
+  userID    String
+  answer    Answer   @relation(fields: [answerID], references: [id])
+  answerID  String
+}
+
+enum Role {
+  ROOT
+  ADMIN
+  CUSTOMER
+}
+
+enum OrderStatus {
+  DONE
+  PROCESSING
+  NEW
+  CANCELED
+}
```

