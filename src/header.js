import React from "react";
import { Navbar, Nav } from "react-bootstrap";
import FavoriteIcon from "@material-ui/icons/Favorite";
export default function Header() {
	return (
		<Navbar collapseOnSelect expand="lg" sticky="top" bg="dark" variant="dark">
			<Navbar.Brand href="#">Swager CodeGen</Navbar.Brand>
			<Navbar.Toggle aria-controls="responsive-navbar-nav" />
			<Navbar.Collapse id="responsive-navbar-nav">
				<Nav className="mr-auto" />
				<Nav>
					<Nav.Link href="#deets">
						<span>Swagger Editor</span>
					</Nav.Link>
					<Nav.Link href="#deets">
						<span>Swagger UI</span>
					</Nav.Link>
					<Nav.Link href="#deets">
						<span>
							Made with <FavoriteIcon color="error" fontSize="small" /> by
							Yeshwanth
						</span>
					</Nav.Link>
				</Nav>
			</Navbar.Collapse>
		</Navbar>
	);
}
