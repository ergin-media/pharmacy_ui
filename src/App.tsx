import "./App.css";
import { api } from "@/shared/api/axios";

function App() {
    api.get("/rx/").then(console.log).catch(console.error);
    return <></>;
}

export default App;
