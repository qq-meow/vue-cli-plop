const os = require('os');
let slash = os.type() == 'Windows_NT' ? '\\' : '/'
// 配置文件
module.exports = {
    templates:{
        packageJson:"package.json.hbs",
        vuConfigJs:"vue.config.js.hbs",
        mainJs:`src${slash}main.js.hbs`,
        // router:"src/router/index.js.hbs",
    },
    files:{
        packageJson:"package.json",
        vuConfigJs:"vue.config.js",
        mainJs: `src${slash}main.js`,
        // router:"src/router/index.js",
    }
}