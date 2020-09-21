const { allowedNodeEnvironmentFlags, stdout } = require('process');

module.exports = function(RED) {
    function ZipFolder(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        var os = process.platform;
        var jaraddr = "";
               

        this.pathIn = config.pathIn;
        this.pathOut = config.pathOut;

        let command = 'java -jar ' + jaraddr + ' ' + node.pathIn + ' ' + node.pathOut ;
        if(os == "win32") {
            var useros = require('os');
            var username = useros.userInfo().username;
            jaraddr = 'C:/Users/' + username + '/.node-red/node_modules/node-red-biounicam-tool/Zip_Folder/lib/zip.jar'
            pathIn = 'C:/Users/'+ username + '/.node-red/temp/'+ node.pathIn
            pathOut = 'C:/Users/'+ username + '/.node-red/temp/'+ node.pathOut
        } else {
            jaraddr = "~/.node-red/node_modules/node-red-biounicam-tool/Zip_Folder/lib/zip.jar"
            pathIn = "~/.node-red/temp/" + node.pathIn
            pathOut = "~/.node-red/temp/" + node.pathOut
        }

        node.on('input', function(msg) {
            var pathIn, pathOut;

            if(node.pathIn==null || node.pathOut=='') {
                if(os == "win32") {
                    var useros = require('os');
                    var username = useros.userInfo().username;
                    jaraddr = 'C:/Users/' + username + '/.node-red/node_modules/node-red-biounicam-tool/Zip_Folder/lib/zip.jar'
                    pathIn = 'C:/Users/'+ username + '/.node-red/temp/'+ msg.payload.pathIn
                    pathOut = 'C:/Users/'+ username + '/.node-red/temp/'+ msg.payload.pathOut
                } else {
                    jaraddr = "~/.node-red/node_modules/node-red-biounicam-tool/Zip_Folder/lib/zip.jar"
                    pathIn = "~/.node-red/temp/" + msg.payload.pathIn
                    pathOut = "~/.node-red/temp/" + msg.payload.pathOut
                }

                command = 'java -jar ' + jaraddr + ' ' + pathIn + ' ' + pathOut
            }
            console.log(command)
            const exec = require('child_process').exec;
            const childPorcess = exec(command, function(err, stdout, stderr) {
                if (err) {
                    console.log(err);
                    msg.payload.zip = "NO";
                    node.send(msg);
                } else {
                    msg.payload.zip = "YES";
                    node.send(msg);
                }
            })
        });
    }
    RED.nodes.registerType("zip_folder",ZipFolder);
}