import { spawn } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

export function generatePDF(inputFile, outputFile) {
    return new Promise((resolve, reject) => {
        if (!existsSync(inputFile)) {
            reject(new Error(`Input file ${inputFile} not found`));
            return;
        }

        const htmlPath = resolve(inputFile);
        const outputPath = resolve(outputFile);

        console.log('Generating PDF with Chrome headless...');

        const chromeArgs = [
            '--headless',
            '--disable-gpu',
            '--disable-web-security',
            '--disable-features=VizDisplayCompositor',
            '--run-all-compositor-stages-before-draw',
            '--virtual-time-budget=5000',
            '--force-device-scale-factor=1',
            '--disable-background-timer-throttling',
            '--disable-backgrounding-occluded-windows',
            '--disable-renderer-backgrounding',
            '--print-to-pdf=' + outputPath,
            '--no-margins',
            '--no-pdf-header-footer',
            '--disable-print-preview',
            'file://' + htmlPath
        ];

        const chrome = spawn('/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', chromeArgs);

        chrome.on('close', (code) => {
            if (code === 0 && existsSync(outputPath)) {
                const stats = require('fs').statSync(outputPath);
                const fileSizeInKB = Math.round(stats.size / 1024);
                resolve({
                    success: true,
                    outputFile,
                    fileSize: fileSizeInKB + ' KB'
                });
            } else {
                reject(new Error(`PDF generation failed with exit code: ${code}`));
            }
        });

        chrome.on('error', (err) => {
            reject(new Error('Error launching Chrome: ' + err.message));
        });
    });
}