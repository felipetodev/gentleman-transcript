import { NextRequest } from "next/server";
import { headers } from "next/headers";
import { Webhook } from "svix";
import { db } from "@/server/db";
import { users } from "@/server/db/schema";
import { env } from "@/env";
import { type WebhookEvent } from "@clerk/nextjs/server";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const webhookSecret = env.CLERK_WEBHOOK_SECRET;

  if (!webhookSecret) {
    throw new Error("Missing webhook secret");
  }

  const headerPayload = headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    });
  }

  // Get the body
  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(webhookSecret);

  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (e) {
    console.error("Failed to verify webhook", e);
    return new Response("Error occured", {
      status: 400,
    });
  }

  const { id } = evt.data;
  const eventType = evt.type;

  const userInfo = getUserInfo(payload);

  switch (eventType) {
    case "user.created": {
      await db.insert(users).values({
        userId: id,
        name: userInfo.name,
        email: userInfo.email,
        imageUrl: userInfo.avatarUrl,
      }).onConflictDoUpdate({
        target: users.userId,
        set: {
          userId: id,
          name: userInfo.name,
          email: userInfo.email,
          imageUrl: userInfo.avatarUrl
        }
      })

      break;
    }
    default: {
      console.log(`Unhandled event type: ${eventType}`);
    }
  }

  return new Response("", { status: 201 });
}

interface EmailAddress {
  email_address: string;
  id: string;
  linked_to: Array<{ id: string; type: string }>;
  object: string;
  reserved: boolean;
  verification: {
    attempts: null | number;
    expire_at: null | number;
    status: string;
    strategy: string;
  };
}

interface ExternalAccount {
  approved_scopes: string;
  avatar_url: string;
  email_address: string;
  first_name: string;
  id: string;
  identification_id: string;
  image_url: string;
  label: null | string;
  last_name: string;
  object: string;
  provider: string;
  provider_user_id: string;
  public_metadata: {};
  username: string;
  verification: {
    attempts: null | number;
    expire_at: null | number;
    status: string;
    strategy: string;
  };
}

interface Payload {
  data: {
    backup_code_enabled: boolean;
    banned: boolean;
    birthday: string;
    create_organization_enabled: boolean;
    created_at: number;
    delete_self_enabled: boolean;
    email_addresses: EmailAddress[];
    external_accounts: ExternalAccount[];
    external_id: null | string;
    first_name: string;
    gender: string;
    has_image: boolean;
    id: string;
    image_url: string;
    last_name: string;
    last_sign_in_at: null | number;
    locked: boolean;
    object: string;
    password_enabled: boolean;
    phone_numbers: any[];
    primary_email_address_id: string;
    primary_phone_number_id: null | string;
    primary_web3_wallet_id: null | string;
    private_metadata: {};
    profile_image_url: string;
    public_metadata: {};
    saml_accounts: any[];
    totp_enabled: boolean;
    two_factor_enabled: boolean;
    unsafe_metadata: {};
    updated_at: number;
    username: string;
    web3_wallets: any[];
  };
  object: string;
  type: string;
}

function getUserInfo(payload: Payload) {
  const data = payload.data;
  const emailData = data.email_addresses[0];
  const externalAccountData = data.external_accounts[0];

  const userInfo = {
    name: `${data.first_name} ${data.last_name}`,
    email: emailData.email_address,
    avatarUrl: data.image_url,
  };

  return userInfo;
}
