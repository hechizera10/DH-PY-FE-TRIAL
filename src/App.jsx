import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout.jsx";
import Home from "./pages/Home.jsx";
import Admin from "./pages/Admin.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Profile from "./pages/Profile.jsx";
import PolicyView from "./pages/PolicyView.jsx";
import ReservaDetalle from "./pages/ReservaDetalle.jsx";
import { useContextGlobal } from "./utils/global.context.jsx";
import WhatsAppIcon from "./components/WhatsAppIcon.jsx";

function App() {
	const { state } = useContextGlobal();
	//console.log(state.loggedUser?.apellido)
	return (
		<Router>
			<Routes>
				<Route path="/" element={<Layout />}>
					<Route index element={<Home />} />
					<Route
						path="/administracion"
						element={
							state.loggedUser?.rol[0]?.authority === "ADMIN" || state.loggedUser?.rol[0]?.authority === "COLAB" ? (
								<Admin />
							) : (
								<Home />
							)
						}
					/>

            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/politicas" element={<PolicyView />} />
            <Route path="/reservar/:id" element={<ReservaDetalle />} />
          </Route>
        </Routes>
		<WhatsAppIcon />
    </Router>
  );
}

export default App;
