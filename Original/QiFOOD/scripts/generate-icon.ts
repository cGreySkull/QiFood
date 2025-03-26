import sharp from 'sharp';

// Create a simple icon with text "Q" on a blue background
const width = 1024;
const height = 1024;

// Create a blue background with white "Q" text
const svg = Buffer.from(`
<svg width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" xmlns="http://www.w3.org/2000/svg">
    <defs>
        <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />
        </linearGradient>
    </defs>
    <rect width="${width}" height="${height}" fill="url(#grad)"/>
    <text 
        x="50%" 
        y="50%" 
        font-family="Arial Black" 
        font-size="600" 
        fill="white" 
        text-anchor="middle" 
        dominant-baseline="middle"
        style="filter: drop-shadow(0px 4px 8px rgba(0,0,0,0.3))"
    >
        Q
    </text>
</svg>
`);

// Generate all required icon files
const generateIcons = async () => {
    try {
        // Generate icon.png (1024x1024)
        await sharp(svg)
            .png()
            .toFile('assets/icon.png');

        // Generate adaptive-icon.png (108x108)
        await sharp(svg)
            .resize(108, 108)
            .png()
            .toFile('assets/adaptive-icon.png');

        // Generate favicon.png (32x32)
        await sharp(svg)
            .resize(32, 32)
            .png()
            .toFile('assets/favicon.png');

        // Generate splash.png (1242x2436)
        const splashSvg = Buffer.from(`
            <svg width="1242" height="2436" viewBox="0 0 1242 2436" xmlns="http://www.w3.org/2000/svg">
                <defs>
                    <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" style="stop-color:#4F46E5;stop-opacity:1" />
                        <stop offset="100%" style="stop-color:#7C3AED;stop-opacity:1" />
                    </linearGradient>
                </defs>
                <rect width="1242" height="2436" fill="white"/>
                <text 
                    x="50%" 
                    y="50%" 
                    font-family="Arial Black" 
                    font-size="400" 
                    fill="url(#grad)" 
                    text-anchor="middle" 
                    dominant-baseline="middle"
                    style="filter: drop-shadow(0px 4px 8px rgba(0,0,0,0.1))"
                >
                    Q
                </text>
            </svg>
        `);

        await sharp(splashSvg)
            .png()
            .toFile('assets/splash.png');

        console.log('All icons generated successfully!');
    } catch (error) {
        console.error('Error generating icons:', error);
    }
};

generateIcons(); 