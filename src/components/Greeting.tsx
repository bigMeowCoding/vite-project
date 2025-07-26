import React from "react";

export default function Greeting(props: { name: string; isLoggedIn: boolean }) {
  if (props.isLoggedIn) {
    return <div>Greeting {props.name}</div>;
  }
  return <div>Please login</div>;
}
