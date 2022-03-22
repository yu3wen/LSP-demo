// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import * as path from 'path';
// const path = require('path');
import * as fs from 'fs';
// const fs = require('fs');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	console.log('Congratulations, your extension "lsp" is now active!');

	context.subscriptions.push(vscode.languages.registerDefinitionProvider(['c'],{provideDefinition}));
	context.subscriptions.push(vscode.languages.registerCompletionItemProvider('c', {
		provideCompletionItems,
		resolveCompletionItem
	}, '.'));
	context.subscriptions.push(vscode.languages.registerHoverProvider('c', {
		provideHover
	}));
}

function provideDefinition(document:vscode.TextDocument,position:vscode.Position,token:vscode.CancellationToken):vscode.ProviderResult<vscode.Definition | vscode.LocationLink[]>{
	console.log('====== 进入 provideDefinition 方法 ======');
	const fileName=document.fileName;
	const workspaceRoot = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
	? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;

	if(/\.c$/.test(fileName)){
		const word=document.getText();
		if(/^this$/.test(word)){
			if(workspaceRoot){
				const destPath=path.join(workspaceRoot,'test.json');
				return new vscode.Location(vscode.Uri.file(destPath),new vscode.Position(0,0));
			}
		}
	}
}

function provideCompletionItems(document:vscode.TextDocument,position:vscode.Position,token:vscode.CancellationToken):vscode.ProviderResult<vscode.CompletionItem[] | vscode.CompletionList<vscode.CompletionItem>>{
	console.log('====== 进入 provideCompletionItems 方法 ======');
	const line=document.lineAt(position);
	const workspaceRoot = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
	? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;
	const lineText = line.text.substring(0, position.character);
	if(/this\.$/.test(lineText)){
		if(workspaceRoot){
			const json=require(path.join(workspaceRoot,'test.json'));
			const data=Object.keys(json)
			return data.map(item=>{
				return new vscode.CompletionItem(item, vscode.CompletionItemKind.Field);
			});
			
		}
	}


}

function resolveCompletionItem(item:vscode.CompletionItem, token:vscode.CancellationToken) {
	return null;
}

function provideHover(document:vscode.TextDocument,position:vscode.Position,token:vscode.CancellationToken):vscode.ProviderResult<vscode.Hover>{
	console.log('====== 进入 provideHover 方法 ======');
	const fileName	= document.fileName;
	const workspaceRoot = (vscode.workspace.workspaceFolders && (vscode.workspace.workspaceFolders.length > 0))
	? vscode.workspace.workspaceFolders[0].uri.fsPath : undefined;
	if(/\.c$/.test(fileName)){
		const txt = document.getText();
		if(/^this$/.test(txt)){
			if(workspaceRoot){
				const content=require(path.join(workspaceRoot,'test.json'));
				return new vscode.Hover(`* **参数aa**：${content.aa}\n* **参数bb**：${content.bb}\n* **参数cc**：${content.cc}\n **参数dd**：${content.dd}* `);
			}
			
		}

	}
	return;
}


// this method is called when your extension is deactivated
export function deactivate() {}
