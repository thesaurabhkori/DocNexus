import React from "react";
import AppRoutes from "./routes/AppRoutes";

// 🔗 Correct absolute entry points targeting common workspace location
import UniversalWorkspace from './components/common/UniversalWorkspace';

function App() {
  return <AppRoutes />;
}

export default App;