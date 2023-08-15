const download = require('download-git-repo');
const os = require('os');
const rm = require('rimraf').sync;
const nodeFs = require('fs');
const cfg = require("./config");

let slash = os.type() == 'Windows_NT' ? '\\' : '/'

/**
 * 异步获取模版
 * @param {*} path 
 * @param {*} callback 
 */
function getTemplate(path, callback, type = 'empty') {
    // clone git代码模版，不加分支时，默认master。
    if (type === 'empty') {
        download('direct:https://github.com/qq-meow/empty-vue.git#main', path, {
            clone: true
        }, callback);
    } else if (type === 'elementui') {
        download('direct:https://github.com/qq-meow/elemnt-vue.git#main', path, {
            clone: true
        }, callback);
    } else if (type === 'iviewui') {
        download('direct:https://github.com/qq-meow/iview-vue.git#main', path, {
            clone: true
        }, callback);
    }
}

/**
 * 删除文件
 * @param {String} filePath 文件路径
 */
function deleteFile(filePath) {
    try {
        rm(filePath);
        return true;
        // callback(null, `删除 ${filePath} 成功`)
    } catch (e) {
        return false;
    }
}


/**
 * 询问-输入
 * 1、请输入项目名称（projectName  【String】）
 * 2、是否需要vuex缓存数据（isStore  【Boolean】）
 * 3、是否需要用户信息（isUser  【Boolean】）
 */

/**
 * 执行动作
 * 1、下载模版 并创建项目
 * 2、根据填写内容，配置package.json
 * 3、配置vue.config.js
 * 4、配置src/main.js
 * 6、清除.hbs文件
 */
module.exports = function (plop) {

    // 自定义动作类型-下载模版
    plop.setActionType('getTemplate', function (answers, config, plop) {
        // do something
        // getTemplate();
        console.log(">>>>>>>>>>>>>>下载模版中>>>>>>>>>>>>>>");
        var path = process.cwd() + slash + answers.projectName || "vueDemo";
        
        return new Promise((resolve, reject) => {
            getTemplate(path, function (error, data) {
                if (error) {
                    reject('模版下载失败：' + error);
                } else {
                    resolve('下载模版完成.');
                }
            }, answers.type);
        });
    });
    // 自定义动作类型-删除hbs文件
    plop.setActionType('deleteHbs', function (answers, config, plop) {
        var basePath = process.cwd() + slash + answers.projectName || "vueDemo";
        var isStore = answers.isStore;
        // var isUser = answers.isUser;
        return new Promise((resolve, reject) => {
            try {

                var templates = cfg.templates;
                // 删除hbs文件
                for (var key in templates) {
                    var filePath = basePath + "/" + templates[key];
                    deleteFile(filePath);
                }
                // 如果不需要vuex，则删除store文件
                if (!isStore) {
                    var storePath = basePath + "/src/store"
                    deleteFile(storePath);
                }
                //删除 package-lock.json 缓存文件
                deleteFile(basePath + "/package-lock.json");
                resolve('完成.');
            } catch (e) {
                reject('hbs模版删除：' + error);
            }

        });
    });
    plop.setWelcomeMessage("Create smy vue project.");
    // controller generator
    plop.setGenerator('CreateSmyVue', {
        description: 'Create smy vue project.',
        // 提问
        prompts: [{
            type: 'list', // 输入值类型：select
            name: 'type', // 获取输入值的key
            message: 'Please select project type', // 问题描述
            choices: [
                {
                  name: 'empty',
                  value: 'empty',
                  description: 'empty project is coming',
                },
                {
                    name: 'elementui',
                    value: 'elementui',
                    description: 'elementui project is coming',
                },
                {
                    name: 'iviewui',
                    value: 'iviewui',
                    description: 'iviewui project is coming',
                },
            ],
            default: "项目类型",
            description: '选择项目的类型',
        },{
            type: 'input', // 输入值类型：String
            name: 'projectName', // 获取输入值的key
            message: 'Please input your project name.', // 问题描述
            description: '输入项目名',
            validate: function (input) {
                // Declare function as asynchronous, and save the done callback
                var done = this.async();
                if (input) {
                    if (nodeFs.existsSync(process.cwd() + '/' + input)) {
                        done("项目名已存在")
                    }
                    done(null, true)
                } else {
                    done("请输入项目名")
                }
            }
        }, {
            type: 'input', // 输入值类型：String
            name: 'projectName_ch', // 获取输入值的key
            message: 'Please input your project name for Chinese.', // 问题描述
            default: "项目名称",
            description: '输入项目的中文名',
        }, {
            type: 'confirm', // 输入值类型：Boolean
            name: 'isStore', // 获取输入值的key
            message: 'Do you need a vuex?',
            default: true,
            description: '是否需要vuex（缓存）',
        }, {
            type: 'input', // 输入值类型：Boolean
            name: 'proxy',
            message: 'Please enter your api proxy address.',
            default: "https://127.0.0.1",
            description: '输入后端接口代理地址',
        }],

        // 询问-输入
        actions: function (e) {
            // 项目路径
            var basePath = process.cwd() + slash + e.projectName + slash;
            // console.log(basePath, 'this is projectName-------------------')
            return [{
                type: 'getTemplate',
                speed: 'slow'
            }, {
                type: 'add',
                path: basePath + cfg.files.packageJson,
                templateFile: basePath + cfg.templates.packageJson,
                force: true,
                verbose: true
            }, {
                type: 'add',
                path: basePath + cfg.files.vuConfigJs,
                templateFile: basePath + cfg.templates.vuConfigJs,
                force: true,
                verbose: true
            }, {
                type: 'add',
                path: basePath + cfg.files.mainJs,
                templateFile: basePath + cfg.templates.mainJs,
                force: true,
                verbose: true
            }, {
                type: 'deleteHbs',
                speed: 'slow'
            }]
        }
    });
};