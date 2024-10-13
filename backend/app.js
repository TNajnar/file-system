const express = require('express');
const path = require('path');

const fs = require('fs');
const os = require('os');

const app = express();
const port = 3001;

// CORS setup
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  next();
});

app.get('/filesystem', (req, res) => {
  const userHome = os.homedir();
  console.log(`User Home Directory: ${userHome}`);

  // Get requested path from query parameter or default to home directory
  const requestedPath = req.query.path ? path.join(userHome, req.query.path) : userHome;

  console.log(`Requested path: ${requestedPath}`);

  if (!fs.existsSync(requestedPath)) {
    console.error('Path not found!');
    return res.status(404).json({ message: 'Path not found!' });
  }

  try {
    const stats = fs.lstatSync(requestedPath);

    if (stats.isDirectory()) {
      const folderContents = fs.readdirSync(requestedPath).map(file => {
        const fullPath = path.join(requestedPath, file);
        return {
          name: file,
          isDirectory: fs.lstatSync(fullPath).isDirectory(),
          fullPath: fullPath.replace(/\\/g, '/'), // For compatibility
        };
      });
      return res.json(folderContents);
    } else {
      // If it's a file, return the file
      return res.sendFile(requestedPath);
    }
  } catch (error) {
    console.error('Error accessing path:', error);
    return res.status(500).json({ message: 'Internal Server Error', error: error.message });
  }
});

app.listen(port, () => {
  console.log(`Server is listening on http://localhost:${port}`);
});
