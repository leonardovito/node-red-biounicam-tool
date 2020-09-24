const { allowedNodeEnvironmentFlags, stdout } = require('process');

module.exports = function(RED) {
    function CreateDotFromFasta(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        this.fasta = config.fasta;
        this.pathfolder = config.pathfolder;
        this.outputname = config.outputname;

        let command = 'RNAfold <' + node.fasta + ' > ' + node.pathfolder + '/' + node.outputname;

        node.on('input', function(msg) {
            if(node.fasta==null || node.fasta=='') {
                command = 'RNAfold -i' + msg.payload.fasta + ' -o' + msg.payload.pathfolder + '/' + msg.payload.outputname + ' --noPS';
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
    RED.nodes.registerType("create_dot_from_fasta",CreateDotFromFasta);
}