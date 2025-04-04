import "./App.css";
import { HomePage } from "./pages/HomePage";
import TripPage from "./pages/TripPage";
import ProfilePage from "./pages/ProfilePage";
import Footer from "./components/Footer";
import SavedTripsPage from "./pages/SavedTripsPage";
import CollabPage from "./pages/CollabPage";
import { Route, Routes, BrowserRouter } from "react-router-dom";
import GoogleMapsProvider from "./GoogleMapsProvider";

function App() {
  return (
    <GoogleMapsProvider>
      <BrowserRouter>
        <div className="App">
          <div className="content">
            <Routes>
              <Route exact path="/" element={<HomePage />}></Route>
              <Route exact path="/trips" element={<TripPage />}></Route>
              <Route
                exact
                path="/savedtrips"
                element={<SavedTripsPage />}
              ></Route>
              <Route exact path="/profile" element={<ProfilePage />}></Route>
              <Route exact path="/collaborate" element={<CollabPage />}></Route>
            </Routes>
          </div>
        </div>
      </BrowserRouter>
      <Footer />
    </GoogleMapsProvider>
  );
}

export default App;
