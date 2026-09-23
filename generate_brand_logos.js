/**
 * Script to generate SVG brand logos
 */
const fs = require('fs');
const path = require('path');

const outDir = path.join(__dirname, 'assets', 'brands');
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const logos = {
  // Unilever Group
  'omo': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 36" fill="none">
    <!-- OMO multi-color splash behind -->
    <path d="M14 6 L18 1 L22 7 L27 2 L28 8 L34 5 L31 11 L37 13 L32 17 L36 21 L30 22 L32 28 L26 26 L24 32 L20 27 L16 32 L15 26 L9 28 L11 22 L5 20 L10 16 L4 13 L10 10 L6 5 Z" fill="#FF5722" opacity="0.85"/>
    <path d="M16 8 L20 3 L23 9 L28 5 L28 10 L33 8 L30 13 L35 15 L30 18 L34 22 L29 23 L30 27 L25 25 L23 30 L20 25 L16 29 L16 24 L10 26 L12 21 L6 19 L11 15 L6 12 L11 10 L8 6 Z" fill="#FFC107" opacity="0.7"/>
    <!-- OMO bold red letters -->
    <text x="50" y="27" font-family="'Arial Black', Impact, sans-serif" font-weight="900" font-size="28" fill="#E53935" letter-spacing="-1" text-anchor="middle">OMO</text>
  </svg>`,

  'vim': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 85 36" fill="none">
    <!-- Blue 3D Shield -->
    <path d="M4 4 L81 4 L75 28 L42.5 35 L10 28 Z" fill="#0D47A1"/>
    <path d="M7 6 L78 6 L72 26 L42.5 32 L13 26 Z" fill="#1565C0"/>
    <path d="M10 8 L42.5 8 L42.5 30 L15 25 Z" fill="#1E88E5" opacity="0.6"/>
    <!-- Text VIM -->
    <text x="42.5" y="24" font-family="'Impact', 'Arial Black', sans-serif" font-style="italic" font-size="21" fill="#FFEB3B" text-anchor="middle" letter-spacing="1">VIM</text>
  </svg>`,

  'sunlight': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135 36" fill="none">
    <!-- Sunburst glow -->
    <circle cx="18" cy="18" r="14" fill="#FFD54F" opacity="0.4"/>
    <circle cx="18" cy="18" r="10" fill="#FFA000"/>
    <circle cx="18" cy="18" r="8" fill="#FFEB3B"/>
    <!-- Sun rays -->
    <path d="M18 4 L18 7 M18 29 L18 32 M4 18 L7 18 M29 18 L32 18 M8 8 L10 10 M26 26 L28 28 M8 28 L10 26 M26 8 L28 10" stroke="#FF8F00" stroke-width="2" stroke-linecap="round"/>
    <!-- Lemon drop -->
    <path d="M14 18 C14 13 18 10 18 10 C18 10 22 13 22 18 C22 21 20 24 18 24 C16 24 14 21 14 18 Z" fill="#7CB342" opacity="0.85"/>
    <!-- Text Sunlight -->
    <text x="76" y="24" font-family="'Trebuchet MS', 'Arial Black', sans-serif" font-weight="900" font-style="italic" font-size="18" fill="#2E7D32" letter-spacing="-0.5" text-anchor="middle">Sunlight</text>
  </svg>`,

  'ps': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75 36" fill="none">
    <!-- Blue & Red capsule badge -->
    <rect x="2" y="3" width="71" height="30" rx="15" fill="#0D47A1"/>
    <!-- Smiling red arc -->
    <path d="M12 25 Q37.5 35 63 25 Q37.5 30 12 25 Z" fill="#E53935"/>
    <!-- P/S text -->
    <text x="37.5" y="22" font-family="'Arial Black', Impact, sans-serif" font-weight="900" font-style="italic" font-size="20" fill="#FFFFFF" text-anchor="middle">P/S</text>
  </svg>`,

  'knorr': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 95 36" fill="none">
    <!-- Green flowing banner -->
    <path d="M3 8 C25 2 70 2 92 8 C90 28 85 32 50 32 C15 32 5 28 3 8 Z" fill="#005A36"/>
    <!-- Top yellow border line -->
    <path d="M3 8 C25 2 70 2 92 8" stroke="#FDD835" stroke-width="2.5" fill="none"/>
    <!-- Knorr script text -->
    <text x="47.5" y="24" font-family="'Brush Script MT', 'Segoe Script', cursive, sans-serif" font-weight="bold" font-style="italic" font-size="22" fill="#FFFFFF" text-anchor="middle">Knorr</text>
  </svg>`,

  'clear': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 36" fill="none">
    <!-- Sleek icy background bar -->
    <rect x="2" y="5" width="86" height="26" rx="4" fill="#0A192F"/>
    <!-- Cyan cool streak -->
    <path d="M6 7 L40 7 L32 29 L2 29 Z" fill="#00BCD4" opacity="0.3"/>
    <!-- Text CLEAR -->
    <text x="45" y="24" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="19" fill="#00E5FF" letter-spacing="2" text-anchor="middle">CLEAR</text>
  </svg>`,

  'unilever': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 36" fill="none">
    <!-- Unilever iconic U -->
    <g transform="translate(4, 2) scale(0.65)">
      <path d="M10 5 C10 25 15 38 27 38 C39 38 44 25 44 5 C40 5 36 9 36 15 C36 24 33 30 27 30 C21 30 18 24 18 15 C18 9 14 5 10 5 Z" fill="#1F36C7"/>
      <circle cx="14" cy="8" r="2.5" fill="#1F36C7"/>
      <circle cx="40" cy="8" r="2.5" fill="#1F36C7"/>
      <circle cx="27" cy="34" r="2" fill="#1F36C7"/>
    </g>
    <!-- Text Unilever -->
    <text x="40" y="24" font-family="'Segoe UI', Roboto, sans-serif" font-weight="700" font-size="17" fill="#1F36C7" letter-spacing="0.5">Unilever</text>
  </svg>`,

  // P&G Group
  'pantene': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 36" fill="none">
    <!-- Gold Pro-V capsule icon -->
    <g transform="translate(4, 8)">
      <rect x="0" y="0" width="16" height="20" rx="8" fill="url(#panteneGold)"/>
      <defs>
        <linearGradient id="panteneGold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#FFD54F"/>
          <stop offset="100%" stop-color="#FF8F00"/>
        </linearGradient>
      </defs>
    </g>
    <!-- Text PANTENE -->
    <text x="68" y="24" font-family="'Times New Roman', Times, serif" font-weight="bold" font-size="19" fill="#1A1A1A" letter-spacing="1.2" text-anchor="middle">PANTENE</text>
  </svg>`,

  'head-shoulders': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135 36" fill="none">
    <!-- Swoosh curve -->
    <path d="M4 18 C15 6 30 6 38 18 C30 10 15 10 4 18 Z" fill="#005BBB"/>
    <circle cx="10" cy="18" r="4" fill="#005BBB"/>
    <!-- 2 lines text: head & shoulders -->
    <text x="22" y="16" font-family="'Arial Rounded MT Bold', Arial, sans-serif" font-weight="bold" font-size="12" fill="#005BBB">head &amp;</text>
    <text x="22" y="29" font-family="'Arial Rounded MT Bold', Arial, sans-serif" font-weight="bold" font-size="12" fill="#005BBB">shoulders</text>
  </svg>`,

  'herbal-essences': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 135 36" fill="none">
    <!-- Green botanical leaf -->
    <path d="M12 28 C6 20 8 10 18 6 C20 14 18 24 12 28 Z" fill="#2E7D32"/>
    <path d="M12 28 C18 22 24 14 26 8 C22 16 18 22 12 28 Z" fill="#81C784"/>
    <!-- Text Herbal Essences -->
    <text x="28" y="16" font-family="Georgia, serif" font-style="italic" font-weight="bold" font-size="12" fill="#1B5E20">herbal</text>
    <text x="28" y="29" font-family="Georgia, serif" font-weight="bold" font-size="11" fill="#1B5E20" letter-spacing="0.5">essences</text>
  </svg>`,

  'ariel': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 95 36" fill="none">
    <!-- Atomic Rings Symbol -->
    <g transform="translate(6, 4)">
      <ellipse cx="14" cy="14" rx="13" ry="5" fill="none" stroke="#4CAF50" stroke-width="2.5" transform="rotate(30, 14, 14)"/>
      <ellipse cx="14" cy="14" rx="13" ry="5" fill="none" stroke="#2E7D32" stroke-width="2.5" transform="rotate(90, 14, 14)"/>
      <ellipse cx="14" cy="14" rx="13" ry="5" fill="none" stroke="#81C784" stroke-width="2.5" transform="rotate(150, 14, 14)"/>
      <circle cx="14" cy="14" r="3.5" fill="#00C853"/>
    </g>
    <!-- Text ARIEL -->
    <text x="63" y="24" font-family="'Arial Black', Impact, sans-serif" font-weight="900" font-size="19" fill="#1B5E20" letter-spacing="0.5" text-anchor="middle">ARIEL</text>
  </svg>`,

  'downy': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 36" fill="none">
    <!-- Pink ribbon blossom -->
    <circle cx="14" cy="12" r="4" fill="#F06292"/>
    <circle cx="19" cy="15" r="3" fill="#EC407A"/>
    <!-- Script Downy -->
    <text x="50" y="25" font-family="'Brush Script MT', 'Lucida Handwriting', cursive, sans-serif" font-weight="bold" font-style="italic" font-size="24" fill="#311B92" text-anchor="middle">Downy</text>
  </svg>`,

  'gillette': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 95 36" fill="none">
    <!-- Bold Sharp Italic Gillette -->
    <text x="47.5" y="26" font-family="'Arial Black', Impact, sans-serif" font-weight="900" font-style="italic" font-size="22" fill="#0A2540" letter-spacing="-0.5" text-anchor="middle">Gillette</text>
  </svg>`,

  'olay': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 80 36" fill="none">
    <!-- Classic Elegant OLAY -->
    <text x="40" y="24" font-family="Georgia, 'Times New Roman', serif" font-weight="bold" font-size="21" fill="#111111" letter-spacing="2" text-anchor="middle">OLAY</text>
    <line x1="20" y1="28" x2="60" y2="28" stroke="#D4AF37" stroke-width="1.5"/>
  </svg>`,

  'pg': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 70 36" fill="none">
    <!-- Blue P&G Circle -->
    <circle cx="35" cy="18" r="16" fill="#003CAE"/>
    <text x="35" y="24" font-family="'Arial', sans-serif" font-weight="900" font-style="italic" font-size="16" fill="#FFFFFF" text-anchor="middle">P&amp;G</text>
  </svg>`,

  'oral-b': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 85 36" fill="none">
    <!-- Blue Pill -->
    <rect x="4" y="5" width="77" height="26" rx="13" fill="#00509E"/>
    <!-- Dental Sparkle -->
    <path d="M68 8 L70 12 L74 12 L71 14 L72 18 L68 15 L64 18 L65 14 L62 12 L66 12 Z" fill="#FFFFFF" opacity="0.9"/>
    <!-- Text Oral-B -->
    <text x="38" y="23" font-family="'Arial Black', sans-serif" font-weight="900" font-style="italic" font-size="16" fill="#FFFFFF" text-anchor="middle">Oral-B</text>
  </svg>`,

  'venus': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 85 36" fill="none">
    <!-- Teal Venus Script -->
    <text x="42.5" y="23" font-family="'Brush Script MT', 'Lucida Calligraphy', cursive, sans-serif" font-weight="bold" font-style="italic" font-size="22" fill="#00897B" text-anchor="middle">Venus</text>
    <text x="42.5" y="32" font-family="Arial, sans-serif" font-size="7" font-weight="bold" fill="#004D40" letter-spacing="1" text-anchor="middle">BY GILLETTE</text>
  </svg>`,

  // PepsiCo Group
  'pepsi': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 95 36" fill="none">
    <!-- Pepsi Globe Symbol -->
    <g transform="translate(6, 4)">
      <!-- Circle base -->
      <circle cx="14" cy="14" r="13" fill="#FFFFFF"/>
      <!-- Top red wave -->
      <path d="M1 14 C1 6.8 6.8 1 14 1 C21.2 1 27 6.8 27 14 C21 10 16 18 1 14 Z" fill="#E31B23"/>
      <!-- Bottom blue wave -->
      <path d="M1 14 C16 18 21 10 27 14 C27 21.2 21.2 27 14 27 C6.8 27 1 21.2 1 14 Z" fill="#0065C3"/>
    </g>
    <!-- Text pepsi -->
    <text x="64" y="24" font-family="'Arial Rounded MT Bold', Arial, sans-serif" font-weight="900" font-size="20" fill="#0065C3" letter-spacing="-0.5" text-anchor="middle">pepsi</text>
  </svg>`,

  'tea-plus': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 95 36" fill="none">
    <!-- Tea leaf emblem -->
    <path d="M6 22 C6 10 18 6 24 6 C24 16 16 26 6 22 Z" fill="#2E7D32"/>
    <path d="M10 20 C14 16 18 12 22 8" stroke="#81C784" stroke-width="1.5"/>
    <!-- TEA+ Text -->
    <text x="60" y="24" font-family="'Arial Black', Impact, sans-serif" font-weight="900" font-size="19" fill="#1B5E20" text-anchor="middle">TEA<tspan fill="#E53935">+</tspan></text>
  </svg>`,

  'mirinda': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 95 36" fill="none">
    <!-- Orange circle with green leaf -->
    <g transform="translate(4, 4)">
      <circle cx="14" cy="14" r="13" fill="#FF6D00"/>
      <path d="M14 2 C18 2 22 6 22 10 C18 10 14 6 14 2 Z" fill="#4CAF50"/>
      <!-- Inner fizz -->
      <circle cx="9" cy="12" r="1.5" fill="#FFE082"/>
      <circle cx="19" cy="16" r="1.5" fill="#FFE082"/>
      <circle cx="13" cy="20" r="1.5" fill="#FFE082"/>
    </g>
    <!-- Text MIRINDA -->
    <text x="63" y="23" font-family="'Arial Black', Impact, sans-serif" font-weight="900" font-size="15" fill="#E65100" letter-spacing="0.5" text-anchor="middle">MIRINDA</text>
  </svg>`,

  'revive': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 95 36" fill="none">
    <!-- Cyan Energy Wave -->
    <path d="M6 18 C12 10 20 26 26 18 C20 22 12 14 6 18 Z" fill="#00E5FF"/>
    <circle cx="26" cy="12" r="3" fill="#00B0FF"/>
    <!-- Text Revive -->
    <text x="60" y="24" font-family="'Impact', 'Arial Black', sans-serif" font-style="italic" font-size="20" fill="#0277BD" letter-spacing="0.5" text-anchor="middle">Revive</text>
  </svg>`,

  'rockstar': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 36" fill="none">
    <!-- Star icon -->
    <polygon points="15,3 18,12 27,12 20,18 23,27 15,22 7,27 10,18 3,12 12,12" fill="#FFD600" stroke="#000000" stroke-width="1.5"/>
    <!-- Text ROCKSTAR -->
    <text x="62" y="20" font-family="'Impact', Arial, sans-serif" font-weight="bold" font-size="14" fill="#000000" letter-spacing="1" text-anchor="middle">ROCKSTAR</text>
    <text x="62" y="29" font-family="Arial, sans-serif" font-weight="bold" font-size="8" fill="#FF6F00" letter-spacing="2" text-anchor="middle">ENERGY</text>
  </svg>`,

  'aquafina': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 36" fill="none">
    <!-- Red Sun & Blue Mountains -->
    <path d="M18 14 C18 10 22 7 26 7 C30 7 34 10 34 14 Z" fill="#E53935"/>
    <polygon points="8,26 18,12 28,26" fill="#0288D1"/>
    <polygon points="22,26 30,15 38,26" fill="#01579B"/>
    <!-- AQUAFINA Text -->
    <text x="70" y="23" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="900" font-style="italic" font-size="15" fill="#01579B" letter-spacing="0.5" text-anchor="middle">AQUAFINA</text>
  </svg>`,

  '7up': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 75 36" fill="none">
    <!-- Green circle -->
    <circle cx="22" cy="18" r="14" fill="#00A859"/>
    <!-- White 7 -->
    <text x="18" y="25" font-family="'Arial Black', Impact, sans-serif" font-weight="900" font-style="italic" font-size="22" fill="#FFFFFF">7</text>
    <!-- Red UP bubble -->
    <circle cx="31" cy="15" r="7" fill="#E53935"/>
    <text x="31" y="18" font-family="'Arial Black', sans-serif" font-weight="900" font-size="7" fill="#FFFFFF" text-anchor="middle">UP</text>
  </svg>`,

  // Marico Group
  'oliv': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 85 36" fill="none">
    <!-- Olive Leaf -->
    <path d="M8 24 C8 12 18 8 22 8 C22 18 16 26 8 24 Z" fill="#558B2F"/>
    <circle cx="18" cy="22" r="3.5" fill="#33691E"/>
    <!-- OLIV Text -->
    <text x="54" y="24" font-family="Georgia, serif" font-weight="bold" font-size="19" fill="#33691E" letter-spacing="1" text-anchor="middle">Ô L I V</text>
  </svg>`,

  'lashe': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 90 36" fill="none">
    <!-- Magenta Berry Pill -->
    <rect x="4" y="6" width="82" height="24" rx="12" fill="#AD1457"/>
    <!-- LASHE Text -->
    <text x="45" y="23" font-family="'Helvetica Neue', Arial, sans-serif" font-weight="900" font-size="15" fill="#FFFFFF" letter-spacing="2" text-anchor="middle">LASHE</text>
  </svg>`,

  'purite': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 95 36" fill="none">
    <!-- Lavender Floral sprig -->
    <circle cx="8" cy="12" r="2.5" fill="#7E57C2"/>
    <circle cx="13" cy="9" r="2.5" fill="#5E35B1"/>
    <circle cx="11" cy="16" r="2" fill="#9575CD"/>
    <path d="M10 18 L6 26" stroke="#43A047" stroke-width="1.5"/>
    <!-- PURITÉ Text -->
    <text x="56" y="20" font-family="Georgia, serif" font-weight="bold" font-size="16" fill="#4527A0" letter-spacing="1" text-anchor="middle">PURITÉ</text>
    <text x="56" y="28" font-family="'Times New Roman', serif" font-style="italic" font-size="8" fill="#5E35B1" letter-spacing="0.5" text-anchor="middle">de Provence</text>
  </svg>`,

  'botanika': `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 36" fill="none">
    <!-- Botanical Branch -->
    <path d="M6 24 C10 16 16 12 24 10" stroke="#2E7D32" stroke-width="2" stroke-linecap="round"/>
    <path d="M12 18 C14 14 18 14 18 14" stroke="#4CAF50" stroke-width="1.5"/>
    <circle cx="20" cy="11" r="2" fill="#66BB6A"/>
    <!-- Botanika Text -->
    <text x="62" y="23" font-family="Georgia, serif" font-weight="bold" font-size="16" fill="#1B5E20" letter-spacing="0.5" text-anchor="middle">Botanika</text>
  </svg>`
};

Object.entries(logos).forEach(([name, svg]) => {
  const filePath = path.join(outDir, `${name}.svg`);
  fs.writeFileSync(filePath, svg.trim(), 'utf8');
  console.log(`Generated: ${filePath}`);
});

console.log('All brand logos generated successfully!');
