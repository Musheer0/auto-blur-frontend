// lib/create-google-user.ts
import prisma from "@/db";
import { createDodoCustomer } from "@/dodo/create-customer";
import { user } from "@/generated/prisma/client";
import { randomUUID } from "crypto";

type CreateGoogleUserParams = {
  email: string;
  name: string;
  picture?: string | null;
  expiryDate?: number | null;
  refreshToken?: string | null;
  scope?: string | null;
};

export const createGoogleUser = async ({
  email,
  name,
  picture,
  expiryDate,
  refreshToken,
  scope,
}: CreateGoogleUserParams): Promise<user> => {
  const newUser = await prisma.user.create({
    data: {
      email,
      name,
      picture,
      dodo_customer_id:randomUUID(),
      accounts: {
        create: {
          expires_at: new Date(expiryDate!),
          refresh_token: refreshToken ?? "not-found",
          scope: scope!,
        },
      },
      usage:{
        create:{}
      }
    },
  });

  const dodoCustomerId = await createDodoCustomer(
    newUser.email,
    newUser.name,
  );

  return prisma.user.update({
    where: {
      id: newUser.id,
    },
    data: {
      dodo_customer_id: dodoCustomerId,
    },
  });
};