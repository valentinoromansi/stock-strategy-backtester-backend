export class ServiceResponse{
  status?: number
  message?: string
  data: any
  public constructor(init?:Partial<ServiceResponse>) {
    Object.assign(this, init);
  }
}