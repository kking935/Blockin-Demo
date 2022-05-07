import { BlockinIcon, GitHubIcon } from "./icons";

const Footer = () => {
	return (
		<>
			<footer>
				<a id='demo-code' target='__blank' href='https://github.com/kking935/blockin-demo'>
					<GitHubIcon />
					<p>Demo Source Code</p>
				</a>
				
				<a id='src-code' target='__blank' href='https://github.com/matt-davison/blockin'>
					<BlockinIcon dimensions="27pt"/>
					<p>Blockin Source Code</p>
				</a>
			</footer>
		</>
	);
};

export default Footer;
