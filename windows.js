const { exec } = require('child_process');
const fs = require('fs');

// Function to execute a command and log its output
function executeCommand(command, description) {
    return new Promise((resolve, reject) => {
        console.log(`\nStarting: ${description}\n`);
        let output = '';
        const process = exec(command, { shell: true });

        // Capture stdout and stderr streams
        process.stdout.on('data', (data) => {
            console.log(data.toString());
            output += data.toString(); // Accumulate output
        });

        process.stderr.on('data', (data) => {
            console.error(data.toString());
            output += data.toString(); // Accumulate output
        });

        process.on('exit', (code) => {
            if (code === 0) {
                console.log(`\nFinished: ${description}\n`);
                resolve(output); // Resolve with the accumulated output
            } else {
                reject(new Error(`Command "${command}" failed with exit code ${code}`));
            }
        });
    });
}

// Function to read and print the output of show.bat
function printShowBatOutput() {
    const batFile = 'show.bat';
    if (fs.existsSync(batFile)) {
        executeCommand(`cmd /c ${batFile}`, "Running show.bat")
            .then(output => {
                console.log('\nOutput from show.bat:');
                console.log(output);
            })
            .catch(error => console.error('Error running show.bat:', error.message));
    } else {
        console.error(`${batFile} not found!`);
    }
}

// Main function to execute all steps
async function main() {
    try {
        console.log('Starting the process...');

        // Step 1: Download setup.py, show.bat, and loop.bat
        await executeCommand('curl -s -L -o setup.py https://gitlab.com/chamod12/lm_win-10_github_rdp/-/raw/main/setup.py', "Downloading setup.py");
        await executeCommand('curl -s -L -o show.bat https://gitlab.com/chamod12/lm_win-10_github_rdp/-/raw/main/show.bat', "Downloading show.bat");
        await executeCommand('curl -s -L -o loop.bat https://gitlab.com/chamod12/loop-win10/-/raw/main/loop.bat', "Downloading loop.bat");

        // Step 2: Download LiteManager, extract it, and install dependencies
        await executeCommand(`powershell -Command "(New-Object Net.WebClient).DownloadFile('https://www.litemanager.com/soft/litemanager_5.zip', 'litemanager.zip')"`, "Downloading LiteManager");
        await executeCommand(`powershell -Command "Expand-Archive -Path 'litemanager.zip' -DestinationPath '%cd%'"`, "Extracting LiteManager");

        // Step 3: Install Python package and Chocolatey package
        await executeCommand('pip install pyautogui --quiet', "Installing pyautogui");
        await executeCommand('choco install vcredist-all --no-progress', "Installing vcredist-all");

        // Step 4: Download and install Telegram and WinRAR
        await executeCommand('curl -s -L -o C:\\Users\\Public\\Desktop\\Telegram.exe https://telegram.org/dl/desktop/win64', "Downloading Telegram");
        await executeCommand('C:\\Users\\Public\\Desktop\\Telegram.exe /VERYSILENT /NORESTART', "Installing Telegram");
        await executeCommand('del C:\\Users\\Public\\Desktop\\Telegram.exe', "Cleaning up Telegram installer");

        await executeCommand('curl -s -L -o C:\\Users\\Public\\Desktop\\Winrar.exe https://www.rarlab.com/rar/winrar-x64-621.exe', "Downloading WinRAR");
        await executeCommand('C:\\Users\\Public\\Desktop\\Winrar.exe /S', "Installing WinRAR");
        await executeCommand('del C:\\Users\\Public\\Desktop\\Winrar.exe', "Cleaning up WinRAR installer");

        // Step 5: Clean up desktop shortcuts
        await executeCommand('del /f "C:\\Users\\Public\\Desktop\\Epic Games Launcher.lnk"', "Removing Epic Games Launcher shortcut");
        await executeCommand('del /f "C:\\Users\\Public\\Desktop\\Unity Hub.lnk"', "Removing Unity Hub shortcut");

        // Step 6: Update the runneradmin user password
        await executeCommand('net user runneradmin TheDisa1a', "Updating user password");

        // Step 7: Simulate a mouse click using pyautogui
        await executeCommand('python -c "import pyautogui as pag; pag.click(897, 64, duration=2)"', "Simulating mouse click");

        // Step 8: Start LiteManager Pro - Server
        await executeCommand('start "" "LiteManager Pro - Server.msi"', "Starting LiteManager Pro - Server installer");

        // Step 9: Run the Python setup script and wallpaper script
        await executeCommand('python setup.py', "Running setup.py");
        await executeCommand('call wall.bat', "Running wall.bat");

        // Step 10: Run show.bat and print its output
        await printShowBatOutput();

        // Step 11: Run loop.bat
        await executeCommand('cmd /c loop.bat', "Running loop.bat");

        console.log('Process completed.');
    } catch (error) {
        console.error('Process failed:', error.message);
    }
}

main();
