import { Link } from "react-router-dom";
import ExpandableNav from "../components/ExpandableNav";

const Footer = () => {
	return (
		<footer className="w-100 mt-5 mb-2 bg-footer">
			<div className="padding">
				<div className="container col-12 display-flex justify-space-between my-5 px-5 bg-footer-card">
					<div
						className="col-6 text-left py-2"
						style={{
							borderRight: "1px solid black",
							fontStyle: "italic",
						}}
					>
						<p>
							Project created in Summer 2024 by{" "}
							<span style={{ fontWeight: "bold" }}>
								<Link to="/about">KTetsuyama</Link>
							</span>
						</p>
						<p>
							<Link to="https://github.com/ktetsuyama">
								Keegan R.E.
							</Link>
						</p>
					</div>
					<div
						className="col-6 text-right py-2"
						style={{ fontStyle: "italic" }}
					>
						<p>
							<span style={{ fontWeight: "bold" }}>
								<Link to="https://github.com/ktetsuyama/everafter">
									Click here
								</Link>
							</span>{" "}
							to view the source code repo on GitHub!
						</p>
						<p>
							EverAfter utilizes the{" "}
							<span>
								<Link to="https://opensource.org/license/mit">
									standard MIT License
								</Link>
							</span>
						</p>
					</div>
				</div>
			</div>
			{/* ExpandableNav for mobile */}
			<ExpandableNav />
		</footer>
	);
};

export default Footer;
