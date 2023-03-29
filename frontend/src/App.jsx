import axios from "axios";
import { UserContextProvider } from "./contexts/UserContext";
import AllRoutes from "./routes/AllRoutes";

function App() {
  axios.defaults.baseURL = "http://localhost:8000";
  axios.defaults.withCredentials = true;

  return (
    <UserContextProvider>
      <AllRoutes />
    </UserContextProvider>
  );
}

export default App;
