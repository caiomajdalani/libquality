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
        "/src/docs"
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