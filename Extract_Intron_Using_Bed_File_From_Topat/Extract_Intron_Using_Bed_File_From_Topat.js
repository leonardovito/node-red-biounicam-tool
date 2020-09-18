const { allowedNodeEnvironmentFlags, stdout } = require('process');

module.exports = function(RED) {
    function ExtractIntronUsingBedFileFromTopat(config) {
        RED.nodes.createNode(this,config);
        var node = this;

        var os = process.platform;
        var jaraddr = "";
        
        if(os == "win32") {
            var useros = require('os');
            var username = useros.userInfo().username;
            jaraddr = 'C:/Users/' + username + '/.node-red/node_modules/node-red-biounicam-tool/Extract_Intron_Using_Bed_File_From_Topat/lib/ExtractIntronUsingBEdFileFromTopat.jar'
        } else {
            jaraddr = "~/.node-red/node_modules/node-red-biounicam-tool/Extract_Intron_Using_Bed_File_From_Topat/lib/ExtractIntronUsingBEdFileFromTopat.jar";
        }

        this.fasta = config.fasta;
        this.tp = config.tp;
        this.pathfolder = config.pathfolder;
        this.outputname = config.outputname;
        this.flanking = config.flanking;

        var command;
        if(node.flanking == "" || node.flanking == null) {
            command = 'java -jar ' + jaraddr + ' -fa ' + node.fasta + ' -tp ' + node.tp +  ' -out ' + node.outputname + ' -path ' + node.pathfolder;
        } else {
            command = 'java -jar ' + jaraddr + ' -fa ' + node.fasta + ' -tp ' + node.tp +  ' -out ' + node.outputname + ' -path ' + node.pathfolder + ' -f ' + node.flanking;
        }
        
        node.on('input', function(msg) {

            if(node.fasta==null || node.fasta=="") {
                if(msg.payload.flanking == "" || msg.payload.flanking == null) {
                    command = 'java -jar ' + jaraddr + ' -fa ' + msg.payload.fasta + ' -tp ' + msg.payload.tp +  ' -out ' + msg.payload.outputname + ' -path ' + msg.payload.pathfolder;
                } else {
                    command = 'java -jar ' + jaraddr + ' -fa ' + msg.payload.fasta + ' -tp ' + msg.payload.tp +  ' -out ' + msg.payload.outputname + ' -path ' + msg.payload.pathfolder + ' -f ' + msg.payload.flanking;
                }
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
    RED.nodes.registerType("extract_intron_using_bed_file_from_topat",ExtractIntronUsingBedFileFromTopat);
}