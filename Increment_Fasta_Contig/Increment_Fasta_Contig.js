const { allowedNodeEnvironmentFlags, stdout } = require('process');

module.exports = function(RED) {
    function IncrementFastaContig(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var os = process.platform;
        var jaraddr = "";
        
        if(os == "win32") {
            var useros = require('os');
            var username = useros.userInfo().username;
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
    RED.nodes.registerType("increment_fasta_contig",IncrementFastaContig);
}