import { DefaultService } from './service.default';
import * as express from "express";

export class AuthService extends DefaultService {

  private readonly _app = express();
  private readonly _router = express.Router();

  public async init() {
    this._app.use(express.json());
    this._app.use(express.urlencoded({ extended: false }));
    this._app.use(this._router);

    this._router.get("*", (req, res) => this.onResponse(req, res));
  }

  public async onResponse(req: Express.Request, res: Express.Response) {

  }
}