import Card from "@/components/commonComponents/Card";
import { useEffect } from "react";

export default function HomePage() {
  useEffect(() => {
    document.title = "Video Tracker & Planer";
  });

  return (
    <div className="container text-center" style={{width: '50%'}}>
      <Card title='Welcome to the Video Tracking & Planning app'>
        <div className="container text-center">
          <div className="row">
            <p>This is the home page of the App.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}