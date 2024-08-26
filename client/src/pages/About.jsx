import { React, useEffect, useState } from "react";
import ExpandableNav from "../components/ExpandableNav";
import Keegan from "../assets/keegan-img.png";

const About = () => {
	// Check device width
	const [isDesktop, setIsDesktop] = useState(window.innerWidth > 992);
	const [isTablet, setIsTablet] = useState(
		window.innerWidth > 768 && window.innerWidth < 992
	);
	const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

	useEffect(() => {
		const handleResize = () => {
			setIsDesktop(window.innerWidth > 992);
			setIsTablet(window.innerWidth > 768 && window.innerWidth < 992);
			setIsMobile(window.innerWidth < 768);
		};

		// Add/remove event listener as needed
		window.addEventListener("resize", handleResize);
		return () => {
			window.removeEventListener("resize", handleResize);
		};
	}, []);

	return (
		<>
			<div className="col-12 col-lg-10">
				<div className="card bg-white mt-2">
					<h4 className="card-header bg-primary text-primary p-2 pl-3">
						About me
					</h4>
					<div className="card-body mx-2">
						<hr className="mb-3" />
						<p>
							I am a developer that wanted to make an attractive
							timeline app to tell the story of the romance I
							found with my wife. I sought to create an elegant
							way to tell our story, and allow others to do the
							same.
						</p>
						<p>
							With this app, users can create a timeline of
							events, upload photos, and write stories to
							accompany them. These timelines can be kept as a
							private chronology of two people in love, or shared
							with the world as a public display of affection.
						</p>
					</div>
				</div>
				<div className="card bg-white mt-2">
					<h4 className="card-header bg-primary text-primary p-2 pl-3">
						Links
					</h4>
					<div className="card-body mx-2">
						<hr className="my-5" />
						<div className="profile-container">
							<img
								src={Keegan}
								alt="Profile picture for Keegan Royal-Eisenberg"
								className="small-image"
								style={{
									outline: "4px solid #2d3e50",
									border: "2px solid orange",
									borderRadius: "50%",
								}}
							/>
							<div className="profile-info w-75">
								<h4>Keegan Royal-Eisenberg</h4>
							</div>
							<div
								className={
									isDesktop
										? "profile-links w-25"
										: isTablet
										? "profile-links w-25"
										: "profile-links w-50"
								}
							>
								<a
									href="https://github.com/ktetsuyama"
									target="_blank"
									className="btn btn-md mb-1 btn-orange btn-github w-100"
								>
									GitHub
								</a>
								<a
									href="https://www.linkedin.com/in/keegan-royal-eisenberg/"
									target="_blank"
									className="btn btn-md mb-1 btn-orange btn-linkedin w-100"
								>
									LinkedIn
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
			{/* ExpandableNav for mobile */}
			<ExpandableNav />
		</>
	);
};

export default About;
