import { rental } from "./proto_gen/rental/rental_pb";
import { Coolcar } from "./request";

export namespace TripService {
    export function CreateTirp(req: rental.v1.CreateTripRequest): Promise<rental.v1.CreateTripResponse> {
        return Coolcar.sendRequestWithRetry({
            method: 'POST',
            path: '/v1/trip',
            data: req,
            respMarshaller: rental.v1.CreateTripResponse.fromObject
        })
    }
}