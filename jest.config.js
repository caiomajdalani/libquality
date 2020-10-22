module.exports = {
    verbose: true,
    coveragePathIgnorePatterns: [
        "/node_modules/",
        "/coverage/",
        "jest.config.js",
        "/docker/",
        "/logs/",
        "/mysql/",
        "/ecosystem-config/",
        "/src/docs",
        "/src/controllers",
        "/src/routes",
        "/src/index.js",
        "/src/server"
    ],
    setupFilesAfterEnv: [
        './jestSetup.js'
    ],
    testEnvironment: "node",
    collectCoverage: true,
    collectCoverageFrom: [
        "**/*.{js,jsx}"
    ]
}