import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    document.title = "Video Tracker & Planer";
  });

  return (
    <div className="container text-center">
      <div className="row">
        <h1>Welcome to the Video Tracking & Planning app</h1>
      </div>
      <div className="row">
        <p>This is the home page of the App.</p>
      </div>
    </div>
  );
}