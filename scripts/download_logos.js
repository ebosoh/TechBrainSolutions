import fs from 'fs';
import path from 'path';
import https from 'https';
import http from 'http';
import { fileURLToPath } from 'url';

// Get directory name in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const logoUrls = [
  {
    name: 'fian',
    url: 'https://www.fian.org/fileadmin/user_upload/FIAN_international_logo.png'
  },
  {
    name: 'coloradoresilience',
    url: 'https://coloradoresilience.org/wp-content/uploads/2021/10/CRA-logo-color-1.png'
  },
  {
    name: 'rainbows',
    url: 'https://rainbowsunited.org/wp-content/uploads/2021/04/logo.png'
  },
  {
    name: 'catchafire',
    url: 'https://www.catchafire.org/static/images/site/logos/catchafire-logo.svg'
  },
  {
    name: 'techbrain',
    url: 'https://www.techbrain.africa/wp-content/uploads/2022/03/TechBrain-Logo-1.png'
  },
  {
    name: 'mooreparts',
    url: 'https://mooreparts.com/wp-content/uploads/2023/08/MP_Logo.png'
  },
  {
    name: 'tellyourtrail',
    url: 'https://tellyourtrail.com/wp-content/uploads/2023/06/Tell-Your-Trail-Logo.png'
  },
  {
    name: 'eightyfour',
    url: 'https://eightyfour.com/wp-content/uploads/2023/10/84-Logo-Navbar-2.png'
  },
  {
    name: 'saharabiz',
    url: 'https://saharabiz.com/wp-content/uploads/2024/03/Sahara-Biz.png'
  },
  {
    name: 'dreamwrap',
    url: 'https://dreamwrapsleep.com/wp-content/uploads/2022/04/Dream-Wrap-Sleep-Logo.png'
  },
  {
    name: 'ringmasters',
    url: 'https://shopringmasters.com/cdn/shop/files/ringmasters-logo-new.png'
  }
];

const targetDir = path.join(__dirname, '..', 'client', 'src', 'assets', 'actual_logos');

// Ensure the directory exists
if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// Function to download a file
function downloadFile(url, filePath) {
  return new Promise((resolve, reject) => {
    // Choose the right protocol
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (response) => {
      // Handle redirects
      if (response.statusCode === 301 || response.statusCode === 302) {
        console.log(`Following redirect for ${url} to ${response.headers.location}`);
        return downloadFile(response.headers.location, filePath)
          .then(resolve)
          .catch(reject);
      }

      // Check for successful response
      if (response.statusCode !== 200) {
        return reject(new Error(`Failed to download ${url}, status code: ${response.statusCode}`));
      }

      // Determine file extension
      const contentType = response.headers['content-type'];
      let extension = path.extname(url).toLowerCase();
      
      if (!extension) {
        if (contentType && contentType.includes('svg')) {
          extension = '.svg';
        } else if (contentType && contentType.includes('png')) {
          extension = '.png';
        } else if (contentType && contentType.includes('jpeg') || contentType && contentType.includes('jpg')) {
          extension = '.jpg';
        } else {
          extension = '.png'; // Default
        }
      }

      const filePathWithExt = filePath + extension;
      
      const fileStream = fs.createWriteStream(filePathWithExt);
      response.pipe(fileStream);

      fileStream.on('finish', () => {
        fileStream.close();
        console.log(`Downloaded: ${url} to ${filePathWithExt}`);
        resolve(filePathWithExt);
      });

      fileStream.on('error', err => {
        fs.unlinkSync(filePathWithExt);
        reject(err);
      });
    }).on('error', err => {
      reject(err);
    });
  });
}

// Download all logos
async function downloadLogos() {
  console.log('Starting logo downloads...');
  
  for (const logo of logoUrls) {
    const filePath = path.join(targetDir, logo.name);
    try {
      await downloadFile(logo.url, filePath);
    } catch (err) {
      console.error(`Error downloading ${logo.name} from ${logo.url}:`, err.message);
    }
  }
  
  console.log('Finished downloading logos.');
}

downloadLogos();