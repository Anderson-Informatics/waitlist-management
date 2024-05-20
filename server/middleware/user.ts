import { serverSubabaseUser } from "#supabase/server";

export default defineEventHandler(async (event) => {
  const user = await serverSubabaseUser(event);
  event.context.user = user;
});
