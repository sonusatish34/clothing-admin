export const fetchAssignStore = async () => {
  const response = await fetch(`https://api.zuget.com/admin/assign-store`, {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'Authorization': localStorage.getItem(`${localStorage.getItem('user_phone')}_token`),
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
  const response = await fetch(`https://api.zuget.com/admin/update-store-status`, {
    method: 'PUT',
    headers: {
      'accept': 'application/json',
      'Authorization': localStorage.getItem(`${localStorage.getItem('user_phone')}_token`),
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

