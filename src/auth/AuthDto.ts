import type { DataResponse } from "../shared/CommonDto"

export interface LoginResponse extends DataResponse{
    accessToken: string
}