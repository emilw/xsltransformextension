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
    let preselectedDisposable = vscode.commands.registerCommand('extension.applyPreselectedXSL', (lastFile: any, files: any[]) => {
        const config = vscode.workspace.getConfiguration("xmlTransformer");
        if(isPreReqOk() && vscode.window.activeTextEditor) {
            const xmlFilePath = vscode.window.activeTextEditor.document.uri.path;
            const map = config.get('xmlAndXsltMap') as Array<any>;
            let found = false;
            let xslFile = '';
            map.forEach(element => {
                if(element.xml === xmlFilePath){
                    found = true;
                    xslFile = element.xslt;
                }
                console.log(element.xml);
            });
            if(!found){
                vscode.window.showErrorMessage(`There were no XSLT file connected to XML file ${xmlFilePath}`);
            } else {
                applyXSL(xmlFilePath, xslFile);   
            }
        }
    });
    // The command has been defined in the package.json file
    // Now provide the implementation of the command with  registerCommand
    // The commandId parameter must match the command field in package.json
    let disposable = vscode.commands.registerCommand('extension.selectXSLToApply', (selectedFile: any, files: any[]) => {
        const config = vscode.workspace.getConfiguration("xmlTransformer");
        if(isPreReqOk() && vscode.window.activeTextEditor) {

            const xmlPath = vscode.window.activeTextEditor.document.uri.path;
            
            vscode.window.showOpenDialog({
                canSelectFiles: true,
                openLabel: 'Pick the XSL file to apply'
            }).then((xslFile) => {
                if(xslFile && xslFile.length > 0) {
                    const xslFilePath = xslFile[0].path;
                    applyXSL(xmlPath, xslFilePath);
                    const shouldSaveConnection = config.get('autoSaveXslAndXsltMap') as Boolean;
                    if(shouldSaveConnection) {
                        updateXmlAndXslMap(xmlPath, xslFilePath, config);
                    }
                }
            });
        }
    });

    //context.subscriptions.push(vscode.window.)
    context.subscriptions.push(disposable);
    context.subscriptions.push(preselectedDisposable);
}

function isPreReqOk(): boolean {

    if(!vscode.window.activeTextEditor){
        vscode.window.showInformationMessage("Open an XML file first to use this feature");
        return false;
    }

    if(vscode.window.activeTextEditor.document.languageId !== 'xml'){
        vscode.window.showErrorMessage('The document is not an xml, please select an XML document and run this again');
        return false;
    }

    return true;
}

function applyXSL(xmlFilePath: string, xslFilePath: string) {
    vscode.workspace.openTextDocument(xmlFilePath).then((xmlFile) => {
        const xmlData = xmlFile.getText();
        const xml = xmlParse(xmlData);
        
        vscode.workspace.openTextDocument(xslFilePath).then((xslFile) => {
            const xslData = xslFile.getText();
            const xslt = xmlParse(xslData);
            const transformedXml = xsltProcess(xml, xslt);

            vscode.workspace.openTextDocument({
                content: transformedXml,
                language: 'xml'
            }).then((textDoc) => {
                vscode.window.showTextDocument(textDoc).then((textEditor) => {
                    vscode.commands.executeCommand('editor.action.formatDocument');
                });
            });
        });
    });
}

function updateXmlAndXslMap(xmlFilePath: string, xslFilePath: string, config: vscode.WorkspaceConfiguration) {
    let map = config.get('xmlAndXsltMap') as Array<any>;
    let found = false;
    map.forEach(element => {
        if(element.xml === xmlFilePath){
            found = true;
        }
        console.log(element.xml);
    });
    if(!found){
        map.push({
            xml: xmlFilePath,
            xslt: xslFilePath
        });
        config.update('xmlAndXsltMap', map);
        console.log(`Added map between XML file ${xmlFilePath} and XSLT file ${xslFilePath}`);
    } else {
        console.log(`The XML file ${xmlFilePath} is already mapped, please remove it in the workspace config if you want to remove it`);
    }
}

// this method is called when your extension is deactivated
export function deactivate() {
}