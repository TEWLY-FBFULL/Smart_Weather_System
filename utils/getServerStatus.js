const os = require('os');
const si = require('systeminformation');

const getServerStats = async () => {
    const cpu = await si.cpu();
    const mem = await si.mem();
    const disk = await si.fsSize();
    const net = await si.networkStats();
    const load = os.loadavg();

    return {
        cpu: {
            model: cpu.manufacturer + " " + cpu.brand,
            speed: cpu.speed + " GHz",
            cores: cpu.cores,
            usage: await si.currentLoad(), // Load cpu usage
        },
        memory: {
            total: (mem.total / 1073741824).toFixed(2) + " GB",
            used: (mem.used / 1073741824).toFixed(2) + " GB",
            free: (mem.free / 1073741824).toFixed(2) + " GB",
            usagePercent: ((mem.used / mem.total) * 100).toFixed(2),
        },
        disk: disk.map(d => ({
            mount: d.mount,
            total: (d.size / 1073741824).toFixed(2) + " GB",
            used: (d.used / 1073741824).toFixed(2) + " GB",
            usagePercent: ((d.used / d.size) * 100).toFixed(2),
        })),
        network: {
            interface: net[0].iface,
            sent: (net[0].tx_bytes / 1048576).toFixed(2) + " MB",
            received: (net[0].rx_bytes / 1048576).toFixed(2) + " MB",
        },
        loadAverage: {
            "1min": load[0].toFixed(2),
            "5min": load[1].toFixed(2),
            "15min": load[2].toFixed(2),
        },
        uptime: os.uptime() + " sec",
    };
};

module.exports = { getServerStats };