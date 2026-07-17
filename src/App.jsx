import React, { useEffect, useState } from "react";
import AppRoutes from "./routes/AppRoutes";
import ScaletenLoader from "./components/common/ScaletenLoader";

function App() {
  const [isLoaded, setIsLoaded] = useState(document.readyState === "complete");

  useEffect(() => {
    const handleLoad = () => setIsLoaded(true);

    if (document.readyState !== "complete") {
      window.addEventListener("load", handleLoad);
    }

    return () => window.removeEventListener("load", handleLoad);
  }, []);

  useEffect(() => {
    const placeholder = document.getElementById("app-startup-loader");
    const rootElement = document.getElementById("root");

    if (isLoaded) {
      if (placeholder) placeholder.style.display = "none";
      if (rootElement) rootElement.style.display = "";
      document.body.style.overflow = "";
    } else {
      if (rootElement) rootElement.style.display = "none";
      document.body.style.overflow = "hidden";
    }
  }, [isLoaded]);

  return (
    <>
      {!isLoaded && <ScaletenLoader />}
      <div className={isLoaded ? "" : "hidden"}>
        <AppRoutes />
      </div>
    </>
  );
}

export default App;
