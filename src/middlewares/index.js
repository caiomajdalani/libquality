const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet')
const expressWinston = require('express-winston');
const winston = require('winston')

const { API, ENVIRONMENT } = process.env
const _api = API ? JSON.parse(API) : null

module.exports = app => {
    app
        .set("host", _api ? _api.HOST : 'localhost')
        .set("port", _api ? _api.PORT : 3000)
        .set("env", ENVIRONMENT || 'LOCAL')
        .set("version", _api ? _api.VERSION : null)
        .use(helmet())
        .use(cors({
            origins: ["*"],
            methods: ["GET", "POST", "PUT", "DELETE"],
            allowedHeaders: ["Content-Type"]
        }))
        .use(bodyParser.json({limit: (_api ? _api.REQUEST.LIMIT : '100mb'), extended: (_api ? _api.REQUEST.EXTENDED : true)}))
        .use(bodyParser.urlencoded({limit: ( _api ? _api.REQUEST.LIMIT : '100mb'), extended: (_api ? _api.REQUEST.EXTENDED : true)}))
        .use(expressWinston.logger({
            transports: [
              new winston.transports.Console({
                format: winston.format.combine(
                    winston.format.timestamp(),
                    winston.format.colorize(),
                )
            }), 
            new winston.transports.File({ filename: './logs/winston/errors.log', level: 'error' }),
            new winston.transports.File({ filename: './logs/winston/combined.log' })
            ],
            format: winston.format.combine(
              winston.format.timestamp(),
              winston.format.colorize(),
              winston.format.json(),
              winston.format.printf((info)=>{
                  return `${info.timestamp} ${info.message} -> ${JSON.stringify(info.meta)}`;
              })
            ),
            msg: "HTTP {{req.method}} {{req.url}}",
            expressFormat: true,
            colorize: true,
            ignoreRoute: function (req, res) { return false; }
        }));

}