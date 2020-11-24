import { DefaultService } from './service.default';
import * as express from "express";

export class AuthService extends DefaultService {

  private readonly _app = express();
  private readonly _router = express.Router();

  public async init() {
    this._app.use(express.json());
    this._app.use(express.urlencoded({ extended: false }));
    this._app.use(this._router);

    this._router.get("/bot", (req, res) => this.onResponse(req, res))
    this._router.all("*", (req, res) => res.redirect(encodeURI(process.env.BOT_LINK + process.env.ROOT_URL + "/bot")));

    return new Promise<void>((resolve, reject) => {
      this._app.listen(process.env.PORT ?? 3000, () => {
        this._logger.log("Listening on port", process.env.PORT ?? 3000);
        this._logger.log("Listening GET on /bot for auth response");
        this._logger.log("Listening ALL on * for redirect to bot uri");
        resolve();
      });
    });
    
  }

  public async onResponse(req: express.Request, res: express.Response) {
    const query: AuthResponse = req.query as unknown as AuthResponse;
    if (req.statusCode >= 300) {
      this._logger.error("Error authenticating : ", query);
    }
    this._logger.log("New server for bot with perm", query.permissions, "with guild id", query.guild_id);
    res.json({ success: true, message: "You may close this tab" });
  }
}


interface AuthResponse {
  code: string,
  guild_id: string,
  permissions: string
}