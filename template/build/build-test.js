// https://github.com/shelljs/shelljs
require('./check-versions')()
process.env.NODE_ENV = 'production'

var ora = require('ora')
var path = require('path')
var chalk = require('chalk')
var shell = require('shelljs')
var webpack = require('webpack')
var config = require('../config')
var webpackConfig = require('./webpack.test.conf')

var spinner = ora('building for test...')

{{#if_eq platform "midea"}}
// 对调测试、正式版本号
var swapVersion = function() {
    var cubeModulePath = path.join(config.buildTest.assetsRoot, '/CubeModule.json'),
        cubeModule = require(cubeModulePath),
        jsonfile = require('jsonfile')
    var temp = {
        version: cubeModule.version,
        build: cubeModule.build
    }
    for (var p in temp) {
        cubeModule[p] = cubeModule['test' + p[0].toUpperCase() + p.slice(1)]
        cubeModule['test' + p[0].toUpperCase() + p.slice(1)] = temp[p]
    }
    jsonfile.writeFileSync(cubeModulePath, cubeModule, {
        spaces: 2
    })
}
{{/if_eq}}

spinner.start()

var assetsPath = path.join(config.buildTest.assetsRoot, config.buildTest.assetsSubDirectory)
shell.rm('-rf', assetsPath)
shell.mkdir('-p', assetsPath)
shell.config.silent = true
shell.cp('-R', 'static/*', assetsPath)
shell.config.silent = false

webpack(webpackConfig, function(err, stats) {
    spinner.stop()
    if (err) throw err
    process.stdout.write(stats.toString({
        colors: true,
        modules: false,
        children: false,
        chunks: false,
        chunkModules: false
    }) + '\n\n')
    {{#if_eq platform "midea"}}
    swapVersion()
    {{/if_eq}}
    console.log(chalk.cyan('  Build complete.\n'))
    console.log(chalk.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
    ))
})
