import React from "react";
import "./styles.css";
import Header from "./header";
import { APIData } from "./APIData";

export default function App() {
	return (
		<div className="App">
			<Header />
			<APIData />
		</div>
	);
}
