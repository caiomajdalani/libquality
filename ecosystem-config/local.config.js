module.exports = {
    apps : [{
        name: "libquality",
        script: "./src/index.js",
        instances: "1",
        exec_mode: "cluster",
        error_file: "./logs/pm2/api_error.log",
        out_file: "./logs/pm2/api_out.log",
        ignore_watch: [
            "node_modules",
            ".DS_Store",
            ".vscode",
            "logs",
            ".git",
            "coverage",
            "Dockerfile",
            "docker-compose.yml"
        ],
        trace: true,
        watch: true,
        node_args: [
            "--max_old_space_size=4096"
        ],
        max_memory_restart: '1G',
        env: {
            API: {
                HOST: "localhost",
                VERSION: "v1",
                PORT: 3000,
                REQUEST: {
                    LIMIT: "100mb",
                    EXTENDED: true,
                    LOG: "local"
                }
            },
            MYSQL: {
                DATABASE: "libquality",
                USERNAME: "root",
                PASSWORD: "admin",
                HOST: "localhost",
                PORT: 3306
            },
            ENVIRONMENT: "LOCAL",
            NODE_ENV: "local"
        }
    }]
}