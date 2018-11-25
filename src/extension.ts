'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import {xsltProcess, xmlParse} from 'xslt-processor';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "change-file-encoding-for-many-files" is now active!');

    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.sayHello', (lastFile: any, files: any[]) => {
        // The code you place here will be executed every time your command is executed

        // Display a message box to the user
        /*console.log(files.length);
        files.forEach(function(file: any) {
            console.log(file.fsPath);
        });
        vscode.window.showInformationMessage(lastFile.fsPath);
        
        vscode.workspace.openTextDocument(files[0]).then((document) => {
            console.log(document.getText());
        });*/
        vscode.workspace.openTextDocument(files[0]).then((xmlFile) => {
            const xmlData = xmlFile.getText();
            console.log(xmlData);
            const xml = xmlParse(xmlData);
            vscode.workspace.openTextDocument('/Users/Emil/Repos/XmltestFolder/Transform.xsl').then((xslFile) => {
                const xslData = xslFile.getText();
                console.log(xslData);
                const xslt = xmlParse(xslData);
                const transformedXml = xsltProcess(xml, xslt);
                console.log(transformedXml);
            });
        });

    });

    //context.subscriptions.push(vscode.window.)
    context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}