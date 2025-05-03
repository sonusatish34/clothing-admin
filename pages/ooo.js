import React from "react";

const ComponentName = async (props) => {
  const resp = await fetch("https://jsonplaceholder.typicode.com/users");
  const ussers = await resp.json();

  return <div>oooo</div>;
};

export default ComponentName;
