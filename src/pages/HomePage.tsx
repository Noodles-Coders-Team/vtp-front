import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    document.title = "Weather Control";
  });

  return (
    <div className="container text-center">
      <div className="row">
        <h1>Welcome to the Weather App</h1>
      </div>
      <div className="row">
        <p>This is the home page of the Weather App.</p>
      </div>
    </div>
  );
}