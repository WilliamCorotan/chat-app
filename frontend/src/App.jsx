import axios from "axios";
import { UserContextProvider } from "./contexts/UserContext";
import Routes from "./routes/Routes";

function App() {
  axios.defaults.baseURL = "http://localhost:8000";
  axios.defaults.withCredentials = true;

  return (
    <UserContextProvider>
      <Routes />
    </UserContextProvider>
  );
}

export default App;
