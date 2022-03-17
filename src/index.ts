import * as vscode from "vscode";
import * as fs from "fs";

/**读取正在加载的文件内容 */
function readFile(fd: any, filePath: any) {
	const fileContent: string = fs.readFileSync(filePath, {
		encoding: "utf8",
		flag: "r",
	});
	return {
		length: fileContent.length,
		content: fileContent,
	};
}

/**修改文件内容 */
function writeFile(fd: any, filePath: any, content: string) {
	fs.writeFile(filePath, content, (err) => {
		if (err) {
			console.log(err);
		}
	});
}

/**
 * Fisher–Yates shuffle
 */
function shuffle(arr: boolean[]) {
	let len = arr.length;
	while (len > 1) {
		let index = Math.floor(Math.random() * len--);
		[arr[len], arr[index]] = [arr[index], arr[len]];
	}
	return arr;
}

function getMagicStr(fileInfo: { length: number; content: string }) {
	let contentArr = fileInfo.content.split("");
	let trueLen: number = Math.ceil(fileInfo.length / 2);
	let falseLen: number = fileInfo.length - trueLen;
	let randomArr: boolean[] = Array(trueLen)
		.fill(true)
		.concat(Array(falseLen).fill(false));
	//乱序的索引数组
	let IndexArr = shuffle(randomArr);
	let retArr: string[] = [];

	IndexArr.forEach((flag: boolean, idx: number) => {
		if (flag) {
			retArr.push(contentArr[idx]);
		}
	});
	return retArr.join("");
}

function activate(context: vscode.ExtensionContext) {
	let disposable = vscode.commands.registerCommand("thanos.magic", () => {
		const filePath: any = vscode.window.activeTextEditor?.document.fileName;
		const fd = fs.openSync(filePath, "r+");

		const fileInfo: { length: number; content: string } = readFile(
			fd,
			filePath
		);

		let retStr: string = getMagicStr(fileInfo);
		writeFile(fd, filePath, retStr);

		vscode.window.showInformationMessage("The Thanos Magic!");
	});

	context.subscriptions.push(disposable);
}

function deactivate() {}

export { activate, deactivate };
