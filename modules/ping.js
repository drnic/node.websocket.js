var Module = this.Module = function(data, connection){
};

Module.prototype.onData = function(data, connection) {
  var sys = require('sys');
  var start = data.match(new RegExp('start (.*)'));
  if (start) {
    var host = start[1];
    var ping = process.createChildProcess("ping", [host]);
    connection.send("ping " + host + "; pid: " + ping.pid); // log
    connection.send('start { "host": "' + host + '", "pid": ' + ping.pid + ' }'); // command
    ping.addListener("output", function(data) {
      if (typeof data != "undefined" && data !== null) {
        connection.send(ping.pid + ": " + data.replace(/\n$/, ''));        
      }
    });
    ping.addListener("error", function(data) {
      if (typeof data != "undefined" && data !== null) {
        connection.send(ping.pid + ": error: " + data.replace(/\n$/, ''));        
      }
    });
  }
  var stop = data.match(new RegExp('stop (.*)'));
  if (stop) {
    var pid = stop[1];
    sys.puts("kill " + pid);
    sys.exec("kill " + pid, function(stdout, stderr) {
      if (stdout) {
        sys.puts(stdout);
        connection.send(pid + ": " + stdout);
      }
      if (stderr) {
        sys.puts("error: " + stderrr);
        connection.send("error: " + stderr); // log
      }
    });
    connection.send("Ping stopped."); // log
  }
};

Module.prototype.onDisconnect = function(connection){
  clearInterval(this.interval);
};