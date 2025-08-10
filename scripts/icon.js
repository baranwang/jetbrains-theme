const fs = require('fs');
const path = require('path');
const { parse } = require('jsonc-parser');

const iconPath = path.join(__dirname, '../icons');

const icons = {
  light: {},
  dark: {},
};

const iconFiles = fs.readdirSync(iconPath);

iconFiles.forEach((file) => {
  if (!file.endsWith('.svg')) {
    return;
  }
  const name = path.basename(file, path.extname(file));
  if (name.endsWith('_dark')) {
    icons.dark[name.replace('_dark', '')] = file;
  } else {
    icons.light[name] = file;
    if (!icons.dark[name]) {
      icons.dark[name] = file;
    }
  }
});

function defineIcons(type) {
  return Object.entries(icons[type]).reduce((acc, [key, value]) => {
    acc[key] = {
      iconPath: `../icons/${value}`,
    };
    return acc;
  }, {});
}

const darkIconsConfigPath = path.join(__dirname, '../themes/int-ui-dark-icons.json');
const lightIconsConfigPath = path.join(__dirname, '../themes/int-ui-light-icons.json');

const darkIconsConfig = parse(fs.readFileSync(darkIconsConfigPath).toString());
const lightIconsConfig = { ...darkIconsConfig };

darkIconsConfig.iconDefinitions = defineIcons('dark');
lightIconsConfig.iconDefinitions = defineIcons('light');

fs.writeFileSync(darkIconsConfigPath, JSON.stringify(darkIconsConfig, null, 2));
fs.writeFileSync(lightIconsConfigPath, JSON.stringify(lightIconsConfig, null, 2));
