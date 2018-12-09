'use strict';
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { SSL_OP_NO_SESSION_RESUMPTION_ON_RENEGOTIATION } from 'constants';
//import {xsltProcess, xmlParse} from 'xslt-processor';
const xslLib = require('xslt-processor');
const {xsltProcess, xmlParse} = xslLib;

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

    // Use the console to output diagnostic information (console.log) and errors (console.error)
    // This line of code will only be executed once when your extension is activated
    console.log('Congratulations, your extension "change-file-encoding-for-many-files" is now active!');

    let preselectedDisposable = vscode.commands.registerCommand('extension.applyPreselectedXSL', (lastFile: any, files: any[]) => {
        vscode.window.showErrorMessage("There were no pre mapped XSL, please update pre map configuration", );
    })
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.selectXSLToApply', (selectedFile: any, files: any[]) => {
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

        let xslFilePath = '';

        vscode.window.showOpenDialog({
            canSelectFiles: true,
            openLabel: 'Pick the XSL file to apply'
        }).then((xslFile) => {
            if(xslFile && xslFile.length > 0){
                console.log(xslFile);
                xslFilePath = xslFile[0].path;

                vscode.workspace.openTextDocument(selectedFile).then((xmlFile) => {
                    const xmlData = xmlFile.getText();
                    console.log(xmlData);
                    const xml = xmlParse(xmlData);
                    
                    //'/Users/Emil/Repos/XmltestFolder/Transform.xsl'
                    vscode.workspace.openTextDocument(xslFilePath).then((xslFile) => {
                        const xslData = xslFile.getText();
                        console.log(xslData);
                        const xslt = xmlParse(xslData);
                        const transformedXml = xsltProcess(xml, xslt);
                        console.log(transformedXml);
                        vscode.workspace.openTextDocument({
                            content: transformedXml,
                            language: 'xml'
                        }).then((textDoc) => {
                            vscode.window.showTextDocument(textDoc).then((textEditor) => {
                                vscode.commands.executeCommand('editor.action.formatDocument').then((x) => {
                                    
                                });
                            });
                        });
                    });
                });
            }
        });

    });



    //context.subscriptions.push(vscode.window.)
    context.subscriptions.push(disposable);
    context.subscriptions.push(preselectedDisposable);
}

// this method is called when your extension is deactivated
export function deactivate() {
}