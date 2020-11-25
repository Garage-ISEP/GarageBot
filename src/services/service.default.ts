import { Logger } from './../utils/logger';

export class DefaultService {

  protected _logger = new Logger(this);

  public async init(): Promise<DefaultService> { return this }  
}