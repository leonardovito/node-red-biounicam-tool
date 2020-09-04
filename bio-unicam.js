const { allowedNodeEnvironmentFlags, stdout } = require('process');

module.exports = function(RED) {
    function BioUnicamNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        
        //var jaraddr = 'C:\\Users\\internship01\\Desktop\\biounicam-node\\lib\\IncremetingConting.jar';
        
        //const path = require('path');
        //var jaraddr = path.resolve('./.node-red/node_modules/biounicam-tool/lib/IncremetingConting.jar');
        
        //var test = process.cwd();
        var os = process.platform;
        var jaraddr = "";
        //console.log(os);
        if(os == "win32") {
            var useros = require('os');
            var username = useros.userInfo().username;
            //console.log(username);
            jaraddr = 'C:\\Users\\' + username + '\\.node-red\\node_modules\\biounicam-tool\\lib\\IncremetingConting.jar'
        } else {
            jaraddr = "~/.node-red/node_modules/biounicam-tool/lib/IncremetingConting.jar";
        }

        console.log(jaraddr);
        this.fasta = config.fasta;
        this.pathfolder = config.pathfolder;
        this.outputname = config.outputname;

        let command = 'java -jar ' + jaraddr + ' -f ' + node.fasta + ' -path ' + node.pathfolder + ' -out ' + node.outputname;
        console.log(command);
        node.on('input', function(msg) {
            //msg.payload = msg.payload.toLowerCase() + node.fasta + node.pathfolder + node.outputname;
            const exec = require('child_process').exec;
            const childPorcess = exec(command, function(err, stdout, stderr) {
                if (err) {
                    console.log(err)
                }
                console.log(stdout)
                msg.payload = stdout;
                node.send(msg);
            })
        });
    }
    RED.nodes.registerType("bio-unicam",BioUnicamNode);
}