import { Command } from "commander";
import figlet from "figlet";
import { readdir, mkdir, stat, open } from "node:fs/promises";
import path from "node:path";

const program = new Command();

console.log(figlet.textSync("Dir Manager", "ANSI Shadow"));

program
	.version("1.0.0")
	.description("An example CLI for managing a directory")
	.option("-l, --ls, --list [value]", "List directory content")
	.option("-m, --mkdir <value>", "Create a directory")
	.option("-t, --touch <value>", "Create a file")
	.parse(process.argv);

const options = program.opts();

async function listDirContents(filepath: string) {
	try {
		const files = await readdir(filepath);
		const promises = files.map(async (file: string) => {
			const route = path.resolve(filepath, file);

			const { size, birthtime } = await stat(route);

			return {
				"File Name": file,
				"Size (MB)": size / 1000,
				"Created At": birthtime,
			};
		});

		const detailedFiles = await Promise.all(promises);
		console.table(detailedFiles);
	} catch (error) {
		console.error("Error occurred while reading the diretory!", error);
	}
}

async function createDir(filepath: string) {
	let exists = false;
	try {
		const stats = await stat(filepath);
		exists = stats.isDirectory();
	} catch (error) {
		exists = false;
	}

	if (!exists) {
		await mkdir(filepath);
		console.log("The directory has been created successfully 🔥");
	} else console.error("The directory already exists 🙅‍♂️");
}

async function createFile(filepath: string) {
	await open(filepath, "w");
	console.log("An empty file has been created 🔥");
}

if (options.ls) {
	const filepath =
		typeof options.ls === "string" ? options.ls : path.dirname("./");
	listDirContents(filepath);
}
if (options.mkdir) {
	createDir(path.resolve(path.dirname("./"), options.mkdir));
}
if (options.touch) {
	createFile(path.resolve(path.dirname("./"), options.touch));
}
