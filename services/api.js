export const fetchAssignStore = async () => {
  const response = await fetch(`https://ecommstagingapi.tboo.com/admin/assign-store`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3Bob25lIjoiNzk4OTAzMDc0MSJ9.ZXYVhHb5N3ZQA7Y4Ph57lwtQ2_SLOAtUuMlUCekDas4',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      app_user_id: 19,
      role_id: 5,
    }),
  });

  const data = await response.json();
  return data?.data?.results;
};

export const UpdateAssignStore = async () => {
  const response = await fetch(`https://ecommstagingapi.tboo.com/admin/update-store-status`, {
    method: 'PUT',
    headers: {
      'accept': 'application/json',
      'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX3Bob25lIjoiNzk4OTAzMDc0MSJ9.ZXYVhHb5N3ZQA7Y4Ph57lwtQ2_SLOAtUuMlUCekDas4',
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      id: 1,
      store_id: 4,
      status: "in_progress",
      reject_reason: "string"
    }),
  });

  const data = await response.json();
  return data;
};

