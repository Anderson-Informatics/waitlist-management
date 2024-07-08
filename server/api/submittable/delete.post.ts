export default defineEventHandler(async (event) => {
  // Get data from body
  const body = await readBody(event);
  console.log(body);

  // Get the runtimeconfig SUBMITTABLE API KEY
  const SUBMITTABLE_API_KEY = useRuntimeConfig().SUBMITTABLE_API_KEY;

  // Update a result
  try {
    const acceptIds = {
      7326: "cef9335f-e06b-41c8-bffb-975987481145",
      2882: "37f66bbe-5835-461b-956c-fba3c3475618",
      689: "32b7f516-82a3-4383-9df8-b8c5544d1feb",
      3638: "2ee062a6-f3c3-4f05-bb9d-573cd593474c",
      1084: "b88d8e63-9bc3-4eaf-9bd1-9ef43cc49c4d",
      3639: "dbe83e8d-b4af-456a-ae3b-80f4e86e364a",
      1552: "b1c5e26e-3ac1-416c-9888-751ef472fdcc",
    };
    let labelId = acceptIds[body.SchoolID];
    console.log(`labelId: ${labelId} | API Key: ${SUBMITTABLE_API_KEY}`);
    // ${result.submissionId}
    const response = await $fetch(
      `https://submittable-api.submittable.com/v4/submissions/3d01655a-8034-43ca-86d1-db16be0b3601/labels/${labelId}`,
      {
        method: "DELETE",
        headers: {
          Accept: "application/json",
          Authorization: `Basic ${SUBMITTABLE_API_KEY}`,
        },
      }
    );
    return { message: "New accept label properly removed" };
  } catch (e) {
    throw createError({
      message: e.message,
    });
    return { message };
  }
});
