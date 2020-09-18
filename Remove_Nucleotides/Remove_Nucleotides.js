const { allowedNodeEnvironmentFlags, stdout } = require('process');

module.exports = function(RED) {
    function RemoveNucleotides(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var os = process.platform;
        var jaraddr = "";
        
        if(os == "win32") {
            var useros = require('os');
            var username = useros.userInfo().username;
            jaraddr = 'C:/Users/' + username + '/.node-red/node_modules/node-red-biounicam-tool/Remove_Nucleotides/lib/RemoveNucleotides.jar'
        } else {
            jaraddr = "~/.node-red/node_modules/node-red-biounicam-tool/Remove_Nucleotides/lib/RemoveNucleotides.jar";
        }

        this.fasta = config.fasta;
        this.n = config.n;
        this.pathfolder = config.pathfolder;
        this.outputname = config.outputname;

        let command = 'java -jar ' + jaraddr + ' -f ' + node.fasta + ' -n ' + node.n + ' -path ' + node.pathfolder + ' -out ' + node.outputname;

        node.on('input', function(msg) {
            if(node.fasta==null || node.fasta=='') {
                command = 'java -jar ' + jaraddr + ' -f ' + msg.payload.fasta + ' -n ' + msg.payload.n + ' -path ' + msg.payload.pathfolder + ' -out ' + msg.payload.outputname;
            }
            console.log(command)
            const exec = require('child_process').exec;
            const childPorcess = exec(command, function(err, stdout, stderr) {
                if (err) {
                    console.log(err);
                    msg.payload.stdout = "Error";
                    node.send(msg);
                }
                else{
                    msg.payload.stdout = stdout;
                    node.send(msg);
                }
            })
        });
    }
    RED.nodes.registerType("remove_nucleotides",RemoveNucleotides);
}